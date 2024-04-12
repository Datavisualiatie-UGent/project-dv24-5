import { getColumnUniqueValues } from "./process_data";

export function getCorrelation(firstDisasterType, secondDisasterType) {
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
      if(!isNaN(correlation))
        correlations.push(correlation);   
    }
  }
  if (correlations.length == 0) {
    return 0;
  }
  return correlations.reduce((x, y) => x + y, 0.0) / correlations.length;
}

export function getTypeCorrelations() {
  var correlations = [];
  getColumnUniqueValues("Disaster Type").forEach(x => {
    getColumnUniqueValues("Disaster Type").forEach(y => {
      const correlation = getCorrelation(x, y);
      correlations.push({first : x, second : y, correlation: correlation});
    })
  })
  return correlations;
}
