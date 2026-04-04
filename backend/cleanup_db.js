const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const Student = require('./models/Student');

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    // Find records missing required fields
    const malformedStudents = await Student.find({
      $or: [
        { name: { $exists: false } },
        { studentId: { $exists: false } },
        { name: '' },
        { studentId: '' }
      ]
    });

    console.log(`Found ${malformedStudents.length} malformed student records.`);

    if (malformedStudents.length > 0) {
      const ids = malformedStudents.map(s => s._id);
      const result = await Student.deleteMany({ _id: { $in: ids } });
      console.log(`Successfully deleted ${result.deletedCount} malformed records.`);
    }

    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

cleanup();
