import React, { useState, useEffect } from 'react';
import './App.css';

const CONTROL_TYPES = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
];

function App() {
  const [controls, setControls] = useState([]);
  const [formData, setFormData] = useState({});
  const [newType, setNewType] = useState('text');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/index.php')
      .then(res => res.json())
      .then(data => {
        setEntries(data || []);
        if (data && data.length > 0) {
          const last = data[data.length - 1];
          restoreControlsAndData(last);
        }
      });
    // eslint-disable-next-line
  }, []);

  const restoreControlsAndData = (entry) => {
    const restoredControls = Object.keys(entry.data).map((id) => {
      const value = entry.data[id];
      let type = 'text';
      if (typeof value === 'number') type = 'number';
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) type = 'date';
      return { id, type };
    });
    setControls(restoredControls);
    setFormData(entry.data);
  };

  const addControl = () => {
    const id = Date.now() + Math.random();
    setControls([...controls, { id, type: newType }]);
  };

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        // Reload entries and keep current formData
        fetch('http://localhost:8000/index.php')
          .then(res => res.json())
          .then(data => setEntries(data || []));
      }
    } catch (err) {
      // Error handling can be added here if needed
    }
  };



  return (
    <div className="App">
      <h2>Dynamic Data Capture</h2>
      <div style={{ marginBottom: 16 }}>
        <select value={newType} onChange={e => setNewType(e.target.value)}>
          {CONTROL_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={addControl} style={{ marginLeft: 8 }}>Add Control</button>
      </div>
      <form onSubmit={handleSubmit}>
        {controls.map(ctrl => (
          <div key={ctrl.id} style={{ marginBottom: 8 }}>
            <label>
              {ctrl.type.charAt(0).toUpperCase() + ctrl.type.slice(1)}:
              <input
                type={ctrl.type}
                value={formData[ctrl.id] || ''}
                onChange={e => handleChange(ctrl.id, e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={controls.length === 0}>Save Data</button>
      </form>

    </div>
  );
}

export default App;
