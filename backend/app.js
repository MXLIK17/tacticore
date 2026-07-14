const express = require("express");
const cors = require("cors");


const playerRoutes =
require("./routes/playerRoutes");

const draftRoutes =
require("./routes/draftRoutes");

const tournamentRoutes =
require("./routes/tournamentRoutes");


const app = express();

const PORT = 3000;



app.use(cors());

app.use(express.json());





app.get("/", (req,res)=>{

    res.json({

        success:true,

        message:
        "TactiCore backend is running"

    });

});





app.use("/api/players", playerRoutes);

app.use("/api/draft", draftRoutes);

app.use("/api/tournament", tournamentRoutes);






// 404 Handler

app.use((req,res)=>{

    res.status(404).json({

        success:false,

        message:
        "Route not found"

    });

});





// Global Error Handler

app.use((err,req,res,next)=>{


    console.error(err);


    res.status(500).json({

        success:false,

        message:
        err.message || "Server Error"

    });


});





app.listen(PORT,()=>{

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});