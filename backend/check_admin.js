const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-management';

async function checkAdmin() {
  await mongoose.connect(MONGO_URI);
  const admin = await Admin.findOne({ username: 'admin' });
  if (admin) {
    console.log('Admin already exists: username is "admin"');
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = new Admin({ username: 'admin', password: hashedPassword });
    await newAdmin.save();
    console.log('Created temporary admin: admin / admin123');
  }
  process.exit(0);
}

checkAdmin();
