import * as Plot from "npm:@observablehq/plot";
import {nameMapping} from "./world_map_chart.js";

function preProcessData(data) {
    for (let entry of data) {
        if ("year" in entry) {
            entry["year"] = JSON.stringify(entry["year"]).split("-")[0].slice(1, 5)
            entry["disaster"] = (nameMapping[entry["country"]] ?? entry["country"]) + " (" +  entry["year"] + ")"
        }
    }
}

export function barChart(counts,  {
    label="Total Deaths",
    x_val="deaths",
    y_val="disaster",
    scheme={},
    colorList=[],
    width = {}
}={}) {
    preProcessData(counts);
    let colorDict;
    const schemeExists = Object.keys(scheme).length > 0
    const unitExists = scheme["unit"] !== undefined;
    if (schemeExists) {
        colorDict = {
            type: "quantize",
            scheme: scheme["color"],
            legend: true,
            label: unitExists ? scheme["unit"] : "Year"
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
            domain: counts.map(d => d[y_val]),
        }
    }

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
                    y: y_val,
                    fill: schemeExists ? scheme["map"] : y_val,
                    sort: { y: "x", reverse: true },
                    channels: {
                        "Magnitude": (d) => schemeExists ? (d[scheme["map"]] + " " + scheme["unit"]) : d[y_val],
                        "Total Deaths": x_val, // TODO change for main page 
                        "Year": "year"},
                    tip: {format: {Magnitude: unitExists, label: true, x: false, y: false, fill: false}}},
            )
        ],
        color: colorDict,
    })
}