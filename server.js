const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const dataPath = 'data.json';
let customers = [];

// Load existing data on server startup
if (fs.existsSync(dataPath)) {
  const data = fs.readFileSync(dataPath, 'utf8');
  customers = JSON.parse(data);
}

// Function to validate a customer
function validateCustomer(customer) {
  if (!customer.firstName || !customer.lastName || !customer.age || !customer.id) {
    return false;
  }
  if (customer.age <= 18) {
    return false;
  }
  if (customers.some((existingCustomer) => existingCustomer.id === customer.id)) {
    return false;
  }
  return true;
}

// Function to insert a customer into the sorted array
function insertCustomer(customer) {
    const lastName = customer.lastName;
  const firstName = customer.firstName;

  let insertIndex = 0;
  while (
    insertIndex < customers.length &&
    (lastName.localeCompare(customers[insertIndex].lastName) > 0 ||
      (lastName === customers[insertIndex].lastName &&
        firstName.localeCompare(customers[insertIndex].firstName) > 0))
  ) {
    insertIndex++;
  }

  // Insert the customer at the determined index
  customers.splice(insertIndex, 0, customer);
  
}

// POST customers
app.post('/customers', (req, res) => {
    const newCustomers = req.body;
    const validationErrors = [];
  // Read existing data from data.json
  newCustomers.forEach((customer) => {
    
    const customValidationResult = validateCustomer(customer);

    // Check age
    if (customer.age < 18) {
      validationErrors.push(`Customer ${customer.id}: Age must be 18 or older.`);
    }

    // Check ID uniqueness
    const isDuplicateID = customers.some((existingCustomer) => existingCustomer.id === customer.id);
    if (isDuplicateID) {
      validationErrors.push(`Customer ${customer.id}: ID is not unique.`);
    }

    // Add custom validation errors, if any
    if (customValidationResult !== null) {
      validationErrors.push(customValidationResult);
    }
  });

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  // Insert each new customer into the sorted array
  newCustomers.forEach((customer) => {
    insertCustomer(customer);
  });

  // Write the updated data to data.json
  fs.writeFileSync('data.json', JSON.stringify(customers, null, 2), 'utf8');

  res.status(200).json({ message: 'Customers added and sorted successfully' });
});

function validateCustomer(customer) {
  
  return null; 
}


app.get('/customers', (req, res) => {
    // Read data from data.json file
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data.json:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Parse data as JSON
      const customerData = JSON.parse(data);
  
      // Send the data as JSON response
      res.status(200).json(customerData);
    });
  });
  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
