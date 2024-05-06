function filterDisasters(disasters, specificDisasterType=[]) {
    return disasters.filter((el) => {
        const nonBiological = el["Disaster Subgroup"] !== "Biological";
        const correctMeasurement = el["Start Year"] >= 1988 && el["Start Year"] < 2024;
        const isClimate = !["Volcanic activity", "Impact"].includes(el["Disaster Type"]);
        const isSpecificDisasterType = specificDisasterType.length === 0 || specificDisasterType.includes(el["Disaster Type"]);
        return nonBiological && correctMeasurement && isClimate && isSpecificDisasterType;
    })
}

export function getGroupedDisasters(disasters, specificDisasterType=[]) {
    return Object.groupBy(
        // Filter based on necessary items
        filterDisasters(disasters, specificDisasterType),
        ({ "Disaster Type": type }) => {
            if (type.includes("Mass movement")) return "Mass Movement";
            if (type.includes("Glacial")) return "Flood";
            return type;
        }
    );
}

export function getDisastersPerYear(disasters, specificDisasterType=[]) {
    const groupedDisasters = getGroupedDisasters(disasters, specificDisasterType)
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

export function getCorrelationBetweenTwoLists(listx, listy) {
    let x2 = [];
    let y2 = [];
    let xy = [];
    let sigmaX = 0;
    let sigmaY = 0;
    let n = Math.min(listx.length, listy.length);
    for (var i = 0; i < n; i++) {
      const x = listx[i];
      const y = listy[i];
      x2.push(x*x);
      y2.push(y*y);
      xy.push(x*y);
    }

    let sigmaX2 = x2.reduce(((x, y) => x + y), 0);
    let sigmaY2 = y2.reduce(((x, y) => x + y), 0);
    let sigmaXY = xy.reduce(((x, y) => x + y), 0);

    var correlation = ((n*sigmaXY) - (sigmaX*sigmaY))/Math.sqrt((n*sigmaX2 - (sigmaX*sigmaX)) * (n*sigmaY2 - (sigmaY*sigmaY)));
    return correlation;
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

export function getConfirmedAffectedPersonsPerYear(disasters, specificDisasterType=[]){
    const groupedDisasters = getGroupedDisasters(disasters, specificDisasterType);
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
                json[year]["totalCount"] += 1;
            } else {
                json[year] = new Object({deaths : deaths, injured : injured, affected : affected, totalCount: 1});
            }
        });
        for (let i = minYear; i <= maxYear; i++) {
            if (i in json) {
                acc.push({
                    disaster: disasterType,
                    year : i,
                    deaths : json[i]["deaths"],
                    injured : json[i]["injured"],
                    affected : json[i]["affected"],
                    amount: json[i]["totalCount"]
                });
            }
        }
        return acc;
    }, []);
}



function getGroupedDisastersByCountry(disasters, specificDisasterType=[]) {
    return Object.groupBy(
        filterDisasters(disasters, specificDisasterType),
        ({ "Country": country }) => {
            return country;
        }
    );
}

export function getTotalDisastersPerCountry(disasters, specificDisasterType=[]) {
    const groupedDisastersByCountry = getGroupedDisastersByCountry(disasters, specificDisasterType);
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


export function getAverageLengthOfDisasterPerYear(disasters, specificDisasterType=[]) {
  const groupedDisasters = getGroupedDisasters(disasters, specificDisasterType);
  return Object.entries(groupedDisasters).reduce((acc, [disasterType, disasterList]) => {
    let obj = new Object();
    let miny = Number.MAX_VALUE;
    let maxy = Number.MIN_VALUE;
  
    disasterList.forEach(d => {
      const startYear = parseInt(d["Start Year"]);
      const startMonth = parseInt(d["Start Month"]);
      const startDay = parseInt(d["Start Day"]);
  
      const endYear = parseInt(d["End Year"]);
      const endMonth = parseInt(d["End Month"]);
      const endDay = parseInt(d["End Day"]);
  
      const hasNan = [startYear, startMonth, startDay, endYear, endMonth, endDay].some(el => isNaN(el))
      if (hasNan) return;
      
      const startDate = new Date(startYear, startMonth, startDay);
      const endDate = new Date(endYear, endMonth, endDay);
  
      const lengthInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (startYear in obj) {
          const [currentAvg, n] = obj[startYear];
          const newAvg = (lengthInDays + currentAvg * n) / (n + 1);
          obj[startYear] = [newAvg, n + 1];
      } else {
          obj[startYear] = [lengthInDays, 1];
      }
  
      if (startYear < miny) {
        miny = startYear;
      }
      if (startDate > maxy) {
        maxy = startYear;
      }
    });
    for (let i = miny; i < maxy; i++) {
      let avgLength = 0;
      if (i in obj) {
          avgLength = obj[i][0];
      }
      acc.push({disaster: disasterType, year : i, avgLength: avgLength});
    }
  return acc;
  }, []);
}

export function bundleDisasters(disasters) {
  return disasters.map((disaster) => {
    let amountOfDisasters = 0;
    if (disaster["year"] % 3 == 1) {
      const disasterBefore = disasters.find(d => d["year"] == disaster["year"] - 1 && d["disaster"] == disaster["disaster"]);
      const disasterAfter = disasters.find(d => d["year"] == disaster["year"] + 1 && d["disaster"] == disaster["disaster"]);
      if (disasterBefore) {
        amountOfDisasters += disasterBefore["disasters"];
      }
      if (disasterAfter) {
        amountOfDisasters += disasterAfter["disasters"];
      }
    }
    return {
      disasters: disaster["disasters"] + amountOfDisasters,
      ...disaster
    };
    }
  ).filter((disaster) => disaster["year"] % 3 ==  1);
}

/*
  * This function takes in a list of disasters and returns a dictionary with the disaster name as key and the amount of deaths, injured and affected people as value.
  * The amount of deaths, injured and affected people are summed over all years.
  * Useful for the bar charts.
*/
export function getDisasterCounts(emdat_disasters) {
  const confirmedAffectedPersonsPerYear = getConfirmedAffectedPersonsPerYear(
    emdat_disasters
  );
  return confirmedAffectedPersonsPerYear.reduce((acc, disaster) => {
    const disasterName = disaster["disaster"];
    const nrOfDeaths = disaster["deaths"];
    const nrOfInjured = disaster["injured"];
    const nrOfAffected = disaster["affected"];
    const count = disaster["amount"];
    const foundDisaster = acc.find((el) => el["disaster"] === disasterName);
    if (foundDisaster) {
      foundDisaster["deaths"] += nrOfDeaths;
      foundDisaster["injured"] += nrOfInjured;
      foundDisaster["affected"] += nrOfAffected;
      foundDisaster["numberOfDisasters"] += count;

      acc = acc.filter((el) => el["disaster"] !== disasterName);
      acc.push(foundDisaster);
    } else {
      const obj = {
        disaster: disasterName,
        deaths: nrOfDeaths,
        injured: nrOfInjured,
        affected: nrOfAffected,
        numberOfDisasters: count,
      };
      acc.push(obj);
    }
    return acc;
  }, []);
}

export function getDisasterMagnitudes(emdat_disasters, disasterType) {
  const groupedDisasters = getGroupedDisasters(emdat_disasters, [disasterType])
  return groupedDisasters[disasterType].filter(el => el["Magnitude"]).reduce((acc, disaster) => {
    const year = disaster["Start Year"];
    const magnitude = disaster["Magnitude"];
  
    const dInAcc = acc.find(e => e["year"] === year);
    if (dInAcc) {
      const nrOfDisasters = dInAcc["nrOfDisasters"];
      const currentMagnitudeAverage = dInAcc["magnitude"];
      const newAverage = ((nrOfDisasters * currentMagnitudeAverage + magnitude) / (nrOfDisasters + 1)) | 0
      const newObj = {
        year: year,
        magnitude: newAverage,
        nrOfDisasters: nrOfDisasters + 1,
        disaster: disasterType
      }
      acc = acc.filter(e => e["year"] !== year);
      acc.push(newObj);
    } else {
      const obj = {
        year: year,
        magnitude: magnitude,
        nrOfDisasters: 1,
        disaster: disasterType
      };
      acc.push(obj);
    }
    return acc;
  }, []);
}

export function getTotalDisastersPerYear(disasterCounts) {
  var totalDisastersPerYear = [];
  disasterCounts.forEach(e => {
    const index = e["year"] - 1988;
    const disasters = e["disasters"];
    if (totalDisastersPerYear.length <= index) {
      totalDisastersPerYear.push(disasters);
    } else {
      totalDisastersPerYear[index] = totalDisastersPerYear[index] += disasters;
    }
  });
  var toReturn = [];
  for (var i = 0; i < totalDisastersPerYear.length; i++) {
    toReturn.push({date : (i + 1988), disasters : totalDisastersPerYear[i]});
  }
  return toReturn;
}


export function getMonthlyTemperatureChanges(giss_temperatures) {
  var temps = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (var i = 0; i < giss_temperatures.length; i++) {
    const obj = giss_temperatures[i];
    const year = obj["Year"];
    if (year < 1988 || year > 2022) {
      continue;
    }
    for (var x = 0; x < months.length; x++) {
      const month = months[x];
      const temp = Number(obj[month]);
      if (isNaN(temp)) {
        continue;
      }
      const d = new Date(year, x);
      var o = {date : d, temp: temp};
      temps.push(o);    
    }
  }
    
  
  return temps;
}

export function getYearlyTemperatureChanges(giss_temperatures) {
  var temps = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (var i = 0; i < giss_temperatures.length; i++) {
    const obj = giss_temperatures[i];
    const year = obj["Year"];
    if (year < 1988) {
      continue;
    }
    const temp = Number(obj["J-D"]);
    if (isNaN(temp)) {
      continue;
    }
    var o = {date : year, temp: temp};
    temps.push(o);    
    
  }
  return temps;
}
