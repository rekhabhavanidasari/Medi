# MediSpot – Find Medicines Near You

## Current State
A full-featured medicine finder web app with:
- Navbar with logo, tagline, and "Add Pharmacy" dropdown (login/register)
- Hero section with medicine search (voice, camera, text), location bar
- Stats row (pharmacies, medicines, live inventory)
- Split layout: pharmacy results list + Leaflet map with routing
- Auth modal (login + register tabs)
- Multi-step pharmacy registration modal
- All data is simulated/generated client-side

## Requested Changes (Diff)

### Add
- Emergency button (red, pulsing) in the navbar, placed to the left of the "Add Pharmacy" button
- Emergency modal that shows nearest hospitals (simulated data around user location)
- Each hospital card shows: name, area, distance (km), open/closed status, phone, and a "Get Route" button
- Map inside the emergency modal (or reuse the main map) showing hospital pins in red
- Hospital open/closed badge prominently displayed
- Sort hospitals by distance (nearest first)
- Route line on map when user clicks a hospital

### Modify
- Navbar: add emergency button between tagline and "Add Pharmacy" button

### Remove
- Nothing removed

## Implementation Plan
1. Add emergency button styles (red gradient, pulse animation, navbar placement)
2. Add emergency modal styles (overlay, hospital cards, open/closed badges)
3. Add hospital dataset (simulated names, areas, open hours, phone numbers)
4. Add `openEmergencyModal()` / `closeEmergencyModal()` functions
5. Generate nearby hospitals using haversine distance from user location
6. Render hospital cards sorted by distance with open/closed status
7. Show hospital markers on a Leaflet map inside the modal
8. Wire "Get Route" per hospital card to draw route line on that map
