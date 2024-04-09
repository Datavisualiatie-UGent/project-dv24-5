export function getDisastersPerColor(selectedDisasters) {
    const colorDisasters = {
        "Flood": "blue", 
        "Extreme temperature": "purple", 
        "Earthquake": "brown", 
        "Storm": "grey", 
        "Mass Movement": "green",
        "Volcanic activity": "orange", 
        "Drought": "yellow", 
        "Wildfire": "red"
    };
    return [
        selectedDisasters,
        selectedDisasters.map((disaster) => colorDisasters[disaster]),
    ];
}