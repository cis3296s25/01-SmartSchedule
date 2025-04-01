function SaveLoadControls({ saveSchedule, loadSchedule, message }) {
    return (
        <div style={{ marginTop: '1rem' }}>
            <button onClick={saveSchedule}>💾 Save Schedule</button>
            <button onClick={loadSchedule}>📂 Load Schedule</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SaveLoadControls;

