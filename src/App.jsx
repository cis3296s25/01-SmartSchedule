import { useState, useEffect } from 'react';
import './App.css';
import SemesterSelector from './components/SemesterSelector';
import CourseSearch from './components/CourseSearch';
import SelectedCourses from './components/SelectedCourses';
import ScheduleRestrictions from './components/ScheduleRestrictions';
import GeneratedSchedules from './components/GeneratedSchedules';

function App() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setMessage(`Searching for: ${search}`);
  };

  const semesters = ["Fall 2025", "Spring 2025", "Fall 2024"];

  const handleSelectSemester = (sem) => {
    setSemester(sem);
    setShowSemesterDropdown(false);
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
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/course-numbers?term_code=202503");
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
        <h1>SmartSchedule 📅</h1>
        <h3>Temple's Course Schedule Generator</h3>

        <div className="container">
          <SemesterSelector
              semester={semester}
              semesters={semesters}
              showSemesterDropdown={showSemesterDropdown}
              setSemester={setSemester}
              setShowSemesterDropdown={setShowSemesterDropdown}
              handleSelectSemester={handleSelectSemester}
          />

          <CourseSearch
              search={search}
              setSearch={setSearch}
              handleClick={handleClick}
              handleAddCourse={handleAddCourse}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              filteredCourses={filteredCourses}
              handleSelectCourse={handleSelectCourse}
              loading={loading}
          />

          <SelectedCourses
              selectedCourses={selectedCourses}
              handleRemoveCourse={handleRemoveCourse}
              handleClearCourses={handleClearCourses}
          />

          <ScheduleRestrictions />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={saveSchedule}>💾 Save Schedule</button>
          <button onClick={loadSchedule}>📂 Load Schedule</button>
          {message && <p>{message}</p>}
        </div>

        <div className="container">
          <GeneratedSchedules />
        </div>
      </>
  );
}

export default App;



