import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.algorithm import generateSchedules


def test_generateSchedules_valid():
    input_courses = [
        {
            "code": "CIS 1051",
            "title": "Intro to Python",
            "CRN": "12345",
            "professor": "Andrew Rosen",
            "creditHours": 4,
            "meetingTimes": [
                {
                    "start": "0900",
                    "end": "1050",
                    "days": ["monday"],
                    "type": "Lecture"
                }
            ]
        },
        {
            "code": "MATH 1041",
            "title": "Calculus I",
            "CRN": "23456",
            "professor": "Dr. Math",
            "creditHours": 4,
            "meetingTimes": [
                {
                    "start": "1100",
                    "end": "1215",
                    "days": ["monday", "wednesday"],
                    "type": "Lecture"
                }
            ]
        }
    ]

    result = generateSchedules(input_courses)
    assert isinstance(result, dict)
    assert len(result) >= 1  # At least 1 valid schedule should be generated


