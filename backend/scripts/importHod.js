const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hod = require('../models/Hod.model');
const Department = require('../src/models/Department');
const hodSeedData = require('../data/hodSeedData');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function importHod() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const departments = await Department.find({}, { _id: 1, name: 1 }).lean();
  const departmentMap = new Map(departments.map((item) => [item.name, String(item._id)]));

  const records = hodSeedData.map((item) => {
    const departmentId = departmentMap.get(item.departmentName);

    if (!departmentId) {
      throw new Error(`Department not found for HOD import: ${item.departmentName}`);
    }

    return {
      ...item,
      departmentId,
    };
  });

  await Hod.deleteMany({});
  await Hod.insertMany(records);

  console.log(`HOD import complete — ${records.length} records inserted`);
  await mongoose.disconnect();
}

importHod().catch(async (error) => {
  console.error('HOD import failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
