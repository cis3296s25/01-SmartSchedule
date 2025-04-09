function SaveLoadControls({ saveSchedule, loadSchedule, message }) {
    return (
        <div style={{ marginTop: '1rem' }}>
            <button onClick={saveSchedule}>💾 Save Selected Courses</button>
            <button onClick={loadSchedule}>📂 Load Selected Courses</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SaveLoadControls;

