import * as Plot from "npm:@observablehq/plot";

export function choroplethWorldMap(
    data,
    land,
    countries,
    {width, disaster="Wildfire", label="Total wildfires per country", scheme="reds"} = {}
    ) {
    let byName = {};
    for (let i = 0; i < data.length; i++) {
        byName[data[i].country] = data[i]
    }

    return Plot.plot({
        width,
        projection: { type: "equal-earth", rotate: [-10, 0] },
        color: {
            type: "quantize",
            n: 10,
            scheme: scheme,
            unknown: "#ddd",
            label: label,
            legend: true,
            //width: width/3
        },
        marks: [
            Plot.sphere({ fill: "#f0faff", stroke: "currentColor" }),
            //Plot.geo(land, { fill: "currentColor", dx: 1, dy: 1 }), // shade
            Plot.graticule(),
            Plot.geo(countries, {
                fill: (d) => byName[d.properties.name] !== undefined ? byName[d.properties.name][disaster] : undefined,
                stroke: "currentColor",
                strokeWidth: 0.25,
                dx: 1,
                dy: 1,
                title: (d) => `${d.properties.name}: ${byName[d.properties.name] !== undefined ? byName[d.properties.name][disaster] : undefined ?? "No data"}`
            })
        ]
    })
}