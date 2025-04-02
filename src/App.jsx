/* global scheduler */
import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from "axios";


function App() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [schedule, setSchedule] = useState({});
  const schedulerContainerRef = useRef(null);


  const handleClick = () => {
    setMessage(`Searching for: ${search}`);
  };

  const semesters = ["Fall 2025", "Spring 2025", "Fall 2024"];

  const handleSelectSemester = (sem) => {
    setSemester(sem);
    setShowSemesterDropdown(false); //close dropdown after selecting
  };


  const handleSelectCourse = (course) => {
    setSearch(course);
    setShowDropdown(false);
  };

  const handleAddCourse = () => {
    if (search && !selectedCourses.includes(search)) {
      setSelectedCourses([...selectedCourses, search]);
      setSearch('');
      setShowDropdown(false);
    }
  };
  

  const handleRemoveCourse = (course) => {
    setSelectedCourses(selectedCourses.filter(item => item !== course));
  };
  

  const handleClearCourses = () => {
    setSelectedCourses([]);
  };

  const saveSchedule = () => {
    localStorage.setItem('savedSchedule', JSON.stringify(selectedCourses));
    setMessage('✅ Schedule saved!');
  };

  const loadSchedule = () => {
    const saved = localStorage.getItem('savedSchedule');
    if (saved) {
      setSelectedCourses(JSON.parse(saved));
      setMessage('📂 Schedule loaded!');
    } else {
      setMessage('⚠️ No saved schedule found.');
    }
  };

  const filteredCourses = courses.filter((course) =>
      course.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await fetch("http://localhost:8000/api/course-numbers?term_code=202503");
        const data = await response.json();
        setCourses([...new Set(data.courseNumbers)]);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMessage("⚠️ Failed to fetch courses.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // DHTMLX Scheduler setup
 
  useEffect(() => {
    if (!scheduler || !scheduler.init || !schedulerContainerRef.current) return;

    scheduler.init(schedulerContainerRef.current, new Date(), "week");

    if (!schedule || Object.keys(schedule).length === 0) return;

    const eventList = [];
    let eventId = 1;

    Object.values(schedule).forEach((scheduleItem) => {
      Object.values(scheduleItem).forEach((course) => {
        course.meetingTimes.forEach((mt) => {
          mt.days.forEach((day) => {
            // Map day name to JS Date index (0 = Sunday, 1 = Monday, ...)
            const dayMap = {
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
            };

            const startHour = parseInt(mt.start.substring(0, 2), 10);
            const startMin = parseInt(mt.start.substring(2), 10);
            const endHour = parseInt(mt.end.substring(0, 2), 10);
            const endMin = parseInt(mt.end.substring(2), 10);

            const now = new Date();
            const eventStart = new Date(now.setDate(now.getDate() - now.getDay() + dayMap[day]));
            eventStart.setHours(startHour, startMin);

            const eventEnd = new Date(eventStart);
            eventEnd.setHours(endHour, endMin);

            eventList.push({
              id: eventId++,
              text: `${course.code} - ${course.title}`,
              start_date: eventStart,
              end_date: eventEnd,
            });
          });
        });
      });
    });

    scheduler.clearAll();
    scheduler.parse(eventList, "json");
  }, [schedule]);

  const handleGeneration = async () => {
    setLoadingSchedules(true);
  
    try {
      const termCode = "202503";
      const fullCourses = [];
  
      for (let code of selectedCourses) {
        const [subject, courseNumber] = code.split(" ");
        const res = await axios.get("http://localhost:8000/api/subject/courses", {
          params: {
            subject,
            term_code: termCode
          }
        });
  
        // Find matching course
        const matching = res.data.courses.find((c) => c.code === code);
        if (matching) {
          fullCourses.push(matching);
        }
      }
  
      const response = await axios.post("http://localhost:8000/api/generate", {
        courses: fullCourses
      });
  
      console.log("✅ Schedules:", response.data);
      setSchedule(response.data);
    } catch (error) {
      console.error("Error generating schedules:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };
 

  return (
    <>
      <h1>SmartSchedule 📅</h1>
      <h3>Temple's Course Schedule Generator</h3>

      <div className="container">
        <div className="stacked">
          <div>
            <h3>Semester</h3>
            <p>Choose your semester from the dropdown below.</p>

            <input
              type="text"
              placeholder="Select semester"
              value={semester}
              onFocus={() => setShowSemesterDropdown(true)} //show dropdown on focus
              onChange={(e) => setSemester(e.target.value)} //update semester value
            />

            {showSemesterDropdown && semesters.length > 0 && (
              <ul className="dropdown">
                {semesters.map((sem, index) => (
                  <li key={index} onClick={() => handleSelectSemester(sem)}>
                    {sem}
                  </li>

                ))}
              </ul>
            )}
          </div>

          <div>
            <h3>Schedule Restrictions</h3>
          </div>
          </div>


        <div>
          <h3>Available Courses</h3>
          <input
            type="text"
            placeholder="Search for Course..."
            value={search}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleAddCourse}>Add</button>

          {loadingCourses ? (
            <p>Loading courses...</p>
          ) : showDropdown && filteredCourses.length > 0 ? (
            <div className="scroll-container">
              <ul className="dropdown">
                {filteredCourses.map((course, index) => (
                  <li key={index} onClick={() => handleSelectCourse(course)}>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No matching courses found</p>
          )}
        </div>

        <div>
          <h3>Selected Courses</h3>
          {selectedCourses.length === 0 ? (
            <p>No courses selected</p>
          ) : (
            <>
              <ul>
                {selectedCourses.map((course, index) => (
                  <li key={index}>
                    {course} <button onClick={() => handleRemoveCourse(course)}>Remove</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleClearCourses}>Clear All</button>
            </>
          )}
        <div style={{ marginTop: '1rem' }}>
          <button onClick={saveSchedule}>💾 Save Schedule</button>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={loadSchedule}>📂 Load Schedule</button>
          {message && <p>{message}</p>}
        </div>

        </div>
      </div>

      <button onClick={handleGeneration} disabled={loadingSchedules}>
        {loadingSchedules ? "Generating..." : "Generate Schedules"}
      </button>
      
      <div
        ref={schedulerContainerRef}
        style={{ width: "100%", height: "600px", marginTop: "2rem" }}
      ></div>

      <div className="container">
        <div>
          <h3> Schedules </h3>
          <div className="w-full">
            {Object.keys(schedule).length > 0 ? (
              <div className="grid gap-4">
                {Object.entries(schedule).map(([day, classes]) => (
                  <div key={day} className="p-4 border rounded-lg shadow-md">
                    <h3 className="font-bold capitalize">{day}:</h3>
                    <ul>
                      {classes.length > 0 ? (
                        classes.map((cls, index) => (
                          <li key={index} className="mt-2">
                            <strong>{cls.code}</strong> - {cls.title} ({cls.start}-{cls.end}) with {cls.professor}
                          </li>
                        ))
                      ) : (
                        <p>No classes scheduled.</p>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No schedule generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

}
export default App;

