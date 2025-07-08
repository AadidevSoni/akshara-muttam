import express from 'express';
import User from '../models/userModel.js'; // formerly Player
const router = express.Router();

// auto-generate registration ID
const generateRegId = async () => {
  const last = await User.findOne().sort({ createdAt: -1 }).exec();
  if (!last) return 'REG-001';
  const lastNum = parseInt(last.registrationId.split('-')[1]);
  return `REG-${String(lastNum + 1).padStart(3, '0')}`;
};

router.post('/register', async (req, res) => {
  try {
    const { name, age, whatsappNo, Class } = req.body;

    if (!name || !age || !whatsappNo || !Class) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const registrationId = await generateRegId();

    const newUser = new User({ registrationId, name, age, whatsappNo, Class });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

export default router;
