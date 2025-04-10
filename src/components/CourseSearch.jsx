import {useEffect, useState, useRef} from "react";

function CourseSearch({selectedCourses, setSelectedCourses, message, setMessage, termCode}) {
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

    // refs for prefetching apis on page load
    const hasFetchedSubjects = useRef(false);
    const hasPrefetchedCourses = useRef(false);
    const isCoursePrefetchComplete = useRef(false);
    const isPrefetchingCourses = useRef(false);
    const subjectCoursesCache = useRef({});

    // prefetch course numbers
    useEffect(() => {
        if (hasPrefetchedCourses.current) return;
        hasPrefetchedCourses.current = true;

        const fetchAllCourses = async () => {
            const cached = localStorage.getItem(`all_courses_${termCode}`);
            if (cached) {
                isCoursePrefetchComplete.current = true;
                return;
            }

            isPrefetchingCourses.current = true;
            try {
                const res = await fetch(`http://localhost:8000/api/course-numbers?term_code=${termCode}`);
                const data = await res.json();
                const unique = [...new Set(data.courseNumbers)];
                localStorage.setItem(`all_courses_${termCode}`, JSON.stringify(unique));
                isCoursePrefetchComplete.current = true;
            } catch (err) {
                console.error("Failed to prefetch all course numbers:", err);
            } finally {
                isPrefetchingCourses.current = false;
            }
        };

        fetchAllCourses();
    }, []);

    // prefetch subjects
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

    // reset everything when semester changes
    useEffect(() => {
    hasFetchedSubjects.current = false;
    hasPrefetchedCourses.current = false;
    subjectCoursesCache.current = {};

    setSelectedSubject('');
    setSelectedSubjectCode('');
    setCourses([]);
    setSearch('');
    setShowSubjectDropdown(false);
    setShowCourseDropdown(false);

}, [termCode]);



    const fetchCourses = async (subjectCode = '') => {
        setLoadingCourses(true);
        setShowCourseDropdown(true);

        try {
            if (!subjectCode) {
                const cachedCourses = localStorage.getItem(`all_courses_${termCode}`);
                if (cachedCourses) {
                    setCourses(JSON.parse(cachedCourses));
                    return;
                }

                const res = await fetch(`http://localhost:8000/api/course-numbers?term_code=${termCode}`);
                const data = await res.json();
                const uniqueCourses = [...new Set(data.courseNumbers)];
                setCourses(uniqueCourses);
                localStorage.setItem(`all_courses_${termCode}`, JSON.stringify(uniqueCourses));
            } else {
                // fetch full course section objects
                const res = await fetch(`http://localhost:8000/api/subject/courses?term_code=${termCode}&subject=${subjectCode}`);
                const data = await res.json();

                // cache full section objects by subject
                subjectCoursesCache.current[subjectCode] = data.courses;

                // extract course codes for dropdown
                const courseCodes = [...new Set(data.courses.map(c => c.code))];
                setCourses(courseCodes);
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
        if (!search) return;

        const matchingSections = [];

        // search all cached subjects for full section matches
        Object.values(subjectCoursesCache.current).forEach(sectionList => {
            sectionList.forEach(section => {
                if (section.code === search) {
                    matchingSections.push(section);
                }
            });
        });

        if (matchingSections.length === 0) {
            setMessage(`No sections found for ${search}`);
            return;
        }

        // filter out sections already selected by CRN
        const newSections = matchingSections.filter(section =>
            !selectedCourses.some(existing => existing.CRN === section.CRN)
        );

        if (newSections.length === 0) {
            setMessage(`All sections of ${search} already added`);
            return;
        }

        console.log("✅ Adding sections to selectedCourses:", newSections);
        setSelectedCourses(prev => [...prev, ...newSections]);
        setMessage(`✅ Added ${search} (${newSections.length} section${newSections.length > 1 ? 's' : ''})`);
        setSearch('');
        setShowCourseDropdown(false);
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
        fetchCourses(subj.code);
    };

    return (
        <div>
            <h3>Available Courses</h3>

            {/* Subject Input */}
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
                            <li key={idx} onClick={() => handleSubjectSelect(subj)}>
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
                    const cached = localStorage.getItem(`all_courses_${termCode}`);

                    if (!selectedSubjectCode && courses.length === 0) {
                        if (cached && !isPrefetchingCourses.current) {
                            setLoadingCourses(true);
                            setCourses(JSON.parse(cached));
                            setTimeout(() => setLoadingCourses(false), 300); // simulate loading UI
                        } else if (!cached && !isPrefetchingCourses.current) {
                            fetchCourses(""); // fallback
                        } else {
                            setLoadingCourses(true); // user clicked before prefetch finished
                        }
                    }
                }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={handleAddCourse}>Add</button>

            {/* Course Results */}
            {showCourseDropdown && loadingCourses ? (
                <p>
                    {selectedSubjectCode ? <i>Loading courses...</i> : "Loading all courses..."}
                    <p></p>
                    <img src="./spinner.svg" alt="loading"/>
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







