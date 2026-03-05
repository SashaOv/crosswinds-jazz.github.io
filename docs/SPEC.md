# Crosswinds Band Web Site

## Overview

A simple, responsive website for the Crosswinds jazz band.

Routes:
- `/` (Home)
- `/the-band` (The Band)

Contact Us is opened as a modal dialog from the top bar (no dedicated `/contact` page).

## General Layout

- Top bar: 
   - [logo](./assets/logo-transparent.png) on the left, 
   - Tab bar with links to pages on the right
   - Rightmost link: Contact Us
   - Mobile: hamburger icon that toggles a dropdown nav
- Content area:
   - Page content
- Bottom bar
   - Social media icons with links
   

## Pages

### Home

A page with following information architectire:
   - Multiple sections using InfoSection component. Each section contains:
      - Horizontally split, alternating right/left layout
         - Vertically split:
            - 1-2 sentences of text
            - Player with a demo recording implemented by DemoPlayer component. Contains a title of the song, and buttons:
               - 15 seconds backward
               - rewind (position to the start of recording)
               - play/pause toggle
               - 15 seconds forward
            - Time display: current time and total duration
         - Image: one of the band photos

The data for the home page comes from `./content/home.yaml`

      Player behavior:
      - Starts paused (no autoplay)
      - Only one player can play at a time across the page
      
### The Band

- Band bio and history (`hero`) rendered as a full-width text block above member sections
- Member profiles (photo, name, instrument, short bio) in the alternating right-left format similar to the home page.

The data comes from `./content/the-band.yaml`

### Contact Us

Opens a modal dialog from the top bar with the following:

- "X" Window close icon
- Your Name
- Your Email
- Message: large text field
- Send button

Validation before submit:
- Name: minimum 8 characters
- Email: must match email regex format
- Message: minimum 12 characters

Submission behavior:
- Submit with `POST` to a backend endpoint (URL: `TBD`)
- While submitting, show spinner next to `Send`
- Keep spinner visible for at least 1 second, or until response is received, whichever is longer
- Then change button text to `Sent!` and apply disabled background/state
- Keep dialog visible for 2 more seconds, then close it automatically
- On error: show inline error message below Send button; button reverts to `Send`; dialog stays open for retry

## Tech Stack
- Astro
- Svelte for components: InfoSection, DemoPlayer, ContactUsDialog 
- Colors are coming from named variables
- Consider variables for component sizes, too
- Deployment: GitHub Pages via GitHub Actions (static build)

## Content Model
`content/home.yaml` and `content/the-band.yaml` can be represented as:

```ts
export interface Track {
   title?: string;
   source: string;
}

export interface ContentItem {
   title?: string;
   text?: string;
   photo: string;
   audio?: Track[];
}

export interface ContentDocument {
   title: string;
   content: ContentItem[];
   hero?: string;
}
```

