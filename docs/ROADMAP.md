# TactiCore - Development Roadmap

## Purpose

This document defines the development priorities for TactiCore.

The purpose of this roadmap is to maintain focus on the core gameplay experience and prevent unnecessary feature expansion.

Development decisions should prioritize:

1. Completing the core gameplay loop.
2. Improving user experience.
3. Increasing football immersion.
4. Maintaining clean architecture.

---

# Version 1 Goal

Version 1 of TactiCore should deliver a complete football draft and simulation experience.

The player should be able to:


Choose Competition
↓
Choose Formation
↓
Draft Players
↓
Build Starting XI
↓
Simulate Competition
↓
View Results


The experience should feel complete even without advanced features.

---

# Current Status

## Completed

### Backend

✅ Backend architecture established

✅ Express API created

✅ Draft system implemented

✅ Historical player data system created

✅ Historical team system created

✅ Formation system created

✅ Match simulation engine created

✅ Premier League simulation foundation created

✅ World Cup simulation foundation created

✅ Player statistics foundation created

✅ Backend stabilization completed

---

### Documentation

Completed:

✅ Development Guide

✅ Project Vision

✅ UI Guidelines

✅ Design System

✅ Architecture Guidelines

✅ Simulation Guidelines

---

### Frontend

Completed:

✅ React foundation

✅ Basic application structure

✅ API communication foundation

---

# Current Priority

The current focus is improving the frontend experience.

The frontend should transform from a functional prototype into a polished football application.

---

# Phase 1 - Frontend Foundation

## Goal

Create a clean football-first user interface.

---

## Tasks

### Application Structure

Implement:

- Clear page structure
- Navigation
- Reusable components
- Consistent styling

---

### Core Screens

Create:

## Home Screen

Purpose:

- Introduce TactiCore
- Allow mode selection

---

## Draft Screen

Purpose:

- Manage player drafting
- Display current selection

---

## Squad Builder Screen

Purpose:

- Display completed team
- Show formation
- Display football pitch

---

## Simulation Screen

Purpose:

- Show competition progress
- Display matches

---

## Results Screen

Purpose:

- Display final outcomes
- Show statistics

---

# Phase 2 - Squad Builder Experience

## Goal

Create the main TactiCore identity.

The football pitch should become the centre of the application.

---

## Requirements

Implement:

- Realistic football pitch
- Formation positioning
- Empty position placeholders
- Player jersey markers
- Player ratings
- Player names

Avoid:

- Player cards
- Dashboard layouts
- Excessive information

---

# Phase 3 - Draft Experience

## Goal

Make drafting enjoyable.

---

## Requirements

Implement:

- Position-based drafting
- Historical team selection
- Player selection interface
- Draft progress indicator

The player should always understand:

- Current position
- Available choices
- Completed positions

---

# Phase 4 - Competition Experience

## Goal

Present simulations as football events.

---

## Premier League

Display:

- League table
- Match results
- Final position
- Player statistics

---

## World Cup

Display:

- Groups
- Knockout bracket
- Match history
- Champion
- Awards

---

# Phase 5 - Polish

## Goal

Improve presentation quality.

---

Tasks:

- Responsive design
- Animations
- Loading states
- Error handling
- UI consistency
- Visual refinement

---

# Features Not Included in Version 1

The following features should not be prioritized:

## Club Management

Not included:

- Transfers
- Contracts
- Finances
- Ownership
- Staff management

---

## Player Development

Not included:

- Training
- Growth systems
- Player progression

---

## Advanced Football Systems

Not included:

- Injuries
- Fatigue
- Dynamic careers
- Qualification systems

---

These features may be considered in future versions.

---

# Development Rules

When adding features:

Ask:

## Does this improve:

- Drafting?
- Squad building?
- Simulation?
- Replayability?

If not, reconsider.

---

# Coding Priorities

Prioritize:

- Clean architecture
- Reusable components
- Simple solutions
- Maintainable code

Avoid:

- Quick hacks
- Duplicate systems
- Unnecessary dependencies
- Overengineering

---

# Cursor Development Rules

When using Cursor:

Before editing:

1. Read:
   - DEVELOPMENT_GUIDE.md
   - VISION.md
   - UI_GUIDELINES.md
   - DESIGN_SYSTEM.md
   - ARCHITECTURE.md
   - SIMULATION_GUIDELINES.md

2. Understand the existing implementation.

3. Explain planned changes before editing.

---

Cursor should:

- Implement requested changes.
- Preserve working systems.
- Follow architecture rules.
- Avoid unnecessary features.

---

Cursor should not:

- Redesign architecture without approval.
- Add unrelated features.
- Replace working systems.
- Ignore documentation.

---

# Final Product Goal

TactiCore should become:

> A football-first draft and simulation experience where players can build legendary squads and discover how history's greatest teams would compete.

The goal is not to build the biggest football simulator.

The goal is to build the most enjoyable football draft experience.