import * as Plot from "npm:@observablehq/plot";

export function areaChart(data, y, label) {
    return Plot.plot({
        y: {
            label: label
        },
        marks: [
            Plot.areaY(
                data,
                Plot.stackY({
                    x: "year",
                    y: y,
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
}