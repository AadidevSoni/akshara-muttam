import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPlayerByIdQuery, useUpdatePlayerMutation } from '../redux/api/userApiSlice';
import './EditPlayer.css';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EditPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto'; 

    return () => {
      document.body.style.overflowY = '';
      document.documentElement.style.overflowY = '';
    };
  }, []);

  const { data: player, isLoading, isError } = useGetPlayerByIdQuery(id);

  const [updatePlayer, { isLoading: isUpdating }] = useUpdatePlayerMutation();

  const [formData, setFormData] = useState({
    playerId: '',
    name: '',
    email: '',
    phone: '',
    fees: '',
    registrationDate: '',
    paymentStatus: {},
  });

  useEffect(() => {
    if (player) {
      setFormData({
        playerId: player.playerId || '',
        name: player.name || '',
        email: player.email || '',
        phone: player.phone || '',
        fees: player.fees || '',
        registrationDate: player.registrationDate || '',
        paymentStatus: player.paymentStatus || {},
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleMonth = (month) => {
    setFormData(prev => ({
      ...prev,
      paymentStatus: {
        ...prev.paymentStatus,
        [month]: !prev.paymentStatus[month],
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePlayer({ id, data: formData }).unwrap();
      alert('Player updated successfully!');
      navigate('/playerList');
    } catch (err) {
      alert('Failed to update player. ' + err?.data?.message || err.error);
    }
  };

  return <>
    {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Player Editor...</p>
        </div>
      )}

      <div className="video-wrapper-ep">
        <video
          autoPlay muted loop
          className="video-background-ep"
          playsInline
          src="/videos/footballer.mp4"
          type="video/mp4"
        />
        <div className="video-overlay-ep"></div>
      </div>
    <form className="edit-player-form" onSubmit={handleSubmit}>
      <h3>Edit Player Details</h3>
      
      <input
        type="text"
        name="playerId"
        placeholder="Player ID"
        value={formData.playerId}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        type="number"
        name="fees"
        placeholder="Fees"
        value={formData.fees}
        onChange={handleChange}
        required
        min={0}
      />

      <input
        type="date"
        name="registrationDate"
        className="date-input"
        value={formData.registrationDate ? new Date(formData.registrationDate).toISOString().split('T')[0] : ''}
        onChange={handleChange}
      />

      <div className="month-toggles">
        {months.map(month => (
          <label key={month}>
            <input
              type="checkbox"
              checked={formData.paymentStatus[month] || false}
              onChange={() => handleToggleMonth(month)}
            />
            {month}
          </label>
        ))}
      </div>

      <button type="submit" disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Player'}
      </button>
    </form>
  </>
};

export default EditPlayer;
