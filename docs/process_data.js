export function getGroupedDisasters(disasters, nonClimateDisasters) {
    return Object.groupBy(
        // Filter based on necessary items
        disasters.filter((el) => {
            const nonBiological = el["Disaster Subgroup"] !== "Biological";
            const correctMeasurement =
                el["Start Year"] >= 1988 && el["Start Year"] < 2024;
            const isClimate = !nonClimateDisasters.includes(el["Disaster Type"]);
            return nonBiological && correctMeasurement && isClimate;
        }),
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

export function getDisastersAmountPerCountryPerYear(emdat_disasters) {
  let obj = new Object();
  emdat_disasters.forEach(d => {
    let country = d["Subregion"];
    let y = parseInt(d["Start Year"]);
    let disasterType = d["Disaster Type"];
    if (country in obj) {
      if (!(y in obj[country])) {
        obj[country][y] = new Object();
      }
      if (!(disasterType in obj[country][y])) {
        obj[country][y][disasterType] = 0;
      }
      obj[country][y][disasterType] += 1;
    } else {
      obj[country] = new Object();
      obj[country][y] = new Object();
      obj[country][y][disasterType] = 1;
    }
  });
  return obj;
}

export function getColumnUniqueValues(name, emdat_disasters) {
  let list = [];
  for (var i in emdat_disasters) {
    if (!list.includes(emdat_disasters[i][name]) && (emdat_disasters[i][name] != undefined)) {
      list.push(emdat_disasters[i][name]);
    }
  }
  return list;
}


export function getCorrelation(firstDisasterType, secondDisasterType, disastersAmountPerCountryPerYear) {
  let correlations = [];
  for (let country in disastersAmountPerCountryPerYear) {
    let x2 = [];
    let y2 = [];
    let xy = [];
    let sigmaX = 0;
    let sigmaY = 0;
    let n = 0;
    const list = disastersAmountPerCountryPerYear[country];
    const years = Object.keys(list).map(x => parseInt(x));
    var year = Math.min.apply(Math, years);
    while (year <= Math.max.apply(Math, years)) {
      n++;
      var i = 0;
      let x = 0;
      let y = 0;
      while (i < 1 && (year <= Math.max.apply(Math, years))) {
        if (year in disastersAmountPerCountryPerYear[country]) {
          const tempX = disastersAmountPerCountryPerYear[country][year][firstDisasterType];
          const tempY = disastersAmountPerCountryPerYear[country][year][secondDisasterType];
          if (!isNaN(tempX)) x += tempX;
          if (!isNaN(tempY)) y += tempY; 
        }
        i++;
        year++;
      }
      sigmaX += x;
      sigmaY += y;
      x2.push(x*x);
      y2.push(y*y);
      xy.push(x*y);   
    }
    let sigmaX2 = x2.reduce(((x, y) => x + y), 0);
    let sigmaY2 = y2.reduce(((x, y) => x + y), 0);
    let sigmaXY = xy.reduce(((x, y) => x + y), 0);

    if (!(sigmaX == 0 && sigmaY == 0)) {   
      var correlation = ((n*sigmaXY) - (sigmaX*sigmaY))/Math.sqrt((n*sigmaX2 - (sigmaX*sigmaX)) * (n*sigmaY2 - (sigmaY*sigmaY)));
      if(isNaN(correlation))
        correlations.push(0);
      else       
        correlations.push(correlation);  
    }
  }
  if (correlations.length == 0) {
    return 0;
  }
  return correlations.reduce((x, y) => x + y, 0.0) / correlations.length;
}

export function getTypeCorrelations(disastersAmountPerCountryPerYear, emdat_disasters) {
  var correlations = [];
  getColumnUniqueValues("Disaster Type", emdat_disasters).forEach(x => {
    getColumnUniqueValues("Disaster Type", emdat_disasters).forEach(y => {
      const correlation = getCorrelation(x, y, disastersAmountPerCountryPerYear);
      correlations.push({first : x, second : y, correlation: correlation});
    })
  })
  return correlations;
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
