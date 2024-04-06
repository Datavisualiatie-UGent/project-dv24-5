import * as Plot from "npm:@observablehq/plot";
import * as d3 from 'https://unpkg.com/d3?module'

export function worldMap(fp, land, countries) {
    let byName = {};
    for (let i = 0; i < fp.length; i++) {
        byName[fp[i].country] = fp[i]
    }
    //const byName = d3.index(fp, (d) => d.country)
    return Plot.plot({
        width: 928,
        projection: { type: "equal-earth", rotate: [-10, 0] },
        color: {
            type: "quantize",
            n: 10,
            unknown: "#ddd",
            label: "Share of Women with access to modern methods of family planning (%)",
            legend: true,
            width: 360
        },
        marks: [
            Plot.sphere({ fill: "#f0faff", stroke: "currentColor" }),
            //Plot.geo(land, { fill: "currentColor", dx: 1, dy: 1 }), // shade
            Plot.graticule(),
            Plot.geo(countries, {
                fill: (d) => byName[d.properties.name]?.value,
                stroke: "currentColor",
                strokeWidth: 0.25,
                dx: 1,
                dy: 1,
                title: (d) => `${d.properties.name}: ${byName[d.properties.name]?.value.toFixed(1) ?? "No data"}`
            })
        ]
    })
}