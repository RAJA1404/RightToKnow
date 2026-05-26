const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const FINAL_TALUK_VILLAGE_XLSX = 'C:\\Users\\ELCOT\\Downloads\\TN_District_Taluk_Village_FINAL.xlsx';
const OFFICIAL_VILLAGES_XLSX = 'C:\\Users\\ELCOT\\Downloads\\TN_Official_Villages.xlsx';
const TALUKS_XLSX = 'C:\\Users\\ELCOT\\Downloads\\TamilNadu_Districts_Taluks.xlsx';
const VILLAGES_XLSX = 'C:\\Users\\ELCOT\\Downloads\\TN_District_Taluk_Village.xlsx';
const OUTPUT_JSON = path.join(__dirname, '..', 'src', 'data', 'districts.json');

function extractSheetXml(xlsxPath, sheetName = 'sheet1.xml') {
  const buffer = fs.readFileSync(xlsxPath);
  const marker = Buffer.from(`xl/worksheets/${sheetName}`);
  const markerIndex = buffer.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Could not find ${sheetName} inside ${xlsxPath}`);
  }

  const signature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  const localHeaderOffset = buffer.lastIndexOf(signature, markerIndex);

  if (localHeaderOffset === -1) {
    throw new Error(`Could not locate the local ZIP header for ${sheetName} inside ${xlsxPath}`);
  }

  const compressionMethod = buffer.readUInt16LE(localHeaderOffset + 8);
  const compressedSize = buffer.readUInt32LE(localHeaderOffset + 18);
  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod !== 8) {
    throw new Error(`Unsupported compression method ${compressionMethod} in ${xlsxPath}`);
  }

  return zlib.inflateRawSync(compressed).toString('utf8');
}

function decodeCellValue(raw = '') {
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#10;/g, '\n')
    .trim();
}

function parseRows(sheetXml) {
  const rowMatches = [...sheetXml.matchAll(/<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)];

  return rowMatches.map(([, rowNumber, rowXml]) => {
    const cells = {};

    for (const [, columnRef, cellXml] of rowXml.matchAll(/<c\b[^>]*r="([A-Z]+)\d+"[^>]*>([\s\S]*?)<\/c>/g)) {
      const textMatch = cellXml.match(/<t(?:\s+xml:space="preserve")?>([\s\S]*?)<\/t>/);
      const valueMatch = cellXml.match(/<v>([\s\S]*?)<\/v>/);
      const rawValue = textMatch ? textMatch[1] : valueMatch ? valueMatch[1] : '';
      cells[columnRef] = decodeCellValue(rawValue);
    }

    return {
      rowNumber: Number(rowNumber),
      cells,
    };
  });
}

function buildHierarchyFromOfficialWorkbook(rows) {
  const districtMap = new Map();
  let currentDistrict = '';
  let currentTaluk = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = row.cells.B || '';
    const talukCell = row.cells.C || '';
    const villageCell = row.cells.D || '';

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (talukCell) {
      currentTaluk = talukCell;
    }

    if (!currentDistrict || !currentTaluk || !villageCell) {
      continue;
    }

    if (!districtMap.has(currentDistrict)) {
      districtMap.set(currentDistrict, {
        district: currentDistrict,
        taluks: [],
      });
    }

    const districtEntry = districtMap.get(currentDistrict);
    let talukEntry = districtEntry.taluks.find((taluk) => taluk.name === currentTaluk);

    if (!talukEntry) {
      talukEntry = {
        name: currentTaluk,
        villages: [],
      };
      districtEntry.taluks.push(talukEntry);
    }

    if (!talukEntry.villages.includes(villageCell)) {
      talukEntry.villages.push(villageCell);
    }
  }

  return districtMap;
}

function buildHierarchyFromFinalWorkbook(rows) {
  const districtMap = new Map();
  let currentDistrict = '';
  let currentTaluk = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = row.cells.B || '';
    const talukCell = row.cells.C || '';
    const villageCell = row.cells.D || '';

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (talukCell) {
      currentTaluk = talukCell;
    }

    if (!currentDistrict || !currentTaluk || !villageCell) {
      continue;
    }

    if (!districtMap.has(currentDistrict)) {
      districtMap.set(currentDistrict, {
        district: currentDistrict,
        taluks: [],
      });
    }

    const districtEntry = districtMap.get(currentDistrict);
    let talukEntry = districtEntry.taluks.find((taluk) => taluk.name === currentTaluk);

    if (!talukEntry) {
      talukEntry = {
        name: currentTaluk,
        villages: [],
      };
      districtEntry.taluks.push(talukEntry);
    }

    if (!talukEntry.villages.includes(villageCell)) {
      talukEntry.villages.push(villageCell);
    }
  }

  return districtMap;
}

function buildBaseHierarchy(rows) {
  const districtMap = new Map();
  let currentDistrict = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = row.cells.B || '';
    const talukCell = row.cells.C || '';

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (!currentDistrict || !talukCell) {
      continue;
    }

    if (!districtMap.has(currentDistrict)) {
      districtMap.set(currentDistrict, {
        district: currentDistrict,
        taluks: [],
      });
    }

    const districtEntry = districtMap.get(currentDistrict);
    const talukExists = districtEntry.taluks.some((taluk) => taluk.name === talukCell);
    if (!talukExists) {
      districtEntry.taluks.push({
        name: talukCell,
        villages: [],
      });
    }
  }

  return districtMap;
}

function mergeVillages(rows, districtMap) {
  let currentDistrict = '';
  let currentTaluk = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = row.cells.B || '';
    const talukCell = row.cells.C || '';
    const villageCell = row.cells.D || '';

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (talukCell) {
      currentTaluk = talukCell;
    }

    if (!currentDistrict || !currentTaluk || !villageCell) {
      continue;
    }

    if (!districtMap.has(currentDistrict)) {
      districtMap.set(currentDistrict, {
        district: currentDistrict,
        taluks: [],
      });
    }

    const districtEntry = districtMap.get(currentDistrict);
    let talukEntry = districtEntry.taluks.find((taluk) => taluk.name === currentTaluk);

    if (!talukEntry) {
      talukEntry = {
        name: currentTaluk,
        villages: [],
      };
      districtEntry.taluks.push(talukEntry);
    }

    if (!talukEntry.villages.includes(villageCell)) {
      talukEntry.villages.push(villageCell);
    }
  }
}

function sortHierarchy(districtMap) {
  return [...districtMap.values()]
    .sort((a, b) => a.district.localeCompare(b.district))
    .map((districtEntry) => ({
      district: districtEntry.district,
      taluks: districtEntry.taluks
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((taluk) => ({
          name: taluk.name,
          villages: (taluk.villages.length ? taluk.villages : [taluk.name]).sort((a, b) => a.localeCompare(b)),
        })),
    }));
}

function isOfficialVillageWorkbook(rows) {
  const headerRow = rows.find((row) => row.rowNumber === 1);
  return (
    headerRow?.cells?.B === 'District' &&
    headerRow?.cells?.C === 'Block / Panchayat Union' &&
    headerRow?.cells?.D === 'Village Name'
  );
}

function isFinalTalukVillageWorkbook(rows) {
  const headerRow = rows.find((row) => row.rowNumber === 1);
  return headerRow?.cells?.B === 'District' && headerRow?.cells?.C === 'Taluk' && headerRow?.cells?.D === 'Village Name';
}

function main() {
  const primaryWorkbook = process.argv[2] || FINAL_TALUK_VILLAGE_XLSX;
  const secondaryWorkbook = process.argv[3] || VILLAGES_XLSX;

  if (!fs.existsSync(primaryWorkbook)) {
    throw new Error(`Location workbook not found: ${primaryWorkbook}`);
  }

  const primaryRows = parseRows(extractSheetXml(primaryWorkbook));
  let hierarchy;

  if (isFinalTalukVillageWorkbook(primaryRows)) {
    hierarchy = sortHierarchy(buildHierarchyFromFinalWorkbook(primaryRows));
  } else if (isOfficialVillageWorkbook(primaryRows)) {
    hierarchy = sortHierarchy(buildHierarchyFromOfficialWorkbook(primaryRows));
  } else {
    if (!fs.existsSync(secondaryWorkbook)) {
      throw new Error(`Village workbook not found: ${secondaryWorkbook}`);
    }

    const villageRows = parseRows(extractSheetXml(secondaryWorkbook));
    const districtMap = buildBaseHierarchy(primaryRows);
    mergeVillages(villageRows, districtMap);
    hierarchy = sortHierarchy(districtMap);
  }

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(hierarchy, null, 2)}\n`, 'utf8');

  const talukCount = hierarchy.reduce((total, district) => total + district.taluks.length, 0);
  const villageCount = hierarchy.reduce(
    (total, district) => total + district.taluks.reduce((talukTotal, taluk) => talukTotal + taluk.villages.length, 0),
    0
  );

  console.log(
    `Location hierarchy import complete. Districts: ${hierarchy.length}, Taluks: ${talukCount}, Villages: ${villageCount}`
  );
  console.log(`Written to: ${OUTPUT_JSON}`);
}

try {
  main();
} catch (error) {
  console.error('Location hierarchy import failed:', error.message);
  process.exit(1);
}
