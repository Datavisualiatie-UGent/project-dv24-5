---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 2rem 0 2rem;
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
  getYearlyTemperatureChanges,
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

const groupedDisasters = getGroupedDisasters(emdat_disasters, filterBefore2000);
const disastersPerYear = getDisastersPerYearAsInt(
  emdat_disasters,
  filterBefore2000
);
const totalDisasterPerYear = getTotalDisastersPerYear(
  disastersPerYear,
  filterBefore2000
);

const correlation = getCorrelationBetweenTwoLists(
  disastersPerYear.map((e) => e["disasters"]),
  yearlyTemperatureChanges.map((e) => e["temp"])
);

const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
  emdat_disasters,
  filterBefore2000
);

const disasterCounts = getDisasterCounts(emdat_disasters, filterBefore2000);

const disastersAmountPerCountryPerYear = getDisastersAmountPerCountryPerYear(
  emdat_disasters,
  filterBefore2000
);
const correlations = getTypeCorrelations(
  disastersAmountPerCountryPerYear,
  emdat_disasters
);
const averageLengthOfDisasterPerYear = getAverageLengthOfDisasterPerYear(
  emdat_disasters,
  filterBefore2000
);

const mostDeadlyDisasters = getMostDeadlyDisasters(
  emdat_disasters,
  filterBefore2000
);
```

```js
const bundledDisasters = bundleDisasters(disastersPerYear);
```

```js
import { bumpChart } from "./components/bump_chart.js";
import { areaChart } from "./components/area_chart.js";
import {
  lineChart,
  tempLineChart,
  tempDisasterAmountLineChart,
} from "./components/line_chart.js";
import { correlationMatrix } from "./components/correlation_matrix.js";
import { barChart } from "./components/bar_chart.js";
import { getDisastersPerColor } from "./components/color_matching.js";
import { sunBurst } from "./components/sunburst.js";
import { treeMap } from "./components/tree_map.js";
```

---
<div class="hero">
  <p>In recent decades, our planet has borne witness to an immense increase in the global temperature. The result of global warming can easily be seen in the increase in the severity and frequency of disasters. Our goal is to see how strong the correlation is between the rising temperature and the impact of disasters.</p>
  <p>To this end, we used EM-DAT, a dataset created by the Centre for Research on the Epidemiology of Disasters. This dataset contains data on the amount, severity, and impact of disasters since 1900.</p> 
  <p>We demonstrate the correlation between natural disasters and global temperature by visualizing the dataset in specific ways. First, the natural disasters that are likely to be affected by the rising global temperature were chosen. For each of these disasters, we document some interesting aspects and examine whether there is a correlation.</p>
</div>

```js
const filterBefore2000 = before2000.length === 0;
```

---
<div class="grid grid-cols-2">
  <div>
    ${sunBurst(groupedDisasters, selectedDisasters)}
  </div>
  <div><h3>The dataset</h3><p>The dataset contains 26,000 disasters starting from 1990. These entries contain a wide range of different disasters. EM-DAT has reported on everything from Earthquakes to Hopper infestations. We are focusing on the climate disasters. This means we're only using around 15,000 of the total entries. The organization also states that the dataset is subject to time bias. This means that the dataset suffers from unequal reporting quality and coverage over time. We can mitigate this bias by filtering the dataset to only include data after the year 1988.</p>
  <p>EM-DAT has its own definition of a disaster: "A situation or event which overwhelms local capacity, necessitating a request to the national or international level for external assistance; an unforeseen and often sudden event that causes great damage, destruction, and human suffering." A Disaster can be entered into the dataset if it has one of the following requirements: 
  
  1) ≥ 10 deaths 
  2) ≥ 100 affected 
  3) A call for international assistance</p>
  <p>As for the classification of disasters, this can be seen in the chart on the left. Each disaster has a type and a subtype; the size of the slice corresponds to how often the disaster appears. The definition of each disaster can be checked by hovering over it. We can immediately see that floods and storms are the most common disasters. Comparing specific disasters can be done by selecting them below.</p>
  </div>
</div>

```js
const before2000 = true;
// const before2000 = view(
//   Inputs.checkbox(
//     ["include"],
//     { label: "Include disasters before year 2000", value: ["include"] },
//     ""
//   )
// );
```

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

<div class="grid grid-cols-2">
  <div>
    <p><h3>Trends</h3>The overall trend in the number of disasters can be seen in the graph on the right. We can clearly see an increase in disasters, especially from 1995 to 2000. That said, there are some types of disasters that remain consistent throughout the years. Earthquakes, Mass Movements, and Droughts barely change. Other types of disasters, like Floods, contribute to this overall increasing trend. Focusing on specific disasters can be done by selecting the corresponding checkboxes.</p>
  </div>
  <div>
        ${areaChart(disastersPerYear.filter(disaster => selectedDisasters.includes(disaster["disaster"])),
            "disasters", "Amount of disasters", selectedAndColor)}
  </div>
</div>

---

<div>
    ${resize((width) => barChart(disasterCounts, {label: "Total Deaths", "catMapping": {
              "domain": selectedAndColor[0],
              "colors": selectedAndColor[1],
              "map": "disaster"
            }, width}))}
</div>

<div>
  <p><h3>Death tolls</h3>The graph above shows the total death toll across all disaster types. Even though Earthquakes only represent a small portion of the total number of disasters, they are clearly the most devastating. Storms are the second most devastating, and Extreme temperatures and Floods come in third and fourth. Mass Movements, Droughts, and Wildfires are quite far behind as they often don't cause many casualties.</p>
</div>

---

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
    ${resize((width) => barChart(mostDeadlyDisasters.filter(d => selectedCountries.includes("all") ? true : selectedCountries.includes(d["country"])).slice(0, 15),
        {"catMapping": {
          "domain": selectedAndColor[0],
          "colors": selectedAndColor[1],
          "map": "disasterType"
        }, width}))}
</div>

<div>
  <p><h3>Deadliest disasters</h3>In the bar chart above we see the deadliest disasters. If we look at the global disasters we can again see that earthquakes are the most deadly. The 5 most deadly disasters from 1988 are as follows:
  
  1. [2010 Haiti earthquake](https://en.wikipedia.org/wiki/2010_Haiti_earthquake)
  2. [2004 Indian Ocean earthquake and tsunami](https://en.wikipedia.org/wiki/2004_Indian_Ocean_earthquake_and_tsunami)
  3. [Cyclone Gorky](https://en.wikipedia.org/wiki/1991_Bangladesh_cyclone)
  4. [Cyclone Nargis](https://en.wikipedia.org/wiki/Cyclone_Nargis)
  5. [2008 Sichuan earthquake](https://en.wikipedia.org/wiki/2008_Sichuan_earthquake)
  </p>
</div>


---


<div class="grid grid-cols-2">
  <div>
    ${tempDisasterAmountLineChart(monthlyTemperatureChanges, totalDisasterPerYear, correlation)}
  </div>
  <div>
    <h3>Correlation with temperature</h3>
    <p>Finally, we can compare the number of disasters each year to the overall increase in temperature. The temperature data is taken from the GISS Surface Temperature Analysis dataset from NASA. We observe both the mentioned increase in disasters and the increase in temperature anomaly. This anomaly is calculated by comparing the mean temperatures from 1951-1980 to the current temperatures. A correlation factor can also be seen; this is calculated by correlating the annual global temperature anomalies with the annual number of disasters. This yields a correlation factor of ${correlation.toFixed(5)}, which means there is some correlation but not a significant amount. As we will see in the pages about specific disasters, this can be explained by the fact that some disasters are less influenced by the temperature trend than expected.</p>
  </div>
</div>

---

<div class="card">
  <h3>Dataset Links</h3>

  - [Disaster Data](https://www.emdat.be/): Delforge, D. et al.: EM-DAT: The Emergency Events Database, Preprint, https://doi.org/10.21203/rs.3.rs-3807553/v1, 2023.
  - [Temperature Data](https://data.giss.nasa.gov/gistemp/): GISTEMP Team, 2024: GISS Surface Temperature Analysis (GISTEMP), version 4. NASA Goddard Institute for Space Studies. Dataset accessed 20YY-MM-DD at https://data.giss.nasa.gov/gistemp/.
</div>
