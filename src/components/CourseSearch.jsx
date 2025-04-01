function CourseSearch({
                          search,
                          setSearch,
                          showDropdown,
                          setShowDropdown,
                          handleAddCourse,
                          handleSelectCourse,
                          filteredCourses,
                          loading
                      }) {
    return (
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
                <div className="scroll-container">
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
    );
}

export default CourseSearch;


