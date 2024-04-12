import * as Plot from "npm:@observablehq/plot";

export function correlationMatrix(correlations) {
  return Plot.plot({
    marginLeft: 145,
    marginBottom: 100,
    label: "Disaster Type",
    color: { scheme: "rdylbu", pivot: 0, legend: true, label: "correlation" },
    x : { tickRotate: -25 },
    y : { tickRotate: -25 },
    marks: [
      Plot.cell(correlations, { x: "first", y: "second", fill: "correlation" }),
      Plot.dot(correlations, {
        x: "first", 
        y : "second", 
        stroke: "correlation", 
        tip : true,
        channels: {"Disaster Type" : "first", "Second Disaster Type" : "second", correlation : "correlation"}
      })
    ]
  })
}


