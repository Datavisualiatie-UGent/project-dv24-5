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

<div>
    <p><h3></h3>A <b>drought</b> is an extended period of unusually low precipitation that produces a shortage of water for people, animals, and plants. Drought is different from most other hazards in that it develops slowly, sometimes even over the years, and its onset is generally difficult to detect. Drought is not solely a physical phenomenon because its impacts can be exacerbated by human activities and water supply demands. Drought is therefore often defined both conceptually and operationally. Operational definitions of drought, i.e., the degree of precipitation reduction that constitutes a drought, vary by locality, climate, and environmental sector. There have been <b>547 occurences of droughts</b> between 1988 and 2022.</p>
</div>

<div>
    <p><h3></h3><i>Below you can filter if you want to include the droughts before the year 2000:</i></p>
</div>

```js
const before2000 = view(
  Inputs.checkbox(
    ["Include droughts before year 2000"],
    { label: "", value: ["Include droughts before year 2000"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
```

---

<div>
    <p><h3>Most deadly droughts</h3>Disasters pose significant dangers and often result in fatalities. The following chart illustrates the locations and timing of the most deadly droughts. The length of the bar is equal to the total amount of deaths and the colour represents the magnitude. If you wish to explore the deadliest incidents in a particular country, you can utilize the filter. It is important to note that the filter only includes countries with recorded fatal occurrences.</p>
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
                "color":"oranges",
                "map": "year"
            }, width}))}
    </div>
</div>

---

<h3> Droughts per country </h3>

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>The colour of a country represents the amount of droughts that occurred in this country. By hovering over a country, you can see the name of the country and the exact amount of occurrences.</p>
        <p>When certain countries have a lot more occurrences than the average, it's tough to distinguish between countries with average occurrences. To understand how these average countries compare to each other more clearly, using a logarithmic scale can help.</p>
    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld,
            disaster: "Drought",
            label: "Total droughts",
            scheme: "oranges",
            logScale: logScale
        }))}
    </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    <p><h3>Climate change</h3>The chart to the right displays the temperature increase of the world due to climate change together with the amount of droughts per year. As is visible, there isn't a direct correlation between the amount of droughts and the constantly increasing temperature. What is noticable is that the amount of droughts has increased compared to the early 1990s. In 2016, the amount of droughts increased to an all time high.</p>
  </div>
  <div>
    ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation, width))}
  </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    ${resize(width => scatterChart(dateLength, {xlabel:"date", x_val:"date", y:"length", ylabel:"Duration (days)", scheme: {map: "length", color: "oranges"}, channels: {Country: "country", Year: "year", Length: "length"}, tip: {Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false, date:false}, width:width}))}
  </div>
  <div>
    <p>
    <h3>Duration of droughts</h3>
    Due to climate change, the duration of the droughts has also increased dramatically. While in the 2000s there weren't a lot of droughts that spanned for over a year. In recent years more and more droughts last longer and longer. The duration and thus the severity of droughts keeps getting bigger. This leads to more deaths and more people affected.
    </p>
  </div>
</div>

---
