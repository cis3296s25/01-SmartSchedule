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

      <input
        type="text"
        placeholder="Search for Course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleClick}>Search</button>
    </>
  );
}

export default App
