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
            }),
            Plot.tip(data, Plot.pointer({
                x: "year",
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

export function tempDisasterAmountLineChart(tempData, disasterData, correlation) {
    return Plot.plot({
        style: "overflow: visible;",    
        marks: [
            Plot.barY(
                disasterData, { x: "year", y: "disasters", fill: "#AAA", }),
            Plot.axisX({ticks: []}),
            (_, { x }, __, dimensions) => {
                return Plot.plot({
                    ...dimensions,
                    marginLeft: 59,
                    marginRight: 24,
                    color: {
                        type: "diverging",
                        scheme: "YlOrRd"
                    },
                    
                    marks: [
                        Plot.line(tempData, {
                            x: "date",
                            y: "temp",
                            z : null,
                            strokeWidth: 2,
                            stroke: "temp",
                            tip: {
                                format: {
                                    temp : true,
                                    date : true,
                                    y: (d) => d > 0 ? `˖${d}C°` : `${d}C°`,
                                    x: (d) => {
                                        const year = d.getFullYear();
                                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        const month = months[d.getMonth()];
                                        return month + " " + year;
                                    },
                                }
                            },
                        }),
                    ],
                    y: { axis: "right", nice: true, line: true, label: "Temperature Anomaly" }    
                });
            },
            Plot.text([[0, 0]], {text : ["Correlation: " + correlation.toFixed(5)], marks: [ Plot.frame() ], monospace: true, dx:130, dy: -300, fontSize: 10})
        ],
        y: {nice : true, label : "Amount of Disasters"}
        
    })
}

export function tempLineChart(data) {
    return Plot.plot({
        style: "overflow: visible;",    
        color: {
            type: "diverging",
            scheme: "YlOrRd"
        },
        marks: [
            Plot.ruleY([0]),
            Plot.line(data, {
                x: "date",
                y: "temp",
                reverse: true,
                z : null,
                strokeWidth: 2,
                stroke: "temp",
                tip: {
                    format: {
                        temp : true,
                        date : true,
                        y: (d) => d > 0 ? `˖${d}C°` : `${d}C°`,
                        x: (d) => {
                            const year = d.getFullYear();
                            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const month = months[d.getMonth()];
                            return month + " " + year;
                        },
                    }
                },
                
            }),
            Plot.gridY({x: (y) => data.find((d) => d.temp >= y)?.date, insetLeft: -6}),
            Plot.axisY({
                    label: "temperature change",
                    x: (y) => data.find((d) => d.temp >= y)?.date, insetLeft: -6,
                    tickFormat: (d, i, _) => (d > 0 ? `˖${d}` : d),
                    interval: 0.2
                }
            )
        ],
        
    })
}
