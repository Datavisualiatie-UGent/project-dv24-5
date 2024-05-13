---
title: Wildfire
toc: false
---

# Wildfire

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
  ["Wildfire"]
);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000,
  ["Wildfire"]
);
const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  filterBefore2000,
  ["Wildfire"]
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
  ["Wildfire"]
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  filterBefore2000,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  filterBefore2000,
  ["Wildfire"]
);

const lengthDisaster = getDateLengthOrMagnitudeDisaster(
  emdat_disasters,
  filterBefore2000,
  "Wildfire"
);
```

```js
import {
  lineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
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

const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000,
  "Wildfire"
);

import { barChart } from "./components/bar_chart.js";
```

<div>
    <p><h3></h3>A <b>wildfire</b> is defined as any uncontrolled and non-prescribed combustion or burning of plants in a natural setting such as a forest, grassland, brush land or tundra, which consumes natural fuels and spreads based on environmental conditions (e.g., wind, or topography). Wildfires can be triggered by lightning,  and extreme temperatures or human actions. There have been <b>384 occurences of wildfires</b> between 1988 and 2022.</p>
</div>

<div>
    <p><h3></h3><i>Below you can filter if you want to include the wildfires before the year 2000:</i></p>
</div>

```js
const before2000 = view(
  Inputs.checkbox(
    ["Include wildfires before year 2000"],
    { label: "", value: ["Include wildfires before year 2000"] },
    ""
  )
);
```

```js
const filterBefore2000 = before2000.length === 0;
```

---

<div>
    <p><h3>Most deadly wildfires</h3>Disasters pose significant dangers and often result in fatalities. The following chart illustrates the locations and timing of the most deadly wildfires. The length of the bar is equal to the total amount of deaths and the colour represents the magnitude. If you wish to explore the deadliest incidents in a particular country, you can utilize the filter. It is important to note that the filter only includes countries with recorded fatal occurrences.</p>
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
                "color":"reds",
                "map": "year"
            }, width}))}
    </div>
</div>

---

<h3> Wildfires per country </h3>

<div class="grid grid-cols-2">
    <div>
        ${fullWorldCheckbox}
        ${logScaleCheckbox}
        ${fullWorld ? "" : longitudeSlider}
        <p>The colour of a country represents the amount of wildfires that occurred in this country. By hovering over a country, you can see the name of the country and the exact amount of occurrences.</p>
        <p>When certain countries have a lot more occurrences than the average, it's tough to distinguish between countries with average occurrences. To understand how these average countries compare to each other more clearly, using a logarithmic scale can help.</p>
    </div>
    <div class="">
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, countries, {
            width, 
            longitude: longitude,
            fullWorld: fullWorld,
            disaster: "Wildfire",
            label: "Total wildfires",
            scheme: "reds",
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
    <h3>Correlation with temperature</h3>
    There isn't any indicator that suggests that there are more wildfires in the world each year. This, however, doesn't mean that climate change doesn't have any effect on the wildfires.
    </p>
  </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    <p>
    <h3>Duration of wildfires</h3>
    The duration of wildfires increased in the last couple of years. It becomes more and more difficult to extinguish these fires. The causes for wildifres can be human error but could also be linked to other disasters such as droughts. Long periods of no rain can cause wildfires to exist and makes it more difficult to extinguish these fires. These wildfires have a big impact on natural wildlife and biodiversity. 
    </p>
  </div>
  <div>
    ${resize(width => scatterChart(lengthDisaster, {xlabel:"date", x_val:"date", y:"length", ylabel:"Duration (days)", scheme:{map: "length", color: "reds"}, channels: {Country: "country", Year: "year", Length: "length"}, tip:{Year: d => d.getFullYear(), Length: d => `${d} days`, Country: true, y:false, x:false, stroke:false}, width:width}))}
  </div>
</div>

---
