# TactiCore - UI Guidelines

## Purpose

This document defines the visual and user experience philosophy of TactiCore.

The goal is to create a football-first interface that feels like a modern tactical football experience.

The application should feel like:

- A football tactics board
- A coach's planning screen
- A squad-building experience

It should not feel like:

- A business dashboard
- A CRUD application
- A statistics management system
- A collectible card game

Every visual decision should support the core experience:

> Build a team. Understand the squad. Simulate the competition.

---

# Overall Design Philosophy

TactiCore should prioritize:

1. Football clarity
2. Simplicity
3. Modern design
4. Easy understanding
5. Meaningful interaction

The user should immediately understand:

- What mode they are playing
- What formation they selected
- Which positions are filled
- Which positions remain empty
- How strong their squad is

The user should never need to search through menus or lists to understand their team.

---

# Visual Identity

TactiCore should establish its own identity.

Avoid copying:

- EA FC Ultimate Team
- Football Manager
- Fantasy football websites
- Card collection games
- Generic dashboards

The interface should feel closer to:

- A professional football tactics board
- A modern coaching application
- A digital stadium experience

The design should be:

- Minimal
- Elegant
- Football-focused
- Clean
- Responsive

The interface should feel polished through simplicity rather than excessive visual effects.

---

# Squad Builder Interface

The squad builder is the most important screen in TactiCore.

The football pitch should be the primary visual element.

The user should understand their entire squad simply by looking at the screen.

The pitch should occupy most of the available space.

Avoid surrounding the pitch with unnecessary information.

---

# Football Pitch

The football pitch should include realistic football markings:

- Halfway line
- Centre circle
- Penalty areas
- Goal areas
- Touchlines

The pitch should use:

- Dark green grass
- Slight grass pattern variation
- White pitch markings

The pitch should look realistic while remaining clean.

The pitch should never distract from the players.

---

# Formation Display

When a formation is selected, every position should appear on the pitch.

Example:

4-3-3:

          ST

    LW           RW


      CM   CM

          CDM

    LB  CB    CB    RB  
            
            GK


The formation should determine the player's positions.

Positions should resemble real football positioning.

Examples:

- Wingers should be wide and advanced.
- Fullbacks should be wider than centre-backs.
- Midfielders should maintain realistic spacing.
- Defensive players should remain deeper.

Avoid creating a simple grid layout.

The pitch should resemble an actual tactical lineup.

---

# Empty Positions

Undrafted positions should always remain visible.

Empty positions should appear as:

- Outlined circles
- Slightly transparent
- Minimal styling

Inside each position marker display the abbreviation.

Examples:

GK
LB
CB
CB
RB
CDM
CM
CAM
LW
ST
RW


Empty placeholders should communicate:

- Which positions remain available
- Where the next drafted player will go

They should not dominate the screen.

---

# Drafted Players

When a player is selected, the empty position should transform into a player representation.

Do not use:

- Player cards
- Large profile panels
- Player portraits

Instead use:

- Simple jersey icon
- Player initials
- Rating badge
- Player name

Example:

   🟦

   TH

   95
Theirry Henry 


The user should immediately understand:

- Who occupies the position
- Where they play
- Their overall rating

---

# Player Jersey Design

Jerseys should be minimal.

Each jersey should contain:

## Main Element

Player initials.

Example:

TH 

## Rating Badge

Small badge positioned near the jersey.

Example:

95


The rating badge should be visually noticeable but not overpowering.

## Player Name

Displayed underneath the jersey.

Example:

Theirry Henry 


Avoid unnecessary statistics during squad building.

The pitch should remain the focus.

---

# Player Interaction

Interactions should remain simple.

Hovering over a player should provide additional information.

A lightweight tooltip may display:

- Full name
- Historical team
- Season/tournament
- Position
- Overall rating

Avoid large popups or profile screens.

Information should be available without interrupting the squad-building experience.

---

# Drafting Experience

The current draft position should always be clear.

Example:

Current Selection; 
ST


The active position may have:

- Slight highlight
- Subtle animation
- Visual focus indicator

Avoid flashy effects.

The user should always know:

"What position am I currently filling?"

---

# Animations

Animations should improve feedback.

Use:

- Smooth player placement
- Small hover effects
- Subtle transitions

Avoid:

- Excessive movement
- Flashy effects
- Long animations

Animations should generally be quick.

The user experience should feel responsive.

---

# Navigation

Navigation should remain simple.

Recommended structure:

Home

Draft

Squad

Simulation

Results


Avoid unnecessary menus.

Every screen should have a clear purpose.

The user should always understand:

- Where they are
- What they can do next

---

# Results Interface

Simulation results should feel like football results.

Avoid showing raw data first.

Instead of:

wins: 24
losses: 5
points: 82


Present information visually.

Example:

Premier League Season

Champion

TactiCore FC

Points

82

Top Scorer

Thierry Henry


---

# Match Results

Individual matches should communicate:

- Teams
- Score
- Goalscorers
- Assists
- Winner

Example:

Arsenal Legends

2 - 1

Barcelona Legends

Goals:

Henry 34'

Messi 71'


---

# Tables and Statistics

Statistics are important but should support the football experience.

Prioritize:

- Readability
- Clear hierarchy
- Important information first

Avoid overwhelming the user with excessive statistics.

---

# Colour Philosophy

Colours should improve readability.

Recommended palette:

## Pitch

- Dark football green
- Slight grass variation

## Text

- White
- Light grey

## Empty positions

- Neutral grey

## Player jerseys

- Team-inspired colours where appropriate

## Ratings

- Gold accents

Colours should feel professional.

Avoid:

- Excessive gradients
- Neon colours
- Distracting effects

---

# Responsive Design

The interface should work across different screen sizes.

The football pitch must remain the centrepiece.

On smaller screens:

- Maintain realistic player spacing
- Scale the pitch proportionally
- Avoid compressing positions together

Do not sacrifice usability for fitting more information.

---

# Component Philosophy

Frontend components should be:

- Reusable
- Small
- Focused
- Consistent

Examples:

Possible reusable components:

FootballPitch

PlayerMarker

PositionPlaceholder

Jersey

RatingBadge

FormationSelector

MatchCard

StatsPanel


Avoid creating large components containing unrelated logic.

---

# Future Compatibility

The squad builder should allow future additions without redesign.

Possible future features:

- Chemistry
- Captain selection
- Substitutions
- Player comparisons
- Tactical changes

Do not implement these features now.

However, the interface should not prevent future expansion.

---

# Final UI Principle

Whenever making a design decision, ask:

> Does this make the football experience clearer and more enjoyable?

If yes, continue.

If no, remove it.