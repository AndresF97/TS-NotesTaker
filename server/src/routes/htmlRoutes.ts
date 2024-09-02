import {Router, type Response, type Request } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
router.get("/notes", (_req: Request, res: Response)=>{
    res.sendFile(path.join(__dirname, '../../../client/dist/notes.html'))
})

router.get("*", (_req: Request, res: Response)=>{
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'))
})

export default router;
