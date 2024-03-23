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
Plot.plot({
  height: 500,
  marginLeft: 150,
  x: {
    label: "Number of disasters per category",
    labelAnchor: "center",
  },
  marks: [
    Plot.barX(
      counts,
      Plot.groupY(
        { x: "max" },
        {
          x: (val) => val.amount / totalCount,
          y: "disaster",
          sort: { y: "x", reverse: true }
        }
      )
    )
  ]
})
  }</div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <div class="card">${
    Plot.plot({
    y: {
      label: "Amount of disasters"
    },
    marks: [
      Plot.areaY(
        disastersPerYear,
        Plot.stackY({
          x: "year",
          y: "disasters",
          fill: "disaster",
          z: "disaster",
          title: "disaster",
          order: "max",
          reverse: true,
          stroke: "#ddd"
        })
      ),
      Plot.ruleY([0])
    ],
    style: {
      pointerEvents: "all"
    },
    color: {
      legend: true,
      columns: "110px",
      width: 640
    }
  })
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
const disastersPerYear = Object.entries(groupedDisasters).reduce(
  (acc, [disasterType, disasterList]) => {
    let obj = new Object();
    let miny = Number.MAX_VALUE;
    let maxy = Number.MIN_VALUE;
    disasterList.forEach((d) => {
      let y = parseInt(d["Start Year"]);
      if (y in obj) {
        obj[y] += 1;
      } else {
        obj[y] = 1;
      }
      if (y < miny) {
        miny = y;
      }
      if (y > maxy) {
        maxy = y;
      }
    });
    for (let i = miny; i < maxy; i++) {
      let nrOfDisasters = 0;
      if (i in obj) {
        nrOfDisasters = obj[i];
      }
      acc.push({ disaster: disasterType, year: i, disasters: nrOfDisasters });
    }
    return acc;
  },
  []
);
```

```js
const counts = Object.keys(groupedDisasters)
  .reduce((acc, key) => {
    acc.push({ disaster: key, amount: groupedDisasters[key].length });
    return acc;
  }, [])
  .sort((a, b) => b.amount - a.amount);
```

```js
const totalCount = counts.reduce((acc, dic) => acc + dic["amount"], 0);
```

---
