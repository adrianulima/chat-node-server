import { Router } from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import rooms from './rooms'

const router = Router()
router.use(cors())
router.use(json())

// routes
router.use('/rooms', rooms)

export default router
