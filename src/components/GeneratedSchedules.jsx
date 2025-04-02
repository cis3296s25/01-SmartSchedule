import React from 'react';

const GeneratedSchedules = ({ schedules }) => {
  return (
    <div className="box">
      <h3>Generated Schedules</h3>
      {schedules.length === 0 ? (
        <p>No schedule generated yet.</p>
      ) : (
        <ul>
          {schedules.map((schedule, index) => (
            <li key={index}>{JSON.stringify(schedule)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeneratedSchedules;




