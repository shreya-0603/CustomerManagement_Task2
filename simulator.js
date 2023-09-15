const axios = require('axios');

const SERVER_URL = 'http://localhost:3000'; 
// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random first names and last names using the provided data
const firstNames = ['Leia', 'Sadie', 'Jose', 'Sara', 'Frank', 'Dewey', 'Tomas', 'Joel', 'Lukas', 'Carlos'];
const lastNames = ['Liberty', 'Ray', 'Harrison', 'Ronan', 'Drew', 'Powell', 'Larsen', 'Chan', 'Anderson', 'Lane'];

function generateRandomCustomer() {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomAge = getRandomInt(10, 90);
  const randomid = getRandomInt(1,100);
  return {
    firstName: randomFirstName,
    lastName: randomLastName,
    age: randomAge,
    id: randomid, 
  };
}

// Simulated POST requests
async function simulatePostRequests() {
  // Simulate multiple POST requests with different customers
  const customers1 = [];
  const customers2 = [];

  for (let i = 0; i < 2; i++) {
    const customer = generateRandomCustomer();
    customers1.push(customer);
  }

  try {
    const response1 = await axios.post(`${SERVER_URL}/customers`, customers1);
    console.log('POST Request 1:', response1.status, response1.data);
  } catch (error) {
    console.error('Error making POST request:', error.message);
  }
}

// Simulated GET request
async function simulateGetRequest() {
  try {
    const response = await axios.get(`${SERVER_URL}/customers`);
    console.log('GET Request:', response.status, response.data);
  } catch (error) {
    console.error('Error making GET request:', error.message);
  }
}

// Simulate requests
async function simulateRequests() {
  await simulatePostRequests();
  await simulateGetRequest();
}

// Start simulating requests
simulateRequests();
