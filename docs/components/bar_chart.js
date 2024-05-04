import * as Plot from "npm:@observablehq/plot";

export function barChart(counts, [disasters, colors], label, x_val="amount", y="disaster", scale=1) {    
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
        color: {
            domain:disasters,
            range:colors,
            legend: true,
        }
    })
}