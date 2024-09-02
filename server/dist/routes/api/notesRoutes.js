import { Router } from "express";
const router = Router();
import NotesServices from "../../services/notesServices.js";
router.get("/", async (_req, res) => {
    try {
        const allNotes = NotesServices.getNotes();
        res.status(200).json(allNotes);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/", async (_req, res) => {
    try {
        const data = await NotesServices.creatNotes(_req.body);
        if (data === "sucess") {
            res.status(200).json({ message: data });
        }
        else {
            res.status(404).json(data);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.delete('/:id', async (_req, res) => {
    try {
        const data = await NotesServices.deleteNotes(_req.params.id);
        if (data === "sucess") {
            res.status(200).json({ message: data });
        }
        else {
            res.status(404).json(data);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
export default router;
