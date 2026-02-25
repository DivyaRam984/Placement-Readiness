# KodNest Premium Build System

Design system for the Job Readiness App. Calm, intentional, coherent, confident. B2C product quality.

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise

## Color system (max 4)

| Role     | Token       | Value     |
|----------|-------------|-----------|
| Background | `--kn-bg` | `#F7F6F3` (off-white) |
| Primary text | `--kn-text` | `#111111` |
| Accent   | `--kn-accent` | `#8B0000` (deep red) |
| Success  | `--kn-success` | Muted green |
| Warning  | `--kn-warning` | Muted amber |

Use only these across the entire system.

## Typography

- **Headings:** Serif (Libre Baskerville), large, confident, generous spacing
- **Body:** Sans-serif (Source Sans 3), 16–18px, line-height 1.6–1.8
- **Text blocks:** Max width 720px
- No decorative fonts, no random sizes

## Spacing scale

Use only: **8px, 16px, 24px, 40px, 64px**  
Tokens: `--kn-space-1` through `--kn-space-5`.  
Never use arbitrary values (e.g. 13px, 27px). Whitespace is part of the design.

## Global layout structure

Every page must follow:

1. **Top Bar** — Left: project name; Center: Step X / Y; Right: status badge (Not Started / In Progress / Shipped)
2. **Context Header** — Large serif headline, one-line subtext, clear purpose, no hype
3. **Primary Workspace (70%)** — Main product interaction; clean cards, predictable components
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, actions (Copy, Build in Lovable, It Worked, Error, Add Screenshot)
5. **Proof Footer** — Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed; each requires user proof

## Component rules

- **Primary button:** Solid deep red (`--kn-accent`). **Secondary:** Outlined, same radius
- Same hover effect and border radius (`--kn-radius`) everywhere
- **Inputs:** Clean borders, no heavy shadows, clear focus state (border uses accent)
- **Cards:** Subtle border, no drop shadows, balanced padding (`--kn-space-3`)

## Interaction rules

- **Transitions:** 150–200ms, ease-in-out (`--kn-transition`). No bounce, no parallax

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user.
- **Empty states:** Provide the next action. Never feel dead.

All of the above is implemented in `tokens.css`, `base.css`, `components.css`, and `layout.css`, and in the layout/components under `src/components`.
