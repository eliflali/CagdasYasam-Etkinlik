// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css'; // Make sure to create a LoginPage.css file with the CSS below
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different routes
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the login logic here, perhaps sending a POST request to your Django backend
    console.log('Login with:', username, password);
    navigate('/main-page');
  };

  return (
    <div className="container">
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı Adı"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default LoginPage;
