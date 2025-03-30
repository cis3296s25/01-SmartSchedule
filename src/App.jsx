import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState(''); 
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const semesters = [
    "Fall 2025",
    "Spring 2025",
    "Fall 2024"
  ]

  const handleSelectSemester = (sem) => {
    setSemester(sem);
    setShowSemesterDropdown(false); //close dropdown after selecting
  }


  const courseList = () => { //list to display the course list
    const [courses, setCourses] = useState([]);
  }

  const courses = [ //temp course list
    "CIS 1001",
    "CIS 2001",
    "CIS 3001"
  ];

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
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/course-numbers?term_code=202503"); // Replace with your backend URL
        const data = await response.json();
        setCourses([...new Set(data.courseNumbers)]); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMessage("⚠️ Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []); 

  return (
    <>
      <h1>SmartSchedule 📅 </h1>
      <h3>Temple's Course Schedule Generator</h3>

      <div class="container">
        <div>
          <h3>Select Semester</h3>
        
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

      <div class="container">
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

          {loading ? (
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
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
          <button onClick={saveSchedule}>💾 Save Schedule</button>
          <button onClick={loadSchedule}>📂 Load Schedule</button>
          {message && <p>{message}</p>}
        </div>
        
      <div class="container">
        <div>
          <h3> Generated Schedules </h3>

        </div>
      </div>
    </>
  );
}

export default App;
