import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  registrationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  whatsappNo: { type: String, required: true },
  Class: { type: String, required: true },
  registrationDate: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
