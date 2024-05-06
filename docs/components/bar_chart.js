import * as Plot from "npm:@observablehq/plot";

export function barChart(counts, label, x_val="amount", y="disaster", colorList=[], scale=1) {
    let colorDict = {};
    if (!colorList) {
        colorDict = {
            legend:true,
            domain: counts.map(d => d[y]),
        }
    } else {
        const [disasters, colors] = colorList;
        colorDict = {
            domain:disasters,
            range:colors,
            legend: true,
        };
    }
    return Plot.plot({
        height: 500,
        marginLeft: 150,
        x: {
            label: label,
            labelAnchor: "center",
        },
        marks: [
            Plot.barX(
                counts,
                Plot.groupY(
                    { x: "max" },
                    {
                        x: (val) => val[x_val] / (Number.isInteger(scale) ? scale : val[scale]),
                        y: y,
                        sort: { y: "x", reverse: true },
                        fill: y,
                    }
                ),
            ),
            Plot.tip(counts, Plot.pointer({
                x: (val) => val[x_val] / (Number.isInteger(scale) ? scale : val[scale]) | 0,
                y: y,
            }))
        ],
        color: colorDict,
    })
}