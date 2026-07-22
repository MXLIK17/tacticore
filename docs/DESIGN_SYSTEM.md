# TactiCore - Design System

## Purpose

This document defines the reusable visual language of TactiCore.

The purpose of this design system is to ensure every screen, component, and interaction feels like part of the same football experience.

The design system should create an interface that is:

- Consistent
- Modern
- Minimal
- Football-focused
- Easy to understand

Every new component should follow these rules.

---

# Design Philosophy

TactiCore follows a simple principle:

> Strong design comes from clarity, not complexity.

The interface should avoid unnecessary decoration.

Prioritize:

- Clear hierarchy
- Readability
- Spacing
- Consistency
- Football identity

Avoid:

- Excessive gradients
- Heavy shadows
- Overuse of animations
- Decorative elements without purpose

---

# Visual Style

The overall visual style should feel like:

- A modern football application
- A tactical analysis board
- A professional coaching interface

The style should not resemble:

- Ultimate Team cards
- Fantasy football websites
- Business dashboards
- Mobile games with excessive effects

---

# Colour System

Colours should support usability and hierarchy.

---

## Primary Colours

### Pitch Green

Used for:

- Football pitch
- Football environments
- Main identity elements

Characteristics:

- Dark
- Natural
- Professional

---

### Background

Used for:

- Main application background
- Large empty spaces

Should be:

- Dark neutral tones
- Comfortable for long viewing

---

### Surface

Used for:

- Panels
- Small containers
- Information sections

Should provide separation without feeling like separate applications.

---

# Text Colours

## Primary Text

Used for:

- Player names
- Headings
- Important information

Should have high contrast.

---

## Secondary Text

Used for:

- Descriptions
- Supporting information
- Labels

Should be softer than primary text.

---

## Disabled Text

Used for:

- Empty states
- Unavailable options

Should remain visible but subtle.

---

# Accent Colours

## Gold

Used for:

- Player ratings
- Awards
- Achievements
- Important statistics

Gold should represent excellence.

---

## Team Colours

May be used for:

- Player jerseys
- Team identity

Avoid allowing team colours to overpower the interface.

---

# Typography

Typography should prioritize readability.

---

## Headings

Used for:

- Page titles
- Competition names
- Major sections

Characteristics:

- Strong
- Clear
- Modern

---

## Subheadings

Used for:

- Player names
- Categories
- Section labels

---

## Body Text

Used for:

- Descriptions
- Supporting information

Should remain easy to read.

---

## Numbers

Important football statistics should have strong visual emphasis.

Examples:

- Ratings
- Scores
- Goals
- Points

Numbers should be easy to scan.

---

# Spacing System

Use consistent spacing.

Recommended spacing scale:

Small:
8px

Medium:
16px

Large:
24px

Extra Large:
32px

Section:
48px


Avoid overcrowding.

Whitespace is intentional.

Empty space improves focus.

---

# Border Radius

Components should feel modern but not overly rounded.

Use:

- Small radius for buttons
- Medium radius for panels
- Larger radius for player elements

Avoid:

- Completely circular cards
- Excessive pill-shaped designs

---

# Shadows

Use shadows carefully.

Shadows should:

- Create separation
- Improve hierarchy

Avoid:

- Heavy shadows
- Floating UI everywhere

The interface should feel clean.

---

# Buttons

Buttons should be simple and readable.

---

## Primary Button

Used for:

- Main actions

Examples:

- Start Draft
- Confirm Player
- Simulate Competition

Characteristics:

- Strong contrast
- Clear text
- Obvious action

---

## Secondary Button

Used for:

- Optional actions

Examples:

- Back
- Cancel
- Change Formation

Should be visually lighter.

---

## Disabled Button

Should communicate:

- Action unavailable
- Requirement not completed

Without disappearing completely.

---

# Player Components

Players are the most important objects in TactiCore.

---

# Jersey Component

Jerseys should represent players on the football pitch.

Each jersey contains:

- Initials
- Rating badge
- Team colour

Avoid:

- Player portraits
- Large cards
- Excessive information

---

# Rating Badge

Ratings should be instantly readable.

Example:

95


Characteristics:

- Small
- Visible
- Premium feeling

Gold accents may be used.

---

# Position Marker

Empty positions should use:

- Transparent circles
- Minimal outlines
- Position abbreviation

Examples:

ST
CM
CB
GK


They should guide the player without distracting.

---

# Cards and Panels

Cards should only exist when they improve organization.

Acceptable uses:

- Match results
- Statistics summaries
- Player comparison

Avoid:

- Turning every player into a card
- Card-heavy layouts

---

# Tables

Tables should prioritize readability.

Use for:

- League standings
- Tournament brackets
- Statistics

Tables should:

- Have clear columns
- Highlight important information
- Avoid excessive borders

---

# Icons

Icons should be:

- Simple
- Consistent
- Functional

Avoid decorative icons.

Every icon should communicate something.

---

# Animations

Animations should improve feedback.

Allowed:

- Fade transitions
- Small movement
- Hover effects
- Player placement animation

Avoid:

- Long transitions
- Flashy effects
- Constant movement

The user should notice the interaction, not the animation.

---

# Responsive Rules

The interface must adapt naturally.

Priorities:

1. Preserve football pitch visibility.
2. Maintain player positioning.
3. Keep text readable.
4. Avoid unnecessary scrolling.

---

# Component Organization

Frontend components should follow reusable design principles.

Example:

components/

FootballPitch

PlayerMarker

Jersey

RatingBadge

Button

MatchCard

StatsTable


Components should have:

- One responsibility
- Clear naming
- Reusable behavior

---

# Consistency Rules

Before creating a new component ask:

1. Does this already exist?
2. Can an existing component be reused?
3. Does this improve the football experience?

Avoid duplicate components.

---

# Final Design Principle

Every design choice should support:

> The user should feel like they are building and managing a legendary football squad.

If an element does not improve clarity, usability, or immersion, remove it.