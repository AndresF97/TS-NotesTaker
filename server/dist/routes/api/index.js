import { Router } from "express";
const router = Router();
import notesRoutes from "./notesRoutes.js";
router.use('/notes', notesRoutes);
export default router;
