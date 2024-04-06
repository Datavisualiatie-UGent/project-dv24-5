import * as Plot from "npm:@observablehq/plot";

export function lineChart(data, y, label) {
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
            legend: true,
        }
    })
}

export function amountOfDisastersPerYearLineChart(disastersPerYear) {
    return Plot.plot({
        style: "overflow: visible;",
        y: {
            label: "Amount of disasters"
        },
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(disastersPerYear, {
                x: "year",
                y: "disasters",
                stroke: "disaster",
                title: "disaster",
                order: "max",
                reverse: true,
                tip: true,
            }),
        ],
        color: {
            legend: true,
        }
    })
}

export function deathsPerYear(confirmedAffectedPersonsPerYear) {
    return Plot.plot({
        style: "overflow: visible;",
        y: {
            label: "Deaths"
        },
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(confirmedAffectedPersonsPerYear, {
                x: "year",
                y: "deaths",
                stroke: "disaster",
                title: "disaster",
                order: "max",
                reverse: true,
                tip: true,
            }),
        ],
        color: {
            legend: true,
        }
    })
}


export function peopleInjuredPerYear(confirmedAffectedPersonsPerYear) {
    return Plot.plot({
        style: "overflow: visible;",
        y: {
            label: "People injured"
        },
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(confirmedAffectedPersonsPerYear, {
                x: "year",
                y: "injured",
                stroke: "disaster",
                title: "disaster",
                order: "max",
                reverse: true,
                tip: true,
            }),
        ],
        color: {
            legend: true,
        }
    })
}