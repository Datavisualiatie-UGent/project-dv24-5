import { legend } from 'npm:@observablehq/plot';
import * as d3 from 'https://unpkg.com/d3?module'

function index(xs, x) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].name == x) {
            return i;
        }
    }

    return -1;
}

export function treeMap(groupedDisasters, selectedDisasters = []) {
    var data = Object.entries(groupedDisasters).reduce(
        (acc, [type, list]) => {
            if (!selectedDisasters.includes(type) && selectedDisasters.length != 0) {
                return acc;
            }
            acc.push({ name: type, value: 0, children: [{ name: "Other", type: type, value: 0, containing: [], children: [] }] });

            for (var i = 0; i < list.length; i++) {
                const el = list[i];
                const subType = el["Disaster Subtype"];
                if (subType == undefined) return;
                var children = acc[index(acc, type)].children;
                if (!children.map(x => x.name).includes(subType)) {
                    children.push({ name: subType, type: type, value: 1, children: [] });
                } else {
                    children[index(children, subType)].value += 1;
                }
            }
            return acc;
        }, []);
    const total = data.reduce((sum, xs) => sum += xs.children.reduce((sum, x) => sum += x.value, 0), 0);
   
    data = { name: "disasters", occurences: total, children: data };

    return Treemap(data, {
        value: d => d.value,
        label: d => (d.name == "Other" && d.containing.length == 1) ? d.containing[0].name : d.name,
        group: d => d.type,
        title: (d, n) => {
            if (!d.value) {
                d.value = d.occurences;
            }
            if (d.name == "Other") {
                var text = "";
                for (var i = 0; i < d.containing.length; i++) {
                    if (definitionTable[d.containing[i].name]) {
                        text += d.containing[i].name + ", " + d.containing[i].value + " occurences: " + definitionTable[d.containing[i].name] + "\n\n";
                    } else {
                        text += d.containing[i].name + ", " + d.containing[i].value + " occurences\n\n";
                    }
                }
                return text;
            } else {
                if (definitionTable[d.name]) {
                    return d.name + ", " + d.value + " occurences: " + definitionTable[d.name];
                } else {
                    return d.name + ", " + d.value + " occurences";
                }
            }
        },
        width: 600,
        height: 600
    })
}

// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/treemap
function Treemap(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    value, // given a node d, returns a quantitative value (for area encoding; null for count)
    sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
    label, // given a leaf node d, returns the name to display on the rectangle
    group, // given a leaf node d, returns a categorical value (for color encoding)
    title, // given a leaf node d, returns its hover text
    link, // given a leaf node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links (if any)
    tile = d3.treemapBinary, // treemap strategy
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    margin = 0, // shorthand for margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    padding = 1, // shorthand for inner and outer padding
    paddingInner = padding, // to separate a node from its adjacent siblings
    paddingOuter = padding, // shorthand for top, right, bottom, and left padding
    paddingTop = paddingOuter, // to separate a node’s top edge from its children
    paddingRight = paddingOuter, // to separate a node’s right edge from its children
    paddingBottom = paddingOuter, // to separate a node’s bottom edge from its children
    paddingLeft = paddingOuter, // to separate a node’s left edge from its children
    round = true, // whether to round to exact pixels
    colors = d3.schemeTableau10, // array of colors
    zDomain, // array of values for the color scale
    fill = "#ccc", // fill for node rects (if no group color encoding)
    fillOpacity = group == null ? null : 0.6, // fill opacity for node rects
    stroke, // stroke for node rects
    strokeWidth, // stroke width for node rects
    strokeOpacity, // stroke opacity for node rects
    strokeLinejoin, // stroke line join for node rects
  } = {}) {
  
    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
  
    // We take special care of any node that has both a value and children, see
    // https://observablehq.com/@d3/treemap-parent-with-value.
    const stratify = data => (d3.stratify().path(path)(data)).each(node => {
      if (node.children?.length && node.data != null) {
        const child = new d3.Node(node.data);
        node.data = null;
        child.depth = node.depth + 1;
        child.height = 0;
        child.parent = node;
        child.id = node.id + "/";
        node.children.unshift(child);
      }
    });
    const root = path != null ? stratify(data)
        : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
        : d3.hierarchy(data, children);
  
    // Compute the values of internal nodes by aggregating from the leaves.
    value == null ? root.count() : root.sum(d => Math.max(0, d ? value(d) : null));
  
    // Prior to sorting, if a group channel is specified, construct an ordinal color scale.
    const leaves = root.leaves();
    const G = group == null ? null : leaves.map(d => group(d.data, d));
    if (zDomain === undefined) zDomain = G;
    zDomain = new d3.InternSet(zDomain);
    const color = group == null ? null : d3.scaleOrdinal(zDomain, colors);
  
    // Compute labels and titles.
    const L = label == null ? null : leaves.map(d => label(d.data, d));
    const T = title === undefined ? L : title == null ? null : leaves.map(d => title(d.data, d));
  
    // Sort the leaves (typically by descending value for a pleasing layout).
    if (sort != null) root.sort(sort);
  
    // Compute the treemap layout.
    d3.treemap()
        .tile(tile)
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .paddingInner(paddingInner)
        .paddingTop(paddingTop)
        .paddingRight(paddingRight)
        .paddingBottom(paddingBottom)
        .paddingLeft(paddingLeft)
        .round(round)
      (root);
  
    const svg = d3.create("svg")
        .attr("viewBox", [-marginLeft, -marginTop, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
  
    const node = svg.selectAll("a")
      .data(leaves)
      .join("a")
        .attr("xlink:href", link == null ? null : (d, i) => link(d.data, d))
        .attr("target", link == null ? null : linkTarget)
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const colorDisasters = {
        "Flood": "hsl(240, 50%, 50%)",        // Blue
        "Extreme temperature": "hsl(270, 50%, 50%)", // Purple
        "Earthquake": "hsl(30, 50%, 50%)",     // Brown
        "Storm": "hsl(250, 10%, 50%)",            // Grey
        "Mass movement": "hsl(120, 50%, 50%)", // Green
        "Volcanic activity": "hsl(10, 50%, 50%)",  // Orange
        "Drought": "hsl(52, 85%, 69%)",       // Yellow
        "Wildfire": "hsl(360, 50%, 50%)"        // Red
    };
  
    node.append("rect")
        .attr("fill", (d, i) => colorDisasters[d.data.type])
        .attr("fill-opacity", fillOpacity)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);
  
    if (T) {
      node.append("title").text((d, i) => T[i]);
    }
  
    if (L) {
      // A unique identifier for clip paths (to avoid conflicts).
      const uid = `O-${Math.random().toString(16).slice(2)}`;
  
      node.append("clipPath")
         .attr("id", (d, i) => `${uid}-clip-${i}`)
       .append("rect")
         .attr("width", d => d.x1 - d.x0)
         .attr("height", d => d.y1 - d.y0);
  
      node.append("text")
          .attr("clip-path", (d, i) => `url(${new URL(`#${uid}-clip-${i}`, location)})`)
        .selectAll("tspan")
        .data((d, i) => `${L[i]}`.split(/\n/g))
        .join("tspan")
          .attr("x", 3)
          .attr("y", (d, i, D) => `${(i === D.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
          .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
          .text(d => d);   
    }
  
    return Object.assign(svg.node(), {scales: {color}});
  }

const definitionTable = {
    "Earthquake": "Sudden movement of a block of the Earth’s crust along a geological fault and associated ground shaking.",
    "Ground movement": "Surface displacement of earthen materials due to ground shaking triggered by earthquakes or volcanic eruptions.",
    "Tsunami": "A series of waves (with long wavelengths when traveling across the deep ocean) that are generated by a displacement of massive amounts of water through underwater earthquakes, volcanic eruptions, or landslides. Tsunami waves travel at very high speed across the ocean, but as they begin to reach shallow water they slow down, and the wave grows steeper.",
    "Storm (General)": "General Storm",
    "Tropical cyclone": "A tropical cyclone originates over tropical or subtropical waters. It is characterized by a warm-core, non-frontal synoptic-scale cyclone with a low-pressure center, spiral rain bands and strong winds. Depending on their location, tropical cyclones are referred to as hurricanes (Atlantic, Northeast Pacific), typhoons (Northwest Pacific), or cyclones (South Pacific and Indian Ocean).",
    "Severe weather": "Severe weather",
    "Tornado": "A violently rotating column of air that reaches the ground or open water (waterspout).",
    "Blizzard/Winter storm": "A low-pressure system in winter months with significant accumulations of snow, freezing rain, sleet, or ice. A blizzard is a severe snowstorm with winds exceeding 35 mph (56 km/h) for three or more hours, producing reduced visibility (less than 0.25 miles (400 m)).",
    "Lightning/Thunderstorms": "A high-voltage, visible electrical discharge produced by a thunderstorm and followed by the sound of thunder.",
    "Extra-tropical storm": "A type of low-pressure cyclonic system in the middle and high latitudes (also called a mid-latitude cyclone) that primarily gets its energy from the horizontal temperature contrasts (fronts) in the atmosphere. When associated with cold fronts, extra-tropical cyclones may be particularly damaging (e.g., European winter/windstorm, or Nor’easter).",
    "Hail": "Solid precipitation in the form of irregular pellets or balls of ice more than 5 mm in diameter.",
    "Sand/Dust storm": "Strong winds carrying particles of sand aloft, but generally confined to less than 50 feet (15 m), especially common in arid and semi-arid environments. A dust storm is also characterized by strong winds but carries smaller particles of dust rather than sand over an extensive area.",
    "Storm surge": "An abnormal rise in sea level generated by a tropical cyclone or other intense types of storm.",
    "Derecho": "Widespread and usually fast-moving windstorms associated with a convection/convective storm. Derechos include downburst and straight-line winds. The damage from derechos is often confused with the damage from tornadoes.",
    "Avalanche (wet)": "A large mass of loosened earth material, snow, or ice that slides, flows, or falls rapidly down a mountainside under the force of gravity. Snow Avalanche: Rapid downslope movement of a mix of snow and ice.",
    "Landslide (wet)": "Any kind of moderate to rapid soil movement incl. lahars, mudslides, and debris flows (under wet conditions). A landslide is the movement of soil or rock controlled by gravity and the speed of the movement usually ranges between slow and rapid, but it is not very slow. It can be superficial or deep, but the materials must make up a mass that is a portion of the slope or the slope itself. The movement has to be downward and outward with a free face.",
    "Mass Movement:": "Wet: Types of mass movement that occur when heavy rain or rapid snow/ice melt send large amounts of vegetation, mud, or rock down a slope driven by gravitational forces.\n\n Dry: Any type of downslope movement of earth materials under hydrological dry conditions.",
    "Landslide (dry)": "Any kind of moderate to rapid soil movement incl. lahars, mudslides, and debris flows (under dry conditions). A landslide is the movement of soil or rock controlled by gravity and the speed of the movement usually ranges between slow and rapid, but it is not very slow. It can be superficial or deep, but the materials must make up a mass that is a portion of the slope or the slope itself. The movement has to be downward and outward with a free face.",
    "Avalanche (dry)": "A large mass of loosened earth material, snow, or ice that slides, flows, or falls rapidly down a mountainside under the force of gravity. Debris Avalanche: The sudden and very rapid downslope movement of a mixed mass of rock and soil. There are two general types of debris avalanches. A cold debris avalanche usually results from an unstable slope suddenly collapsing whereas a hot debris avalanche results from volcanic activity leading to slope instability and collapse.",
    "Sudden Subsidence (dry)": "Sinking of the ground due to groundwater removal, mining, dissolution of limestone (e.g., karst sinkholes), extraction of natural gas, and earthquakes. In this case, the sinking occurs under dry conditions as a result of a geophysical trigger.",
    "Landslide (wet)": "Any kind of moderate to rapid soil movement incl. lahars, mudslides, and debris flows (under wet conditions). A landslide is the movement of soil or rock controlled by gravity and the speed of the movement usually ranges between slow and rapid, but it is not very slow. It can be superficial or deep, but the materials must make up a mass that is a portion of the slope or the slope itself. The movement has to be downward and outward with a free face.",
    "Sudden Subsidence (wet)": "Sinking of the ground due to groundwater removal, mining, dissolution of limestone (e.g., karst sinkholes), extraction of natural gas, and earthquakes. In this case, the sinking occurs under wet conditions as a result of a hydrological trigger (e.g., rain).",
    "Drought": "An extended period of unusually low precipitation that produces a shortage of water for people, animals, and plants. Drought is different from most other hazards in that it develops slowly, sometimes even over the years, and its onset is generally difficult to detect. Drought is not solely a physical phenomenon because its impacts can be exacerbated by human activities and water supply demands. Drought is therefore often defined both conceptually and operationally. Operational definitions of drought, i.e., the degree of precipitation reduction that constitutes a drought, vary by locality, climate, and environmental sector.",
    "Wildfire": "Any uncontrolled and non-prescribed combustion or burning of plants in a natural setting such as a forest, grassland, brush land or tundra, which consumes natural fuels and spreads based on environmental conditions (e.g., wind, or topography). Wildfires can be triggered by lightning or human actions.",
    "Wildfire (General)": "Any uncontrolled and non-prescribed combustion or burning of plants in a natural setting such as a forest, grassland, brush land or tundra, which consumes natural fuels and spreads based on environmental conditions (e.g., wind, or topography). Wildfires can be triggered by lightning or human actions.",
    "Forest fire": "A type of wildfire in a wooded area.",
    "Land fire (Brush, Bush, Pasture)": "A type of wildfire in a brush, bush, pasture, grassland, or other treeless natural environment.",
    "Extreme temperature": "A general term for temperature variations above (extreme heat) or below (extreme cold) normal conditions.",
    "Cold wave": "A period of abnormally cold weather. Typically, a cold wave lasts for two or more days and may be aggravated by high winds. The exact temperature criteria for what constitutes a cold wave may vary by location.",
    "Heat wave": "A period of abnormally hot and/or unusually humid weather. Typically, a heat wave lasts for two or more days. The exact temperature criteria for what constitutes a heat wave may vary by location.",
    "Severe winter conditions": "Damage caused by snow and ice. Winter damage refers to damage to buildings, infrastructure, traffic (esp. navigation) inflicted by snow and ice in the form of snow pressure, freezing rain, frozen waterways etc.",
    "Flood": " A general term for the overflow of water from a stream channel onto normally dry land in the floodplain (riverine flooding), higher-than-normal levels along the coast (coastal flooding) and in lakes or reservoirs as well as ponding of water at or near the point where the rain fell (flash floods).",
    "Flood (General)": "A general term for the overflow of water from a stream channel onto normally dry land in the floodplain (riverine flooding), higher-than-normal levels along the coast (coastal flooding) and in lakes or reservoirs as well as ponding of water at or near the point where the rain fell (flash floods).",
    "Riverine flood": "A type of flooding resulting from the overflow of water from a stream or river channel onto normally dry land in the floodplain adjacent to the channel.",
    "Flash flood": "Heavy or excessive rainfall in a short period of time that produces immediate runoff, creating flooding conditions within minutes or a few hours during or after the rainfall.",
    "Coastal flood": "Higher-than-normal water levels along the coast caused by tidal changes or thunderstorms that result in flooding, which can last from days to weeks.",
    "Glacial lake outburst flood": "These floods occur when water held back by a glacier or moraine is suddenly released. Glacial lakes can be at the front of the glacier (marginal lake) or below the ice sheet (sub-glacial lake).",
};