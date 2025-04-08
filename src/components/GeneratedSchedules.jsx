import { useEffect, useState } from 'react';

function GeneratedSchedules({ schedule, schedulerContainerRef }) {
    const [selectedSchedule, setSelectedSchedule] = useState("1"); // default to first

    useEffect(() => {
        if (!scheduler || !scheduler.init || !schedulerContainerRef.current) return;

        scheduler.init(schedulerContainerRef.current, new Date(), "week");

        // View window config
        scheduler.config.first_hour = 7;
        scheduler.config.last_hour = 23;

        if (!schedule || !schedule[selectedSchedule]) return;

        const eventList = [];
        let eventId = 1;

        const scheduleItem = schedule[selectedSchedule];
        Object.values(scheduleItem).forEach((course) => {
            course.meetingTimes.forEach((mt) => {
                mt.days.forEach((day) => {
                    const dayMap = {
                        monday: 1,
                        tuesday: 2,
                        wednesday: 3,
                        thursday: 4,
                        friday: 5,
                    };

                    const startHour = parseInt(mt.start.substring(0, 2), 10);
                    const startMin = parseInt(mt.start.substring(2), 10);
                    const endHour = parseInt(mt.end.substring(0, 2), 10);
                    const endMin = parseInt(mt.end.substring(2), 10);

                    const now = new Date();
                    const eventStart = new Date(now.setDate(now.getDate() - now.getDay() + dayMap[day]));
                    eventStart.setHours(startHour, startMin);

                    const eventEnd = new Date(eventStart);
                    eventEnd.setHours(endHour, endMin);

                    eventList.push({
                        id: eventId++,
                        text: `${course.title}`,
                        start_date: eventStart,
                        end_date: eventEnd,
                    });
                });
            });
        });

        scheduler.clearAll();
        scheduler.parse(eventList, "json");
    }, [schedule, schedulerContainerRef, selectedSchedule]);

    return (
        <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            {/* Scheduler Panel */}
            <div style={{ flex: 2 }}>
                <label>
                    <strong>View Schedule:</strong>{' '}
                    <select
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    >
                        {Object.keys(schedule).map((schedNum) => (
                            <option key={schedNum} value={schedNum}>
                                Schedule {schedNum}
                            </option>
                        ))}
                    </select>
                </label>
                <div
                    ref={schedulerContainerRef}
                    style={{ height: "680px", border: "1px solid #ccc", borderRadius: "8px" }}
                />
            </div>

            {/* Schedule List Panel */}
            <div style={{ flex: 1 }}>
                {Object.keys(schedule).length > 0 ? (
                    <div className="grid gap-4">
                        {Object.entries(schedule).map(([sched_num, course]) => (
                            <div key={sched_num} className="p-4 border rounded-lg shadow-md">
                                <h3>Schedule {sched_num}:</h3>
                                {Object.entries(course).map(([course_num, { title, CRN, professor, creditHours, meetingTimes }]) => (
                                    <div key={CRN}>
                                        <h4>{course_num} - {title}</h4>
                                        <h5>{professor}</h5>
                                        <h5>CRN: {CRN} | Credits: {creditHours}</h5>
                                        <ul>
                                            {meetingTimes.map((mt, idx) => (
                                                <li key={idx}>
                                                    {mt.type}: {mt.days.join(", ")} | {mt.start} - {mt.end}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No schedule generated yet.</p>
                )}
            </div>
        </div>
    );
}

export default GeneratedSchedules;
