import * as Plot from "npm:@observablehq/plot";
import * as d3 from 'https://unpkg.com/d3?module'


export function bumpChart(data, {x = "year", y = "disasters", z = "disaster", interval = "year", width} = {}, [disasters, colors]) {
    const rank = Plot.stackY2({x, z, order: y, reverse: true});
    const [xmin, xmax] = d3.extent(Plot.valueof(data, x));
    return Plot.plot({
        width,
        title: "Relative ranking of climate disasters by amount of occurrences.",
        x: {
            inset: 120,
            label: "year",
            grid: true
        },
        y: {
            axis: null,
            inset: 20,
            reverse: true
        },
        marks: [
            Plot.line(data, {
                ...rank,
                stroke: rank.z,
                strokeWidth: 24,
                curve: "bump-x",
                sort: {color: "y", reduce: "first"},
            }),
            Plot.text(data, {
                ...rank,
                text: rank.y,
                fill: "black",
                stroke: z,
                channels: {"amount": y},
                tip: {format: {y: null, text: null}}
            }),
            Plot.text(data, {
                ...rank,
                filter: (d) => d[x] <= xmin,
                text: z,
                dx: -20,
                textAnchor: "end"
            }),
            Plot.text(data, {
                ...rank,
                filter: (d) => d[x] >= xmax,
                text: z,
                dx: 20,
                textAnchor: "start"
            })
        ],
        color: {
            domain:disasters,
            range:colors
        },
    })
}
