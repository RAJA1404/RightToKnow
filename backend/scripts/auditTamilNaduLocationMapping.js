const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const os = require('os');
const { execFileSync } = require('child_process');

const TALUK_WORKBOOK = 'C:\\Users\\ELCOT\\Downloads\\TN_District_Taluk_Village_FINAL.xlsx';
const BLOCK_WORKBOOK = 'C:\\Users\\ELCOT\\Downloads\\TN_Official_Villages.xlsx';
const OUTPUT_DIR = path.join(__dirname, '..', 'reports', 'tamilnadu-location-audit');
const MERGED_XLSX = path.join(OUTPUT_DIR, 'TN_District_Taluk_Block_Village.xlsx');
const MERGED_JSON = path.join(OUTPUT_DIR, 'TN_District_Taluk_Block_Village.json');
const MAPPING_JS = path.join(OUTPUT_DIR, 'districtTalukBlockMap.js');
const VALIDATION_JS = path.join(OUTPUT_DIR, 'validateAllMappings.js');
const REPORT_JSON = path.join(OUTPUT_DIR, 'statewide-audit-report.json');
const REPORT_MD = path.join(OUTPUT_DIR, 'statewide-audit-report.md');

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Kanniyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'The Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivagangai',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukkudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Villupuram',
  'Virudhunagar',
];

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function normalizeKey(value = '') {
  return String(value).toLowerCase().replace(/\s+/g, '').trim();
}

function displayText(value = '') {
  return String(value).trim();
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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
    throw new Error(`Could not locate ZIP header for ${sheetName} inside ${xlsxPath}`);
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

function buildTalukRecords(rows) {
  const records = [];
  let currentDistrict = '';
  let currentTaluk = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = displayText(row.cells.B);
    const talukCell = displayText(row.cells.C);
    const village = displayText(row.cells.D);

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (talukCell) {
      currentTaluk = talukCell;
    }

    const district = currentDistrict;
    const taluk = currentTaluk;

    if (!district || !taluk || !village) continue;

    records.push({
      id: `T-${row.rowNumber}`,
      district,
      taluk,
      village,
      key: `${normalizeKey(district)}||${normalizeKey(village)}`,
    });
  }

  return records;
}

function buildBlockRecords(rows) {
  const records = [];
  let currentDistrict = '';
  let currentBlock = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const districtCell = displayText(row.cells.B);
    const blockCell = displayText(row.cells.C);
    const village = displayText(row.cells.D);
    const villageCode = displayText(row.cells.E);

    if (districtCell) {
      currentDistrict = districtCell;
    }

    if (blockCell) {
      currentBlock = blockCell;
    }

    const district = currentDistrict;
    const block = currentBlock;

    if (!district || !block || !village) continue;

    records.push({
      id: `B-${row.rowNumber}`,
      district,
      block,
      village,
      villageCode,
      key: `${normalizeKey(district)}||${normalizeKey(village)}`,
    });
  }

  return records;
}

function groupByKey(records) {
  const map = new Map();

  for (const record of records) {
    if (!map.has(record.key)) {
      map.set(record.key, []);
    }

    map.get(record.key).push(record);
  }

  return map;
}

function buildDistrictBlockTallies(mergedRows) {
  const tally = new Map();

  for (const row of mergedRows) {
    const districtKey = normalizeKey(row.district);
    const blockKey = normalizeKey(row.block);
    const talukKey = normalizeKey(row.taluk);
    const compositeKey = `${districtKey}||${blockKey}`;

    if (!tally.has(compositeKey)) {
      tally.set(compositeKey, {
        district: row.district,
        block: row.block,
        counts: new Map(),
      });
    }

    const entry = tally.get(compositeKey);
    const current = entry.counts.get(talukKey) || { taluk: row.taluk, count: 0 };
    current.count += 1;
    entry.counts.set(talukKey, current);
  }

  return tally;
}

function deriveBlockOwnership(mergedRows) {
  const tally = buildDistrictBlockTallies(mergedRows);
  const ownerMap = new Map();
  const conflicts = [];
  const combinations = [];

  for (const entry of tally.values()) {
    const counts = [...entry.counts.values()].sort((left, right) => right.count - left.count || left.taluk.localeCompare(right.taluk));
    const top = counts[0];
    const tiedTop = counts.filter((item) => item.count === top.count);
    const ownerKey = `${normalizeKey(entry.district)}||${normalizeKey(entry.block)}`;

    combinations.push(
      ...counts.map((item) => ({
        district: entry.district,
        taluk: item.taluk,
        block: entry.block,
        villageCount: item.count,
      }))
    );

    if (tiedTop.length === 1) {
      ownerMap.set(ownerKey, top.taluk);
    } else {
      ownerMap.set(ownerKey, null);
      conflicts.push({
        district: entry.district,
        block: entry.block,
        taluks: tiedTop.map((item) => item.taluk),
        counts,
      });
    }
  }

  return { ownerMap, conflicts, combinations };
}

function mergeDatasets(talukRecords, blockRecords) {
  const talukByKey = groupByKey(talukRecords);
  const blockByKey = groupByKey(blockRecords);
  const mergedRows = [];
  const unresolvedTalukRows = [];
  const ambiguousTalukRows = [];
  const usedBlockIds = new Set();

  for (const talukRecord of talukRecords) {
    const matches = blockByKey.get(talukRecord.key) || [];

    if (matches.length === 0) {
      unresolvedTalukRows.push({
        ...talukRecord,
        reason: 'block_not_found',
      });
      continue;
    }

    if (matches.length === 1) {
      const match = matches[0];
      usedBlockIds.add(match.id);
      mergedRows.push({
        district: talukRecord.district,
        taluk: talukRecord.taluk,
        block: match.block,
        village: talukRecord.village,
        villageCode: match.villageCode,
        talukRowId: talukRecord.id,
        blockRowId: match.id,
        resolution: 'direct',
      });
      continue;
    }

    ambiguousTalukRows.push({
      ...talukRecord,
      candidates: matches,
      reason: 'multiple_blocks_same_village_name',
    });
  }

  let resolvedThisRound = true;

  while (resolvedThisRound) {
    resolvedThisRound = false;
    const { ownerMap } = deriveBlockOwnership(mergedRows);

    for (let index = ambiguousTalukRows.length - 1; index >= 0; index -= 1) {
      const row = ambiguousTalukRows[index];
      const eligibleMatches = row.candidates.filter(
        (candidate) => ownerMap.get(`${normalizeKey(candidate.district)}||${normalizeKey(candidate.block)}`) === row.taluk
      );

      if (eligibleMatches.length === 1) {
        const match = eligibleMatches[0];
        usedBlockIds.add(match.id);
        mergedRows.push({
          district: row.district,
          taluk: row.taluk,
          block: match.block,
          village: row.village,
          villageCode: match.villageCode,
          talukRowId: row.id,
          blockRowId: match.id,
          resolution: 'inferred-from-block-owner',
        });
        ambiguousTalukRows.splice(index, 1);
        resolvedThisRound = true;
      }
    }
  }

  const unmatchedBlockRows = blockRecords.filter((record) => !talukByKey.has(record.key));
  const unusedMatchedBlockRows = blockRecords.filter((record) => !usedBlockIds.has(record.id) && talukByKey.has(record.key));

  return {
    mergedRows,
    unresolvedTalukRows,
    ambiguousTalukRows,
    unmatchedBlockRows,
    unusedMatchedBlockRows,
    totalTalukRows: talukRecords.length,
    totalBlockRows: blockRecords.length,
  };
}

function buildDuplicateVillageReport(mergedRows, blockRecords) {
  const report = [];
  const officialGroups = new Map();

  for (const row of blockRecords) {
    const key = `${normalizeKey(row.district)}||${normalizeKey(row.village)}`;
    if (!officialGroups.has(key)) {
      officialGroups.set(key, []);
    }
    officialGroups.get(key).push(row);
  }

  for (const [key, officialMatches] of officialGroups.entries()) {
    if (officialMatches.length < 2) continue;

    const district = officialMatches[0].district;
    const talukMatches = mergedRows.filter(
      (row) => `${normalizeKey(row.district)}||${normalizeKey(row.village)}` === key
    );

    const distinctBlocks = [...new Set(officialMatches.map((item) => item.block))];
    const distinctTaluks = [...new Set(talukMatches.map((item) => item.taluk))];
    const distinctCodes = [...new Set(officialMatches.map((item) => item.villageCode).filter(Boolean))];

    let verdict = 'legitimate';
    if (distinctTaluks.length > 1) {
      verdict = 'error';
    } else if (distinctBlocks.length > 1 && distinctCodes.length <= 1) {
      verdict = 'error';
    }

    report.push({
      village: officialMatches[0].village,
      district,
      taluk1: distinctTaluks[0] || '',
      block1: distinctBlocks[0] || '',
      taluk2: distinctTaluks[1] || '',
      block2: distinctBlocks[1] || '',
      verdict,
      villageCodes: distinctCodes,
      taluks: distinctTaluks,
      blocks: distinctBlocks,
    });
  }

  return report.sort((left, right) => {
    if (left.verdict !== right.verdict) {
      return left.verdict === 'error' ? -1 : 1;
    }

    return left.district.localeCompare(right.district) || left.village.localeCompare(right.village);
  });
}

function buildBleedErrors(mergedRows, ownerMap) {
  const errors = [];

  for (const row of mergedRows) {
    const owner = ownerMap.get(`${normalizeKey(row.district)}||${normalizeKey(row.block)}`);
    if (owner && owner !== row.taluk) {
      errors.push({
        district: row.district,
        village: row.village,
        block: row.block,
        assignedTaluk: row.taluk,
        correctTaluk: owner,
      });
    }
  }

  return errors;
}

function buildOrphanBlockList(unmatchedBlockRows, mergedRows, ownerConflicts) {
  const matchedBlocks = new Set(
    mergedRows.map((row) => `${normalizeKey(row.district)}||${normalizeKey(row.block)}`)
  );
  const conflictedBlocks = new Set(
    ownerConflicts.map((item) => `${normalizeKey(item.district)}||${normalizeKey(item.block)}`)
  );
  const blockMap = new Map();

  for (const row of unmatchedBlockRows) {
    const key = `${normalizeKey(row.district)}||${normalizeKey(row.block)}`;
    if (matchedBlocks.has(key)) continue;

    if (!blockMap.has(key)) {
      blockMap.set(key, {
        district: row.district,
        block: row.block,
        sampleVillage: row.village,
        issue: conflictedBlocks.has(key) ? 'conflict' : 'no_taluk_match',
      });
    }
  }

  return [...blockMap.values()].sort((left, right) => left.district.localeCompare(right.district) || left.block.localeCompare(right.block));
}

function buildTalukBlockMap(mergedRows, ownerMap) {
  const map = {};

  for (const row of mergedRows) {
    const district = row.district;
    const taluk = row.taluk;
    const block = row.block;
    const owner = ownerMap.get(`${normalizeKey(district)}||${normalizeKey(block)}`);

    if (!owner || owner !== taluk) continue;

    if (!map[district]) {
      map[district] = {};
    }

    if (!map[district][taluk]) {
      map[district][taluk] = [];
    }

    if (!map[district][taluk].includes(block)) {
      map[district][taluk].push(block);
    }
  }

  for (const district of Object.keys(map)) {
    for (const taluk of Object.keys(map[district])) {
      map[district][taluk].sort((left, right) => left.localeCompare(right));
    }
  }

  for (const district of Object.keys(map)) {
    const sortedTaluks = Object.keys(map[district])
      .sort((left, right) => left.localeCompare(right))
      .reduce((accumulator, taluk) => {
        accumulator[taluk] = map[district][taluk];
        return accumulator;
      }, {});
    map[district] = sortedTaluks;
  }

  return Object.fromEntries(
    Object.keys(map)
      .sort((left, right) => left.localeCompare(right))
      .map((district) => [district, map[district]])
  );
}

function summarizeByDistrict({
  mergedRows,
  unresolvedTalukRows,
  ambiguousTalukRows,
  unmatchedBlockRows,
  ownerConflicts,
  duplicateVillageReport,
  bleedErrors,
  mappingObject,
}) {
  const districts = new Set([
    ...TAMIL_NADU_DISTRICTS,
    ...mergedRows.map((row) => row.district),
    ...unresolvedTalukRows.map((row) => row.district),
    ...unmatchedBlockRows.map((row) => row.district),
  ]);

  const summary = [...districts].map((district) => {
    const districtMerged = mergedRows.filter((row) => row.district === district);
    const districtTaluks = Object.keys(mappingObject[district] || {});
    const districtBlocks = new Set(districtMerged.map((row) => row.block));
    const unmatchedCount =
      unresolvedTalukRows.filter((row) => row.district === district).length +
      ambiguousTalukRows.filter((row) => row.district === district).length +
      unmatchedBlockRows.filter((row) => row.district === district).length;
    const conflictsCount =
      ownerConflicts.filter((item) => item.district === district).length +
      duplicateVillageReport.filter((item) => item.district === district && item.verdict === 'error').length +
      bleedErrors.filter((item) => item.district === district).length;
    const missingDistrict = !districtMerged.length && !unmatchedCount && !conflictsCount;
    const status = missingDistrict || unmatchedCount > 0 || conflictsCount > 0 ? 'FAIL' : 'OK';

    return {
      district,
      taluks: districtTaluks.length,
      blocks: districtBlocks.size,
      villages: districtMerged.length,
      unmatched: unmatchedCount,
      conflicts: conflictsCount,
      status,
      missingDistrict,
    };
  });

  summary.sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === 'FAIL' ? -1 : 1;
    }

    return left.district.localeCompare(right.district);
  });

  return summary;
}

function columnName(index) {
  let current = index;
  let result = '';

  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }

  return result;
}

function writeXlsx(rows, outputPath) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rti-xlsx-'));
  const xlDir = path.join(tempRoot, 'xl');
  const relsDir = path.join(tempRoot, '_rels');
  const xlRelsDir = path.join(xlDir, '_rels');
  const worksheetDir = path.join(xlDir, 'worksheets');

  fs.mkdirSync(relsDir, { recursive: true });
  fs.mkdirSync(xlRelsDir, { recursive: true });
  fs.mkdirSync(worksheetDir, { recursive: true });

  const sheetRowsXml = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const cellsXml = row
        .map((cell, cellIndex) => {
          const ref = `${columnName(cellIndex + 1)}${rowNumber}`;
          if (typeof cell === 'number') {
            return `<c r="${ref}"><v>${cell}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(cell ?? '')}</t></is></c>`;
        })
        .join('');

      return `<row r="${rowNumber}">${cellsXml}</row>`;
    })
    .join('');

  const worksheetXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<sheetData>${sheetRowsXml}</sheetData>` +
    '</worksheet>';

  const workbookXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<sheets><sheet name="Merged Data" sheetId="1" r:id="rId1"/></sheets>' +
    '</workbook>';

  const contentTypesXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
    '</Types>';

  const rootRelsXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    '</Relationships>';

  const workbookRelsXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
    '</Relationships>';

  fs.writeFileSync(path.join(tempRoot, '[Content_Types].xml'), contentTypesXml, 'utf8');
  fs.writeFileSync(path.join(relsDir, '.rels'), rootRelsXml, 'utf8');
  fs.writeFileSync(path.join(xlDir, 'workbook.xml'), workbookXml, 'utf8');
  fs.writeFileSync(path.join(xlRelsDir, 'workbook.xml.rels'), workbookRelsXml, 'utf8');
  fs.writeFileSync(path.join(worksheetDir, 'sheet1.xml'), worksheetXml, 'utf8');

  const zipPath = `${outputPath}.zip`;
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  execFileSync(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${tempRoot}\\*' -DestinationPath '${zipPath}' -Force`,
    ],
    { stdio: 'ignore' }
  );

  fs.renameSync(zipPath, outputPath);
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function renderMappingObject(mappingObject) {
  return `const districtTalukBlockMap = ${JSON.stringify(mappingObject, null, 2)};\n\nmodule.exports = districtTalukBlockMap;\n`;
}

function renderValidationFunction() {
  return `const districtTalukBlockMap = require('./districtTalukBlockMap');\n\nfunction getVillagesForTaluk(district, taluk, allVillages) {\n  const blocks = (districtTalukBlockMap[district] || {})[taluk] || [];\n  return allVillages.filter(v =>\n    v.district === district && blocks.includes(v.block)\n  );\n}\n\nfunction validateAllMappings(allVillages) {\n  const errors = [];\n  allVillages.forEach(v => {\n    const blocks = (districtTalukBlockMap[v.district] || {})[v.taluk] || [];\n    if (!blocks.includes(v.block)) {\n      errors.push({\n        type: 'wrong_block_for_taluk',\n        district: v.district,\n        taluk: v.taluk,\n        block: v.block,\n        village: v.village,\n      });\n    }\n  });\n  console.table(errors);\n  return errors;\n}\n\nmodule.exports = {\n  districtTalukBlockMap,\n  getVillagesForTaluk,\n  validateAllMappings,\n};\n`;
}

function renderMarkdownReport(summary, report) {
  const lines = [];
  lines.push('# Tamil Nadu Taluk-Block-Village Audit');
  lines.push('');
  lines.push(`Merged rows: ${report.mergeStats.mergedRows}`);
  lines.push(`Unmatched taluk rows: ${report.mergeStats.unmatchedTalukRows}`);
  lines.push(`Unmatched block rows: ${report.mergeStats.unmatchedBlockRows}`);
  lines.push(`Ambiguous taluk rows: ${report.mergeStats.ambiguousTalukRows}`);
  lines.push('');
  lines.push('| District | Taluks | Blocks | Villages | Unmatched | Conflicts | Status |');
  lines.push('|----------|--------|--------|----------|-----------|-----------|--------|');
  for (const row of summary) {
    lines.push(`| ${row.district} | ${row.taluks} | ${row.blocks} | ${row.villages} | ${row.unmatched} | ${row.conflicts} | ${row.status} |`);
  }
  lines.push('');
  lines.push(`Statewide totals: districts=${report.statewideTotals.districts}, taluks=${report.statewideTotals.taluks}, blocks=${report.statewideTotals.blocks}, villages=${report.statewideTotals.villages}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function main() {
  const talukWorkbook = process.argv[2] || TALUK_WORKBOOK;
  const blockWorkbook = process.argv[3] || BLOCK_WORKBOOK;

  if (!fs.existsSync(talukWorkbook)) {
    throw new Error(`Taluk workbook not found: ${talukWorkbook}`);
  }

  if (!fs.existsSync(blockWorkbook)) {
    throw new Error(`Block workbook not found: ${blockWorkbook}`);
  }

  ensureDirectory(OUTPUT_DIR);

  const talukRows = parseRows(extractSheetXml(talukWorkbook));
  const blockRows = parseRows(extractSheetXml(blockWorkbook));
  const talukRecords = buildTalukRecords(talukRows);
  const blockRecords = buildBlockRecords(blockRows);

  const mergeResult = mergeDatasets(talukRecords, blockRecords);
  const ownership = deriveBlockOwnership(mergeResult.mergedRows);
  const duplicateVillageReport = buildDuplicateVillageReport(mergeResult.mergedRows, blockRecords);
  const bleedErrors = buildBleedErrors(mergeResult.mergedRows, ownership.ownerMap);
  const orphanBlocks = buildOrphanBlockList(mergeResult.unmatchedBlockRows, mergeResult.mergedRows, ownership.conflicts);
  const mappingObject = buildTalukBlockMap(mergeResult.mergedRows, ownership.ownerMap);
  const districtSummary = summarizeByDistrict({
    mergedRows: mergeResult.mergedRows,
    unresolvedTalukRows: mergeResult.unresolvedTalukRows,
    ambiguousTalukRows: mergeResult.ambiguousTalukRows,
    unmatchedBlockRows: mergeResult.unmatchedBlockRows,
    ownerConflicts: ownership.conflicts,
    duplicateVillageReport,
    bleedErrors,
    mappingObject,
  });

  const mergedOutputRows = [
    ['District', 'Taluk', 'Block', 'Village Name'],
    ...mergeResult.mergedRows
      .slice()
      .sort((left, right) => {
        return (
          left.district.localeCompare(right.district) ||
          left.taluk.localeCompare(right.taluk) ||
          left.block.localeCompare(right.block) ||
          left.village.localeCompare(right.village)
        );
      })
      .map((row) => [row.district, row.taluk, row.block, row.village]),
  ];

  const report = {
    sourceCoverage: {
      expectedDistricts: TAMIL_NADU_DISTRICTS.length,
      talukWorkbookDistricts: [...new Set(talukRecords.map((row) => row.district))].sort(),
      blockWorkbookDistricts: [...new Set(blockRecords.map((row) => row.district))].sort(),
      missingDistricts: TAMIL_NADU_DISTRICTS.filter(
        (district) =>
          !talukRecords.some((row) => row.district === district) && !blockRecords.some((row) => row.district === district)
      ),
    },
    mergeStats: {
      totalTalukRows: mergeResult.totalTalukRows,
      totalBlockRows: mergeResult.totalBlockRows,
      mergedRows: mergeResult.mergedRows.length,
      unmatchedTalukRows: mergeResult.unresolvedTalukRows.length,
      unmatchedBlockRows: mergeResult.unmatchedBlockRows.length,
      ambiguousTalukRows: mergeResult.ambiguousTalukRows.length,
      unusedMatchedBlockRows: mergeResult.unusedMatchedBlockRows.length,
    },
    blockOwnership: {
      combinations: ownership.combinations,
      conflicts: ownership.conflicts,
    },
    duplicates: duplicateVillageReport,
    bleedErrors,
    orphans: {
      villages: mergeResult.unresolvedTalukRows,
      blocks: orphanBlocks,
      taluks: districtSummary.filter((row) => row.missingDistrict).map((row) => row.district),
    },
    districtSummary,
    statewideTotals: {
      districts: districtSummary.length,
      taluks: districtSummary.reduce((total, row) => total + row.taluks, 0),
      blocks: districtSummary.reduce((total, row) => total + row.blocks, 0),
      villages: districtSummary.reduce((total, row) => total + row.villages, 0),
      unmatched: districtSummary.reduce((total, row) => total + row.unmatched, 0),
      conflicts: districtSummary.reduce((total, row) => total + row.conflicts, 0),
    },
    mappingObject,
  };

  writeXlsx(mergedOutputRows, MERGED_XLSX);
  fs.writeFileSync(MERGED_JSON, `${JSON.stringify(mergeResult.mergedRows, null, 2)}\n`, 'utf8');
  fs.writeFileSync(MAPPING_JS, renderMappingObject(mappingObject), 'utf8');
  fs.writeFileSync(VALIDATION_JS, renderValidationFunction(), 'utf8');
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(REPORT_MD, renderMarkdownReport(districtSummary, report), 'utf8');

  console.log(`Merged rows written to ${MERGED_XLSX}`);
  console.log(`Mapping written to ${MAPPING_JS}`);
  console.log(`Validation helper written to ${VALIDATION_JS}`);
  console.log(`Audit report written to ${REPORT_JSON}`);
  console.log(
    JSON.stringify(
      {
        mergedRows: mergeResult.mergedRows.length,
        unmatchedTalukRows: mergeResult.unresolvedTalukRows.length,
        unmatchedBlockRows: mergeResult.unmatchedBlockRows.length,
        ambiguousTalukRows: mergeResult.ambiguousTalukRows.length,
        unusedMatchedBlockRows: mergeResult.unusedMatchedBlockRows.length,
        ownershipConflicts: ownership.conflicts.length,
        bleedErrors: bleedErrors.length,
        duplicateVillageErrors: duplicateVillageReport.filter((item) => item.verdict === 'error').length,
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (error) {
  console.error('Statewide audit failed:', error.message);
  process.exit(1);
}
