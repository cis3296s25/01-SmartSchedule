import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [schedule, setSchedule] = useState({});

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

  const filteredCourses = courses.filter(course =>
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
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleGeneration = async () => {
    setLoadingSchedules(true);
    try {
      const response = await axios.post("http://localhost:8000/api/generate", {
        courses: selectedCourses,
      });
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
            <SemesterSelector
                semester={semester}
                setSemester={setSemester}
                showSemesterDropdown={showSemesterDropdown}
                setShowSemesterDropdown={setShowSemesterDropdown}
                semesters={semesters}
                handleSelectSemester={handleSelectSemester}
            />
            <ScheduleRestrictions />
          </div>

          <CourseSearch
              search={search}
              setSearch={setSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              courses={courses}
              filteredCourses={filteredCourses}
              loadingCourses={loadingCourses}
              handleClick={handleClick}
              handleSelectCourse={handleSelectCourse}
              handleAddCourse={handleAddCourse}
          />

          <SelectedCourses
              selectedCourses={selectedCourses}
              handleRemoveCourse={handleRemoveCourse}
              handleClearCourses={handleClearCourses}
              saveSchedule={saveSchedule}
              loadSchedule={loadSchedule}
              message={message}
          />
        </div>

        <button onClick={handleGeneration} disabled={loadingSchedules}>
          {loadingSchedules ? "Generating..." : "Generate Schedules"}
        </button>

        <GeneratedSchedules schedule={schedule} />
      </>
  );
}

export default App;





