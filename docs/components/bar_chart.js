import * as Plot from "npm:@observablehq/plot";

export function numberOfDisastersPerCategory(counts, totalCount, [disasters, colors]) {
    return Plot.plot({
        height: 500,
        marginLeft: 150,
        x: {
            label: "Number of disasters per category",
            labelAnchor: "center",
        },
        marks: [
            Plot.barX(
                counts,
                Plot.groupY(
                    { x: "max" },
                    {
                        x: (val) => val.amount / totalCount,
                        y: "disaster",
                        sort: { y: "x", reverse: true }
                    }
                )
            )
        ],
        color: {
            domain:disasters,
            range:colors,
        }
    })
}