import React, { useState } from 'react';

function ScheduleRestrictions() {
    const [restrictions, setRestrictions] = useState([]); 
    const [showSection, setShowSection] = useState(false);

    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const ampmOptions = ["AM", "PM"];

    const addRestriction = () => {
        const newRestriction = {
            fromHour: "",
            fromMinute: "",
            fromAmPm: "",
            toHour: "",
            toMinute: "",
            toAmPm: "",
            isEntered: false  //false until user clicks enter
        };
        setRestrictions((prev) => [...prev, newRestriction]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...restrictions];
        updated[index][field] = value;
        setRestrictions(updated);
    };

    const isRestrictionComplete = (restriction) => {
        return (
            restriction.fromHour && restriction.fromMinute && restriction.fromAmPm &&
            restriction.toHour && restriction.toMinute && restriction.toAmPm
        ); //returns true if all 6 dropdowns are filled in a given row
    };

    const handleEnter = (index) => {
        const updated = [...restrictions];
        updated[index].isEntered = true;
        setRestrictions(updated);
    };

    const canAddAnother = restrictions.length === 0 || (restrictions[restrictions.length - 1]?.isEntered);

    return (
        <div>
            <h3>Schedule Restrictions</h3>

            {!showSection && (
                <button onClick={() => { setShowSection(true); addRestriction(); }}>
                    Add Restriction
                </button>
            )}

            {showSection && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {restrictions.map((restriction, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <strong>Restriction {index + 1}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                {/* FROM */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>From</span>
                                    <select value={restriction.fromHour} onChange={(e) => handleChange(index, "fromHour", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">Hour</option>
                                        {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <span>:</span>
                                    <select value={restriction.fromMinute} onChange={(e) => handleChange(index, "fromMinute", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">Min</option>
                                        {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={restriction.fromAmPm} onChange={(e) => handleChange(index, "fromAmPm", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">AM/PM</option>
                                        {ampmOptions.map(ap => <option key={ap} value={ap}>{ap}</option>)}
                                    </select>
                                </div>

                                {/* TO */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>To</span>
                                    <select value={restriction.toHour} onChange={(e) => handleChange(index, "toHour", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">Hour</option>
                                        {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <span>:</span>
                                    <select value={restriction.toMinute} onChange={(e) => handleChange(index, "toMinute", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">Min</option>
                                        {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={restriction.toAmPm} onChange={(e) => handleChange(index, "toAmPm", e.target.value)} disabled={restriction.isEntered}>
                                        <option value="">AM/PM</option>
                                        {ampmOptions.map(ap => <option key={ap} value={ap}>{ap}</option>)}
                                    </select>
                                </div>

                                {/* ENTER button */}
                                {!restriction.isEntered && isRestrictionComplete(restriction) && (
                                    <button onClick={() => handleEnter(index)}>Enter</button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Only show this if the last restriction has been "Entered" */}
                    {canAddAnother && (
                        <button onClick={addRestriction}>Add Another Restriction</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ScheduleRestrictions;
