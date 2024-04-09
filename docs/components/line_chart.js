import * as Plot from "npm:@observablehq/plot";

export function lineChart(data, y, label, [disasters, colors]) {
    return Plot.plot({
        style: "overflow: visible;",
        y: {
            label: label
        },
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(data, {
                x: "year",
                y: y,
                stroke: "disaster",
                title: "disaster",
                order: "max",
                reverse: true,
                tip: true,
            }),
        ],
        color: {
            domain:disasters,
            range:colors,
            legend: true,
        }
    })
}
