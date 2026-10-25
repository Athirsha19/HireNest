
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// User Schema (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'employer', 'admin'], required: true },
  status: { type: String, enum: ['pending', 'active', 'rejected', 'blocked'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Function to ask questions
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main function
async function createAdmin() {
  try {
    console.log('\n🛡️  HireNest Admin Creator\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!\n');
      console.log('Existing Admin Details:');
      console.log('Name:', existingAdmin.name);
      console.log('Email:', existingAdmin.email);
      console.log('Status:', existingAdmin.status);
      console.log('\n');
      
      const overwrite = await question('Do you want to delete and create new admin? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('\n❌ Operation cancelled');
        process.exit(0);
      }
      
      await User.findByIdAndDelete(existingAdmin._id);
      console.log('✅ Existing admin deleted\n');
    }

    // Get admin details from user
    const name = await question('Enter admin name (default: Admin): ') || 'Admin';
    const email = await question('Enter admin email (default: admin@HireNest.com): ') || 'admin@HireNest.com';
    const mobile = await question('Enter admin mobile (default: 9999999999): ') || '9999999999';
    const password = await question('Enter admin password (default: admin123): ') || 'admin123';

    console.log('\n⏳ Creating admin user...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await User.create({
      name: name,
      email: email,
      mobile: mobile,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('\n✅ Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', admin.name);
    console.log('📱 Mobile:', admin.mobile);
    console.log('🆔 Admin ID:', admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!\n');
    console.log('🌐 Login at: http://localhost:3000/login\n');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.log('\n⚠️  Email already exists. Please use a different email or delete existing user.\n');
    }
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run the script
createAdmin();