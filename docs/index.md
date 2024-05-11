---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Hello, Observable Framework</h1>
  <h2>Welcome to your new project! Edit&nbsp;<code style="font-size: 90%;">docs/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started" target="_blank">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

```js
import {
  getGroupedDisasters,
  getDisastersPerYearAsInt,
  getDisastersPerYearAsDate,
  getConfirmedAffectedPersonsPerYear,
  getDisastersAmountPerCountryPerYear,
  getTypeCorrelations,
  getCorrelationBetweenTwoLists,
  getAverageLengthOfDisasterPerYear,
  bundleDisasters,
  getDisasterCounts,
  getTotalDisastersPerYear,
  getMonthlyTemperatureChanges,
  getYearlyTemperatureChanges,
  getMostDeadlyDisasters,
} from "./process_data.js";

const emdat_disasters = await FileAttachment("data/emdat_disasters.csv").csv({
  typed: true,
  headers: true,
});

const temperatures = await FileAttachment(
  "data/GISS_surface_temperature.csv"
).csv({
  typed: false,
  headers: true,
});

const monthlyTemperatureChanges = getMonthlyTemperatureChanges(
  temperatures,
  filterBefore2000
);
const yearlyTemperatureChanges = getYearlyTemperatureChanges(
  temperatures,
  filterBefore2000
);

const groupedDisasters = getGroupedDisasters(emdat_disasters, filterBefore2000);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000
);
const totalDisasterPerYear = getTotalDisastersPerYear(
  disastersPerYear,
  filterBefore2000
);

const correlation = getCorrelationBetweenTwoLists(
  disastersPerYear.map((e) => e["disasters"]),
  yearlyTemperatureChanges.map((e) => e["temp"])
);

const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  filterBefore2000
);

const disasterCounts = getDisasterCounts(emdat_disasters, filterBefore2000);

const disastersAmountPerCountryPerYear = getDisastersAmountPerCountryPerYear(
  emdat_disasters,
  filterBefore2000
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  filterBefore2000
);

const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000
);
```

```js
const bundledDisasters = bundleDisasters(disastersPerYear);
```

```js
import { bumpChart } from "./components/bump_chart.js";
import { areaChart } from "./components/area_chart.js";
import {
  lineChart,
  tempLineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { correlationMatrix } from "./components/correlation_matrix.js";
import { barChart } from "./components/bar_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { sunBurst } from "./components/sunburst.js";
```

```js
const before2000 = view(
  Inputs.checkbox(
    ["include"],
    { label: "Include disasters before year 2000", value: ["include"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
```

## Most deadly droughts

```js
const availableCountries = [
  "all",
  ...new Set(mostDeadlyDisasters.map((d) => d["country"])),
];

const selectedCountries = view(
  Inputs.select(
    availableCountries,
    { label: "Choose country:", value: availableCountries },
    ""
  )
);
```

<div>
    <div>
        ${resize((width) => barChart(mostDeadlyDisasters.filter(d => selectedCountries.includes("all") ? true : selectedCountries.includes(d["country"])).slice(0, 15),
            {"catMapping": {
              "domain": selectedAndColor[0],
              "colors": selectedAndColor[1],
              "map": "disasterType"
            }, width}))}
    </div>
</div>

```js
const selectedDisasters = Object.keys(groupedDisasters);
```

<div class="grid">
    <div class="card">
        ${resize((width) => bumpChart(bundledDisasters, {width}, selectedAndColor))}
    </div>
</div>

```js
const selectedAndColor = getDisastersPerColor(selectedDisasters);
```

<div class="grid grid-cols-2">
    <div class="card">
        ${areaChart(disastersPerYear.filter(disaster => selectedDisasters.includes(disaster["disaster"])),
            "disasters", "Amount of disasters", selectedAndColor)}
    </div>
</div>

<div class="grid">
  <div class="card">
  ${sunBurst(groupedDisasters, selectedDisasters)}
  </div>
</div>

<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
  ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, totalDisasterPerYear, correlation, width))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => barChart(disasterCounts, {label: "Occurrences", x_val: "numberOfDisasters", y_val: "disaster", "catMapping": {
              "domain": selectedAndColor[0],
              "colors": selectedAndColor[1],
              "map": "disaster"
            }, width}))}
  </div>
<div class="card">
    ${resize((width) => barChart(disasterCounts, {label: "Total Deaths", "catMapping": {
              "domain": selectedAndColor[0],
              "colors": selectedAndColor[1],
              "map": "disaster"
            }, width}))}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${correlationMatrix(correlations)}
  </div>
</div>
---
