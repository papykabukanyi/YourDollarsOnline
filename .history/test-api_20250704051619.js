// Test script to verify API endpoints are working
// Run this after starting the development server

const testEndpoints = [
  '/api/categories',
  '/api/search?q=test',
  '/api/products',
  '/api/init',
  '/api/seed'
];

async function testAPI() {
  console.log('Testing API endpoints...');
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      const data = await response.json();
      console.log(`✅ ${endpoint}: Status ${response.status}`, data);
    } catch (error) {
      console.log(`❌ ${endpoint}: Error`, error.message);
    }
  }
}

// Run tests
testAPI();
