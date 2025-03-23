import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState(''); 
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setMessage(`Searching for: ${search}`);
  };

  return (
    <>
      <h1>SmartSchedule</h1>
      <h3>Temple Course Schedule Generator</h3>

      <div class="container">
        
      <div>
      <h3>Available Courses</h3>
        <input
          type="text"
          placeholder="Search for Course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleClick}>Search</button>
      </div>

      <div>
        <h3>Selected Courses</h3>
      </div>

      <div>
        <h3>Schedule Restictions</h3>
      </div>
      
      </div>
    </>
  );
}

export default App
