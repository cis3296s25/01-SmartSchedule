from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithm import generateSchedules

app = Flask(__name__)
CORS(app)

# Sample function to process and generate schedules
def generate_schedules(selected_courses):
    schedule = {"monday": [],
                "tuesday": [],
                "wednesday": [], 
                "thursday": [], 
                "friday": []}

    for course in selected_courses:
        code = course["code"]
        title = course["title"]
        professor = course["professor"]

        for meeting in course["meetingTimes"]:
            start = meeting["start"]
            end = meeting["end"]
            for day in meeting["days"]:
                schedule[day.lower()].append({
                    "code": code,
                    "title": title,
                    "start": start,
                    "end": end,
                    "professor": professor
                })

    return schedule

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    selected_courses = data.get("courses", [])
    if not selected_courses:
        return jsonify({"error": "No courses provided"}), 400

    schedules = generateSchedules(selected_courses)  # Call the function
    return jsonify(schedules)  # Return schedules as JSON

if __name__ == "__main__":
    app.run(debug=True)

# temp output:
# monday:
# code, title, start time, end time, professor 
# code, title, start time, end time, professor 

# tuesday:
# code, title, start time, end time, professor 
# code, title, start time, end time, professor 

# etc..


