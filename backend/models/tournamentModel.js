let tournament = {
    type: null, // "premier-league" or "world-cup"
    teams: [],  // user + AI teams
    currentMatchIndex: 0,
    fixtures: [],
    standings: {},
    completed: false
};

module.exports = tournament;