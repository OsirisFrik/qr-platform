# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QR Platform** is a web application for generating QR codes with a focus on simplicity and intuitive UX. Users can generate QR codes for URLs, text, WiFi networks, and WhatsApp contacts without complex workflows.

**Current state**: Migrated from Nuxt 4 to Astro with Vue 3 components. Running on Astro's static generation with Vue island hydration.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Build for production (generates static site in dist/)
pnpm build

# Preview production build locally
pnpm preview

# Format code with Prettier
pnpm prettier
```

## Tech Stack

- **Framework**: Astro 6 (static SSG with Vue 3 island components)
- **UI Components**: Vue 3 + Reka UI (headless component library)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **QR Generation**: `qrcode` npm package
- **Icons**: lucide-vue-next
- **Notifications**: vue-sonner (toast notifications)
- **Internationalization**: i18next-vue (en, es locales)
- **Routing**: Vue Router (for client-side navigation)
- **Analytics**: @vercel/analytics, @vercel/speed-insights
- **Code Quality**: Prettier with import/class sorting

## Architecture & Code Organization

### QR Generation Flow

Entry point is **src/pages/index.astro** which renders **HomeView.vue** with `client:load` hydration.

**HomeView.vue** layout orchestrates:
- **QRGenerator.vue**: Main component managing state, mode switching (text/wifi/whatsapp)
- **QRInput.vue**: Text/URL input form
- **QRWifiInput.vue**: WiFi credential input
- **QRWhatsAppInput.vue**: WhatsApp contact sharing input
- **QRPreview.vue**: Canvas-based QR display with download
- **QRHistory.vue**: Browser localStorage history panel
- **QROptions.vue**: Customization controls (error correction, size, colors)

Supporting components:
- **ThemeToggle.vue**: Dark/light mode toggle
- **LanguageSwitcher.vue**: Locale switcher (en/es)
- **GitHubStars.vue**, **BuyMeACoffee.vue**: External links

### Directory Structure

```
src/
├── pages/
│   └── index.astro          # Entry point, hydrates HomeView.vue
├── layouts/
│   └── Layout.astro         # Base Astro layout (head, body wrapper)
├── components/
│   ├── HomeView.vue         # Main view (hydrated island)
│   ├── QRGenerator.vue      # QR orchestrator & state manager
│   ├── QRInput.vue          # Text/URL input
│   ├── QRWifiInput.vue      # WiFi input
│   ├── QRWhatsAppInput.vue  # WhatsApp input
│   ├── QRPreview.vue        # Canvas QR display + download
│   ├── QROptions.vue        # Customization options
│   ├── QRHistory.vue        # History panel
│   ├── LanguageSwitcher.vue
│   ├── GitHubStars.vue
│   ├── BuyMeACoffee.vue
│   └── ui/                  # Reka UI component library
│       ├── button/
│       ├── card/
│       ├── field/
│       ├── select/
│       ├── textarea/
│       ├── slider/
│       └── ... (other UI components)
├── composables/
│   ├── useQRCode.ts         # QR generation logic (returns reactive state)
│   └── useQRHistory.ts      # LocalStorage-based history management
├── i18n/
│   ├── index.ts             # i18next-vue setup and useI18n() composable
│   └── locales/
│       ├── en.json
│       └── es.json
├── assets/
│   └── css/
│       └── tailwind.css     # Global styles, Tailwind directives
└── styles/
    └── ... (additional CSS if needed)
```

### State Management

**Reactive state** via Vue composition API composables (no external state library):

- **useQRCode()**: Manages text input, QR options, generation state, download
  - Returns: `text`, `options`, `qrDataUrl`, `isGenerating`, `downloadQR()`, `copyToClipboard()`, `reset()`
  - Triggers on text changes → generates QR canvas data → canvas-to-dataURL conversion
  
- **useQRHistory()**: Manages localStorage history
  - Returns: `history`, `addToHistory()`, `clearHistory()`
  - Persistent storage key: `qr-history`

QRGenerator.vue watches mode changes and syncs active input to `text` ref for preview.

### Key Patterns

#### QR Code Generation

```vue
<script setup>
import QRCode from 'qrcode'
import { useQRCode } from '@/composables/useQRCode'

const { text, options, qrDataUrl, downloadQR } = useQRCode()

// In composable:
// QRCode.toCanvas(canvas, text, options) → canvas.toDataURL()
</script>
```

- Uses `qrcode` library's `toCanvas()` API
- Supports options: `errorCorrectionLevel` (L/M/Q/H), `width`, `color` (dark/light)
- Canvas converted to DataURL for preview/download

#### Astro → Vue Hydration

```astro
---
import HomeView from '../components/HomeView.vue'
---

<Layout>
  <HomeView client:load />
</Layout>
```

`client:load` hydrates the component immediately. Other directives: `client:idle`, `client:visible`.

#### Internationalization

```vue
<script setup>
import { useI18n } from '@/i18n'

const { t, locale } = useI18n()
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>
```

Translations in `src/i18n/locales/{en,es}.json`. Keys accessed via `t('key.nested')`.

#### Styling

- Tailwind v4 configured via `@tailwindcss/vite` in `astro.config.mjs`
- Prettier plugin auto-sorts Tailwind classes
- Dark mode via `<html class="dark">` (already set in Layout.astro)
- Reka UI components reference CSS variables; update `src/assets/css/tailwind.css` for theming

#### Component Imports

Explicit imports required (no auto-import in Astro):

```vue
<script setup>
import Button from '@/components/ui/button/Button.vue'
import { useQRCode } from '@/composables/useQRCode'
</script>
```

Vite alias `@` resolves to `src/`.

### Mode & Input Handling

**QRGenerator.vue** manages a `mode` ref (text/wifi/whatsapp):

```typescript
const mode = ref<'text' | 'wifi' | 'whatsapp'>('text')
const wifiText = ref('')
const whatsappText = ref('')

const activeText = computed(() => {
  if (mode.value === 'wifi') return wifiText.value
  if (mode.value === 'whatsapp') return whatsappText.value
  return text.value
})

watch(mode, () => {
  reset() // clear inputs and preview when switching
})
```

Each input component (`QRInput`, `QRWifiInput`, `QRWhatsAppInput`) updates its respective ref, which syncs to `text` for QR generation.

## Configuration Files

- **astro.config.mjs**: Astro setup, Vue integration, Tailwind Vite plugin, path alias (`@`)
- **.prettierrc**: Import sorting, Tailwind class sorting, 80 char line width
- **package.json**: Scripts (dev/build/preview), dependencies
- **tsconfig.json**: TypeScript config

## Design Principles

- **Minimal, fast UX**: Few form fields, real-time preview
- **Mobile-first**: Responsive design via Tailwind
- **Extensible**: Easy to add new QR modes (create input component → update QRGenerator mode logic)
- **Accessible**: Semantic HTML, ARIA labels (use Reka UI components which handle a11y)

## Common Tasks

### Adding a New QR Input Type

1. Create `src/components/QRNewInput.vue` (follow `QRWifiInput.vue` structure)
2. In `QRGenerator.vue`:
   - Add mode to type: `'text' | 'wifi' | 'whatsapp' | 'newinput'`
   - Add state ref: `const newInputText = ref('')`
   - Add computed `activeText` case
   - Add watch to sync input to `text`
3. Add UI button in QRGenerator template to switch mode
4. Add translations to `i18n/locales/{en,es}.json`

### Adding a UI Component from Reka UI

Reka UI is already integrated. Import from `src/components/ui/` and use directly—no CLI needed.

Example: Button, Card, Select, etc. are ready to use.

### Formatting Before Commit

```bash
pnpm prettier
```

Prettier will:
- Sort imports (3rd party → @/ → relative)
- Sort Tailwind classes
- Fix formatting

## Deployment

Built static site in `dist/` after `pnpm build`. Deploy to Vercel:
- Analytics & Speed Insights enabled
- No server required (static SSG)
- Instant cold starts

## Development Notes

**Astro-specific gotchas**:
- Components in `.astro` files can't use Vue reactivity directly—use `.vue` files with `client:*` for interactivity
- `import.meta.env` for environment variables (Astro-style)
- Styles in `.astro` are scoped by default; use `is:global` if needed

**File extensions**:
- `.astro` for pages/layouts (server-side, static generation)
- `.vue` for interactive components (hydrated as islands)

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
