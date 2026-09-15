# Accessibility Engineering

ShopSphere includes frontend accessibility improvements aimed at making the e-commerce experience usable with keyboard navigation, assistive technologies, zoom/reflow, reduced motion, and high-contrast display settings.

## Engineering Coverage

- Semantic `nav` and `main` landmarks
- Skip-to-main-content navigation
- Route-change focus management for the main content region
- Native links and buttons for interactive navigation
- `aria-current="page"` for current navigation state
- Mobile menu state exposed through `aria-expanded` and `aria-controls`
- Descriptive accessible names for icon-only controls
- Decorative icons hidden from the accessibility tree with `aria-hidden`
- Strong visible `:focus-visible` indicators
- Keyboard-operable controls without pointer-only interactions
- Disabled control states that remain understandable and non-interactive
- Form inputs supporting `aria-invalid` for validation feedback
- Reduced-motion support through `prefers-reduced-motion`
- Forced-colors/high-contrast support
- Minimum touch target sizing on small screens
- Responsive layouts intended to support zoom and reflow

## Accessibility Verification Checklist

| Area | Result |
|---|---|
| Keyboard navigation | Pass — navigation and controls use native interactive elements |
| Skip navigation | Pass — skip link targets the main content landmark |
| Route focus | Pass — main content receives focus after route changes |
| Focus visibility | Pass — global `:focus-visible` indicator is provided |
| Navigation state | Pass — current route is exposed with `aria-current` |
| Mobile menu | Pass — expanded/collapsed state and controlled region are exposed |
| Icon-only controls | Pass — menu/cart controls have accessible names |
| Decorative icons | Pass — decorative Lucide icons use `aria-hidden` |
| Reduced motion | Pass — transitions and animations are reduced when requested |
| High contrast | Pass — forced-colors styles are included |
| Form validation state | Pass — shared Input supports `aria-invalid` |
| Responsive interaction | Pass — small-screen controls use accessible touch sizing |

## Manual Test Scenarios

### Keyboard

1. Press `Tab` from the top of the page.
2. Confirm the **Skip to main content** control appears and can be activated with `Enter`.
3. Continue through navigation, menu controls, product controls, cart actions, and forms using only the keyboard.
4. Confirm every focused control has a visible focus indicator.
5. Open the mobile navigation and verify it can be opened and closed with the keyboard.

### Screen Reader

Review page landmarks, headings, navigation names, current-page state, form labels, button names, product images, validation messages, and cart/order status announcements with a screen reader such as NVDA, VoiceOver, or Narrator.

### Zoom and Reflow

Check the application at 200% and 400% browser zoom. Confirm content remains readable and interactive controls remain reachable without requiring horizontal scrolling for normal single-column content.

### Motion and Contrast

Enable `prefers-reduced-motion` and confirm non-essential transitions are reduced. Test Windows High Contrast/forced-colors mode and confirm focus indicators and controls remain distinguishable.

## Engineering Notes

Accessibility is implemented as a reusable frontend concern rather than as page-specific styling only. Shared UI primitives, navigation, application landmarks, focus handling, and global accessibility CSS provide a consistent foundation for customer and admin flows.
