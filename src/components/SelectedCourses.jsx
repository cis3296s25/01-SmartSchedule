import React, { useState } from 'react';

function SelectedCourses({ selectedCourses, setSelectedCourses }) {
    const [message, setMessage] = useState('');

    const handleRemoveCourse = (course) => {
        setSelectedCourses((prev) => prev.filter((item) => item !== course));
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

    return (
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
    );
}

export default SelectedCourses;


