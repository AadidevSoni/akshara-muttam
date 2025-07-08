import express from 'express';
import {createPlayer,getAllPlayers,loginAdmin,logoutCurrentUser,deletePlayerById,updatePlayerById,getPlayerById,uploadPlayersExcelBatch
} from '../controllers/playerController.js';

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/auth', loginAdmin);
router.post('/logout', logoutCurrentUser);

router.route('/players')
  .post(authenticate, createPlayer)     
  .get(authenticate, getAllPlayers);     

router.route('/:id')
  .delete(authenticate, deletePlayerById)
  .get(authenticate, getPlayerById)
  .put(authenticate, updatePlayerById);

router.post('/upload-excel', authenticate, uploadPlayersExcelBatch);

export default router;