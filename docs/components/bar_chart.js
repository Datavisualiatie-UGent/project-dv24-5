import * as Plot from "npm:@observablehq/plot";
import {nameMapping} from "./world_map_chart.js";

function preProcessData(data) {
    for (let entry of data) {
        entry["year"] = JSON.stringify(entry["year"]).split("-")[0].slice(1, 5)
        entry["disaster"] = (nameMapping[entry["country"]] ?? entry["country"]) + " (" +  entry["year"] + ")"
    }
}

export function barChart(counts,  {
    label="Total Deaths",
    x_val="deaths",
    y="disaster",
    scheme={},
    colorList=[],
    width = {}
}={}) {
    preProcessData(counts);
    let colorDict;
    const schemeExists = Object.keys(scheme).length > 0
    if (schemeExists) {
        colorDict = {
            type: "quantize",
            scheme: scheme["color"],
            legend: true,
          };
    } else if (colorList) {
        const [disasters, colors] = colorList;
        colorDict = {
            domain:disasters,
            range:colors,
            legend: true,
        };
    } else {
        colorDict = {
            legend:true,
            domain: counts.map(d => d[y]),
        }
    }
    const unitExists = scheme["unit"] !== undefined;
    colorDict["label"] = unitExists ? scheme["unit"] : "Year";
    return Plot.plot({
        width,
        marginLeft: 140,
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
                    y: y,
                    fill: schemeExists ? scheme["map"] : y,
                    sort: { y: "x", reverse: true },
                    channels: {
                        "Magnitude": (d) => schemeExists ? d[scheme["map"]] + " " + scheme["unit"] : d[y],
                        "Total Deaths": x_val,
                        "Year": "year"},
                    tip: {format: {Magnitude: unitExists, "Total Deaths": true, x: false, y: false, fill: false}}},
            )
        ],
        color: colorDict,
    })
}