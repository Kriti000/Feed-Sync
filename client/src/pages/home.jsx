import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [stats, setStats] = useState({ count: 0, recent: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/feedback?limit=3', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setStats({ count: res.data.length, recent: res.data.slice(0,3) });
      } catch (err) {
        console.error('Home fetch error', err);
      }
    };
    load();
  }, []);

  return (
    <div className="mt-4">
      <h1>Welcome to the Home Page</h1>
      

      <ul className="list-group">
        {stats.recent.map(r => (
          <li key={r._id} className="list-group-item">{r.message || r.feedback}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
