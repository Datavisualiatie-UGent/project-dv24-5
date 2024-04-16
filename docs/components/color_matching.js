export function getDisastersPerColor(selectedDisasters) {
    const colorDisasters = {
        "Flood": "hsl(240, 50%, 50%)",        // Blue
        "Extreme temperature": "hsl(270, 50%, 50%)", // Purple
        "Earthquake": "hsl(30, 50%, 50%)",     // Brown
        "Storm": "hsl(250, 10%, 50%)",            // Grey
        "Mass Movement": "hsl(120, 50%, 50%)", // Green
        "Volcanic activity": "hsl(10, 50%, 50%)",  // Orange
        "Drought": "hsl(70, 50%, 50%)",       // Yellow
        "Wildfire": "hsl(360, 50%, 50%)"        // Red
    };
    return [
        selectedDisasters,
        selectedDisasters.map((disaster) => colorDisasters[disaster]),
    ];
}