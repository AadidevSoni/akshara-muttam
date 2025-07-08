import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  fees: { type: Number, required: true },
  paymentStatus: {
    Jan: { type: Boolean, default: false },
    Feb: { type: Boolean, default: false },
    Mar: { type: Boolean, default: false },
    Apr: { type: Boolean, default: false },
    May: { type: Boolean, default: false },
    Jun: { type: Boolean, default: false },
    Jul: { type: Boolean, default: false },
    Aug: { type: Boolean, default: false },
    Sep: { type: Boolean, default: false },
    Oct: { type: Boolean, default: false },
    Nov: { type: Boolean, default: false },
    Dec: { type: Boolean, default: false },
  },
  registrationDate: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
export default Player;