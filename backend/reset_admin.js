const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-management';

async function resetAdmin() {
  await mongoose.connect(MONGO_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.findOneAndUpdate(
    { username: 'admin' },
    { username: 'admin', password: hashedPassword },
    { upsert: true, new: true }
  );
  console.log('Admin password reset to "admin123"');
  process.exit(0);
}

resetAdmin();
