import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    whatsappNo: '',
    Class: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      toast.success('Registered successfully!');
      setFormData({ name: '', age: '', whatsappNo: '', Class: '' });

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="registerPage">
      <h1>Register Now</h1>
      <form className="registerForm" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required onChange={handleChange} value={formData.name} />
        <input name="age" type="number" placeholder="Age" required onChange={handleChange} value={formData.age} />
        <input name="whatsappNo" placeholder="WhatsApp Number" required onChange={handleChange} value={formData.whatsappNo} />
        <input name="Class" placeholder="Class" required onChange={handleChange} value={formData.Class} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
