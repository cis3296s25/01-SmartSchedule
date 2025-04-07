import {useEffect, useState, useRef} from "react";

function CourseSearch({selectedCourses, setSelectedCourses, message, setMessage}) {
    // states for subject search and selection
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

    // states for course search and selection
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);

    // fixed term passed in
    const termCode = "202503";

    // refs for prefetching apis on page load
    const hasFetchedSubjects = useRef(false);
    const hasPrefetchedCourses = useRef(false);


    useEffect(() => {
        if (hasPrefetchedCourses.current) return;
        hasPrefetchedCourses.current = true;

        const fetchAllCourses = async () => {
            const cached = localStorage.getItem(`all_courses_${termCode}`);
            if (cached) return;

            try {
                const res = await fetch(`http://localhost:8000/api/course-numbers?term_code=${termCode}`);
                const data = await res.json();
                const unique = [...new Set(data.courseNumbers)];
                localStorage.setItem(`all_courses_${termCode}`, JSON.stringify(unique));
                console.log("Prefetched all course numbers");
            } catch (err) {
                console.error("Failed to prefetch all course numbers:", err);
            }
        };

        fetchAllCourses();
    }, []);

    useEffect(() => {
        if (hasFetchedSubjects.current) return;
        hasFetchedSubjects.current = true;

        const fetchSubjects = async () => {
            const cachedSubjects = localStorage.getItem(`subjects_${termCode}`);
            if (cachedSubjects) {
                setSubjects(JSON.parse(cachedSubjects));
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/api/subjects?term_code=${termCode}`);
                const data = await res.json();
                setSubjects(data.subjects);
                localStorage.setItem(`subjects_${termCode}`, JSON.stringify(data.subjects));
            } catch (err) {
                console.error("Failed to fetch subjects", err);
            }
        };
        fetchSubjects();
    }, []);

    const fetchCourses = async (subjectCode = '') => {
        setLoadingCourses(true);
        setShowCourseDropdown(true);

        try {
            let url;
            if (!subjectCode) {
                const cachedCourses = localStorage.getItem(`all_courses_${termCode}`);
                if (cachedCourses) {
                    setCourses(JSON.parse(cachedCourses));
                    return;
                }

                url = `http://localhost:8000/api/course-numbers?term_code=${termCode}`;
                const res = await fetch(url);
                const data = await res.json();
                const uniqueCourses = [...new Set(data.courseNumbers)];
                setCourses(uniqueCourses);
                localStorage.setItem(`all_courses_${termCode}`, JSON.stringify(uniqueCourses));
            } else {
                url = `http://localhost:8000/api/subject/courses?term_code=${termCode}&subject=${subjectCode}`;
                const res = await fetch(url);
                const data = await res.json();
                setCourses([...new Set(data.courses.map(c => c.code))]);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
            setCourses([]);
        } finally {
            setLoadingCourses(false);
        }
    };


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
        return subjects.filter(s =>
            s.code.toLowerCase().includes(lower) ||
            s.description.toLowerCase().includes(lower)
        );
    };

    const handleSubjectClick = () => {
        setShowSubjectDropdown(true);
        // reset it when the input is clicked again
        if (selectedSubjectCode) {
            setSelectedSubject('');
            setSelectedSubjectCode('');
            setCourses([]);
            setSearch('');
        }
    };

    const handleSubjectChange = (e) => {
        const input = e.target.value;
        setSelectedSubject(input);
        setSelectedSubjectCode('');
        setCourses([]);
        setShowSubjectDropdown(true);
    };

    const handleSubjectSelect = (subj) => {
        setSelectedSubject(subj.description);
        setSelectedSubjectCode(subj.code);
        setShowSubjectDropdown(false);
        setSearch('');
        fetchCourses(subj.code); // auto-fetch and show course dropdown
    };

    return (
        <div>
            <h3>Available Courses</h3>

            {/* Subject Dropdown */}
            <label><strong>Subject: </strong></label>
            <input
                type="text"
                placeholder="Select Subject"
                value={selectedSubject}
                onClick={handleSubjectClick}
                onFocus={handleSubjectClick}
                onChange={handleSubjectChange}
            />
            {showSubjectDropdown && (
                <div className="scroll-container">
                    <ul className="dropdown">
                        {filterSubjects(selectedSubject).map((subj, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleSubjectSelect(subj)}
                            >
                                {subj.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <p></p>

            {/* Course Dropdown */}
            <label style={{marginTop: '1rem'}}><strong>Course: </strong></label>
            <input
                type="text"
                placeholder="Search for Course..."
                value={search}
                onFocus={() => {
                    setShowCourseDropdown(true);
                    if (!selectedSubjectCode && courses.length === 0) {
                        fetchCourses(""); // Load all courses
                    }
                }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={handleAddCourse}>Add</button>

            {showCourseDropdown && loadingCourses ? (
                <p>{selectedSubjectCode ? <i>Loading courses... </i> : "Loading all courses..."}
                    <p></p>
                    <img src="./spinner.svg"/>
                </p>
            ) : showCourseDropdown && courses.length > 0 ? (
                <div className="scroll-container">
                    <ul className="dropdown">
                        {courses
                            .filter(course =>
                                course.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((course, index) => (
                                <li key={index} onClick={() => handleSelectCourse(course)}>
                                    {course}
                                </li>
                            ))}
                    </ul>
                </div>
            ) : (
                showCourseDropdown && !loadingCourses && <p>No matching courses found</p>
            )}
        </div>
    );
}

export default CourseSearch;






