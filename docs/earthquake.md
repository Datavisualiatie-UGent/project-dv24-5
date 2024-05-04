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
  getDisastersPerYear,
  getConfirmedAffectedPersonsPerYear,
  getDisastersAmountPerCountryPerYear,
  getTypeCorrelations,
  getAverageLengthOfDisasterPerYear,
  getTotalDisastersPerCountry,
} from "./process_data.js";


// Get disasters
const emdat_disasters = await FileAttachment("data/emdat_disasters.csv").csv({
  typed: true,
  headers: true,
});

const groupedDisasters = getGroupedDisasters(emdat_disasters, ["Earthquake"]);
const disastersPerYear = getDisastersPerYear(emdat_disasters, ["Earthquake"]);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  ["Earthquake"]
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
```

```js
import { lineChart } from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

```js
const countries = await FileAttachment("data/countries.json").json();
const totalDisastersPerCountry = getTotalDisastersPerCountry(emdat_disasters);

const longitudeSlider = Inputs.range([-180, 180], {step: 1, label: "Longitude"});
const longitude = Generators.input(longitudeSlider);

const fullWorldCheckbox = Inputs.checkbox([""], {label: "Full world view"})
const fullWorld = Generators.input(fullWorldCheckbox);

import { choroplethWorldMap, scatterWorldMap } from "./components/world_map_chart.js";
```
## Earthquakes per country

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${longitudeSlider}
        <p>Tekstje over welke gebieden het meest getroffen worden?</p>
    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld.includes(""),
            disaster: "Earthquake",
            label: "Total earthquakes",
            scheme: "greens",
        }))}
    </div>
</div>

```js
const longitudeSlider2 = Inputs.range([-180, 180], {step: 1, label: "Longitude"});
const longitude2 = Generators.input(longitudeSlider2);

const fullWorldCheckbox2 = Inputs.checkbox([""], {label: "Full world view"})
const fullWorld2 = Generators.input(fullWorldCheckbox2);
```

## Most deadly earthquakes
<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox2}
        ${longitudeSlider2}
        <p>Tekstje over welke gebieden het meest getroffen worden?</p>
    </div>
    <div>
        ${resize((width) => scatterWorldMap(groupedDisasters, countries, {
            width, 
            label: "Total Deaths", 
            longitude: longitude2, 
            fullWorld: fullWorld2.includes("")
        }))}
    </div>
</div>



<div class="grid grid-cols-2">
    <div class="card">
        ${lineChart(disastersPerYear, "disasters", "Amount of disasters", selectedAndColor)}
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

