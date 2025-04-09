import React, { useState } from 'react';

function ScheduleRestrictions() {
    const [showTimeRange, setShowTimeRange] = useState(false);

    //from time state
    const [fromHour, setFromHour] = useState("1");
    const [fromMinute, setFromMinute] = useState("00");
    const [fromAmPm, setFromAmPm] = useState("AM");

    //to time state
    const [toHour, setToHour] = useState("1");
    const [toMinute, setToMinute] = useState("00");
    const [toAmPm, setToAmPm] = useState("AM");

    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const ampmOptions = ["AM", "PM"];

    return (
        <div>
            <h3>Schedule Restrictions</h3>

            {/* Add Restriction Button */}
            {!showTimeRange && (
                <button onClick={() => setShowTimeRange(true)}>Add Restriction</button>
            )}

            {/* Time Picker Shown After Click */}
            {showTimeRange && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                    {/* FROM Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>From</span>

                        <select value={fromHour} onChange={(e) => setFromHour(e.target.value)}>
                            {hourOptions.map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>

                        <span>:</span>

                        <select value={fromMinute} onChange={(e) => setFromMinute(e.target.value)}>
                            {minuteOptions.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select value={fromAmPm} onChange={(e) => setFromAmPm(e.target.value)}>
                            {ampmOptions.map((ap) => (
                                <option key={ap} value={ap}>{ap}</option>
                            ))}
                        </select>
                    </div>

                    {/* TO Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>To</span>

                        <select value={toHour} onChange={(e) => setToHour(e.target.value)}>
                            {hourOptions.map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>

                        <span>:</span>

                        <select value={toMinute} onChange={(e) => setToMinute(e.target.value)}>
                            {minuteOptions.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select value={toAmPm} onChange={(e) => setToAmPm(e.target.value)}>
                            {ampmOptions.map((ap) => (
                                <option key={ap} value={ap}>{ap}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleRestrictions;
