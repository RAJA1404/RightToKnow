const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config({ path: './.env' });

const testUsers = [
  {
    email: 'citizen@example.com',
    password: 'Citizen@123',
    firstName: 'John',
    lastName: 'Citizen',
    phone: '9876543210',
    address: '123 Main St, Tamil Nadu',
    aadhaarNo: '123456789012',
    role: 'citizen',
  },
  {
    email: 'admin@example.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '9876543211',
    address: '456 Admin Ave, Tamil Nadu',
    aadhaarNo: '123456789013',
    role: 'main_admin',
  },
  {
    email: 'pio@example.com',
    password: 'Pio@123',
    firstName: 'PIO',
    lastName: 'Officer',
    phone: '9876543212',
    address: '789 PIO Lane, Tamil Nadu',
    aadhaarNo: '123456789014',
    role: 'pio',
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding users...');

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('Cleared existing test users');

    // Create test users
    const createdUsers = await User.insertMany(testUsers);
    console.log('\n✅ Test users created successfully!\n');
    
    createdUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${testUsers.find(u => u.email === user.email).password}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedUsers();
