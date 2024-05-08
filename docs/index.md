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
  getDisastersPerYear,
  getConfirmedAffectedPersonsPerYear,
  getDisastersAmountPerCountryPerYear,
  getTypeCorrelations,
  getCorrelationBetweenTwoLists,
  getAverageLengthOfDisasterPerYear,
  bundleDisasters,
  getDisasterCounts,
  getTotalDisastersPerYear,
  getMonthlyTemperatureChanges,
  getYearlyTemperatureChanges
} from "./process_data.js";

const emdat_disasters = await FileAttachment("data/emdat_disasters.csv").csv({
  typed: true,
  headers: true,
});

const temperatures = await FileAttachment("data/GISS_surface_temperature.csv").csv({
  typed: false,
  headers: true,
});

const monthlyTemperatureChanges = getMonthlyTemperatureChanges(temperatures);
const yearlyTemperatureChanges = getYearlyTemperatureChanges(temperatures);

const groupedDisasters = getGroupedDisasters(emdat_disasters);
const disastersPerYear = getDisastersPerYear(emdat_disasters);
const totalDisasterPerYear = getTotalDisastersPerYear(disastersPerYear);

const correlation = getCorrelationBetweenTwoLists(totalDisasterPerYear.map(e => e["disasters"]), yearlyTemperatureChanges.map(e => e["temp"]));

const confirmedAffectedPersonsPerYear =
  getConfirmedAffectedPersonsPerYear(emdat_disasters);

const disasterCounts = getDisasterCounts(emdat_disasters);

const disastersAmountPerCountryPerYear =
  getDisastersAmountPerCountryPerYear(emdat_disasters);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear =
  getAverageLengthOfDisasterPerYear(emdat_disasters);
```

```js
const bundledDisasters = bundleDisasters(disastersPerYear);
```

```js
import { bumpChart } from "./components/bump_chart.js";
import { areaChart } from "./components/area_chart.js";
import { lineChart, tempLineChart, tempDisasterAmountLineChart } from "./components/line_chart.js";
import { correlationMatrix } from "./components/correlation_matrix.js";
import { barChart } from "./components/bar_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
```

<div class="grid">
    <div class="card">
        ${resize((width) => bumpChart(bundledDisasters, {width}, selectedAndColor))}
    </div>
</div>

```js
const potDisasters = Object.keys(groupedDisasters);

const selectedDisasters = view(
  Inputs.checkbox(
    potDisasters,
    { label: "Choose Disasters:", value: potDisasters },
    ""
  )
);
```

```js
const selectedAndColor = getDisastersPerColor(selectedDisasters);
```

<div class="grid grid-cols-2">
    <div class="card">
        ${areaChart(disastersPerYear.filter(disaster => selectedDisasters.includes(disaster["disaster"])),
            "disasters", "Amount of disasters", selectedAndColor)}
    </div>
</div>

<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
  ${tempDisasterAmountLineChart(monthlyTemperatureChanges, totalDisasterPerYear, correlation)}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${barChart(disasterCounts, "Amount of disasters", "numberOfDisasters", "disaster", {colorList: selectedAndColor})}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${barChart(disasterCounts, "Deaths per disaster", "deaths", "disaster", {colorList: selectedAndColor}, "numberOfDisasters")}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${barChart(disasterCounts, "Affected per disaster", "affected", "disaster", {colorList: selectedAndColor}, "numberOfDisasters")}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${barChart(disasterCounts, "Injured per disaster", "injured", "disaster", {colorList: selectedAndColor}, "numberOfDisasters")}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${correlationMatrix(correlations)}
  </div>
</div>
---
