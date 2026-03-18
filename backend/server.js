import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import connectDB from "./config/db.js"
import { logger } from "./utils/logger.js"
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js"

/* 🛰️ ROUTE IMPORTS */
import authRoutes from "./routes/authRoutes.js"       // [NEW] Security Terminal
import fleetRoutes from "./routes/fleetRoutes.js"     // [NEW] Fleet Command
import farmerRoutes from "./routes/farmerRoutes.js"
import supplyRoutes from "./routes/supplyRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config()

const app = express()

/* 🗄️ Database Connection */
connectDB()

/* 🛠️ Middleware Stack */

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())
app.use(logger) // Log every inbound transmission

/* 🛰️ SYSTEM ROUTES */

// Auth Terminal (Login/Register/Logout)
app.use("/api/auth", authRoutes)

// Fleet Command (GPS/Telemetry/Missions)
app.use("/api/fleet", fleetRoutes)

// Logistics Loops
app.use("/api/farmers", farmerRoutes)
app.use("/api/supply", supplyRoutes)
app.use("/api/contact", contactRoutes)

/* 🏁 Health Check */
app.get("/", (req, res) => {
  res.json({
    status: "Operational",
    system: "Jacksteve Ltd Logistics API",
    version: "2026.1"
  })
})

/* 🛡️ Error Handling (Orderly Shutdown) */
app.use(notFound)
app.use(errorHandler)

/* ⚡ Server Initialization */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 JACKSTEVE COMMAND RUNNING ON PORT ${PORT}`)
})
