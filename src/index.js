import express from 'express'
import routes from './routes'

const app = express()

// Index routes
app.use('/', routes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
