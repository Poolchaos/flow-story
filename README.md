# FlowStory - 3D Data Storytelling Platform

Transform your CSV data into interactive 3D visualizations with FlowStory, built with React 18, TypeScript, and Three.js.

## Features

- **CSV Upload**: Drag-and-drop or browse to upload CSV files
- **Smart Type Detection**: Automatic detection of number, string, date, and boolean types
- **Column Mapping**: Intuitive UI to map data columns to X/Y/Z axes and optional visual properties
- **Data Validation**: Real-time statistics and validation before visualization
- **3D Visualization**: Interactive bar charts with pan, zoom, and rotate controls
- **Hover Tooltips**: Detailed data display on hover with all row values
- **Color Interpolation**: Dynamic color gradients based on data values
- **Responsive Design**: Mobile-first responsive layout with cyan/teal color scheme

## Tech Stack

- **Frontend**: React 18.3, TypeScript 5.6, Vite 7.2
- **3D Graphics**: Three.js 0.181, @react-three/fiber 8.18, @react-three/drei 10.1
- **Styling**: Tailwind CSS v4.1 with @tailwindcss/postcss plugin
- **State Management**: Zustand 5.0
- **Routing**: React Router v7.1
- **Data Processing**: PapaParse 5.5, D3.js 7.9
- **Testing**: Vitest 4.0, React Testing Library, Happy-DOM

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app in development mode at [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

Builds the app for production to `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Testing

FlowStory has **97.5% statement coverage** and **89.4% branch coverage** with comprehensive test suites.

### Run Tests

```bash
npm test
```

Runs tests in watch mode.

### Run Tests Once

```bash
npm test -- --run
```

Runs all tests once without watching.

### Coverage Report

```bash
npm run test:coverage
```

Generates full coverage report with V8 provider. Coverage thresholds:
- **Lines**: ≥85%
- **Functions**: ≥85%
- **Branches**: ≥85%
- **Statements**: ≥85%

### Test UI

```bash
npm run test:ui
```

Opens Vitest UI for interactive test exploration.

### Test Files

- `src/store/dataStore.test.ts` - Zustand store tests (19 tests, 100% coverage)
- `src/components/FileUpload.test.tsx` - CSV upload component (23 tests, 96.8% coverage)
- `src/components/ColumnMapper.test.tsx` - Column mapping UI (13 tests, 100% coverage)

## Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # CSV upload with drag-and-drop
│   ├── ColumnMapper.tsx # Column-to-axis mapping interface
│   ├── DataValidation.tsx # Data statistics and validation
│   ├── Scene3D.tsx      # Three.js canvas wrapper
│   └── BarChart3D.tsx   # 3D bar chart visualization
├── pages/               # Route pages
│   ├── Home.tsx         # Landing page
│   ├── Create.tsx       # Multi-step workflow (upload/configure/preview)
│   ├── Visualize.tsx    # Full-screen 3D visualization
│   └── Explore.tsx      # Gallery (coming soon)
├── store/               # State management
│   └── dataStore.ts     # Zustand store for CSV data and mappings
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types (ParsedData, ColumnMapping, etc.)
└── test/                # Test configuration
    └── setup.ts         # Vitest setup with happy-dom
```

## Workflow

1. **Upload**: Drag-and-drop a CSV file or click to browse
2. **Preview**: View parsed data with type detection (first 5 rows)
3. **Map Columns**: Assign columns to X/Y/Z axes (required) and optional color/size/label
4. **Validate**: Review statistics (count, unique values, min/max/avg for numbers)
5. **Visualize**: Click "View in 3D" to see interactive bar chart
6. **Explore**: Pan (right-click), rotate (left-click), zoom (scroll) in 3D space
7. **Inspect**: Hover over bars to see all data values in tooltip

## Current Limitations

- Maximum 100 data points rendered (performance optimization)
- Only bar chart template implemented (particles/spheres planned for Week 4)
- No waypoint/narrative system yet
- No export functionality (video/image)

## Future Roadmap (Week 4+)

- [ ] Particle cloud template
- [ ] Sphere/bubble chart template
- [ ] Waypoint system with camera animation
- [ ] Camera path timeline controls
- [ ] Export to video/image
- [ ] Gallery with example datasets
- [ ] Performance optimization for large datasets (>100 rows)

## Color Scheme

FlowStory uses a professional cyan/teal palette:
- Primary: `#06b6d4` (cyan-500)
- Primary Dark: `#0891b2` (cyan-600)
- Accent: `#22d3ee` (cyan-400)
- Gradient: Cyan → Purple for data interpolation

## License

MIT

## Contributing

Contributions welcome! Please ensure:
- All tests pass (`npm run test:coverage`)
- TypeScript compiles without errors (`npm run build`)
- Linting passes (`npm run lint`)
- Coverage remains ≥85% for all metrics
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
