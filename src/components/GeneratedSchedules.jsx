import React from 'react';

const GeneratedSchedules = ({ schedule }) => {
    return (
        <div className="container">
            <div>
                <h3> Schedules </h3>
                <div className="w-full">
                    {Object.keys(schedule).length > 0 ? (
                        <div className="grid gap-4">
                            {Object.entries(schedule).map(([day, classes]) => (
                                <div key={day} className="p-4 border rounded-lg shadow-md">
                                    <h3 className="font-bold capitalize">{day}:</h3>
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
        </div>
    );
};

export default GeneratedSchedules;





