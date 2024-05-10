---
title: Earthquake
toc: false
---

# Earthquake

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
  getDisastersPerYearAsInt,
  getConfirmedAffectedPersonsPerYear,
  getDisastersAmountPerCountryPerYear,
  getTypeCorrelations,
  getCorrelationBetweenTwoLists,
  getAverageLengthOfDisasterPerYear,
  getTotalDisastersPerCountry,
  getMonthlyTemperatureChanges,
  getYearlyTemperatureChanges,
  getDisasterMagnitudes,
  getMostDeadlyDisasters,
  getInfoDisaster,
  getDateLengthOrMagnitudeDisaster,
} from "./process_data.js";


// Get disasters
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

// Get disasters per country
const totalDisastersPerCountry = getTotalDisastersPerCountry(emdat_disasters);
import {
  choroplethWorldMap,
  scatterWorldMap,
} from "./components/world_map_chart.js";

const groupedDisasters = getGroupedDisasters(emdat_disasters, ["Earthquake"]);
const disastersPerYear = getDisastersPerYearAsInt(emdat_disasters, ["Earthquake"]);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  ["Earthquake"]
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
  ["Earthquake"]
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  ["Earthquake"]
);
const disasterMagnitudes = getDisasterMagnitudes(emdat_disasters, "Earthquake");
const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  "Earthquake"
);

const infoDisaster = getInfoDisaster(emdat_disasters, "Earthquake");
const lengthDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  "Earthquake",
  false
);
```

```js
import { lineChart, tempDisasterAmountLineChart } from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { barChart } from "./components/bar_chart.js";
import { scatterChart } from "./components/scatter_chart.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

```js

```


## Most deadly earthquakes

```js
const availableCountries = [
    "all",
    ...new Set(infoDisaster.map((d) => d["country"])),
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
        ${resize((width) => barChart(infoDisaster.filter(d => selectedCountries.includes("all") ? true : selectedCountries.includes(d["country"])).slice(0, 15),
            {"scheme":{
                "color":"greens",
                "map": "magnitude",
                "unit": "Richter",
            }, width}))}
    </div>
</div>

```js
const countries = await FileAttachment("data/countries.json").json();

const longitudeSlider = Inputs.range([-180, 180], {step: 1, label: "Longitude"});
const longitude = Generators.input(longitudeSlider);

const fullWorldCheckbox = Inputs.toggle({label: "Full world view", value: true})
const fullWorld = Generators.input(fullWorldCheckbox);

const logScaleCheckbox = Inputs.toggle({label: "Log scale", value: false})
const logScale = Generators.input(logScaleCheckbox);
```
## Earthquakes per country

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>In the case that some country(s) have significantly more occurrences than the average amount, the difference between countries with an average amount vanishes. </p>
        <p>To get a better idea of how these countries with an average amount relate to each other, you can use the logarithmic scale.</p>
    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld,
            disaster: "Earthquake",
            label: "Total earthquakes",
            scheme: "greens",
            logScale: logScale
        }))}
    </div>
</div>

```js
const longitudeSlider2 = Inputs.range([-180, 180], {step: 1, label: "Longitude"});
const longitude2 = Generators.input(longitudeSlider2);

const fullWorldCheckbox2 = Inputs.toggle({label: "Full world view", value: false})
const fullWorld2 = Generators.input(fullWorldCheckbox2);

```

## Most deadly earthquakes
<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox2}
        ${fullWorld2 ? "" : longitudeSlider2}
        <p>The disks represent the total amount of deaths. Hover over them to see the exact number and what the magnitude of the eartquake was.</p>
    </div>
    <div>
        ${resize((width) => scatterWorldMap(groupedDisasters, countries, {
            width, 
            label: "Total Deaths", 
            longitude: longitude2, 
            fullWorld: fullWorld2
        }))}
    </div>
</div>

<div class="grid grid-cols-2">
    <div class="card">
      ${scatterChart(lengthDisaster, "date", "date", "magnitude", {map: "magnitude", color: "reds"})}
    </div>
</div


<div class="grid" style="grid-auto-rows: 600px;">
  <div class="card">
    ${tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation)}
  </div>
</div>

<div class="grid grid-cols-2">
    <div class="card">
        ${lineChart(disastersPerYear, "disasters", "Amount of disasters", selectedAndColor)}
    </div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${lineChart(averageLengthOfDisasterPerYear, "avgLength", "Length of disaster", selectedAndColor)}
  </div>
</div>


<div class="grid grid-cols-2" style="grid-auto-rows: 600px;">
  <div class="card">
    ${lineChart(disasterMagnitudes, "magnitude", "Magnitude (richter)", selectedAndColor)}
  </div>
</div>

