---
title: Storm
toc: false
---

# Storm

<!-- Load and transform the data -->
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

```js
import {
  getGroupedDisasters,
  getDisastersPerYear,
  getConfirmedAffectedPersonsPerYear,
  getDisastersAmountPerCountryPerYear,
  getTypeCorrelations,
  getCorrelationBetweenTwoLists,
  getAverageLengthOfDisasterPerYear,
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

const groupedDisasters = getGroupedDisasters(emdat_disasters, ["Storm"]);
const disastersPerYear = getDisastersPerYear(emdat_disasters, ["Storm"]);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  ["Storm"]
);

const correlation = getCorrelationBetweenTwoLists(disastersPerYear.map(e => e["disasters"]), yearlyTemperatureChanges.map(e => e["temp"]));

const counts = Object.keys(groupedDisasters)
  .reduce((acc, key) => {
    acc.push({ disaster: key, amount: groupedDisasters[key].length });
    return acc;
  }, [])
  .sort((a, b) => b.amount - a.amount);

const totalCount = counts.reduce((acc, dic) => acc + dic["amount"], 0);
const disastersAmountPerCountryPerYear = getDisastersAmountPerCountryPerYear(
  emdat_disasters,
  ["Storm"]
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  ["Storm"]
);
```

```js
import { lineChart,tempDisasterAmountLineChart } from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
  ${tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation)}
  </div>
</div>

<div class="grid grid-cols-2">
    <div class="card">
        ${lineChart(confirmedAffectedPersonsPerYear, "deaths", "Amount of deaths", selectedAndColor)}
    </div>
   <div class="card">
        ${lineChart(confirmedAffectedPersonsPerYear, "injured", "People injured", selectedAndColor)}
    </div>
</div>

<div class="grid">
     <div class="card">
        ${lineChart(confirmedAffectedPersonsPerYear, "affected", "People affected", selectedAndColor)}
    </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${lineChart(averageLengthOfDisasterPerYear, "avgLength", "Length of disaster", selectedAndColor)}
  </div>
</div>

---
