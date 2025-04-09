import sys
import os
import pytest

# Add parent directory to path for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.algorithm import generateSchedules
from unittest.mock import patch, Mock
from utils import fetch
import utils.fetch as fetch


# ---------------------- Tests for generateSchedules ----------------------

def test_generateSchedules_valid():
    input_courses = [
        {
            "code": "CIS 1051",
            "title": "Intro to Python",
            "CRN": "12345",
            "professor": "Andrew Rosen",
            "creditHours": 4,
            "meetingTimes": [
                {"start": "0900", "end": "1050", "days": ["monday"], "type": "Lecture"}
            ]
        },
        {
            "code": "MATH 1041",
            "title": "Calculus I",
            "CRN": "23456",
            "professor": "Dr. Math",
            "creditHours": 4,
            "meetingTimes": [
                {"start": "1100", "end": "1215", "days": ["monday", "wednesday"], "type": "Lecture"}
            ]
        }
    ]
    result = generateSchedules(input_courses)
    assert isinstance(result, dict)
    assert len(result) >= 1


def test_generateSchedules_with_conflict():
    courses = [
        {
            "code": "TEST 101",
            "title": "Conflict 1",
            "CRN": "11111",
            "professor": "Prof A",
            "creditHours": 3,
            "meetingTimes": [
                {"start": "1000", "end": "1100", "days": ["monday"], "type": "Lecture"}
            ]
        },
        {
            "code": "TEST 102",
            "title": "Conflict 2",
            "CRN": "22222",
            "professor": "Prof B",
            "creditHours": 3,
            "meetingTimes": [
                {"start": "1030", "end": "1130", "days": ["monday"], "type": "Lecture"}
            ]
        }
    ]
    schedules = generateSchedules(courses)
    assert isinstance(schedules, dict)
    assert len(schedules) == 0


def test_generateSchedules_online_class():
    courses = [
        {
            "code": "HIST 1011",
            "title": "History Online",
            "CRN": "55555",
            "professor": "Prof C",
            "creditHours": 3,
            "meetingTimes": []  # Async / no time
        }
    ]
    result = generateSchedules(courses)
    assert isinstance(result, dict)
    assert len(result) == 1


def test_generateSchedules_mixed_valid_and_online():
    courses = [
        {
            "code": "ENG 1001",
            "title": "English Lit",
            "CRN": "11122",
            "professor": "Prof D",
            "creditHours": 3,
            "meetingTimes": [{"start": "0900", "end": "1000", "days": ["tuesday"], "type": "Lecture"}]
        },
        {
            "code": "PHIL 1101",
            "title": "Philosophy Async",
            "CRN": "33344",
            "professor": "Prof E",
            "creditHours": 3,
            "meetingTimes": []
        }
    ]
    result = generateSchedules(courses)
    assert len(result) >= 1


# ---------------------- Tests for fetch (mocked) ----------------------

def test_get_all_subjects_mocked(mocker):
    mocker.patch("utils.fetch.requests.Session.get", return_value=mocker.Mock(
        status_code=200,
        json=lambda: [{"code": "CIS", "description": "Computer Info Systems"}]
    ))
    subjects = fetch.get_all_subjects("202503")
    assert isinstance(subjects, list)
    assert subjects[0]["code"] == "CIS"

def test_fetch_courses_mocked():
    mock_response = {
        "data": [
            {
                "subject": "CIS",
                "courseNumber": "1051",
                "courseTitle": "Intro to Python",
                "courseReferenceNumber": "12345",
                "faculty": [{"displayName": "Andrew Rosen"}],
                "creditHourLow": 4,
                "meetingsFaculty": [
                    {
                        "meetingTime": {
                            "beginTime": "0900",
                            "endTime": "1050",
                            "monday": True,
                            "tuesday": False,
                            "wednesday": True,
                            "thursday": False,
                            "friday": False,
                            "meetingTypeDescription": "Lecture"
                        }
                    }
                ]
            }
        ]
    }

    with patch("utils.fetch.requests.Session.post") as mock_post:
        mock_post.return_value.json = lambda: mock_response
        mock_post.return_value.status_code = 200

        courses = fetch.fetch_courses("202503", "CIS")
        assert isinstance(courses, list)
        assert len(courses) == 1
        assert courses[0]["code"] == "CIS 1051"
        assert courses[0]["professor"] == "Andrew Rosen"
        assert courses[0]["meetingTimes"][0]["days"] == ["monday", "wednesday"]


def test_get_all_courses_mocked_subjects():
    with patch("utils.fetch.get_all_subjects") as mock_subjects, \
         patch("utils.fetch.fetch_courses") as mock_fetch:

        mock_subjects.return_value = [{"code": "CIS", "description": "CS"}]
        mock_fetch.return_value = [{
            "code": "CIS 1051",
            "title": "Intro to Python",
            "CRN": "12345",
            "professor": "Prof A",
            "creditHours": 4,
            "meetingTimes": []
        }]

        result = fetch.get_all_courses("202503")
        assert isinstance(result, list)
        assert len(result) == 1
        assert result[0]["code"] == "CIS 1051"
