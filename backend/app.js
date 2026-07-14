const express = require("express");
const cors = require("cors");

// Routes
const playerRoutes = require("./routes/playerRoutes");
const draftRoutes = require("./routes/draftRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const seasonRoutes = require("./routes/seasonRoutes");


const app = express();

const PORT = 3000;


// Middleware
app.use(cors());

app.use(express.json());


// Health check route
app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "TactiCore backend is running"

    });

});


// API Routes

app.use("/api/players", playerRoutes);

app.use("/api/draft", draftRoutes);

app.use("/api/tournament", tournamentRoutes);

app.use("/api/season", seasonRoutes);



// Start server

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});