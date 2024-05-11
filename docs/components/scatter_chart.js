import * as Plot from "npm:@observablehq/plot";

export function scatterChart(data, {xlabel, x_val="date", y="length", scheme={}, channels={}, tip={}, width={}}){
    let colorDict = {};
    const schemeExists = Object.keys(scheme).length > 0
    if (schemeExists) {
        colorDict = {
            type: "log",

            scheme: scheme["color"],
            legend: true,
          };
    } else {
        colorDict = {
            legend:true,
            domain: counts.map(d => d[y]),
        }
    }
    return Plot.plot({
        width,
        grid: true,
        color: colorDict,
        x: {
            label: xlabel,
            labelAnchor: "center",
        },
        marks: [
          Plot.ruleY([0]),
          Plot.dot(data, {x:x_val, y: y, stroke: scheme["map"], channels: channels, tip: { format: tip }}),
        ]
      })
}