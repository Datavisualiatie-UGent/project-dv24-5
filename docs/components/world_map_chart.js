import * as Plot from "npm:@observablehq/plot";


const nameMapping = { // datasetName: countries.json name
    "United States of America": "United States",
    "Germany Federal Republic": "Germany",
    "United Republic of Tanzania": "Tanzania",
    "Soviet Union": "Russia",
    "T�rkiye": "Turkey",
    "Venezuela (Bolivarian Republic of)": "Venezuela",
    "Iran (Islamic Republic of)": "Iran",
    "Viet Nam": "Vietnam",
    "China, Hong Kong Special Administrative Region": "China",
    "Bolivia (Plurinational State of)": "Bolivia",
    "C�te d�Ivoire": "Cote d'Ivoire",
    "Democratic Republic of the Congo": "Congo",
    "Taiwan (Province of China)": "Taiwan",
    "People's Democratic Republic of Yemen": "Yemen",
    "Netherlands (Kingdom of the)": "Netherlands",
    "United Kingdom of Great Britain and Northern Ireland": "United Kingdom"
}

export function choroplethWorldMap(
    data,
    land,
    countries,
    {
        width,
        disaster="Wildfire",
        label="Total wildfires per country",
        scheme="reds",
        withSlider= true,
        longitude=0
    } = {}
    ) {
    let byName = {};
    for (let i = 0; i < data.length; i++) {
        let country = data[i].country;
        byName[nameMapping[country] ?? country] = data[i];
    }

    // used to fill nameMapping
    //const allCountries = countries.features.map(feature => feature.properties.name);
    //const mismatches = Object.keys(byName).filter(country => !allCountries.includes(country))

    return Plot.plot({
        width,
        projection: {
            type: withSlider ? "orthographic" : "equal-earth",
            rotate: [-longitude, 0]
        },
        color: {
            type: "quantize",
            //n: 10,
            scheme: scheme,
            unknown: "#ddd",
            label: label,
            legend: true,
        },
        marks: [
            //Plot.sphere({ fill: "#f0faff", stroke: "currentColor" }),
            Plot.graticule(),
            Plot.sphere(),
            Plot.geo(countries, {
                fill: (d) => byName[d.properties.name]?.[disaster],
                stroke: "grey",
                strokeWidth: 0.25,
                dx: 1,
                dy: 1,
                title: (d) => `${nameMapping[d.properties.name] ?? d.properties.name}: ${byName[d.properties.name]?.[disaster]}`
            })
        ]
    })
}


export function scatterWorldMap(
    data,
    land,
    countries,
    {
        width,
        disaster="Earthquake",
        label="Total Deaths",
        withSlider= true,
        longitude= 0
    } = {}
) {

    return Plot.plot({
        width,
        title: label,
        projection: {
            type: withSlider ? "orthographic" : "equal-earth",
            rotate: [-longitude, 0],
        },
        r: {transform: (d) => label === "Magnitude" ? Math.pow(10, d) : d}, // convert Richter to amplitude
        marks: [
            Plot.geo(countries, {fill: "currentColor", fillOpacity: 0.2}),
            Plot.sphere(),
            Plot.dot(data[disaster], {
                x: "Longitude",
                y: "Latitude",
                stroke: "red",
                strokeWidth: 0.5,
                fill: "red",
                fillOpacity: 0.05,
                r: label,
                title: (d) => `${nameMapping[d["Country"]] ?? d["Country"]}: ${d["Start Year"]}\nTotal deaths: ${d["Total Deaths"]}\nMagnitude: ${d["Magnitude"]} richter`
            })
        ]
    })
}