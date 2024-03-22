---
theme: dashboard
title: Disasters
toc: false
---

# Disasters

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

<div class="hero">
  <h1>Hello, Observable Framework</h1>
  <h2>Welcome to your new project! Edit&nbsp;<code style="font-size: 90%;">docs/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started" target="_blank">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <div class="card">${
    resize((width) => Plot.plot({
  marginLeft: 100,
  grid: true,
  x: {
    axis: "top",
    round: true,
    label: "Number of disasters per category",
    labelAnchor: "center",
  },
  color: {
    range: ["#e15759", "#4e79a7"]
  },
  marks: [
    Plot.barX(counts, {
      y: "disaster",
      x: "amount",
    }),
    Plot.ruleX([0])
  ]
}))
  }</div>
</div>

```js
const disasters = FileAttachment("emdat_disasters.csv").csv({
  typed: true,
  headers: true,
});
```

```js
const groupedDisasters = Object.groupBy(
  disasters.filter((el) => el["Disaster Subgroup"] != "Biological"),
  ({ "Disaster Type": type }) => type
);
```

```js
const counts = Object.keys(groupedDisasters).reduce((acc, key) => {
  acc.push({ disaster: key, amount: groupedDisasters[key].length });
  return acc;
}, []);
```

---
