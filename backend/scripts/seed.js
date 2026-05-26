const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../src/models/Department');
const Category = require('../src/models/Category');
const SampleQuestion = require('../src/models/SampleQuestion');

dotenv.config({ path: './.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Department.deleteMany({});
    await Category.deleteMany({});
    await SampleQuestion.deleteMany({});

    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Education' },
      { name: 'Health' },
      { name: 'Infrastructure' },
      { name: 'Governance' },
      { name: 'Environment' }
    ]);

    // Seed Departments
    await Department.insertMany([
      {
        name: 'Ministry of Education',
        description: 'Handles all central education policies and institutions.',
        code: 'MIN_EDU',
        category: 'Education',
        keywords: ['school', 'college', 'university', 'exam', 'scholarship', 'teacher', 'degree']
      },
      {
        name: 'Ministry of Health and Family Welfare',
        description: 'Responsible for public health and medical services.',
        code: 'MIN_HEALTH',
        category: 'Health',
        keywords: ['hospital', 'doctor', 'medicine', 'vaccine', 'health', 'clinic', 'surgery']
      },
      {
        name: 'Department of Roads and Highways',
        description: 'Infrastructure development and maintenance.',
        code: 'DEPT_ROADS',
        category: 'Infrastructure',
        keywords: ['road', 'bridge', 'highway', 'pothole', 'street', 'construction', 'toll']
      },
      {
        name: 'Municipal Corporation',
        description: 'Local governance and civic amenities.',
        code: 'MUNI_CORP',
        category: 'Governance',
        keywords: ['water', 'garbage', 'sewage', 'light', 'park', 'waste', 'drainage']
      },
      {
        name: 'Ministry of Environment, Forest and Climate Change',
        description: 'Environment protection and forest management.',
        code: 'MIN_ENV',
        category: 'Environment',
        keywords: ['pollution', 'tree', 'forest', 'air', 'river', 'wildlife', 'plastic']
      }
    ]);

    // Seed Sample Questions
    await SampleQuestion.insertMany([
      {
        category: 'Education',
        question: 'What is the total budget allocated for the primary school in My District for the year 2023-24?'
      },
      {
        category: 'Infrastructure',
        question: 'Provide the copy of the contract awarded for the repairs of the Main Road near Sector 5.'
      },
      {
        category: 'Health',
        question: 'What is the current vacancy status of medical officers in the Govt Hospital?'
      },
      {
        category: 'Governance',
        question: 'How many cleanliness drives were conducted in the locality in the last 6 months?'
      },
      {
        category: 'Governance',
        question: 'What is the status of the water pipeline project sanctioned for our area?'
      }
    ]);

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
