import requests
import time

def get_all_subjects(term_code) -> list[str]:
    """
    Had to change to return hard coded list since endpoint was not working
    """
    try:
        session = requests.Session()

        # establish session
        session.get("https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/classSearch/classSearch")

        # make the subject list request
        params = {
            "searchTerm": "",
            "term": term_code,
            "offset": 1,
            "max": 999
        }

        headers = {
            "Accept": "application/json",
            "Referer": "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
            "User-Agent": "Mozilla/5.0"
        }

        response = session.get(
            "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/classSearch/get_subject",
            headers=headers,
            params=params
        )

        response.raise_for_status()
        subjects = response.json()

        return sorted(subjects, key=lambda s: s["code"])  # preserve code and description

    except Exception as e:
        print(f"[ERROR] Failed to fetch subjects: {e}")
        return []


def fetch_courses(term_code: str, subject: str) -> list[dict]:
    """
    Fetches all available course sections for a given subject and term code
    from Temple's registration system

    Makes POST request to establish session with system, submit term and subject, and retrieve information

    Params: (term_code, subject) : ("202503", "CIS")

    Returns list of dictionaries where each dictionary represents a course section
    """
    try:
        courses = []
        session = requests.Session()

        # establish session
        session.post("https://prd-xereg.temple.edu/StudentRegistrationSsb/")

        # search payload Temple expects - simulate real user searching for class
        session.post("https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/search?mode=search", {
            "txt_subject": subject,
            "term": term_code,
            "txt_term": term_code
        })

        page_offset = 0 # start at beginning
        page_size = 50  # Temple returns 50 results per page

        while True:

            # params to paginate and sort search results
            results_args = {
                "txt_subject": subject,
                "term": term_code,
                "txt_term": term_code,
                "pageOffset": page_offset,  # which page
                "pageMaxSize": page_size,   # how many results to return per page
                "sortColumn": "subjectDescription",
                "sortDirection": "asc"
            }

            # request course listings
            response = session.post(
                "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?startDatepicker=&endDatepicker=",
                data=results_args
            )

            data = response.json()
            sections = data.get("data", [])

            # if no more sections, break
            if not sections:
                break

            # format data
            for section in sections:
                course = {
                    "code": f"{section['subject']} {section['courseNumber']}",
                    "title": section["courseTitle"],
                    "CRN": section["courseReferenceNumber"],
                    "professor": section["faculty"][0]["displayName"] if section.get("faculty") else "N/A",
                    "creditHours": section.get("creditHourLow") or section.get("creditHourHigh"),
                    "meetingTimes": []
                }

                # meeting times
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

                # add course to list
                courses.append(course)

            # if sections is less than results returned on page, end of sections
            if len(sections) < page_size:
                break

            page_offset += page_size
            time.sleep(0.3)  # give the server some time

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

    # for each subject in the list, call fetch courses to get all courses from all subjects
    for subject in subjects:
        print(f"Fetching courses for subject: {subject}")
        try:
            courses = fetch_courses(term_code, subject)
            all_courses.extend(courses)
            time.sleep(0.3)  # avoid getting blocked
        except Exception as e:
            print(f"Error fetching {subject}: {e}")

    return all_courses

