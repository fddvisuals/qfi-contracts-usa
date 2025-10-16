# QFI Grants Insight Dashboard

An interactive, responsive React dashboard that illuminates the Qatar Foundation International (QFI) grants portfolio. The app ingests a single CSV (`public/data/Combined_National_QFI_Data.csv`) and surfaces the key program columns called out by the brief while keeping every remaining field available under an "Other" drawer per record.

## ✨ Highlights

- **Clean data ingestion** – CSV parsing with PapaParse, important vs. other fields separation, derived numerics (currency + year extraction).
- **Smart filters** – Search, multi-select year, and source file filters that instantly recompute metrics and visualizations.
- **Purposeful visuals** –
  - Headline summary cards (Total awarded, Disbursed, Grant count, Schools, Conversion ratio, Average grant, Funding sources).
  - Year-over-year area chart comparing approved vs. fully disbursed amounts.
  - Leaderboard for top purposes by frequency and dollars.
  - Horizontal bar chart spotlighting the highest funded source files.
- **Geospatial insight** – Mapbox-powered grants map that scales marker size by approved funding and surfaces location-level details.
- **Comprehensive table** – Sticky, mobile-friendly table for all priority columns plus an expandable “Other fields” drawer that exposes every remaining column/value pair for a record.
- **Thoughtful styling** – Tailwind-powered dark theme with brand-accent gradient, accessible contrast, blur effects, and responsive layout down to small screens.

## 🧱 Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) with the Forms, Typography, and Aspect Ratio plugins
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [Recharts](https://recharts.org/) for the visualizations
- [Headless UI](https://headlessui.com/) + [Heroicons](https://heroicons.com/) for accessible interactive elements

## 🚀 Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:5173 after the dev server starts.

### Production build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

### Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages using the `gh-pages` branch approach. Here's how to set it up:

#### Initial GitHub Pages Setup (One-time)

1. Go to your GitHub repository: https://github.com/fddvisuals/qfi-contracts-usa
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **gh-pages** branch and **/ (root)** folder
5. Click **Save**

#### Deploy to GitHub Pages

Once the initial setup is complete, deploy updates with:

```bash
npm run deploy
```

This command will:
1. Build the production version (`npm run build`)
2. Push the built files to the `gh-pages` branch
3. GitHub Pages will automatically serve the updated site

The live site will be available at: https://fddvisuals.github.io/qfi-contracts-usa/

#### Important Notes

- The `vite.config.ts` is configured with `base: '/qfi-contracts-usa/'` to ensure proper asset paths on GitHub Pages
- The `gh-pages` package handles the deployment process automatically
- After the first deployment, subsequent updates only require running `npm run deploy`

### Map configuration

The geographic visualization relies on Mapbox. A default public token is embedded for convenience, but you should create a personal token and add it to your environment for production use.

1. Create a `.env.local` file in the project root (ignored by git) and add:

  ```bash
  VITE_MAPBOX_TOKEN=your-mapbox-token
  ```

2. Restart the dev server so Vite can pick up the new environment variable.

3. Ensure each CSV row includes `Latitude` and `Longitude` columns (decimal degrees). Records without coordinates are excluded from the map but still appear elsewhere in the dashboard.

## 📁 Data updates

- Replace `public/data/Combined_National_QFI_Data.csv` with a file containing the same header structure (order doesn’t matter).
- On save, refresh the browser or click **Refresh data** in the UI to reparse the CSV.
- Important columns (`Source_File`, `School`, `Grant ID`, etc.) are surfaced directly; any additional columns flow into the per-record “Other fields” accordion automatically.
- Populate `Latitude` and `Longitude` columns (decimal degrees) to keep a record visible on the map; rows without coordinates continue to appear in other visualizations.

## 🧭 Project structure

```
src/
  App.tsx                 # Layout + orchestration of filters, charts, table
  main.tsx                # React bootstrap
  styles.css              # Tailwind directives + global tweaks
  types.ts                # Shared TypeScript types + column constants
  hooks/useGrantData.ts   # Data fetching, normalization, metrics + aggregations
  components/
    SummaryCards.tsx
    FiltersPanel.tsx
    PurposeLeaderboard.tsx
  GrantTable.tsx
    charts/
      YearlyFundingChart.tsx
      FundingBySourceChart.tsx
  utils/format.ts         # Currency/number helpers, year extraction, string guards
```

## 📝 Notes & future ideas

- Bundle size hovers just above Vite’s 500 kB warning largely due to Recharts; splitting the chart bundle (e.g., via lazy imports) is a quick follow-up if needed.
- For deeper storytelling, consider layering geographic groupings, program tags, or interactive narratives using the "Other" metadata already captured.
- The table currently sorts by approved amount. Swap to multi-column sorting or add CSV export if analysts need raw extracts.

Enjoy exploring the grants portfolio! If you need extra slices or visual tweaks, the component structure is ready for extension.
