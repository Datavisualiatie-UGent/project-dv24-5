import * as Plot from "npm:@observablehq/plot";

function preProcessData(data) {
    for (let entry of data) {
        if ("year" in entry) {
            entry["year"] = JSON.stringify(entry["year"]).split("-")[0].slice(1, 5)
        }
    }
}

export function barChart(counts,  {
    label="Total Deaths",
    x_val="deaths",
    y_val="disaster",
    scheme={},
    catMapping={},
    width = {}
}={}) {
    preProcessData(counts);
    let colorDict = {};
    const schemeExists = Object.keys(scheme).length > 0;
    const catMappingExists = Object.keys(catMapping).length > 0;
    const unitExists = scheme["unit"] !== undefined;
    if (schemeExists) {
        colorDict = {
            type: "quantize",
            scheme: scheme["color"],
            legend: true,
            label: unitExists ? scheme["unit"] : "Year"
          };
    } else if (catMappingExists) {
        colorDict = {
            domain: catMapping["domain"],
            range: catMapping["colors"],
            legend: true,
        };
    } else {
        colorDict = {
            legend:true,
            domain: counts.map(d => d[y_val]),
        }
    }
    const fillScheme = catMappingExists ? catMapping["map"] : y_val;
    return Plot.plot({
        width,
        marginLeft: 200,
        x: {
            label: label,
            labelAnchor: "center",
        },
        y: {label: ""},
        marks: [
            Plot.barX(
                counts,
                {
                    x: x_val,
                    y: y_val,
                    fill: schemeExists ? scheme["map"] : fillScheme,
                    sort: { y: "x", reverse: true },
                    channels: {
                        "Magnitude": (d) => schemeExists ? (d[scheme["map"]] + " " + scheme["unit"]) : d[y_val],
                        "Deaths": x_val,
                        "Year": "year"},
                    tip: {format: {Magnitude: unitExists, label: true, x: false, y: false, fill: false}}},
            )
        ],
        color: colorDict,
    })
}