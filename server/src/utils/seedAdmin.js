import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    await Admin.create({
      name: 'Yahya Mohamed',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log('You can now log in to the admin panel.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
