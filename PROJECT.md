# FlowStory - React Implementation

A React-based 3D data storytelling platform for transforming CSV data into immersive visualizations.

## Tech Stack

- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4.1 with @tailwindcss/postcss
- **Routing**: React Router v7.1
- **State Management**: Zustand 5.0
- **Data Parsing**: PapaParse 5.5
- **3D Libraries**: Three.js 0.181, @react-three/fiber 8.18, @react-three/drei 10.1
- **Visualization**: D3.js 7.9

## Features Implemented

### Week 1-2 Complete
- ✅ CSV Upload with drag-and-drop
- ✅ Data parsing with type detection
- ✅ Column mapper (X/Y/Z axes)
- ✅ Data validation with statistics
- ✅ Multi-step workflow with auto-advance
- ✅ Responsive design (mobile-first)
- ✅ Zustand state management
- ✅ React Router navigation
- ✅ Cyan color scheme (soft on eyes)
- ✅ SVG icons (no emojis)

## Project Structure

```
src/
├── components/
│   ├── FileUpload.tsx       # CSV upload with drag-and-drop (220 lines)
│   ├── ColumnMapper.tsx     # X/Y/Z axis mapping (105 lines)
│   └── DataValidation.tsx   # Column stats & type detection (167 lines)
├── pages/
│   ├── Home.tsx            # Landing page with hero, features, CTA (121 lines)
│   ├── Create.tsx          # Multi-step workflow (130 lines)
│   └── Explore.tsx         # Gallery placeholder (16 lines)
├── store/
│   └── dataStore.ts        # Zustand store (36 lines)
├── types/
│   └── index.ts            # TypeScript interfaces (25 lines)
└── App.tsx                 # React Router setup (38 lines)
```

## State Management (Zustand)

```typescript
interface DataStore {
  csvData: string | null;
  parsedData: ParsedData | null;
  columnMapping: ColumnMapping;
  validationResults: ValidationResult[];

  setCsvData: (data: string) => void;
  setParsedData: (data: ParsedData | null) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  setValidationResults: (results: ValidationResult[]) => void;
  clearData: () => void;
}
```

## Design Decisions

### Why React over Vue?
- Better TypeScript integration
- Larger ecosystem for 3D libraries
- More familiar to contributors
- Simpler state management with Zustand

### Why Tailwind v4?
- Latest features and improvements
- Better PostCSS integration
- More flexible color system
- Smaller bundle size

### Why Cyan Color Scheme?
- Softer on eyes than bright blue
- Modern, tech-forward aesthetic
- Better accessibility
- Professional appearance

### Why No Emojis?
- More professional
- Better cross-platform rendering
- Accessibility (screen readers)
- SVG icons scale better

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Migration from Vue

Original Vue implementation had Tailwind CSS configuration issues where utility classes were generating empty CSS rules. React implementation uses Tailwind v4 with proper @tailwindcss/postcss plugin configuration, ensuring all utilities work correctly.

## Next Steps (Week 3+)

### 3D Visualization
- [ ] Three.js scene setup with @react-three/fiber
- [ ] Camera controls and navigation
- [ ] Template selection (bars, particles, spheres)
- [ ] Data mapping to 3D positions
- [ ] Color scaling based on data values

### Narrative System
- [ ] Waypoint creation UI
- [ ] Camera path animation
- [ ] Annotation system
- [ ] Playback controls
- [ ] Timeline editor

### Polish
- [ ] Export functionality (video, images)
- [ ] Gallery with community stories
- [ ] Sample datasets
- [ ] Onboarding flow
- [ ] Help documentation

## Known Issues

- Node.js version warning (requires 22.12+, have 22.8.0) - works but shows warning
- 3D scene not yet implemented - Week 3 feature
- No backend/database - frontend-only MVP

## Performance

- Build time: ~4.3s
- Bundle size: 267KB (gzipped: 84.87KB)
- CSS: 26.26KB (gzipped: 5.32KB)
- Hot reload: <500ms

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)
