---
title: Drought
toc: false
---

# Drought

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
  getDateLengthOrMagnitudeDisaster,
  getMonthlyTemperatureChanges,
  getYearlyTemperatureChanges,
  getTotalDisastersPerCountry,
  getAreaPerCountry,
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

const groupedDisasters = getGroupedDisasters(
  emdat_disasters,
  filterBefore2000,
  ["Drought"]
);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000,
  ["Drought"]
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
  ["Drought"]
);
const dateLength = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  filterBefore2000,
  "Drought"
);
```

```js
import {
  lineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { scatterChart } from "./components/scatter_chart.js";
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

```js
const countries = await FileAttachment("data/countries.json").json();
const totalDisastersPerCountry = getTotalDisastersPerCountry(
  emdat_disasters,
  filterBefore2000
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

const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000,
  "Drought"
);

import { barChart } from "./components/bar_chart.js";
```

```js
const before2000 = view(
  Inputs.checkbox(
    ["include"],
    { label: "Include droughts before year 2000", value: ["include"] },
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
            {"scheme":{
                "color":"oranges",
                "map": "year"
            }, width}))}
    </div>
</div>

## Droughts per country

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
            disaster: "Drought",
            label: "Total droughts",
            scheme: "blues",
            logScale: logScale
        }))}
    </div>
</div>

## Climate change

Below is the chart with the temperature increase of the world due to climate change together with the amount of droughts per year. As is visible, there isn't a direct correlation between the amount of droughts and the constantly increasing temperature. In 2016, there were a lot of droughts when the global temperature also increased to an all time high.

<div>
  ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation, width))}
</div>

## Length of droughts

Due to climate change, the length of the droughts has also increased dramatically. While in the 2000s there weren't a lot of droughts that spanned for over a year. In recent years more and more droughts last longer and longer. While the amount of droughts in the world hasn't increased, the length and thus the severity of droughts keeps getting bigger. This leads to more deaths and more people affected.

<div>
    ${resize(width => scatterChart(dateLength, {xlabel:"date", x_val:"date", y:"length", ylabel:"Duration (days)", scheme: {map: "length", color: "oranges"}, channels: {Country: "country", Year: "year", Length: "length"}, tip: {Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false, date:false}, width:width}))}
</div>
---
