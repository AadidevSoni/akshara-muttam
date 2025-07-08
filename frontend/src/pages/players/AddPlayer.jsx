import React, { useState, useEffect } from 'react';
import { useAddPlayerMutation,useAddExcelPlayerMutation } from '../redux/api/userApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddPlayer.css';
import * as XLSX from 'xlsx';

const AddPlayer = () => {
  const [formData, setFormData] = useState({name: '',email: '',phone: '',fees: '',});
  
  const [loadingScreen, setLoadingScreen] = useState(true);
  const navigate = useNavigate();
  const [addPlayer, { isLoading }] = useAddPlayerMutation();
  const [addExcelPlayer, { isLoading1 }] = useAddExcelPlayerMutation();

  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPlayer(formData).unwrap();
      toast.success('Player added successfully!');
      navigate('/playerList');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add player');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const playersToUpload = rows
          .filter(player =>
            player['Player ID'] && player['Name'] && player['Phone'] && player['Fees (BD)'] && player['Registered']
          )
          .map(player => ({
            playerId: player['Player ID'].toString().trim(),
            name: player['Name'].toString().trim(),
            email: player['Email']?.toString().trim() || '',
            phone: player['Phone'].toString().trim(),
            fees: Number(player['Fees (BD)']),
            registrationDate: new Date(player['Registered']),
            paymentStatus: {
              Jan: player['Jan'] === 'Paid',
              Feb: player['Feb'] === 'Paid',
              Mar: player['Mar'] === 'Paid',
              Apr: player['Apr'] === 'Paid',
              May: player['May'] === 'Paid',
              Jun: player['Jun'] === 'Paid',
              Jul: player['Jul'] === 'Paid',
              Aug: player['Aug'] === 'Paid',
              Sep: player['Sep'] === 'Paid',
              Oct: player['Oct'] === 'Paid',
              Nov: player['Nov'] === 'Paid',
              Dec: player['Dec'] === 'Paid',
            }
          }));

        if (playersToUpload.length === 0) {
          toast.error('No valid players found in Excel file.');
          return;
        }

        // Send to backend using RTK query
        await addExcelPlayer(playersToUpload).unwrap();
        toast.success('All players uploaded successfully!');
      } catch (error) {
        toast.error('Upload error: ' + (error?.data?.message || error.message));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <section className="addPlayerBlock">
      {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Add Player...</p>
        </div>
      )}

      <div className="video-wrapper">
        <video autoPlay muted loop className="video-background" playsInline>
          <source src="/videos/footballer.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="addPlayerContainer">
        <h1 className="addPlayerTitle">Add New Player</h1>

        <label htmlFor="excelUpload" className="custom-file-upload">
          Upload Excel File
        </label>
        <input
          id="excelUpload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />

        <form className="formContainer" onSubmit={handleSubmit}>
          {['name', 'email', 'phone', 'fees'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="addPlayerLabel">{field}</label>
              <input
                type={field === 'fees' ? 'number' : 'text'}
                name={field}
                id={field}
                className="addPlayerInput"
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
          ))}
          <button type="submit" className="submitPlayerButton" disabled={isLoading}>
            {isLoading || isLoading1 ? 'Adding...' : 'Add Player'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPlayer;
