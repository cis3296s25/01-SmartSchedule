function SelectedCourses({
                             selectedCourses,
                             handleRemoveCourse,
                             handleClearCourses
                         }) {
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
        </div>
    );
}

export default SelectedCourses;

