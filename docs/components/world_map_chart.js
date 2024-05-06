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
    "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
    "Czechia": "Czech Republic",
    "North Macedonia": "Macedonia",
    "Republic of Moldova": "Moldova",
    "Syrian Arab Republic": "Syria",
    "South Sudan": "Sudan",
    "State of Palestine": "Palestine",
    "Cabo Verde": "Cape Verde"
}


function getDescription(disastersPerCountry, country, disaster) {
    let amount = disastersPerCountry[country]?.[disaster];
    if (amount === undefined) {
        amount = 0;
    }
    return `Country: ${nameMapping[country] ?? country}\nAmount: ${amount}\n`
}

export function choroplethWorldMap(
    data,
    countries,
    {
        width,
        disaster = "Wildfire",
        label = "Total wildfires per country",
        scheme = "reds",
        fullWorld = false,
        longitude = 0,
        logScale = false
    } = {}
) {
    let disastersPerCountry = {};
    for (let i = 0; i < data.length; i++) {
        let country = data[i].country;
        disastersPerCountry[nameMapping[country] ?? country] = data[i];
    }

    // used to fill nameMapping
    // const allCountries = countries.features.map(feature => feature.properties.name);
    // const mismatches = Object.keys(disastersPerCountry).filter(country => !allCountries.includes(country))

    return Plot.plot({
        width,
        projection: {
            type: fullWorld ? "equal-earth" : "orthographic",
            rotate: [fullWorld ? 0 : -longitude, 0]
        },
        color: {
            type: logScale ? "log" : "quantize",
            n: 10,
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
                fill: (d) => disastersPerCountry[d.properties.name]?.[disaster]|0,
                stroke: "grey",
                strokeWidth: 0.25,
                dx: 1,
                dy: 1,
                title: (d) => `${getDescription(disastersPerCountry, d.properties.name, disaster)}`
            })
        ]
    })
}


export function scatterWorldMap(
    data,
    countries,
    {
        width,
        disaster = "Earthquake",
        label = "Total Deaths",
        fullWorld = false,
        longitude = 0
    } = {}
) {

    return Plot.plot({
        width,
        title: label,
        projection: {
            type: fullWorld ? "equal-earth" : "orthographic",
            rotate: [fullWorld ? 0 : -longitude, 0],
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