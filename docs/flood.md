---
title: Flood
toc: false
---

# Flood

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
  getDisasterMagnitudes,
  getMonthlyTemperatureChanges,
  getYearlyTemperatureChanges,
  getMostDeadlyDisasters,
  getMostExpensiveDisasters,
  getDateLengthOrMagnitudeDisaster,
  getTotalDisastersPerCountry,
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

const monthlyTemperatureChanges = getMonthlyTemperatureChanges(temperatures);
const yearlyTemperatureChanges = getYearlyTemperatureChanges(temperatures);

const groupedDisasters = getGroupedDisasters(emdat_disasters, ["Flood"]);
const disastersPerYear = getDisastersPerYear(emdat_disasters, ["Flood"]);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  ["Flood"]
);

const correlation = getCorrelationBetweenTwoLists(
  disastersPerYear.map((e) => e["disasters"]),
  yearlyTemperatureChanges.map((e) => e["temp"])
);

const counts = Object.keys(groupedDisasters)
  .reduce((acc, key) => {
    acc.push({ disaster: key, amount: groupedDisasters[key].length });
    return acc;
  }, [])
  .sort((a, b) => b.amount - a.amount);

const totalCount = counts.reduce((acc, dic) => acc + dic["amount"], 0);
const disastersAmountPerCountryPerYear = getDisastersAmountPerCountryPerYear(
  emdat_disasters,
  ["Flood"]
);

const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  ["Flood"]
);
const disasterMagnitudes = getDisasterMagnitudes(emdat_disasters, "Flood");
const mostDeadlyDisasters = getMostDeadlyDisasters(emdat_disasters, "Flood");
const mostExpensiveDisasters = getMostExpensiveDisasters(
  emdat_disasters,
  "Flood"
);
const lengthDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  "Flood"
);
```

```js
import {
  lineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { barChart } from "./components/bar_chart.js";
import { scatterChart } from "./components/scatter_chart.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

```js
const countries = await FileAttachment("data/countries.json").json();
const totalDisastersPerCountry = getTotalDisastersPerCountry(emdat_disasters);

const longitudeSlider = Inputs.range([-180, 180], {
  step: 1,
  label: "Longitude",
});
const longitude = Generators.input(longitudeSlider);

const fullWorldCheckbox = Inputs.toggle({
  label: "Full world view",
  value: true,
});
const fullWorld = Generators.input(fullWorldCheckbox);

const logScaleCheckbox = Inputs.toggle({ label: "Log scale", value: false });
const logScale = Generators.input(logScaleCheckbox);

import { choroplethWorldMap } from "./components/world_map_chart.js";
```

## Most deadly floods

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
            {"scheme":{
                "color":"blues",
                "map": "year"
            }, width}))}
    </div>
</div>

## Floods per country

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>In the case that some country(s) have significantly more occurrences than the average amount, the difference between countries with an average amount vanishes. </p>
        <p>To get a better idea of how these countries with an average amount relate to each other, you can use the logarithmic scale.</p>    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld,
            disaster: "Flood",
            label: "Total floods",
            scheme: "blues",
            logScale: logScale
        }))}
    </div>
</div>

<div class="grid grid-cols-2">
    <div class="card">
        ${scatterChart(lengthDisaster, "date", "date", "length", {map: "length", color: "blues"}, {channels: {Country: "country", Year: "year", Length: "length"}, tip:{Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false}})}
    </div>
</div>

<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
    ${tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation)}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${lineChart(averageLengthOfDisasterPerYear, "avgLength", "Length of disaster", selectedAndColor)}
  </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${lineChart(disasterMagnitudes, "magnitude", "Magnitude (km2)", selectedAndColor)}
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
