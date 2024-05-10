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

.hero h3 {
  margin: 0;
  max-width: 34em;
  font-size: 10px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
}

.hero p {
  max-width: 180em;
  /* font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5; */
  /* color: var(--theme-foreground-muted); */
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Global Disasters</h1>
  <h2>Relating the increase in global disasters to climate change.</h2>
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
const disastersPerYear = getDisastersPerYearAsInt(emdat_disasters);
const totalDisasterPerYear = getTotalDisastersPerYear(disastersPerYear);

const correlation = getCorrelationBetweenTwoLists(disastersPerYear.map(e => e["disasters"]), yearlyTemperatureChanges.map(e => e["temp"]));

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
import { sunBurst } from "./components/sunburst.js";
import { treeMap } from "./components/tree_map.js";
```

---
<div class="hero">
  <p>In recent decades, out planet has borne witness to an inmense increase in the global temperature. The result of global warming can easily be seen in the increase of the severity and amount of disasters. Our goal is to see how strong this correlation is between the rising temperature and the impact of disasters.</p>
  <p>To this end we used EM-DAT, a dataset created by Centre for Research on the Epidemiology of Disasters. This dataset contains data on the amount, severity and impact of disasters since 1900.</p>
</div>

---

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


<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${sunBurst(groupedDisasters, selectedDisasters)}
  </div>
  <div><h3>The dataset</h3><p>The dataset contains 26000 disasters starting from 1990. These entries contain a wide range of different disasters. EM-DAT has reported on everything from Earthquakes to Hopper infestations. We are focussing on the climate disasters. This means we're only using around 15000 of the total entries. The organization also states that the dataset is subject to time bias. This means that the dataset suffers from unequal reporting quality and coverage over time.</p><p>EM-DAT has their own definition of a disaster: "A situation or event which overwhelms local capacity, necessitating a request to the national or international level for external assistance; an unforeseen and often sudden event that causes great damage, destruction, and human suffering." The entry requirements for a disastter are as follows: 1) >= 10 deaths 2) >= 100 affected 3) A call to international assistance.</p><p>As for the classification of disasters, this can be seen in the chart on the right. Each disaster has a type and a subtype, the size of the slice corresponds to how often the disasters appear. The definition of each disaster can be check by hovering over it. We can inmediatly see that floods and storms are the most common disasters.</p></div>
</div>

---

<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
  ${tempDisasterAmountLineChart(monthlyTemperatureChanges, totalDisasterPerYear, correlation)}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => barChart(disasterCounts, {label: "Occurrences", x_val: "numberOfDisasters", y_val: "disaster", colorList: selectedAndColor, width}))}
  </div>
  <div class="card">
    ${resize((width) => barChart(disasterCounts, {label: "Total Deaths", colorList: selectedAndColor, width}))}
  </div>
</div>

---
