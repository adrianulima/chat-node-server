import { Router } from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import rooms from './rooms'
import health from './health'

const router = Router()
router.use(cors())
router.use(json())

// routes
router.use('/rooms', rooms)
router.use('/health', health)

export default router
