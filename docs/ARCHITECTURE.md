# TactiCore - Architecture Guidelines

## Purpose

This document defines the software architecture of TactiCore.

The purpose is to maintain a clean, scalable, and maintainable codebase as the project grows.

The application should remain easy to understand and modify.

Every feature should respect the separation between:

- Frontend presentation
- API communication
- Business logic
- Data management

---

# Architecture Overview

TactiCore follows a layered architecture.

The general structure is:

Frontend
|
|
API Requests
|
|
Routes
|
|
Controllers
|
|
Services
|
|
Models
|
|
Data


Each layer has a specific responsibility.

---

# Frontend Architecture

## Responsibility

The frontend is responsible for:

- User interface
- User interaction
- Displaying information
- Managing visual state

The frontend should not contain:

- Simulation logic
- Draft algorithms
- Tournament calculations
- Business rules

---

## Frontend Principles

Components should be:

- Reusable
- Small
- Focused
- Easy to understand

Avoid:

- Large components containing everything
- Duplicate UI logic
- Hardcoded data
- Business calculations inside components

---

# Component Structure

Recommended structure:

frontend/src/

components/

pages/

services/

hooks/

utils/


---

# Components

Components should focus on presentation.

Examples:

FootballPitch

PlayerMarker

Jersey

FormationSelector

MatchCard

StatsTable


A component should answer:

> How should this information appear?

Not:

> How should this information be calculated?

---

# Frontend Services

Frontend services handle communication with the backend.

Examples:

api.js

playerService.js

draftService.js

tournamentService.js


Their responsibility:

- Send requests
- Receive responses
- Handle API communication

They should not:

- Calculate results
- Simulate matches
- Modify backend logic

---

# Backend Architecture

The backend follows:

Routes
|
Controllers
|
Services
|
Models
|
Data


---

# Routes

## Responsibility

Routes define API endpoints.

Example:

POST /api/draft/select

POST /api/season/simulate

POST /api/tournament/worldcup/start


Routes should:

- Map URLs
- Connect requests to controllers

Routes should not contain:

- Business logic
- Calculations
- Data manipulation

---

# Controllers

## Responsibility

Controllers handle HTTP communication.

Controllers should:

- Receive requests
- Validate input
- Call services
- Return responses
- Handle errors

Controllers should remain lightweight.

Example:

Request

↓

Controller

↓

Service

↓

Response


---

Controllers should NOT:

- Simulate matches
- Calculate ratings
- Generate tournaments
- Manage complex state

---

# Services

Services contain the core application logic.

This is where TactiCore's intelligence exists.

Examples:

playerModel.js

teamModel.js

draftModel.js

tournamentModel.js


Models should define:

- Data structure
- Stored state
- Object representation

Models should not contain:

- API logic
- UI logic
- Large calculations

---

# Data Layer

The data folder contains historical football information.

Examples:

data/

players/

teams/

historicalTeams/

pools/


Data should remain:

- Organized
- Expandable
- Easy to update

Avoid scattering football data throughout the application.

---

# Business Logic Rules

Business logic belongs in services.

Examples:

Correct:

matchService.js

calculateWinner()

simulateGoals()

generateMatch()


Incorrect:

calculateWinner()

or:

Controller

generateTournament()

---

# State Management

State should have a clear owner.

Avoid:

- Duplicate state
- Hidden state inside controllers
- Multiple sources of truth

Examples:

Draft state should belong to:


draftService
or
draftModel


Not:


draftController


---

# Data Flow Example

## Draft Selection


User selects player

↓

Frontend

↓

POST /api/draft/select

↓

draftController

↓

draftService

↓

draftModel

↓

Response

↓

Frontend updates pitch


---

# Simulation Example


User starts competition

↓

Frontend request

↓

Tournament Controller

↓

Tournament Service

↓

Match Service

↓

Statistics Service

↓

Response

↓

Results Screen


---

# Adding New Features

Before implementing a feature ask:

1. Does it improve the core gameplay loop?
2. Does it belong in the correct layer?
3. Can existing systems be reused?
4. Will future expansion remain possible?

---

# Refactoring Rules

Existing code may be improved.

Prioritize:

- Maintainability
- Readability
- Simplicity

Allowed:

- Moving logic into correct layers
- Splitting large files
- Removing duplication
- Improving naming

Avoid:

- Rewriting working systems unnecessarily
- Adding dependencies without reason
- Creating unnecessary abstractions

---

# Dependency Rules

Prefer:

- Existing libraries
- Simple solutions
- Native functionality

Avoid:

- Adding packages for small problems
- Overengineering solutions
- Large frameworks without need

---

# Future Expansion

The architecture should allow future features:

Examples:

- Chemistry system
- Player comparisons
- More tournaments
- Tactical adjustments
- Advanced statistics

However:

Future compatibility should not create unnecessary complexity today.

---

# Final Architecture Principle

Every piece of code should have a clear responsibility.

When unsure where something belongs, ask:

> Is this presentation, communication, business logic, data structure, or stored information?

The answer determines where it should exist.