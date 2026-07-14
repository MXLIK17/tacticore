const express = require("express");

const router = express.Router();

const {
    simulateSeason
} = require("../services/seasonService");


router.post("/simulate", (req,res)=>{


    const {
        team
    } = req.body;



    const result =
        simulateSeason(team);



    res.json({

        success:true,

        data:result

    });


});


module.exports = router;