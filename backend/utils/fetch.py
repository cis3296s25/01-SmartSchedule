import requests
import time

def get_all_subjects() -> list[str]:
    """
    Had to change to return hard coded list since endpoint was not working
    """
    return [
        "CIS", "MATH", "BIOL", "CHEM", "PHYS", "STAT", "ENG", "PHIL",
        "ECON", "PSY", "SOC", "SPAN", "ITAL", "HIST", "ART", "ENGL", "EES"
    ]


def fetch_courses(term_code: str, subject: str) -> list[dict]:
    """
    Fetches all available course sections for a given subject and term code
    from Temple's registration system

    Makes POST request to establish session with system, submit term and subject, and retrieve information

    Params: (term_code, subject) : ("202503", "CIS")

    Returns list of dictionaries where each dictionary represents a course section
    """
    courses = []

    # search payload Temple expects when filtering by subject
    search_args = {
        "txt_subject": subject,
        "term": term_code,
        "txt_term": term_code
    }

    # params to paginate and sort search results
    results_args = {
        **search_args,
        "pageOffset": 0,
        "pageMaxSize": 50, # this limits to 50 results.. will have to change later
        "sortColumn": "subjectDescription",
        "sortDirection": "asc"
    }

    try:
        session = requests.Session()
        # establish session
        session.post("https://prd-xereg.temple.edu/StudentRegistrationSsb/")
        # search on class search form for subject
        session.post("https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/search?mode=search", search_args)

        # request course listings
        response = session.post(
            "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?startDatepicker=&endDatepicker=",
            data=results_args
        )
        # convert to dictionary
        data = response.json()

        for section in data.get("data", []):
            course = {
                "code": f"{section['subject']} {section['courseNumber']}",
                "title": section["courseTitle"],
                "CRN": section["courseReferenceNumber"],
                "professor": section["faculty"][0]["displayName"] if section.get("faculty") else "N/A",
                "creditHours": section.get("creditHourLow") or section.get("creditHourHigh"),
                "meetingTimes": []
            }

            for mt in section.get("meetingsFaculty", []):
                mt_info = mt.get("meetingTime", {})
                meeting = {
                    "start": mt_info.get("beginTime"),
                    "end": mt_info.get("endTime"),
                    "days": [
                        day for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]
                        if mt_info.get(day)
                    ],
                    "type": mt_info.get("meetingTypeDescription")
                }
                course["meetingTimes"].append(meeting)

            courses.append(course)

        return courses

    except Exception as e:
        return [{"error": f"Failed to fetch courses for {subject}: {str(e)}"}]


def get_all_courses(term_code: str) -> list[dict]:
    """
    Gets all course sections for all subjects for a given semester term

    Uses get_all_subjects to get a list of all subject codes
    Calls fetch_courses() to get all course sections for that subject and term

    Params:("202501")

    Returns: List of dictionaries where there is one dictionary per course section
    [
      {
        "code": "CIS 1051",
        "title": "Introduction to Problem Solving and Programming in Python",
        "CRN": "21910",
        "professor": "Andrew Rosen",
        "creditHours": 4,
        "meetingTimes": [
          {
            "start": "0900",
            "end": "1050",
            "days": ["monday"],
            "type": "Laboratory"
          },
          {
            "start": "1400",
            "end": "1520",
            "days": ["tuesday", "thursday"],
            "type": "Lecture"
          }
        ]
      }...
    """
    all_courses = []
    subjects = get_all_subjects()

    for subject in subjects:
        print(f"Fetching courses for subject: {subject}")
        try:
            courses = fetch_courses(term_code, subject)
            all_courses.extend(courses)
            time.sleep(0.5)  # avoid getting blocked
        except Exception as e:
            print(f"Error fetching {subject}: {e}")

    return all_courses
