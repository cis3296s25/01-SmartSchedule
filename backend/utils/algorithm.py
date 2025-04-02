def generateSchedules(courses):
    from itertools import permutations

    all_schedules = {}
    count = 1

    # try every possible order of the courses to generate distinct schedules
    for perm in permutations(courses):
        proposed_schedule = {}
        conflict = False

        for current_course in perm:
            for current_meeting in current_course["meetingTimes"]:
                # check if the course conflicts with any already selected
                for selected in proposed_schedule.values():
                    for selected_meeting in selected["meetingTimes"]:
                        overlapping_days = set(current_meeting["days"]) & set(selected_meeting["days"])
                        if overlapping_days:
                            if current_meeting["start"] < selected_meeting["end"] and current_meeting["end"] > selected_meeting["start"]:
                                conflict = True
                                break
                    if conflict:
                        break
                if conflict:
                    break

            if not conflict:
                proposed_schedule[current_course["code"]] = {
                    "title": current_course["title"],
                    "CRN": current_course["CRN"],
                    "professor": current_course["professor"],
                    "creditHours": current_course["creditHours"],
                    "meetingTimes": current_course["meetingTimes"]
                }

        if len(proposed_schedule) == len(courses):  # A full, valid schedule
            all_schedules[count] = proposed_schedule
            count += 1

        if count > 10:  # just generate up to 10
            break

    return all_schedules
