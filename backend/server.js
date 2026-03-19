import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import connectDB from "./config/db.js"
import { logger } from "./utils/logger.js"
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js"

/* 🛰️ ROUTE IMPORTS */
import authRoutes from "./routes/authRoutes.js"
import fleetRoutes from "./routes/fleetRoutes.js"
import farmerRoutes from "./routes/farmerRoutes.js"
import supplyRoutes from "./routes/supplyRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config()

const app = express()

/* 🗄️ Database Connection */
connectDB()

/* 🛠️ Middleware Stack */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://jacksteve.vercel.app",
  "http://localhost:5173", 
  "http://localhost:3000", 
  /\.vercel\.app$/ 
].filter(Boolean); // Clean up any undefined values

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ FIX: Use a Regex literal to handle preflight for ALL routes.
// This prevents the "Missing parameter name" PathError crash on Node v22.
app.options(/^(.*)$/, cors());

app.use(express.json())
app.use(logger)

/* 🛰️ SYSTEM ROUTES */
app.use("/api/auth", authRoutes)
app.use("/api/fleet", fleetRoutes)
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

/* 🛡️ Error Handling */
app.use(notFound)
app.use(errorHandler)

/* ⚡ Server Initialization */
const PORT = process.env.PORT || 10000

app.listen(PORT, () => {
  console.log(`🚀 JACKSTEVE COMMAND RUNNING ON PORT ${PORT}`)
})
