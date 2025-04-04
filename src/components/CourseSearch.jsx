import { useEffect, useState } from "react";

function CourseSearch({ selectedCourses, setSelectedCourses, message, setMessage }) {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const termCode = "202503";

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/subjects?term_code=${termCode}`);
                const data = await res.json();
                setSubjects(data.subjects);
            } catch (err) {
                console.error("Failed to fetch subjects", err);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedSubjectCode) {
                setCourses([]);
                return;
            }

            setLoadingCourses(true);
            try {
                const url = `http://localhost:8000/api/subject/courses?term_code=${termCode}&subject=${selectedSubjectCode}`;
                const res = await fetch(url);
                const data = await res.json();
                const courseList = [...new Set(data.courses.map((c) => c.code))];
                setCourses(courseList);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setCourses([]);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, [selectedSubjectCode]);

    const handleSelectCourse = (course) => {
        setSearch(course);
        setShowCourseDropdown(false);
    };

    const handleAddCourse = () => {
        if (search && !selectedCourses.includes(search)) {
            setSelectedCourses([...selectedCourses, search]);
            setSearch('');
            setShowCourseDropdown(false);
            setMessage(`✅ Added ${search}`);
        }
    };

    const filterSubjects = (query) => {
        const lower = query.toLowerCase();
        return subjects.filter(
            (s) =>
                s.code.toLowerCase().includes(lower) ||
                s.description.toLowerCase().includes(lower)
        );
    };

    const handleSubjectClick = () => {
        // Reset everything on click
        setShowSubjectDropdown(true);
        setSelectedSubject('');
        setSelectedSubjectCode('');
        setCourses([]);
        setSearch('');
    };

    return (
        <div>
            <h3>Available Courses</h3>

            {/* Subject Dropdown */}
            <label><strong>Subject:</strong></label>
            <input
                type="text"
                placeholder="Select Subject"
                value={selectedSubject}
                onClick={handleSubjectClick}
                onFocus={handleSubjectClick}
                onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedSubjectCode('');
                    setCourses([]);
                }}
            />
            {showSubjectDropdown && subjects.length > 0 && (
                <div className="scroll-container">
                    <ul className="dropdown">
                        {filterSubjects(selectedSubject).map((subj, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    setSelectedSubject(subj.description);
                                    setSelectedSubjectCode(subj.code);
                                    setShowSubjectDropdown(false);
                                }}
                            >
                                {subj.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Course Dropdown */}
            <label style={{ marginTop: '1rem' }}><strong>Course:</strong></label>
            <input
                type="text"
                placeholder="Search for Course..."
                value={search}
                onFocus={() => setShowCourseDropdown(true)}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={handleAddCourse}>Add</button>

            {loadingCourses ? (
                <p>Loading courses...</p>
            ) : showCourseDropdown && courses.length > 0 ? (
                <div className="scroll-container">
                    <ul className="dropdown">
                        {courses
                            .filter((course) => course.toLowerCase().includes(search.toLowerCase()))
                            .map((course, index) => (
                                <li key={index} onClick={() => handleSelectCourse(course)}>
                                    {course}
                                </li>
                            ))}
                    </ul>
                </div>
            ) : (
                showCourseDropdown &&
                selectedSubjectCode && // Only show 'No matching courses' if subject selected
                !loadingCourses &&
                courses.length === 0 && <p>No matching courses found</p>
            )}

        </div>
    );
}

export default CourseSearch;


