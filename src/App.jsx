/* global scheduler */
import {useState, useRef} from 'react';
import './App.css';
import axios from "axios";


import html2canvas from "html2canvas"; // Used to capture the DOM as an image
import jsPDF from "jspdf"; // Used to generate and export PDF files

import logo from "./assets/templelogo.png";

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

            // array of promises to fetch each subject’s courses in parallel
            const courseFetchPromises = selectedCourses.map(course => {
                const [subject] = course.code.split(" ");
                return axios.get("http://localhost:8000/api/subject/courses", {
                    params: {
                        subject,
                        term_code: termCode
                    }
                });
            });

            // run all subject fetches in parallel
            const courseResponses = await Promise.all(courseFetchPromises);

            // flatten results into full course data
            const fullCourses = [];

            selectedCourses.forEach((course, index) => {
                const courseList = courseResponses[index].data.courses;
                const matching = courseList.find(c => c.CRN === course.CRN); // match by section
                if (matching) {
                    fullCourses.push(matching);
                }
            });

            console.log("📦 Sending to backend:", JSON.stringify({ courses: fullCourses }, null, 2));

            console.log("🧪 Course preview:", fullCourses.map(c => ({
                code: c.code,
                CRN: c.CRN,
                professor: c.professor,
                meetingTimes: c.meetingTimes
              })));
              

            // call generate API
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

    // func to download generated schedule as a .jpg/.pdf
    const handleDownload = async (type) => {
      if (!schedulerContainerRef.current) return;

      const canvas = await html2canvas(schedulerContainerRef.current, { // Capture the DOM element as a canvas
        
        //added the properties below to ensure full schedule generated was captured. 
        scrollY: -window.scrollY, // Prevent sticky elements
        windowHeight: schedulerContainerRef.current.scrollHeight, // Capture full height of scheduler
        useCORS: true // Support for external styles/images
      });
      
      const imgData = canvas.toDataURL("image/png"); // Convert to PNG image data

      if (type === "pdf") {
          const pdf = new jsPDF(); // Create a new PDF document
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Maintain image aspect ratio
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); //method from jsPDF library used to insert an image into the PDF.
          pdf.save("schedule.pdf"); // Save PDF to device
      } else {
          const link = document.createElement("a");//creates invisible link (<a>) element in the HTML. 
          link.href = imgData;
          link.download = "schedule.jpg"; // Save as JPG to device
          link.click();
      }
  };



    return (
        <>

            <h1>SmartSchedule 📅</h1>
            <img src={logo} className="templelogo" />

            <h3>Temple's Course Schedule Generator</h3>

            <div className="container">

                <SemesterSelector semester={semester} setSemester={setSemester}/>
                <CourseSearch
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    setMessage={setMessage}
                />

                <SelectedCourses
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                />

            </div>

            <button onClick={handleGeneration} disabled={loadingSchedules}>
              {loadingSchedules ? <i>Generating...</i> : "Generate Schedules"}
            </button>


            <GeneratedSchedules schedule={schedule} schedulerContainerRef={schedulerContainerRef}/>
        
        {/* New buttons added to allow users to download their schedule as .pdf/.jpg */}
        {Object.keys(schedule).length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <h4>📥 Download Your Generated Schedule</h4>
                    <button onClick={() => handleDownload("pdf")}>Download as PDF</button> {/* Exports as PDF */}
                    <button onClick={() => handleDownload("jpg")}>Download as JPG</button> {/* Exports as image */}
                </div>
            )}
        

            <GeneratedSchedules schedule={schedule} schedulerContainerRef={schedulerContainerRef} isLoading={loadingSchedules}/>

        </>

    );


}

export default App;

