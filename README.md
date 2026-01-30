# PDF Merger

A simple, client-side web application for merging PDF files. No server required - all processing happens in your browser!

## Features

- 📄 Merge multiple PDF files into one
- 🔄 Drag and drop to reorder files
- 💾 Client-side processing (your files never leave your browser)
- 🎨 Clean, modern UI
- 📱 Responsive design

## Demo

[Live Demo](https://yourusername.github.io/PDFMerger)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PDFMerger.git
cd PDFMerger
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Building for Production

Build minified files for production:
```bash
npm run build
```

This will create a `dist` folder with optimized and minified files.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

1. Update the `base` path in `vite.config.js` to match your repository name

2. Build and deploy:
```bash
npm run deploy
```

This will automatically build the project and deploy it to GitHub Pages.

## Scripts

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build and minify for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

## Technologies Used

- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation
- Pure JavaScript (ES6+)
- CSS3
- HTML5

## License

MIT
