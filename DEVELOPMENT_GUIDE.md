# TactiCore - Development Guide

## Project Overview

TactiCore is a football draft and simulation game where players build dream teams from football history and test those teams in realistic competition simulations.

The game is inspired by the drafting concept of 38-0-0, the presentation and polish of modern football games, and the statistical depth of football simulators. However, it is **not** intended to be a football management simulator like Football Manager or EA FC Career Mode.

The focus is on creating an enjoyable, strategic, and highly replayable drafting experience.

Players should constantly ask themselves:

- Should I take Thierry Henry now or wait for another striker?
- Is this version of Lionel Messi better than another season?
- Can this team win the Premier League?
- Can this XI become World Cup champions?

Every draft should feel different while remaining believable and rewarding.

The application should always feel like a football game, never like a business dashboard or CRUD application.

---

# Core Player Experience

Every decision should feel meaningful.

The player should feel rewarded for intelligent drafting, balanced squad building, and thoughtful formation selection rather than simply choosing the highest-rated players.

Winning should feel earned.

Losing should encourage experimenting with different drafts rather than feeling unfair.

The simulation engine is the heart of TactiCore.

Every feature should improve:

- Drafting
- Squad building
- Competition simulation
- Replayability

Features that distract from the core gameplay loop should not be prioritized.

---

# Version 1 Scope

Version 1 is intentionally limited.

The game contains only two playable modes:

1. Premier League Mode
2. FIFA World Cup Mode

---

# Premier League Mode

The player drafts an eleven-player squad exclusively from historical English Premier League clubs.

After completing the draft, the squad competes in a simulated 38-match Premier League season.

The simulation produces:

- League table
- Wins
- Draws
- Losses
- Goals scored
- Goals conceded
- Goal difference
- Points
- Final league position
- Top scorer
- Top assister

Version 1 does not include:

- Transfers
- Contracts
- Finances
- Player development
- Injuries

---

# FIFA World Cup Mode

The player drafts an eleven-player squad exclusively from historical FIFA World Cup national teams.

After completing the draft, the squad competes in a simulated FIFA World Cup tournament.

The tournament includes:

- Group Stage
- Round of 16
- Quarter-finals
- Semi-finals
- Third Place Match
- Final

The simulation produces:

- Group standings
- Tournament bracket
- Match results
- Match history
- Goal scorers
- Assists
- Tournament champion
- Golden Boot
- Golden Ball
- Golden Glove
- Tournament statistics

Version 1 does not include:

- World Cup qualifying
- Nations League
- Continental tournaments

---

# Historical Teams

Players are drafted only from historical teams.

Each footballer belongs to one specific season or tournament.

Examples:

## Premier League Teams

- Arsenal 2003/04
- Manchester United 1998/99
- Chelsea 2004/05
- Liverpool 2019/20
- Leicester City 2015/16
- Manchester City 2017/18

## World Cup Teams

- Brazil 1970
- Italy 1982
- France 1998
- Spain 2010
- Germany 2014
- Argentina 2022

Different versions of the same player are treated as separate players.

Example:

- Lionel Messi (2006)
- Lionel Messi (2014)
- Lionel Messi (2022)

These are different players with different ratings.

Ratings represent only that specific season or tournament.

---

# Core Gameplay Loop

Every game follows the same structure:
- Choose Game Mode
- Draft Team 
- View Completed XI
- Simulate Competition 
- View Results 
- Start New Draft 


Every feature should strengthen this gameplay loop.

Avoid adding unnecessary systems that distract from it.

---

# Draft System

The draft is the core mechanic of TactiCore.

The player first selects a formation.

Examples:

- 4-3-3
- 4-2-3-1
- 4-4-2
- 3-5-2

The game then drafts one position at a time.

For each position:

1. A random historical team is selected.
2. The player chooses one footballer from that team.
3. The player permanently fills that position.
4. The process continues until all eleven positions are completed.

Every choice should matter.

Players should balance:

- Current squad weaknesses
- Player quality
- Future opportunities

---

# User Interface Philosophy

The interface should feel like a football game.

Avoid:

- Business dashboard designs
- CRUD-style interfaces
- Ultimate Team collectible card aesthetics
- Excessive visual clutter

Player information should be displayed using clean football-focused profile panels.

The football pitch should always remain the primary visual element.

During squad building:

- Display the football pitch
- Display the selected formation
- Display eleven player positions
- Place drafted players directly into their position

The user should understand their squad immediately by looking at the pitch.

---

# Match Simulation

Matches are completely simulated.

The user does not control players directly.

The simulation should be believable rather than perfectly predictable.

The engine should consider:

- Overall Rating
- Attack
- Midfield
- Defence
- Goalkeeping
- Formation
- Team Chemistry
- Home Advantage (Premier League only)

Better teams should usually win.

Upsets should occasionally happen.

Each match should generate:

- Final score
- Goal scorers
- Assists
- Match winner
- Clean sheet information

---

# Team Chemistry

Chemistry rewards intelligent drafting.

Chemistry should improve performance without becoming mandatory.

Possible chemistry sources:

- Same club
- Same nationality
- Similar football era
- Tactical compatibility

Chemistry should be represented as a team bonus.

Avoid creating an overly complicated chemistry system.

---

# Player Ratings

Each player should contain attributes required for simulation.

Examples:

- Overall
- Pace
- Shooting
- Passing
- Dribbling
- Defending
- Physical
- Goalkeeping

Ratings should represent only that historical season or tournament.

---

# Statistics

Every competition should generate meaningful statistics.

## Premier League

- League table
- Wins
- Draws
- Losses
- Goals scored
- Goals conceded
- Goal difference
- Points
- Top scorer
- Top assister

## World Cup

- Group standings
- Knockout bracket
- Match history
- Champion
- Golden Boot
- Golden Ball
- Golden Glove

Player statistics should accumulate throughout each competition.

---

# Current Project Status

## Completed

- Backend architecture
- Draft system
- Team builder
- Formation system
- Match simulation engine
- Premier League season simulation
- Basic World Cup simulation
- Backend API
- React frontend foundation
- Player statistics foundation

## Needs Improvement

- Complete World Cup bracket
- Group stage system
- League table visualization
- Tournament dashboard
- Improved match realism
- Chemistry balancing
- Expanded historical teams
- Player profile displays
- Football pitch graphics
- Frontend styling
- Animations
- Responsive design

---

# Technology

## Frontend

React

## Backend

Node.js  
Express

## Architecture

Maintain:

- Controllers
- Routes
- Services
- Models
- Data

Business logic should remain inside services.

Controllers should remain lightweight.

Components should be reusable.

---

# Coding Standards

Write clean and maintainable code.

Prefer:

- Small focused functions
- Single responsibility
- Reusable components
- Data-driven solutions
- Clear naming
- Consistent organization

Avoid:

- Hardcoded values
- Duplicate logic
- Large monolithic files
- Unnecessary dependencies
- Overengineering

---

# Refactoring Guidelines

Existing code may be modified if improvements are needed.

You may:

- Modify existing files
- Rename services
- Split files
- Merge redundant files
- Improve architecture
- Refactor APIs

Do not preserve poor implementations simply because they already exist.

Preserve functionality, not implementation.

Prioritize:

- Maintainability
- Scalability
- Readability

---

# Design Philosophy

Development decisions should follow:

1. Simplicity over unnecessary complexity.
2. Fun over perfect realism.
3. Replayability over feature quantity.
4. Football authenticity over unnecessary realism.
5. Maintainable architecture over quick hacks.
6. Build fewer systems, but build them well.
7. Improve existing systems before adding new ones.

---

# Instructions for Cursor

When working on TactiCore:

- Read this document before making changes.
- Understand the existing architecture first.
- Analyze before modifying.
- Preserve the core gameplay loop: 
Draft -> Build Team -> Simulate Competiton -> View Results 

- Reuse existing systems where appropriate.
- Refactor existing code when it improves the project.
- Do not introduce unnecessary dependencies.
- Keep solutions modular and scalable.
- Avoid overengineering.
- Prefer simple solutions that can expand later.

If a feature does not improve drafting, squad building, competition simulation, or replayability, reconsider whether it belongs in Version 1.
