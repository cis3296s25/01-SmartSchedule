/* global scheduler */
import { useEffect } from 'react';

function GeneratedSchedules({ schedule, schedulerContainerRef }) {
    useEffect(() => {
        if (!scheduler || !scheduler.init || !schedulerContainerRef.current) return;

        scheduler.init(schedulerContainerRef.current, new Date(), "week");

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
                            text: `${course.code} - ${course.title}`,
                            start_date: eventStart,
                            end_date: eventEnd,
                        });
                    });
                });
            });
        });

        scheduler.clearAll();
        scheduler.parse(eventList, "json");
    }, [schedule]);

    return (
        <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            {/* Scheduler on the left */}
            <div
                ref={schedulerContainerRef}
                style={{ flex: 2, height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}
            ></div>

            {/* Schedule list on the right */}
            <div style={{ flex: 1 }}>
                <h3>Schedules</h3>
                {Object.keys(schedule).length > 0 ? (
                    <div className="grid gap-4">
                        {Object.entries(schedule).map(([day, classes]) => (
                            <div key={day} className="p-4 border rounded-lg shadow-md">
                                <h4 className="font-bold capitalize">{day}:</h4>
                                <ul>
                                    {classes.length > 0 ? (
                                        classes.map((cls, index) => (
                                            <li key={index} className="mt-2">
                                                <strong>{cls.code}</strong> - {cls.title} ({cls.start}-{cls.end}) with {cls.professor}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No classes scheduled.</p>
                                    )}
                                </ul>
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







