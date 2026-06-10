const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

try {
  const dissolveCountry = (inputFileName, outputFileName) => {
    const inputPath = path.join(__dirname, '../../../data', inputFileName);
    console.log(`Reading ${inputPath}...`);
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const geojson = JSON.parse(rawData);

    console.log(`[${inputFileName}] Original sub-regions count: ${geojson.features.length}`);

    // Merge all features into one
    const dissolved = turf.union(turf.featureCollection(geojson.features));

    if (dissolved) {
      // Create a single Feature output to match our SvgBorder logic
      const featureOutput = {
        type: "Feature",
        properties: { name: outputFileName.replace('.json', '') },
        geometry: dissolved.geometry
      };

      const outputPath = path.join(__dirname, '../../../data', outputFileName);
      fs.writeFileSync(outputPath, JSON.stringify(featureOutput), 'utf8');
      console.log(`Successfully dissolved into a clean, single boundary at: ${outputPath}`);
    } else {
      console.error(`Turf union returned null for ${inputFileName}`);
    }
  };

  dissolveCountry('uk_detailed.json', 'united_kingdom.json');
  dissolveCountry('indonesia_detailed.json', 'indonesia.json');

} catch (err) {
  console.error("Error dissolving polygons:", err);
}
