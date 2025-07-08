import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../redux/api/userApiSlice';
import { setCredentials } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') ?? '/';

  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      localStorage.setItem('isLoggedIn', 'true');
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="loginBlock">
      {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Login Screen...</p>
        </div>
      )}

      <div className="video-wrapper">
        <video
          autoPlay muted loop
          className="video-background"
          playsInline
          src="/videos/footballer.mp4"
          type="video/mp4"
        />
        <div className="video-overlay"></div>
      </div>

      <div className="loginContainer">
        <div className="loginText-container">
          <h1 className="sign">Admin Login</h1>
          <p>Welcome back! Please enter your credentials to access the admin profile.</p>
        </div>

        <form className="loginFormContainer" onSubmit={handleSubmit}>
          <div className="loginContainers">
            <label htmlFor="username" className="loginEmail">Username</label>
            <input
              id="username"
              className="loginEmailInput"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="loginContainers">
            <label htmlFor="password" className="loginEmail">Password</label>
            <input
              id="password"
              className="loginEmailInput"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <button type="submit" className="loginButton" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
