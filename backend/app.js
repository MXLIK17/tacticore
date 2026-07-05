const express = require("express");
const cors = require("cors");

// Routes
const playerRoutes = require("./routes/playerRoutes");
const draftRoutes = require("./routes/draftRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (important for testing)
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TactiCore backend is running"
    });
});

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/draft", draftRoutes);
app.use("/api/tournament", tournamentRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});