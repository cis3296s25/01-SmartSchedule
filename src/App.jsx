import { useState, useEffect } from 'react'
import './App.css'
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



  const handleClick = () => {
    setMessage(`Searching for: ${search}`);
  };


  const semesters = [
    "Fall 2025",
    "Spring 2025",
    "Fall 2024"
  ]

  const handleSelectSemester = (sem) => {
    setSemester(sem);
    setShowSemesterDropdown(false); //close dropdown after selecting
  }

  
  const handleSelectCourse = (course) => {
    setSearch(course);
    setShowDropdown(false);
  }

  const handleAddCourse = () => {
    if (search && !selectedCourses.includes(search)) {
      setSelectedCourses([...selectedCourses, search]);
      setSearch('');
      setShowDropdown(false);
    }
  }

  const handleRemoveCourse = (course) => {
    setSelectedCourses(selectedCourses.filter(item => item !== course));
  }

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
        const response = await fetch("http://localhost:8000/api/course-numbers?term_code=202503"); // Replace with your backend URL
        const data = await response.json();
        setCourses([...new Set(data.courseNumbers)]); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        // setMessage("⚠️ Failed to fetch courses.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []); 

  const handleGeneration = async () => {
    setLoadingSchedules(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate_schedules", { courses: selectedCourses });
      setSchedule(response.data);
    } catch (error) {
      console.error("Error generating schedules:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };
  

  return (
    <>
      <h1>SmartSchedule 📅 </h1>
      <h3>Temple's Course Schedule Generator</h3>
      
      <div class="container">
        <div class="stacked">
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
          <div className = "scroll-container"> 
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

      <div class="container">
        <div>
          <h3> Schedules </h3>
          <div className="w-full">
            {Object.keys(schedule).length > 0 ? (
              <div className="grid gap-4">
                {Object.entries(schedule).map(([day, classes]) => (
                  <div key={day} className="p-4 border rounded-lg shadow-md">
                    <h3 className="font-bold capitalize">{day}:</h3>
                    <ul>
                      {classehs.length > 0 ? (
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
