import Player from '../models/playerModel.js';
import Admin from '../models/adminModel.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) {
    res.status(401);
    throw new Error("Invalid admin username");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect password");
  }

  createToken(res, admin._id);
  res.status(200).json({ message: "Logged in successfully" });
});

export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const generatePlayerId = async () => {
  const allPlayers = await Player.find({ playerId: /^GRO-\d+$/ }).select('playerId');

  const maxNumber = allPlayers.reduce((max, player) => {
    const num = parseInt(player.playerId.split('-')[1], 10);
    return num > max ? num : max;
  }, 0);

  const nextNumber = maxNumber + 1;
  const nextId = `GRO-${String(nextNumber).padStart(3, '0')}`;

  return nextId;
};

export const createPlayer = asyncHandler(async (req, res) => {
  const { name, email, phone, fees, registrationDate } = req.body;
  const playerId = await generatePlayerId();
  const existing = await Player.findOne({ playerId });
  if (existing) {
    res.status(400);
    throw new Error('Player ID already exists');
  }
  const player = await Player.create({ playerId, name, email, phone, fees, registrationDate: registrationDate || Date.now()});
  res.status(201).json(player);
});

export const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

export const updatePlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  const { playerId, name, email, phone, fees, paymentStatus, registrationDate } = req.body;

  if (playerId && playerId !== player.playerId) {
    const existing = await Player.findOne({ playerId });
    if (existing && existing._id.toString() !== player._id.toString()) {
      res.status(400);
      throw new Error('Player ID already exists');
    }
    player.playerId = playerId;
  }

  player.name = name || player.name;
  player.email = email || player.email;
  player.phone = phone || player.phone;
  player.fees = fees || player.fees;
  player.registrationDate = registrationDate || player.registrationDate;

  if (paymentStatus && typeof paymentStatus === 'object') {
    const months = Object.keys(player.paymentStatus);
    months.forEach(month => {
      if (paymentStatus.hasOwnProperty(month)) {
        player.paymentStatus[month] = paymentStatus[month];
      }
    });
  }

  const updatedPlayer = await player.save();
  res.json(updatedPlayer);
});

export const deletePlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  await player.deleteOne();
  res.status(200).json({ message: 'Player deleted successfully' });
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  res.status(200).json(player);
});

export const uploadPlayersExcelBatch = asyncHandler(async (req, res) => {
  const players = req.body;

  if (!Array.isArray(players) || players.length === 0) {
    res.status(400);
    throw new Error("No valid player data received");
  }

  // Check for duplicate player IDs
  const ids = players.map(p => p.playerId);
  const existing = await Player.find({ playerId: { $in: ids } });

  if (existing.length > 0) {
    const existingIds = existing.map(p => p.playerId);
    res.status(400);
    throw new Error(`Duplicate Player IDs: ${existingIds.join(', ')}`);
  }

  try {
    const inserted = await Player.insertMany(players);
    res.status(201).json({ message: `${inserted.length} players added.` });
  } catch (err) {
    res.status(500);
    throw new Error("Error inserting players: " + err.message);
  }
});