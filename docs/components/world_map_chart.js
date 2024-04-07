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
    {width, disaster="Wildfire", label="Total wildfires per country", scheme="reds"} = {}
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
        projection: { type: "equal-earth", rotate: [-10, 0] },
        color: {
            type: "quantize",
            n: 10,
            scheme: scheme,
            unknown: "#ddd",
            label: label,
            legend: true,
            //width: width/3
        },
        marks: [
            Plot.sphere({ fill: "#f0faff", stroke: "currentColor" }),
            //Plot.geo(land, { fill: "currentColor", dx: 1, dy: 1 }), // shade
            Plot.graticule(),
            Plot.geo(countries, {
                fill: (d) => byName[d.properties.name]?.[disaster],
                stroke: "currentColor",
                strokeWidth: 0.25,
                dx: 1,
                dy: 1,
                title: (d) => `${d.properties.name}: ${byName[d.properties.name]?.[disaster]}`
            })
        ]
    })
}