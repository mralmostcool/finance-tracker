# Finance Tracker - Agent Rules & Orchestration

This file defines the project-scoped rules and agent coordination guidelines for the Finance Tracker workspace.

## Agent Orchestration & Coordination
- **Team Lead Agent (`team_lead`)**: This agent acts as the main point of contact and orchestrator for all tasks in this workspace. The user interacts primarily with the `team_lead`, who coordinates development, plans workflows, and manages specialized agents as they are created.
- **Frontend Developer Agent (`frontend_developer`)**: Specialized in UI/UX, layouts, styling, components, state management, and frontend integration. Reports directly to the `team_lead`.
- **Backend Developer Agent (`backend_developer`)**: Specialized in server logic, database integration, APIs, security, and business rules. Reports directly to the `team_lead`.
- **Communication Flow**:
  - The user communicates high-level goals.
  - The `team_lead` coordinates the plan and executes or delegates subtasks.

## Project Guardrails
- **Verification**: Always run verification steps (like build, lints, or tests) before concluding work.
- **Documentation**: Keep comments and docstrings up to date.
- **Git Hygiene**: Create clean commits, follow branch guidelines, and always commit and push work to git immediately after completing any task.

## Strict Agent Rules

### Frontend Developer (`frontend_developer`)
- **Styling**: Strictly use **Vanilla CSS** or **CSS Modules**. Avoid Tailwind CSS entirely. Styling must define a clean, cohesive color palette (HSL or Hex), utilize modern typography (like Inter/Outfit), and include rich visual elements (subtle gradients, glassmorphism, hover effects, and micro-animations).
- **Responsive Layout**: Use flexbox and grid layouts ensuring the interface scales beautifully from mobile to large screens.
- **SEO & Structure**:
  - Exactly one `<h1>` per page.
  - Implement descriptive title tags and meta descriptions.
  - Ensure all interactive elements have unique, descriptive IDs.
- **No Placeholders**: Never use placeholder images or text. Use generated assets or actual contextually appropriate content.

### Backend Developer (`backend_developer`)
- **Database & Supabase**:
  - Always design database schemas with security in mind, leveraging Row Level Security (RLS) policies.
  - Use `@supabase/ssr` to instantiate clients correctly for Next.js Server Components, Client Components, Server Actions, and Middleware.
- **Data Flow & Security**:
  - Strictly fetch and mutate data via Next.js Server Actions or Route Handlers.
  - Keep Supabase service role keys and database connection strings strictly server-side. Never expose secret keys to the client.
  - Write robust validation schemas for any user inputs (e.g. Zod).

