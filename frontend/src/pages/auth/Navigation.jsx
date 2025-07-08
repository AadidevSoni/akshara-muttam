import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineLogin } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { IoIosPersonAdd } from 'react-icons/io';
import { MdLogout } from 'react-icons/md';
import { useLogoutMutation } from '../redux/api/userApiSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../redux/features/authSlice'
import './Navigation.css';

const Navigation = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const userInfo = useSelector(state => state.auth.userInfo);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/auth');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`navigation-container ${showSidebar ? 'hidden' : 'visible'}`} style={{ zIndex: 999 }}>
      <div className="nav-links">
        <Link to="/" className="nav-link" onClick={() => setShowSidebar(false)}>
          <AiOutlineHome className="nav-icon" size={26} />
          <span className="nav-item-name">Home</span>
        </Link>

        <Link to="/playerList" className="nav-link" onClick={() => setShowSidebar(false)}>
          <FaUsers className="nav-icon" size={26} />
          <span className="nav-item-name">Registration List</span>
        </Link>

        <Link to="/register" className="nav-link" onClick={() => setShowSidebar(false)}>
          <FaUsers className="nav-icon" size={26} />
          <span className="nav-item-name">Registration</span>
        </Link>
      </div>

      {userInfo ? (
        <div className="nav-links">
          <button onClick={handleLogout} className="nav-link listButton">
            <MdLogout className="nav-icon" size={26} />
            <span className="nav-item-name">Logout</span>
          </button>
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/auth" className="nav-link">
            <AiOutlineLogin className="nav-icon loginIcons" size={26} />
            <span className="nav-item-name">Login</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navigation;
