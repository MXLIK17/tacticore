const worldCupPools = {
    GK: {
        elite: [
            { team: "Germany 2014", players: ["Neuer"] },
            { team: "Italy 2006", players: ["Buffon"] }
        ],
        strong: [
            { team: "France 2018", players: ["Lloris"] },
            { team: "Brazil 2002", players: ["Marcos"] }
        ],
        average: [
            { team: "USA 2014", players: ["Howard"] },
            { team: "Japan 2018", players: ["Kawashima"] }
        ]
    },

    CB: {
        elite: [
            { team: "Italy 2006", players: ["Cannavaro", "Nesta"] },
            { team: "Germany 2014", players: ["Hummels", "Boateng"] }
        ],
        strong: [
            { team: "France 2018", players: ["Varane", "Umtiti"] },
            { team: "Argentina 2014", players: ["Demichelis", "Garay"] }
        ],
        average: [
            { team: "Mexico 2018", players: ["Moreno", "Araujo"] },
            { team: "Nigeria 2014", players: ["Omeruo", "Yobo"] }
        ]
    }
};

module.exports = worldCupPools;