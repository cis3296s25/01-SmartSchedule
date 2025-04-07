/* global scheduler */
import { useEffect } from 'react';

function GeneratedSchedules({ schedule, schedulerContainerRef }) {
    useEffect(() => {
        if (!scheduler || !scheduler.init || !schedulerContainerRef.current) return;

        scheduler.init(schedulerContainerRef.current, new Date(), "week");

        // Limit view from Monday to Friday, 7am to 11pm
        scheduler.config.first_hour = 7;
        scheduler.config.last_hour = 23;

        if (!schedule || Object.keys(schedule).length === 0) return;

        const eventList = [];
        let eventId = 1;

        Object.values(schedule).forEach((scheduleItem) => {
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
                            //${scheduleItem[0]} or ${course.code} this is undefined for some reason
                        });
                    });
                });
            });
        });

        scheduler.clearAll();
        scheduler.parse(eventList, "json");
    }, [schedule, schedulerContainerRef]);

    return (
        <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            {/* Scheduler on the left */}
            <div
                ref={schedulerContainerRef}
                style={{ flex: 2, height: "680px", border: "1px solid #ccc", borderRadius: "8px" }}
            ></div>

            {/* Schedule list on the right */}
            <div style={{ flex: 1 }}>
                {Object.keys(schedule).length > 0 ? (
                    <div className="grid gap-4">
                        {Object.entries(schedule).map(([sched_num, course]) => (
                            <div key={sched_num} className="p-4 border rounded-lg shadow-md">
                            <h3> Schedule {sched_num}:</h3>
                            {Object.entries(course).map(([course_num, {title, CRN, professor, creditHours}]) => (
                                <div>
                                <h4>{course_num} - {title}</h4>
                                <h5> {professor} </h5>
                                <h5>  CRN:{CRN}  Credits: {creditHours} </h5> 
                                {/* doesnt include meeting times start and end yet*/}
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



                                



