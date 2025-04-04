/* global scheduler */
import { useState, useRef } from 'react';
import './App.css';
import axios from "axios";
import SemesterSelector from "./components/SemesterSelector.jsx";
import GeneratedSchedules from "./components/GeneratedSchedules.jsx";
import CourseSearch from './components/CourseSearch';
import SelectedCourses from "./components/SelectedCourses.jsx";



function App() {
  const [message, setMessage] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [schedule, setSchedule] = useState({});
  const schedulerContainerRef = useRef(null);



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

        <SemesterSelector semester={semester} setSemester={setSemester} />
        <CourseSearch
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            setMessage={setMessage}
        />

        <SelectedCourses onSelectedCoursesChange={setSelectedCourses} />

      </div>

      <button onClick={handleGeneration} disabled={loadingSchedules}>
        {loadingSchedules ? "Generating..." : "Generate Schedules"}
      </button>

      <GeneratedSchedules schedule={schedule} schedulerContainerRef={schedulerContainerRef} />
    </>
  );

}
export default App;

