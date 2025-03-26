import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState(''); 
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleClick = () => {
    setMessage(`Searching for: ${search}`);     //handles search button
  };

  const courses = [       //temp course list
    "CIS 1001",
    "CIS 2001",
    "CIS 3001"
  ];

  const handleSelectCourse = (course) => {      //handles course
    setSearch(course);
    setShowDropdown(false);
  }

  const handleAddCourse = () => {     //handles add button
    if (search && !selectedCourses.includes(search)) {
      setSelectedCourses([...selectedCourses, search]);
      setSearch('');
      setShowDropdown(false);
    }
  }

  const handleRemoveCourse = (course) => {    //handles remove button
    setSelectedCourses(selectedCourses.filter(item => item !== course));
  }

  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1>SmartSchedule</h1>
      <h3>Temple Course Schedule Generator</h3>

      <div class="container">
        <div>
          <h3>Attributes</h3>
        </div>
        <div>
          <h3>Available Courses</h3>
            <input
            type="text"
            placeholder="Search for Course..."
            value={search}
            onFocus = {() => setShowDropdown(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        
        <button onClick={handleClick}>Search</button>
        <button onClick={handleAddCourse}>Add</button>
          {showDropdown && filteredCourses.length > 0 && (
              <ul className="dropdown">
                {filteredCourses.map((course, index) => (
                <li key={index} onClick={() => handleSelectCourse(course)}>
                  {course}
                </li>
              ))}
              </ul>
            )}
      </div>

      <div>
        <h3>Selected Courses</h3>
        {selectedCourses.length === 0 ? (
            <p>No courses selected</p>
          ) : (
            <ul>
              {selectedCourses.map((course, index) => (
                <li key={index}>
                  {course} <button onClick={() => handleRemoveCourse(course)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
      </div>

      <div>
        <h3>Schedule Restictions</h3>
      </div>
      
      </div>

      <div class="container">
        <div>
          <h3> Generated Schedules </h3>

        </div>
      </div>
    </>
  );
}

export default App
