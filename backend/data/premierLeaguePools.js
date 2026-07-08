const premierLeaguePools = {
    GK: {
        elite: [
            { team: "Manchester United 2008", players: ["Van der Sar"] },
            { team: "Liverpool 2019", players: ["Alisson"] }
        ],
        strong: [
            { team: "Chelsea 2012", players: ["Cech"] },
            { team: "Arsenal 2006", players: ["Lehmann"] }
        ],
        average: [
            { team: "Everton 2016", players: ["Pickford"] },
            { team: "West Ham 2018", players: ["Fabianski"] }
        ]
    },

    CB: {
        elite: [
            { team: "Man United 2008", players: ["Ferdinand", "Vidic"] },
            { team: "Arsenal Invincibles 2004", players: ["Campbell", "Toure"] }
        ],
        strong: [
            { team: "Chelsea 2015", players: ["Cahill", "Terry"] },
            { team: "Liverpool 2014", players: ["Skrtel", "Agger"] }
        ],
        average: [
            { team: "Aston Villa 2013", players: ["Clark", "Okore"] },
            { team: "Southampton 2016", players: ["Fonte", "van Dijk early"] }
        ]
    }
};

module.exports = premierLeaguePools;