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

// Get disasters per country
const totalDisastersPerCountry = getTotalDisastersPerCountry(
  emdat_disasters,
  filterBefore2000
);
import {
  choroplethWorldMap,
  scatterWorldMap,
} from "./components/world_map_chart.js";

const groupedDisasters = getGroupedDisasters(
  emdat_disasters,
  filterBefore2000,
  ["Earthquake"]
);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000,
  ["Earthquake"]
);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  filterBefore2000,
  ["Earthquake"]
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
  ["Earthquake"]
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  filterBefore2000,
  ["Earthquake"]
);
const disasterMagnitudes = getDisasterMagnitudes(
  emdat_disasters,
  filterBefore2000,
  "Earthquake"
);
const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000,
  "Earthquake"
);

const infoDisaster = getInfoDisaster(
  emdat_disasters,
  filterBefore2000,
  "Earthquake"
);
const lengthDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  filterBefore2000,
  "Earthquake",
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
import { scatterChart } from "./components/scatter_chart.js";
```

```js
const selectedAndColor = getDisastersPerColor(Object.keys(groupedDisasters));
```

<div>
    <p><h3></h3>An <b>earthquake</b> is a sudden movement of a block of the Earth’s crust along a geological fault and associated ground shaking. There have been <b>925 occurences of earthquake</b> between 1988 and 2022.</p>
</div>

<div>
    <p><h3></h3><i>Below you can filter if you want to include the earthquakes before the year 2000:</i></p>
</div>

```js
const before2000 = view(
  Inputs.checkbox(
    ["Include earthquakes before year 2000"],
    { label: "", value: ["Include earthquakes before year 2000"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
```

---

<div>
    <p><h3>Most deadly earthquakes</h3>Disasters pose significant dangers and often result in fatalities. The following chart illustrates the locations and timing of the most deadly earthquakes. The length of the bar is equal to the total amount of deaths and the colour represents the magnitude. If you wish to explore the deadliest incidents in a particular country, you can utilize the filter. It is important to note that the filter only includes countries with recorded fatal occurrences.</p>
</div>

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
                "color":"purples",
                "map": "magnitude",
                "unit": "Richter",
            }, width}))}
    </div>
</div>

```js
const longitudeSlider2 = Inputs.range([-180, 180], {
  step: 1,
  label: "Longitude",
});
const longitude2 = Generators.input(longitudeSlider2);

const fullWorldCheckbox2 = Inputs.toggle({
  label: "Full world view",
  value: true,
});
const fullWorld2 = Generators.input(fullWorldCheckbox2);
```

---

<div class="grid grid-cols-2">
    <div>
        <p>This chart gives you a better idea of where the most deadly earthquakes occurred. The disk size represent the total amount of deaths and you can hover over them to see the exact number and what the magnitude of the earthquake was.</p>
        <p>It is clear to see that with the exception of Haiti, all the most deadly earthquakes occur in Asia. You can also notice the <a href="https://en.wikipedia.org/wiki/Ring_of_Fire">ring of fire</a> on this world map.</p>
    </div>
    <div>
        ${fullWorldCheckbox2}
        ${fullWorld2 ? "" : longitudeSlider2}
        ${resize((width) => scatterWorldMap(groupedDisasters, countries, {
            width, 
            label: "Total Deaths", 
            longitude: longitude2, 
            fullWorld: fullWorld2
        }))}
    </div>
</div>

```js
const countries = await FileAttachment("data/countries.json").json();

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
```

---

<h3> Earthquakes per country </h3>

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>The colour of a country represents the amount of earthquakes that occurred in this country. By hovering over a country, you can see the name of the country and the exact amount of occurrences.</p>
        <p>When certain countries have a lot more occurrences than the average, it's tough to distinguish between countries with average occurrences. To understand how these average countries compare to each other more clearly, using a logarithmic scale can help.</p>
    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld,
            disaster: "Earthquake",
            label: "Total earthquakes",
            scheme: "purples",
            logScale: logScale
        }))}
    </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    ${resize( width => tempDisasterAmountLineChart(monthlyTemperatureChanges, disastersPerYear, correlation, width))}
  </div>
  <div>
    <p>
    <h3>Climate change</h3>
    There is no correlation between the amount of disasters and the global temperature rise. In the EMDAT-dataset there also is not any indication that the earthquakes are getting more intense. This doesn't mean that this can't change in the future since the weight of watter on the earths crust is increasing due to the melting of the ice caps and glaciers. This could lead to more earthquakes especially in the regions that are already seismically active (e.g. the ring of fire).
    </p>
  </div>
</div>

---
