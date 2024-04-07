---
toc: false
---

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
var land = await FileAttachment("data/land.json").json();

const countries = await FileAttachment("data/countries.json").json();

const emdat_disasters = await FileAttachment("data/emdat_disasters.csv").csv({
    typed: true,
    headers: true,
});

import {getTotalDisastersPerCountry, getGroupedDisasters} from './process_data.js';
const totalDisastersPerCountry = getTotalDisastersPerCountry(emdat_disasters)
const groupedDisastersByType = getGroupedDisasters(emdat_disasters);

import {choroplethWorldMap, scatterWorldMap} from './components/world_map_chart.js';
```
<div class="hero">
  <h1>Hello, Observable Framework</h1>
  <h2>Welcome to your new project! Edit&nbsp;<code style="font-size: 90%;">docs/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started" target="_blank">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>


<div class="grid">
    <div class="card">
    ${resize((width) => scatterWorldMap(groupedDisastersByType, land, countries, {width}))}
    </div>
</div>
<div class="grid grid-cols-2">
    <div>
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, land, countries, 
            {width, disaster: "Flood", label: "Total floods per country", scheme: "blues"}))}
    </div>
    <div>
        ${resize((width) => choroplethWorldMap(totalDisastersPerCountry, land, countries, {width}))}
    </div>
</div>