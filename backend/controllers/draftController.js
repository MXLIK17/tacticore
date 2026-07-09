const { spinPool } = require("../services/poolService");


let draft = {};



function spin(req, res) {

    const {
        position,
        mode
    } = req.body;


    const result = spinPool(
        position,
        mode || "premier"
    );


    res.json({

        success: true,

        data: {

            position: result.position,

            label:
                `${result.player} (${result.team})`,

            tier: result.tier

        }

    });

}



function selectPlayer(req, res) {

    const {
        position,
        player
    } = req.body;


    draft[position] = player;


    res.json({

        success: true,

        data: draft

    });

}



function getDraft(req, res) {

    res.json({

        success: true,

        data: draft

    });

}



function resetDraft(req, res) {

    draft = {};


    res.json({

        success: true,

        message: "Draft reset"

    });

}



function getRerolls(req, res) {

    res.json({

        success: true,

        rerolls: 3

    });

}



function useReroll(req, res) {

    res.json({

        success: true,

        message: "Reroll used"

    });

}



module.exports = {

    spin,
    selectPlayer,
    getDraft,
    resetDraft,
    getRerolls,
    useReroll

};