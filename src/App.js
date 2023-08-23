import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const convertToPDF = async () => {
    try {
      const response = await axios.post('http://localhost:3001/convert', { url });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Failed to convert webpage to PDF.');
    }
  };

  return (
    <div className="App">
      <h1>Webpage to PDF Converter</h1>
      <input type="text" placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={convertToPDF}>Convert to PDF</button>
      <p>{message}</p>
    </div>
  );
}

export default App;