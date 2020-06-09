import { Router } from 'express'
import cors from 'cors'
import rooms from './rooms'

const router = Router()
router.use(cors())

// routes
router.use('/rooms', rooms)

export default router
