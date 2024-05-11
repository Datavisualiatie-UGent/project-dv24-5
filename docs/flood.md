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
  getDisastersPerYearAsInt,
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

const groupedDisasters = getGroupedDisasters(
  emdat_disasters,
  filterBefore2000,
  ["Flood"]
);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000,
  ["Flood"]
);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  filterBefore2000,
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
  filterBefore2000,
  ["Flood"]
);

const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  ["Flood"]
);
const disasterMagnitudes = getDisasterMagnitudes(
  emdat_disasters,
  filterBefore2000,
  "Flood"
);
const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000,
  "Flood"
);
const mostExpensiveDisasters = getMostExpensiveDisasters(
  emdat_disasters,
  filterBefore2000,
  "Flood"
);
const lengthDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  filterBefore2000,
  "Flood"
);

const magnitudeDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  filterBefore2000,
  "Flood",
  false
);
```

```js
import {
  lineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { barChart } from "./components/bar_chart.js";
import { scatterChart, logScatterChart } from "./components/scatter_chart.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

```js
const countries = await FileAttachment("data/countries.json").json();
const totalDisastersPerCountry = getTotalDisastersPerCountry(
  emdat_disasters,
  filterBefore2000,
  ["Flood"]
);

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

```js
const before2000 = view(
  Inputs.checkbox(
    ["include"],
    { label: "Include floods before year 2000", value: ["include"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
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

There is a strong indication that the amount of floods and the global temperature rise due to climate change are correlated when plotting the data from 1988 onwards. This correlation however becomes negligible when plotting the data from 2000.

<div class="grid" style="grid-auto-rows: 600px;">
    ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation, width))}
</div>

Below are 2 scatter charts plotted: The first scatter chart displays the duration of the flood. There can be an increase in the duration of floods observed, this is a potential gravity indicator which means that floods are often bigger & more catastrofic.

<div>
    ${resize(width => scatterChart(lengthDisaster, {xlabel:"date", x_val:"date", y: "length", scheme:{map: "length", color: "blues"}, channels: {Country: "country", Year: "year", Length: "length"}, tip:{Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false}, width:width}))}
</div>

The second scatter chart displays the magnitude, which for floods is the affected area size, in a logarithmic manner. The constantly rising regression line shows that the area size becomes larger.

<div>
    ${resize(width => logScatterChart(magnitudeDisaster, {xlabel:"date", x_val:"date", y: "magnitude", scheme:{map: "magnitude", color: "blues"}, channels: {Country: "country", Year: "year", Magnitude: "magnitude"}, tip:{Year: d => d.getFullYear(), Magnitude: d => `${d} km²`, Country: true, y:false, x:false, stroke:false}, width:width}))}
</div>
---
