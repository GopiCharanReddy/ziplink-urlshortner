import { app } from './app.js'
import connectDB from './db/index.js'

connectDB()
.then(() => {
  const PORT = process.env.PORT || 3000
  app.on('error', (error) => {
    console.log("App/Server error: ", error)
    throw error
  })
  app.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT)
  })
})
.catch((error) => {
  console.log("MongoDB connection error: ", error);
})