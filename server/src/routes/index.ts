import { Router } from "express"
const router = Router()
import htmlRoutes from "./htmlRoutes.js"
import apiRoutes from "./api/index.js"

router.use('/api', apiRoutes)
router.use('/', htmlRoutes)


export default router;