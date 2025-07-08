import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'; 
import Admin from './models/adminModel.js';         
import bcrypt from 'bcryptjs';             
import cors from 'cors';
import helmet from 'helmet';
import registerRoutes from "./routes/registerRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7002;

//Helmet secures the headers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api',registerRoutes);

const createDefaultAdmin = async () => {
  try {
    const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10); 
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
      });
      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Failed to create admin:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB(); 
    await createDefaultAdmin(); 

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
