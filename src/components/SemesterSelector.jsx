function SemesterSelector({
                              semester,
                              setSemester,
                              showSemesterDropdown,
                              setShowSemesterDropdown,
                              semesters,
                              handleSelectSemester
                          }) {
    return (
        <div>
            <h3>Semester</h3>
            <p>Choose your semester from the dropdown below.</p>

            <input
                type="text"
                placeholder="Select semester"
                value={semester}
                onFocus={() => setShowSemesterDropdown(true)}
                onChange={(e) => setSemester(e.target.value)}
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
    );
}

export default SemesterSelector;


