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
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

<div>
    <p><h3></h3>A <b>flood</b> is a general term for the overflow of water from a stream channel onto normally dry land in the floodplain (riverine flooding), higher-than-normal levels along the coast (coastal flooding) and in lakes or reservoirs as well as ponding of water at or near the point where the rain fell (flash floods). There have been <b>4834 occurences of floods</b> between 1988 and 2022.</p>
</div>

<div>
    <p><h3></h3><i>Below you can filter if you want to include the floods before the year 2000:</i></p>
</div>

```js
const before2000 = view(
  Inputs.checkbox(
    ["Include floods before year 2000"],
    { label: "", value: ["Include floods before year 2000"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
```

---

<div>
    <p><h3>Most deadly floods</h3>Disasters pose significant dangers and often result in fatalities. The following chart illustrates the locations and timing of the most deadly droughts. The length of the bar is equal to the total amount of deaths and the colour represents the magnitude. If you wish to explore the deadliest incidents in a particular country, you can utilize the filter. It is important to note that the filter only includes countries with recorded fatal occurrences.</p>
</div>

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

---

<h3> Floods per country </h3>

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>The colour of a country represents the amount of floods that occurred in this country. By hovering over a country, you can see the name of the country and the exact amount of occurrences.</p>
        <p>When certain countries have a lot more occurrences than the average, it's tough to distinguish between countries with average occurrences. To understand how these average countries compare to each other more clearly, using a logarithmic scale can help.</p>
    </div>
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

---

<div class="grid grid-cols-2">
  <div>
    <h3>Affected area size of floods</h3>
    There is a strong indication that the amount of floods and the global temperature rise due to climate change are correlated when plotting the data from 1988 onwards. This correlation however becomes negligible when plotting the data from 2000. Still it is visible that there is a huge increase in the amount of floods per year from the 1990s to more recent years.
    </p>
  </div>
  <div>
    ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation, width))}
  </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
  <p>
    <h3>Affected area size of floods</h3>
    This chart displays the affected area size in a logarithmic manner. The constantly rising regression line shows that the affected area size of floods becomes larger. Each year a larger area is affected by floods, this has a disasterous impact on the environment and the people living in these areas. An example of such a major flood that happened in our region was the <a href="https://en.wikipedia.org/wiki/2021_European_floods#:~:text=Floods%20started%20in%20Belgium%2C%20Germany,rivers%20to%20burst%20their%20banks">European floods in 2021</a>.
    </p>
  </div>
  <div>
    ${resize(width => logScatterChart(magnitudeDisaster, {xlabel:"date", x_val:"date", y: "magnitude", ylabel:"Area size (km²)", scheme:{map: "magnitude", color: "blues"}, channels: {Country: "country", Year: "year", Magnitude: "magnitude"}, tip:{Year: d => d.getFullYear(), Magnitude: d => `${d} km²`, Country: true, y:false, x:false, stroke:false}, width:width}))}
  </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    ${resize(width => scatterChart(lengthDisaster, {xlabel:"date", x_val:"date", y: "length", ylabel:"Duration (days)", scheme:{map: "length", color: "blues"}, channels: {Country: "country", Year: "year", Length: "length"}, tip:{Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false}, width:width}))}
  </div>
  <div>
    <p>
    <h3>Duration of floods</h3>
    This scatter plot displays the duration of the flood. An increase in the duration of floods can be observed. This is a potential gravity indicator which means that floods are often bigger and more catastrofic. This can also indicate how much water is being released by the flood. How longer a flood lasts, the more water that has to be drained by the soil.
    </p>
  </div>
</div>

---
