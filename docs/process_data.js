function filterDisasters(disasters, nonClimateDisasters) {
    return disasters.filter((el) => {
        const nonBiological = el["Disaster Subgroup"] !== "Biological";
        const correctMeasurement = el["Start Year"] >= 1988 && el["Start Year"] < 2024;
        const isClimate = !nonClimateDisasters.includes(el["Disaster Type"]);
        return nonBiological && correctMeasurement && isClimate;
    })
}

export function getGroupedDisasters(disasters, nonClimateDisasters) {
    return Object.groupBy(
        // Filter based on necessary items
        filterDisasters(disasters, nonClimateDisasters),
        ({ "Disaster Type": type }) => {
            if (type.includes("Mass movement")) return "Mass Movement";
            if (type.includes("Glacial")) return "Flood";
            return type;
        }
    );
}

export function getDisastersPerYear(groupedDisasters) {
    return Object.entries(groupedDisasters).reduce(
        (acc, [disasterType, disasterList]) => {
            let obj = {};
            let miny = Number.MAX_VALUE;
            let maxy = Number.MIN_VALUE;
            disasterList.forEach((d) => {
                let y = parseInt(d["Start Year"]);
                if (y in obj) {
                    obj[y] += 1;
                } else {
                    obj[y] = 1;
                }
                if (y < miny) {
                    miny = y;
                }
                if (y > maxy) {
                    maxy = y;
                }
            });
            for (let i = miny; i < maxy; i++) {
                let nrOfDisasters = 0;
                if (i in obj) {
                    nrOfDisasters = obj[i];
                }
                acc.push({ disaster: disasterType, year: i, disasters: nrOfDisasters });
            }
            return acc;
        },
        []
    );
}


export function getConfirmedAffectedPersonsPerYear(groupedDisasters){
    return Object.entries(groupedDisasters).reduce((acc, [disasterType, disasterList]) => {

        let json = {};
        let minYear = Number.MAX_VALUE;
        let maxYear = Number.MIN_VALUE;
        disasterList.forEach(d => {

            const year = parseInt(d["Start Year"]);
            let deaths = parseInt(d["Total Deaths"]);
            let injured = parseInt(d["No. Injured"]);
            let affected = parseInt(d["No. Affected"]);
            if (!deaths) deaths = 0;
            if (!injured) injured = 0;
            if (!affected) affected = 0;

            if (year > maxYear) {
                maxYear = year;
            }
            if (year < minYear) {
                minYear = year;
            }

            if (year in json) {
                json[year]["deaths"] += deaths;
                json[year]["injured"] += injured;
                json[year]["affected"] += affected;
            } else {
                json[year] = new Object({deaths : deaths, injured : injured, affected : affected});
            }
        });
        for (let i = minYear; i <= maxYear; i++) {
            if (i in json) {
                acc.push({
                    disaster: disasterType,
                    year : i,
                    deaths : json[i]["deaths"],
                    injured : json[i]["injured"],
                    affected : json[i]["affected"]
                });
            }
        }
        return acc;
    }, []);
}


function getGroupedDisastersByCountry(disasters, nonClimateDisasters) {
    return Object.groupBy(
        filterDisasters(disasters, nonClimateDisasters),
        ({ "Country": country }) => {
            return country;
        }
    );
}

export function getTotalDisastersPerCountry(disasters, nonClimateDisasters) {
    const groupedDisastersByCountry = getGroupedDisastersByCountry(disasters, nonClimateDisasters);
    return Object.entries(groupedDisastersByCountry).reduce(
        (acc, [country, disasterList]) => {
            let disastersForCountry = {};
            disasterList.forEach((d) => {
                let disaster = d["Disaster Type"];
                if (disaster in disastersForCountry) {
                    disastersForCountry[disaster] += 1;
                } else {
                    disastersForCountry[disaster] = 1;
                }
            });
            acc.push({country: country, ...disastersForCountry});
            return acc;
        }, []);
}
