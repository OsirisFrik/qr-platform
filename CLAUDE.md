# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QR Platform** is a Vue 3/Nuxt 4 web application for generating QR codes with a focus on simplicity and intuitive UX. Users can generate QR codes for URLs, text, WiFi networks, and other formats without complex workflows.

Current focus: Build a simple, intuitive QR code generator with real-time preview and download capability. Authentication and dashboard features are deferred.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Generate static site (if applicable)
pnpm generate

# Add shadcn components
pnpm shad add [component-name]

# Format code with Prettier
pnpm format

# Check code formatting without changes
pnpm format --check
```

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 with universal SSR rendering)
- **Styling**: Tailwind CSS v4 + shadcn-nuxt (Vue port of shadcn/ui)
- **QR Generation**: `qrcode` library
- **UI Icons**: lucide-vue-next
- **Notifications**: vue-sonner (toast/notification system)
- **Internationalization**: @nuxtjs/i18n (en, es locales)
- **State Management**: Vue composables + useState (Nuxt built-in)
- **Analytics**: @vercel/analytics, @vercel/speed-insights
- **Code Formatting**: Prettier with import sorting and Tailwind class organization

## Architecture & Code Organization

### Core QR Generation Flow

The QR generator is centered around the **index page** with a modular component architecture:

1. **Input Layer** (`QRInput.vue`, `QRWifiInput.vue`): Captures user input (URL, text, WiFi credentials)
2. **Options Layer** (`QROptions.vue`): Provides customization (error correction level, size, colors)
3. **Preview Layer** (`QRPreview.vue`): Real-time QR code rendering using the `qrcode` library
4. **History Layer** (`QRHistory.vue`): Stores recently generated QR codes in component state
5. **Type Selection** (`QRTypeSelector.vue`): Allows users to choose QR type (URL, text, WiFi)

**Key Composable**: `QRGenerator.vue` orchestrates the entire flow, managing:

- Input state across different QR types
- Preview updates as users type
- History management
- Download functionality

### Directory Structure

```
app/
├── pages/
│   ├── index.vue       # Main QR generator page (primary feature)
│   ├── login.vue       # Placeholder (not in use)
│   └── sign-up.vue     # Placeholder (not in use)
├── components/
│   ├── QRGenerator.vue      # Main orchestrator component
│   ├── QRInput.vue          # Text/URL input form
│   ├── QRWifiInput.vue      # WiFi credential input form
│   ├── QROptions.vue        # QR customization options
│   ├── QRPreview.vue        # QR code canvas display
│   ├── QRHistory.vue        # History of generated QRs
│   ├── QRTypeSelector.vue   # QR type selector (URL, text, WiFi, etc.)
│   ├── GitHubStars.vue      # Repository link component
│   ├── LanguageSwitcher.vue # i18n locale switcher
│   ├── ui/                  # shadcn-nuxt components (auto-imported)
│   ├── forms/               # Form components (placeholder)
│   └── layouts/             # Layout components
├── composables/             # Reusable Vue composition functions (auto-imported)
├── utils/
│   └── shadUtils.ts         # shadcn component utility functions
├── assets/
│   └── css/
│       └── tailwind.css     # Global styles and Tailwind v4 setup
└── views/                   # Page-level view components (used by pages/)

types/                        # TypeScript type definitions
i18n/                         # Translation files
├── locales/
│   ├── en.json             # English translations
│   └── es.json             # Spanish translations
```

### Key Patterns

#### QR Generation with the `qrcode` Library

The app uses the `qrcode` npm package for QR generation. The `QRPreview.vue` component:

- Takes input text/URL via props
- Renders QR code to canvas using `qrcode.toCanvas()`
- Supports customization options (error correction, size, colors)
- Provides download functionality via `canvas.toBlob()`

#### Styling

- Tailwind v4 with `@tailwindcss/vite` plugin
- shadcn components auto-imported (no manual imports required)
- Use `pnpm shad add [component-name]` to add new UI components
- Icons from lucide-vue-next (configured in `components.json` with alias `lucide`)
- **Important**: Prettier auto-organizes Tailwind classes when formatting

#### Internationalization

- Locales: `en` (English), `es` (Español)
- Translation files in `i18n/locales/` as JSON files (not TypeScript)
- Use `useI18n()` composable in components to access translations
- Strategy: `no_prefix` (no URL prefix for locale selection)

#### Component Library

- shadcn-nuxt components auto-imported (no manual imports needed)
- All UI components live in `app/components/ui/`
- Add new components with: `pnpm shad add [component-name]`
- New components being developed: `textarea` and `slider` (already added to UI directory)

#### Component Aliases

Defined in `components.json` for cleaner imports:

- `@/components` → components directory
- `@/components/ui` → shadcn UI components
- `@/utils/shadUtils` → shadcn utility functions
- `@/composables` → composition functions

#### Dark Mode

The app is configured for dark mode by default:

- `<html class="dark">` set in `nuxt.config.ts`
- All shadcn components use dark theme CSS variables
- If adding theme switching, use a `ThemeProvider` component pattern

#### Code Formatting

Prettier is configured with:

- Import sorting: 3rd party → `@/` aliases → relative imports
- Tailwind class sorting (via `prettier-plugin-tailwindcss`)
- 80-character line width
- 2-space indentation
- Single quotes, no semicolons, trailing commas off

Run `pnpm format` before committing to maintain consistency.

## Important Configuration Files

- **nuxt.config.ts**: Framework modules (shadcn, i18n), Tailwind Vite plugin, app head metadata, SSR configuration
- **components.json**: shadcn component registry, icon library config, component aliases
- **package.json**: Scripts, dependencies, and pnpm workspace configuration
- **.prettierrc**: Code formatting rules with import and Tailwind class sorting
- **tsconfig.json**: TypeScript references to Nuxt-generated configs

## Design Principles

Keep the QR generator simple and fast:

- Minimize form fields (input + optional customization only)
- Real-time QR preview as users type
- One-click download with descriptive filenames
- Mobile-friendly responsive interface
- No unnecessary redirects or authentication flows
- Support multiple QR types (URL, text, WiFi) via type selector

## UI Component Rules

- High priority to use existing components in `app/components/ui/`
- Use `defineProps` as a constant for component configuration
- Use `v-model` for inputs and selects (not `:value` or `v-model:modelValue`)
- Prefer `defineEmits` as a constant for event definitions
- Avoid `@update` event handlers when `v-model` is available
- Use `useVModel` for `v-model` composition

## Untracked Components in Development

These components are in git status as untracked (new features being added):

- `QRTypeSelector.vue` — Selector for QR code type (URL, text, WiFi, vCard, etc.)
- `QRWhatsAppInput.vue` — Specialized input for WhatsApp contact sharing
- `ui/slider/` — New slider component for QR customization options
- `ui/textarea/` — New textarea component for longer text inputs

## Common Tasks

### Creating a New QR Input Type

1. Create a new input component in `app/components/` (e.g., `QREmailInput.vue`)
2. Export the input handler function and TypeScript interface
3. Update `QRTypeSelector.vue` to include the new type
4. Update `QRGenerator.vue` to handle the new type in the input/preview logic
5. Add translations for the new type to `i18n/locales/{en,es}.json`

### Adding a shadcn Component

```bash
pnpm shad add [component-name]
```

Components are auto-imported; no manual setup needed.

### Adding Translations

1. Add keys to `i18n/locales/en.json` and `i18n/locales/es.json`
2. Use `const { t } = useI18n()` in components to access: `t('key')`

### Downloading QR Codes

The `QRPreview.vue` component provides download via:

1. Reference to canvas element
2. Use `canvas.toBlob()` to get image data
3. Trigger download using `URL.createObjectURL()` and anchor click

## Deployment Notes

- **Vercel Analytics** enabled for tracking page views and user behavior
- **Vercel Speed Insights** enabled for Web Vitals monitoring
- Static generation not typically needed (SSR provides dynamic content)
- Environment: Check `nuxt.config.ts` `compatibilityDate` for Node.js version compatibility

---

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Accessibility (a11y)

Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- `.claude/skills/accessibility/SKILL.md`
- `.claude/skills/accessibility/references/A11Y-PATTERNS.md`: Practical, copy-paste-ready patterns for common accessibility requirements. Each pattern is self-contained and linked from the main [SKILL.md](../SKILL.md).
- `.claude/skills/accessibility/references/WCAG.md`

## Design Thinking

Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beaut...

- `.claude/skills/frontend-design/SKILL.md`

## Core

Nuxt full-stack Vue framework with SSR, auto-imports, and file-based routing. Use when working with Nuxt apps, server routes, useFetch, middleware, or hybrid rendering.

- `.claude/skills/nuxt/SKILL.md`
- `.claude/skills/nuxt/GENERATION.md`
- `.claude/skills/nuxt/references/advanced-hooks.md`: Nuxt and Nitro hooks for extending build-time and runtime behavior
- `.claude/skills/nuxt/references/advanced-layers.md`: Extending Nuxt applications with layers for code sharing and reusability
- `.claude/skills/nuxt/references/advanced-module-authoring.md`: Complete guide to creating publishable Nuxt modules with best practices
- `.claude/skills/nuxt/references/best-practices-data-fetching.md`: Patterns and best practices for efficient data fetching in Nuxt
- `.claude/skills/nuxt/references/best-practices-ssr.md`: Avoiding SSR context leaks, hydration mismatches, and proper composable usage
- `.claude/skills/nuxt/references/core-cli.md`: Nuxt CLI commands for development, building, and project management
- `.claude/skills/nuxt/references/core-config.md`: Nuxt configuration files including nuxt.config.ts, app.config.ts, and runtime configuration
- `.claude/skills/nuxt/references/core-data-fetching.md`: useFetch, useAsyncData, and $fetch for SSR-friendly data fetching
- `.claude/skills/nuxt/references/core-deployment.md`: Deploying Nuxt applications to various hosting platforms
- `.claude/skills/nuxt/references/core-directory-structure.md`: Nuxt project folder structure, conventions, and file organization
- `.claude/skills/nuxt/references/core-modules.md`: Creating and using Nuxt modules to extend framework functionality
- `.claude/skills/nuxt/references/core-routing.md`: File-based routing, dynamic routes, navigation, and middleware in Nuxt
- `.claude/skills/nuxt/references/features-components-autoimport.md`: Auto-imported components, lazy loading, and hydration strategies
- `.claude/skills/nuxt/references/features-components.md`: NuxtLink, NuxtPage, NuxtLayout, and other built-in Nuxt components
- `.claude/skills/nuxt/references/features-composables.md`: Auto-imported Vue APIs, Nuxt composables, and custom utilities
- `.claude/skills/nuxt/references/features-server.md`: API routes, server middleware, and Nitro server engine in Nuxt
- `.claude/skills/nuxt/references/features-state.md`: useState composable and SSR-friendly state management in Nuxt
- `.claude/skills/nuxt/references/rendering-modes.md`: Universal rendering, client-side rendering, and hybrid rendering in Nuxt

## shadcn/ui

Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file.

- `.claude/skills/shadcn/SKILL.md`
- `.claude/skills/shadcn/cli.md`: Configuration is read from `components.json`.
- `.claude/skills/shadcn/customization.md`: Components reference semantic CSS variable tokens. Change the variables to change every component.
- `.claude/skills/shadcn/mcp.md`: The CLI includes an MCP server that lets AI assistants search, browse, view, and install components from registries.
- `.claude/skills/shadcn/rules/base-vs-radix.md`: API differences between `base` and `radix`. Check the `base` field from `npx shadcn@latest info`.
- `.claude/skills/shadcn/rules/composition.md`: Never render items directly inside the content container.
- `.claude/skills/shadcn/rules/forms.md`: Always use `FieldGroup` + `Field` — never raw `div` with `space-y-*`:
- `.claude/skills/shadcn/rules/icons.md`: **Always use the project's configured `iconLibrary` for imports.** Check the `iconLibrary` field from project context: `lucide` → `lucide-react`, `tabler` → `@tabler/icons-react`, etc. Never assume `lucide-react`.
- `.claude/skills/shadcn/rules/styling.md`: See [customization.md](../customization.md) for theming, CSS variables, and adding custom colors.

## Tailwind CSS Development Patterns

Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or o...

- `.claude/skills/tailwind-css-patterns/SKILL.md`
- `.claude/skills/tailwind-css-patterns/references/accessibility.md`
- `.claude/skills/tailwind-css-patterns/references/animations.md`
- `.claude/skills/tailwind-css-patterns/references/component-patterns.md`
- `.claude/skills/tailwind-css-patterns/references/configuration.md`
- `.claude/skills/tailwind-css-patterns/references/layout-patterns.md`
- `.claude/skills/tailwind-css-patterns/references/performance.md`
- `.claude/skills/tailwind-css-patterns/references/reference.md`
- `.claude/skills/tailwind-css-patterns/references/responsive-design.md`

## Tailwind v4 + shadcn/ui Production Stack

- `.claude/skills/tailwind-v4-shadcn/SKILL.md`
- `.claude/skills/tailwind-v4-shadcn/references/advanced-usage.md`: Advanced customization and component patterns for experienced Tailwind v4 + shadcn/ui developers
- `.claude/skills/tailwind-v4-shadcn/references/common-gotchas.md`
- `.claude/skills/tailwind-v4-shadcn/references/dark-mode.md`: Tailwind v4 + shadcn/ui dark mode requires: 1. `ThemeProvider` component to manage state 2. `.dark` class toggling on `<html>` element 3. localStorage persistence 4. System theme detection
- `.claude/skills/tailwind-v4-shadcn/references/migration-guide.md`: Migrate from hardcoded Tailwind colors to semantic CSS variables.
- `.claude/skills/tailwind-v4-shadcn/references/plugins-reference.md`: Complete guide to Tailwind v4 official plugins (Typography, Forms)

## TypeScript Advanced Types

Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript pr...

- `.claude/skills/typescript-advanced-types/SKILL.md`

## Vue Best Practices Workflow

MUST be used for Vue.js tasks. Strongly recommends Composition API with `<script setup>` and TypeScript as the standard approach. Covers Vue 3, SSR, Volar, vue-tsc. Load for any Vue, .vue files, Vue Router, Pinia, or Vite with Vue work. ALWAYS use Composition API unless the project explicitly req...

- `.claude/skills/vue-best-practices/SKILL.md`
- `.claude/skills/vue-best-practices/references/animation-class-based-technique.md`
- `.claude/skills/vue-best-practices/references/animation-state-driven-technique.md`
- `.claude/skills/vue-best-practices/references/component-async.md`
- `.claude/skills/vue-best-practices/references/component-data-flow.md`
- `.claude/skills/vue-best-practices/references/component-fallthrough-attrs.md`
- `.claude/skills/vue-best-practices/references/component-keep-alive.md`
- `.claude/skills/vue-best-practices/references/component-slots.md`
- `.claude/skills/vue-best-practices/references/component-suspense.md`
- `.claude/skills/vue-best-practices/references/component-teleport.md`
- `.claude/skills/vue-best-practices/references/component-transition-group.md`
- `.claude/skills/vue-best-practices/references/component-transition.md`
- `.claude/skills/vue-best-practices/references/composables.md`
- `.claude/skills/vue-best-practices/references/directives.md`
- `.claude/skills/vue-best-practices/references/perf-avoid-component-abstraction-in-lists.md`
- `.claude/skills/vue-best-practices/references/perf-v-once-v-memo-directives.md`
- `.claude/skills/vue-best-practices/references/perf-virtualize-large-lists.md`
- `.claude/skills/vue-best-practices/references/plugins.md`
- `.claude/skills/vue-best-practices/references/reactivity.md`
- `.claude/skills/vue-best-practices/references/render-functions.md`
- `.claude/skills/vue-best-practices/references/sfc.md`
- `.claude/skills/vue-best-practices/references/state-management.md`
- `.claude/skills/vue-best-practices/references/updated-hook-performance.md`

## Vue 3 Core

Vue 3 Composition API, script setup macros, reactivity system, and built-in components. Use when writing Vue SFCs, defineProps/defineEmits/defineModel, watchers, or using Transition/Teleport/Suspense/KeepAlive.

- `.claude/skills/vue/SKILL.md`
- `.claude/skills/vue/GENERATION.md`
- `.claude/skills/vue/references/advanced-patterns.md`: Vue 3 built-in components (Transition, Teleport, Suspense, KeepAlive) and advanced directives
- `.claude/skills/vue/references/core-new-apis.md`: Vue 3 reactivity system, lifecycle hooks, and composable patterns
- `.claude/skills/vue/references/script-setup-macros.md`: Vue 3 script setup syntax and compiler macros for defining props, emits, models, and more

<!-- autoskills:end -->
