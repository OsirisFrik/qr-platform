# QR Platform

A simple, fast, and intuitive web application for generating QR codes with real-time preview and customization options.

![QR Platform](./public/thumbnail.png)

## Features

✨ **Simple & Intuitive UI** - Generate QR codes without complicated workflows

📱 **Multiple QR Types**

- Text/URL QR codes
- WiFi network sharing
- WhatsApp contact sharing
- vCard (contact card) support
- Extensible architecture for custom types

⚡ **Real-Time Preview** - See your QR code update as you type

🎨 **Customization Options**

- Error correction level (L, M, Q, H)
- QR code size adjustment
- Custom colors (dark/light themes)

💾 **Quick Download** - One-click download with timestamped filenames

📋 **History Tracking** - Recently generated QR codes stored in browser (localStorage)

🌍 **Internationalization** - English and Spanish support

🎯 **Dark Mode** - Modern dark theme by default

## Tech Stack

- **Framework**: [Astro 6](https://astro.build/) (Static site generation with Vue 3 islands)
- **Components**: Vue 3 + [Reka UI](https://reka-ui.com/) (headless component library)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **QR Generation**: [qrcode](https://github.com/davidshimjs/qrcodejs) library
- **Icons**: [lucide-vue-next](https://lucide.dev/)
- **Notifications**: [vue-sonner](https://vue-sonner.com/)
- **i18n**: [i18next-vue](https://i18next.com/) (English & Spanish)
- **Analytics**: Vercel Analytics & Speed Insights
- **Code Quality**: Prettier with import sorting and Tailwind class organization

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server on http://localhost:3000

# Production
pnpm build        # Build static site to dist/
pnpm preview      # Preview production build locally

# Code Quality
pnpm prettier     # Format code with Prettier
```

## Project Structure

```
src/
├── pages/
│   └── index.astro            # Entry point
├── layouts/
│   └── Layout.astro           # Base layout
├── components/
│   ├── HomeView.vue           # Main view (hydrated island)
│   ├── QRGenerator.vue        # QR orchestrator
│   ├── QRInput.vue            # Text/URL input
│   ├── QRWifiInput.vue        # WiFi input
│   ├── QRWhatsAppInput.vue    # WhatsApp input
│   ├── QRPreview.vue          # QR canvas display
│   ├── QROptions.vue          # Customization options
│   ├── QRHistory.vue          # History panel
│   ├── LanguageSwitcher.vue   # i18n locale switcher
│   ├── GitHubStars.vue        # Repository link
│   ├── BuyMeACoffee.vue       # Support link
│   └── ui/                    # Reka UI components
├── composables/
│   ├── useQRCode.ts           # QR generation logic
│   └── useQRHistory.ts        # History management
├── i18n/
│   ├── index.ts               # i18next-vue setup
│   └── locales/
│       ├── en.json            # English translations
│       └── es.json            # Spanish translations
└── assets/
    └── css/
        └── tailwind.css       # Global styles

public/                        # Static assets
```

## How It Works

**Entry point:** `src/pages/index.astro` → hydrates `HomeView.vue` with `client:load`

The QR generation flow is orchestrated by **QRGenerator.vue**:

1. **Mode Selection**: User picks QR type (text, WiFi, WhatsApp)
2. **Input**: User enters relevant data (URL, SSID, contact info)
3. **Preview**: Real-time QR rendering via `useQRCode()` composable
4. **Customize**: Optional adjustments (error correction, size, colors)
5. **Download**: One-click PNG download with timestamped filename
6. **History**: Recently generated QRs saved to localStorage

### QR Generation Logic

Uses the `qrcode` npm package via the `useQRCode()` composable:

```javascript
import QRCode from 'qrcode'

// Generate QR to canvas
await QRCode.toCanvas(canvasRef, text, options)

// Convert to image
const dataUrl = canvas.toDataURL()

// Download
canvas.toBlob((blob) => {
  // Trigger download
})
```

**State:** Reactive via Vue composition API (no external state library)

## Configuration

Key configuration files:

- **astro.config.mjs** - Astro setup, Vue integration, Tailwind plugin, path aliases
- **.prettierrc** - Code formatting rules (import sorting, Tailwind classes)
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

## Development Guidelines

### Adding a New QR Type

1. Create input component: `src/components/QRNewTypeInput.vue`
2. Update `QRGenerator.vue` to add mode to type union and sync logic
3. Add translations to `src/i18n/locales/{en,es}.json`
4. Add UI button in QRGenerator to switch to new mode

### Using Reka UI Components

Components are already in `src/components/ui/`. Import and use directly:

```vue
<script setup>
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <Button>Click me</Button>
</template>
```

### Code Formatting

Run before committing:

```bash
pnpm prettier
```

Prettier will:

- Organize imports (3rd party → @/ aliases → relative)
- Sort Tailwind classes
- Enforce consistent spacing

## Internationalization

Translations are stored as JSON in `src/i18n/locales/`:

```json
{
  "title": "QR Code Generator",
  "mode": {
    "text": "Text",
    "wifi": "WiFi"
  }
}
```

Access in Vue components:

```vue
<script setup>
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>
```

Supported languages: **English (en)** and **Spanish (es)**

## Deployment

Static site generation creates a `dist/` folder ready for deployment on Vercel or any static host:

```bash
pnpm build    # Generate static site to dist/
pnpm preview  # Test production build locally
```

**Features:**

- ✅ Vercel Analytics enabled for page views and user behavior tracking
- ✅ Vercel Speed Insights enabled for Web Vitals monitoring
- ✅ Static SSG for instant load times and zero cold starts
- ✅ Works with any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## Browser Support

- Modern browsers with ES2020+ support
- All Chromium-based browsers (Chrome, Edge, etc.)
- Firefox and Safari (latest versions)

## In Development & Planned Features

**Currently in development:**

- ✨ WhatsApp contact sharing integration
- ✨ vCard (contact card) format support
- ✨ Enhanced QR type selector component

**Upcoming:**

- [ ] Email format support
- [ ] Custom logo/image embedding in QR codes
- [ ] QR code batch generation
- [ ] Theme customization panel
- [ ] User accounts & QR code history sync

## Performance

- ⚡ Real-time QR generation (instant preview)
- 🎯 Minimal dependencies
- 📦 Static site generation (no server overhead)
- 🚀 Instant page loads with Astro's zero-JS-by-default approach
- 🔄 Vue island hydration only where needed (HomeView.vue)

## License

This project is open source. Check the LICENSE file for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions:

- Open an [Issue](https://github.com/osirisfrik/qr-platform/issues)
- Check existing discussions
- Review the [CLAUDE.md](./CLAUDE.md) for development guidelines

---

**Made with ❤️ for simple QR code generation**
