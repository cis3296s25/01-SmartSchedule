from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils.fetch import fetch_courses, get_all_courses, get_all_subjects

app = FastAPI()

# allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace w frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SmartSchedule backend is running "}

@app.get("/api/subject/courses", description="Get all courses for a specific subject")
def courses_for_subject(
    subject: str = Query(..., description="Subject code: CIS for Computer Information Systems "),
    term_code: str = Query(..., description="6-digit term code: 202503 for Spring 2025")
):
    return {"courses": fetch_courses(term_code, subject)}

@app.get("/api/all-courses", description="Get all courses for all subjects returned by subjects")
def all_courses(
    term_code: str = Query(..., description="6-digit term code: 202503 for Spring 2025")
):
    return {"courses": get_all_courses(term_code)}

@app.get("/api/subjects", description="Get all subjects. This is a hardcoded list for now")
def all_subjects():
    """
    This is the hard coded list
    """
    return {"subjects": get_all_subjects()}

@app.get("/api/course-numbers", description="Get all course numbers from all courses")
def course_numbers(
    term_code: str = Query(..., description="6-digit term code: 202503 for Spring 2025")
):
    all_courses = get_all_courses(term_code)
    unique_course_numbers = sorted(set(course["code"] for course in all_courses))  # Extract just the course numbers
    return {"courseNumbers": unique_course_numbers}


