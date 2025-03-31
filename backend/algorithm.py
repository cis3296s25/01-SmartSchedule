def sift_sections(courses):
    input_courses = courses.copy()
    ret_schedules = {}
    proposed_schedule = {}
    conflict = False
    i = 1
    last_good_course = None

    while True:
        for current_course in input_courses:
            print("\n\nCourse: " + current_course["code"])
            
            if len(current_course.get("meetingTimes", [])) == 0:
                return ret_schedules
            
            for current_meeting in current_course["meetingTimes"]:
                print(current_course["code"] + " meeting: " + str(current_meeting))
                
                if current_course["code"] in proposed_schedule:
                    conflict = True
                    print("Conflict: Repeat course")
                    break
                
                if not conflict:
                    for selected_course in proposed_schedule.values():
                        for selected_meeting in selected_course["meetingTimes"]:
                            if set(current_meeting["days"]) & set(selected_meeting["days"]):  # Overlapping days
                                
                                if current_meeting["start"] < selected_meeting["end"] and current_meeting["end"] > selected_meeting["start"]:
                                    conflict = True
                                    print("Conflict: Time overlap")
                                    break
                
                if not conflict:
                    last_good_course = current_course["code"]
                    print(current_course["code"] + " is good")
                    proposed_schedule[current_course["code"]] = {
                        "title": current_course["title"],
                        "CRN": current_course["CRN"],
                        "professor": current_course["professor"],
                        "creditHours": current_course["creditHours"],
                        "meetingTimes": current_course["meetingTimes"]
                    }
                else:
                    conflict = False

        print("New proposed schedule " + str(i) + " " + str(proposed_schedule))
        
        if len(proposed_schedule) == len(input_courses):
            ret_schedules[i] = proposed_schedule.copy()
            proposed_schedule = {}
            input_courses = [c for c in input_courses if c["code"] != last_good_course]  # Remove last used course
            i += 1
        else:
            return ret_schedules

# Sample course data
courses = [
    {
        "code": "CIS 1057",
        "title": "Computer Programming in C",
        "CRN": "54311",
        "professor": "James Howes IV",
        "creditHours": 4,
        "meetingTimes": [
            {
                "start": "1510",
                "end": "1630",
                "days": ["monday", "wednesday", "friday"],
                "type": "Class"
            }
        ]
    },
    {
        "code": "CIS 1068",
        "title": "Program Design and Abstraction",
        "CRN": "7271",
        "professor": "John Fiore",
        "creditHours": 4,
        "meetingTimes": [
            {
                "start": "0930",
                "end": "1050",
                "days": ["tuesday", "thursday"],
                "type": "Lecture"
            },
            {
                "start": "1100",
                "end": "1250",
                "days": ["monday"],
                "type": "Laboratory"
            }
        ]
    },
    {
        "code": "CIS 1166",
        "title": "Mathematical Concepts in Computing I",
        "CRN": "5458",
        "professor": "Sheri Stahler",
        "creditHours": 4,
        "meetingTimes": [
            {
                "start": "1100",
                "end": "1220",
                "days": ["monday", "wednesday"],
                "type": "Lecture"
            },
            {
                "start": "1100",
                "end": "1250",
                "days": ["friday"],
                "type": "Recitation"
            }
        ]
    },
    {
        "code": "CIS 2033",
        "title": "Computational Probability and Statistics",
        "CRN": "11140",
        "professor": "Richard Beigel",
        "creditHours": 3,
        "meetingTimes": [
            {
                "start": "1100",
                "end": "1150",
                "days": ["monday", "wednesday", "friday"],
                "type": "Class"
            }
        ]
    }
]

print("\nOutput: " + str(sift_sections(courses)))