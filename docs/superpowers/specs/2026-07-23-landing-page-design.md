# Landing Page Design

## Summary

This spec defines the first implementation pass for the Apolo landing page main scene based on the approved Figma direction.

Scope for this pass:

- Implement only the center landing scene
- Exclude header and footer
- Target desktop layout only
- Build a reusable window-style card component
- Keep all card content static for now

Out of scope for this pass:

- Responsive behavior
- Functional button, tab, form, or sharing behavior
- Header and footer implementation

## Goals

- Match the approved Figma composition closely in desktop view
- Preserve the layered visual structure with background typography behind cards
- Create a reusable card shell for future sections that use the same "desktop window" motif
- Keep the first pass simple enough to extend later with interactivity

## Layout Architecture

The landing page center area will be implemented as a single scene component named `LandingScene`.

`LandingScene` responsibilities:

- Define the fixed desktop canvas for the hero composition
- Render oversized background typography at a lower z-index
- Position all cards using absolute coordinates
- Own spacing and stacking relationships between cards

The root of the scene will be a `position: relative` container with a fixed desktop width and height chosen to match the approved composition. All floating cards will be placed with `position: absolute`.

This layout intentionally favors precise visual matching over automatic flow. That tradeoff is acceptable because the current goal is desktop-only fidelity.

## Layering

The scene will use a small number of explicit layers:

- Background layer for oversized title typography
- Foreground layer for all cards
- Optional connector accents, if implemented, above the background and below the cards

The background title will remain visually present but subdued using a very light neutral tone. Cards will sit above it using z-index so the composition reads clearly.

## Component Structure

Two primary component levels will be introduced.

### `LandingScene`

This component contains:

- The background typography
- The placement of each floating card
- Static markup for the content inside each card

For the first pass, the card bodies will stay close to the scene component instead of being split into many separate files. This keeps iteration fast while the composition is still settling.

### `WindowCard`

This reusable component will represent the browser-like or desktop-window-like frame used across the scene.

Planned responsibilities:

- Render the outer card shell
- Render the top title bar
- Show a code-like label on the left side of the title bar
- Show three small window control indicators on the right side
- Render children inside a padded content area
- Support title bar variants needed by the scene

Planned props:

- `label`: text shown in the title bar
- `variant`: visual style for the title bar, initially blue or black
- `className`: optional layout override hook
- `children`: inner content

The component should stay presentation-focused and contain no interactive logic.

## Scene Contents

The scene will include the following cards:

- Intro card with primary CTA
- Job selection card
- Career level card
- Prompt card
- Generated layout card
- Apolo intro card with start button
- Block editor card
- Share card

These cards will be implemented as static content matching the visual structure of the approved mockup. Controls such as tabs, buttons, text areas, and list items should look real, but they will not manage state yet.

## Styling Principles

- Use the existing token direction in `/src/index.css` where possible
- Keep the visual language crisp and editorial rather than soft or app-generic
- Favor explicit sizing for visual consistency in this desktop-only pass
- Keep typography, borders, and spacing close to the Figma proportions
- Avoid over-abstracting layout values before the pattern has stabilized

The title bar colors should be configurable so the same `WindowCard` component can support both blue and black header styles already visible in the approved scene.

## Interaction Strategy

All visible controls will be non-functional in this phase.

That means:

- Buttons do not trigger actions
- Tabs do not switch state
- Text input areas do not persist content
- Layout items do not reorder or preview

Even though the UI is static, markup should be structured so later interaction work can be added without rebuilding the scene from scratch.

## Testing and Verification

Implementation readiness will be verified by:

- Successful `vite build`
- No TypeScript or lint-breaking structure introduced by the scene
- Manual visual check that the background typography sits behind the cards
- Manual visual check that the absolute positions preserve the intended composition

## Risks and Tradeoffs

- Absolute positioning makes the first pass easy to match visually, but it is not inherently responsive
- Keeping card bodies inside one scene component speeds up delivery now, but some subcomponents may need extraction later
- Static markup reduces complexity now, but future interactive work should preserve semantic structure to avoid rework

## Follow-up Work

Expected next steps after this pass:

- Implement responsive behavior for tablet and mobile
- Add real state and interactions to card controls
- Connect the static scene to actual product flows
- Decide whether repeated card bodies should be split into dedicated components
