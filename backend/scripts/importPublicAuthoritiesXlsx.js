const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PublicAuthority = require('../src/models/PublicAuthority');
const { normalizeDepartmentName } = require('../src/utils/departmentKeywords');

dotenv.config();

const DEFAULT_XLSX_PATH = 'C:\\Users\\ELCOT\\Downloads\\RTI_Public_Authorities.xlsx';

function extractSheetXml(xlsxPath) {
  const buffer = fs.readFileSync(xlsxPath);
  const marker = Buffer.from('xl/worksheets/sheet1.xml');
  const markerIndex = buffer.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error('sheet1.xml was not found inside the workbook.');
  }

  const localHeaderOffset = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), markerIndex);
  if (localHeaderOffset === -1) {
    throw new Error('Could not locate the local file header for sheet1.xml.');
  }

  const compressionMethod = buffer.readUInt16LE(localHeaderOffset + 8);
  const compressedSize = buffer.readUInt32LE(localHeaderOffset + 18);
  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod !== 8) {
    throw new Error(`Unsupported compression method for workbook XML: ${compressionMethod}`);
  }

  return require('zlib').inflateRawSync(compressed).toString('utf8');
}

function extractRows(sheetXml) {
  const rowMatches = [...sheetXml.matchAll(/<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)];
  const rows = [];

  for (const [, rowNumber, rowXml] of rowMatches) {
    const cellMatches = [...rowXml.matchAll(/<c\b[^>]*r="([A-Z]+)\d+"[^>]*>([\s\S]*?)<\/c>/g)];
    const cells = {};

    for (const [, columnRef, cellXml] of cellMatches) {
      const textMatch = cellXml.match(/<t(?:\s+xml:space="preserve")?>([\s\S]*?)<\/t>/);
      const valueMatch = cellXml.match(/<v>([\s\S]*?)<\/v>/);
      const rawValue = textMatch ? textMatch[1] : valueMatch ? valueMatch[1] : '';
      const cleanValue = rawValue
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#10;/g, '\n')
        .trim();

      cells[columnRef] = cleanValue;
    }

    rows.push({
      rowNumber: Number(rowNumber),
      cells,
    });
  }

  return rows;
}

function buildDataset(rows) {
  const grouped = [];
  let currentDepartment = '';

  for (const row of rows) {
    if (row.rowNumber === 1) continue;

    const departmentCell = row.cells.B || '';
    const subOfficeCell = row.cells.C || '';

    if (departmentCell) {
      currentDepartment = departmentCell;
    }

    if (!currentDepartment || !subOfficeCell) {
      continue;
    }

    let target = grouped.find((entry) => entry.departmentName === currentDepartment);
    if (!target) {
      target = {
        departmentName: currentDepartment,
        normalizedDepartmentName: normalizeDepartmentName(currentDepartment),
        publicAuthorities: [],
      };
      grouped.push(target);
    }

    if (!target.publicAuthorities.includes(subOfficeCell)) {
      target.publicAuthorities.push(subOfficeCell);
    }
  }

  return grouped;
}

async function importWorkbook() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  const workbookPath = process.argv[2] || DEFAULT_XLSX_PATH;
  if (!fs.existsSync(workbookPath)) {
    throw new Error(`Workbook not found at: ${workbookPath}`);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const sheetXml = extractSheetXml(path.resolve(workbookPath));
  const rows = extractRows(sheetXml);
  const dataset = buildDataset(rows);

  let inserted = 0;
  let updated = 0;

  for (const item of dataset) {
    const existing = await PublicAuthority.findOne({
      normalizedDepartmentName: item.normalizedDepartmentName,
    }).lean();

    if (existing) {
      await PublicAuthority.updateOne({ _id: existing._id }, { $set: item });
      updated += 1;
    } else {
      await PublicAuthority.create(item);
      inserted += 1;
    }
  }

  const allowedKeys = dataset.map((item) => item.normalizedDepartmentName);
  const removed = await PublicAuthority.deleteMany({ normalizedDepartmentName: { $nin: allowedKeys } });

  console.log(
    `Public authority import complete. Inserted: ${inserted}, Updated: ${updated}, Removed: ${removed.deletedCount || 0}`
  );
}

importWorkbook()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error('Public authority import failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
