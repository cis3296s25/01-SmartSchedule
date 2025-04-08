import React, { useState } from 'react';

function SelectedCourses({ selectedCourses, setSelectedCourses }) {
    const [message, setMessage] = useState('');

    // group by course code
    const groupedByCode = {};
    selectedCourses.forEach(course => {
        if (!groupedByCode[course.code]) {
            groupedByCode[course.code] = [];
        }
        groupedByCode[course.code].push(course);
    });

    const handleRemoveCourseCode = (code) => {
        setSelectedCourses(prev => prev.filter(course => course.code !== code));
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
                        {Object.keys(groupedByCode).map((code, index) => (
                            <li key={index}>
                                {code}
                                <button onClick={() => handleRemoveCourseCode(code)}>Remove</button>
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



