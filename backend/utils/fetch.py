import requests
import time

def get_all_subjects(term_code: str) -> list[str]:
    """
    Sends POST request to Temple's registration system to get a list of all subject codes for a given semester term
    Params: ("202501")
    Returns: ["CIS", "MATH", "BIOL"...]
    """
    try:
        res = requests.post(
            "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/classSearch/get_subject",
            json={"term": term_code}
        )
        data = res.json()
        return [entry["code"] for entry in data]
    except Exception as e:
        print(f"Error fetching subjects: {e}")
        return []

def get_all_courses(term_code: str) -> list[dict]:
    """
    Gets all course sections for all subjects for a given semester term

    Uses get_all_subjects to get a list of all subject codes
    Sends POST request to Temple's registration system to get all course sections
    Formats into dictionaries

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
    subjects = get_all_subjects(term_code)

    for subject in subjects:
        try:
            print(f"Fetching subject: {subject}")

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
                "pageMaxSize": 50,
                "sortColumn": "subjectDescription",
                "sortDirection": "asc"
            }

            session = requests.Session()
            # establish session
            session.post("https://prd-xereg.temple.edu/StudentRegistrationSsb/")
            # search on class search form for subject
            session.post(
                "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/search?mode=search",
                search_args
            )

            res = session.post(
                "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?startDatepicker=&endDatepicker=",
                data=results_args
            )

            # convert to dictionary
            data = res.json()

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

                all_courses.append(course)

            time.sleep(0.5) # avoid getting blocked

        except Exception as e:
            print(f"Error fetching {subject}: {e}")

    return all_courses