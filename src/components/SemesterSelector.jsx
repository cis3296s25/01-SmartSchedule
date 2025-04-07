import React, { useState } from 'react';

function SemesterSelector({ semester, setSemester }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const semesters = ["Fall 2025", "Spring 2025", "Fall 2024"];

    const handleSelect = (sem) => {
        setSemester(sem);
        setShowDropdown(false);
    };

    return (
            <div className="stacked">
                <div>
                    <h3>Semester</h3>
                    <p>Choose your semester from the dropdown below.</p>

                    <input
                        type="text"
                        placeholder="Select semester"
                        value={semester}
                        onFocus={() => setShowDropdown(true)} //show dropdown on focus
                        onChange={(e) => setSemester(e.target.value)} //update semester value
                    />

                    {showDropdown && semesters.length > 0 && (
                        <ul className="dropdown">
                            {semesters.map((sem, index) => (
                                <li key={index} onClick={() => handleSelect(sem)}>
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
    );
}

export default SemesterSelector;



