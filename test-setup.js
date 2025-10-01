const fetch = require('node-fetch');

async function testSetup() {
  console.log('🔍 Testing BizManager Setup...\n');
  
  // Test local backend
  try {
    console.log('Testing local backend (http://localhost:4000)...');
    const response = await fetch('http://localhost:4000/api/ping');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Local backend is running:', data);
    } else {
      console.log('❌ Local backend responded with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Local backend is not running:', error.message);
    console.log('   → Run: cd backend && npm start');
  }
  
  // Test production backend
  try {
    console.log('\nTesting production backend (https://bitzmanager-py8.onrender.com)...');
    const response = await fetch('https://bitzmanager-py8.onrender.com/api/ping');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Production backend is running:', data);
    } else {
      console.log('❌ Production backend responded with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Production backend is not accessible:', error.message);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. For local development: npm run start:full');
  console.log('2. For production: Deploy both frontend and backend to Render');
  console.log('3. Check the SETUP-GUIDE.md for detailed instructions');
}

testSetup().catch(console.error);
