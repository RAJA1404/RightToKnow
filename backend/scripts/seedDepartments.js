const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Department = require('../src/models/Department');
const { buildDepartmentCode, buildDepartmentKeywords, normalizeDepartmentName } = require('../src/utils/departmentKeywords');

dotenv.config();

const DEPARTMENTS = [
  { name: 'Adi Dravidar and Tribal Welfare Department', category: 'Social Welfare' },
  { name: 'Agriculture and Farmers Welfare Department', category: 'Agriculture' },
  { name: 'Animal Husbandry, Dairy and Fisheries Department', category: 'Agriculture' },
  { name: 'Backward Classes and Minorities Welfare Department', category: 'Social Welfare' },
  { name: 'Commercial Taxes and Registration Department', category: 'Finance' },
  { name: 'Cooperation, Food and Consumer Protection Department', category: 'Public Services' },
  { name: 'Energy Department', category: 'Energy' },
  { name: 'Environment and Forest Department', category: 'Environment' },
  { name: 'Finance Department', category: 'Finance' },
  { name: 'Handlooms and Textiles Department', category: 'Industry' },
  { name: 'Health and Family Welfare Department', category: 'Health' },
  { name: 'Higher Education Department', category: 'Education' },
  { name: 'Highways and Minor Ports Department', category: 'Infrastructure' },
  { name: 'Home Department', category: 'Law & Order' },
  { name: 'Housing and Urban Development Department', category: 'Urban Development' },
  { name: 'Human Resources Management Department', category: 'Administration' },
  { name: 'Industries Department', category: 'Industry' },
  { name: 'Information Technology Department', category: 'Technology' },
  { name: 'Labour Welfare Department', category: 'Labour' },
  { name: 'Law Department', category: 'Legal' },
  { name: 'Legislative Assembly Department', category: 'Government' },
  { name: 'Micro, Small and Medium Enterprises Department', category: 'Industry' },
  { name: 'Municipal Administration and Water Supply', category: 'Civic' },
  { name: 'Natural Resources Department', category: 'Environment' },
  { name: 'Planning and Development Department', category: 'Planning' },
  { name: 'Prohibition and Excise Department', category: 'Regulation' },
  { name: 'Public Department', category: 'Administration' },
  { name: 'Public Works Department', category: 'Infrastructure' },
  { name: 'Revenue and Disaster Management Department', category: 'Revenue' },
  { name: 'Rural Development Department', category: 'Rural' },
  { name: 'School Education Department', category: 'Education' },
  { name: 'Social Reforms Department', category: 'Social' },
  { name: 'Social Welfare Department', category: 'Social Welfare' },
  { name: 'Special Programmes Implementation Department', category: 'Planning' },
  { name: 'Tamil Development Department', category: 'Culture' },
  { name: 'Tourism and Culture Department', category: 'Tourism' },
  { name: 'Transport Department', category: 'Transport' },
  { name: 'Water Resources Department', category: 'Water' },
  { name: 'Welfare of Differently Abled Persons Department', category: 'Social Welfare' },
  { name: 'Youth Welfare and Sports Development Department', category: 'Sports' },
];

async function seedDepartments() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let inserted = 0;
  let updated = 0;
  let removed = 0;

  for (const department of DEPARTMENTS) {
    const normalizedName = normalizeDepartmentName(department.name);
    const payload = {
      name: department.name,
      normalizedName,
      code: buildDepartmentCode(department.name),
      category: department.category,
      keywords: buildDepartmentKeywords(department.name, department.category),
    };

    const existing = await Department.findOne({
      $or: [{ normalizedName }, { name: department.name }],
    }).lean();

    if (existing) {
      await Department.updateOne({ _id: existing._id }, { $set: payload });
      updated += 1;
    } else {
      await Department.create(payload);
      inserted += 1;
    }
  }

  const allowedNames = DEPARTMENTS.map((department) => department.name);
  const deletionResult = await Department.deleteMany({ name: { $nin: allowedNames } });
  removed = deletionResult.deletedCount || 0;

  console.log(`Department seeding complete. Inserted: ${inserted}, Updated: ${updated}, Removed: ${removed}`);
}

seedDepartments()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error('Department seeding failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
