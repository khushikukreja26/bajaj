// server.js - Complete Node.js/Express REST API Solution

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configuration - Replace these with your actual details
const USER_CONFIG = {
    full_name: "khushikukreja", // Replace with your full name in lowercase
    dob: "26122003", // Replace with your DOB in ddmmyyyy format
    email: "khushiaaryankukreja@gmail.com", // Replace with your email
    roll_number: "22BCE10305" // Replace with your college roll number
};

// Helper function to check if a string is numeric
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Helper function to check if a character is alphabetic
function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

// Helper function to check for special characters
function isSpecialCharacter(str) {
    // Not numeric and not alphabetic = special character
    return !isNumeric(str) && !isAlphabetic(str);
}

// Helper function to create alternating caps string
function createAlternatingCaps(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            result += str[i].toLowerCase();
        } else {
            result += str[i].toUpperCase();
        }
    }
    return result;
}

// Main API endpoint
app.post('/bfhl', (req, res) => {
    try {
        // Validate request body
        if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input format. Expected { data: [...] }"
            });
        }

        const inputData = req.body.data;
        
        // Initialize arrays for different categories
        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sumOfNumbers = 0;
        let allAlphabets = '';

        // Process each element in the input array
        inputData.forEach(item => {
            // Convert to string if not already
            const strItem = String(item);
            
            // Check if it's a number
            if (isNumeric(strItem)) {
                const num = parseInt(strItem, 10);
                sumOfNumbers += num;
                
                if (num % 2 === 0) {
                    evenNumbers.push(strItem);
                } else {
                    oddNumbers.push(strItem);
                }
            }
            // Check if it's alphabetic (single or multiple characters)
            else if (isAlphabetic(strItem)) {
                // Convert to uppercase and add to alphabets array
                alphabets.push(strItem.toUpperCase());
                // Collect all alphabetic characters for concatenation
                allAlphabets += strItem;
            }
            // Everything else is a special character
            else if (isSpecialCharacter(strItem)) {
                specialCharacters.push(strItem);
            }
        });

        // Create concatenated string: reverse order with alternating caps
        const reversedAlphabets = allAlphabets.split('').reverse().join('');
        const concatString = createAlternatingCaps(reversedAlphabets);

        // Build response
        const response = {
            is_success: true,
            user_id: `${USER_CONFIG.full_name}_${USER_CONFIG.dob}`,
            email: USER_CONFIG.email,
            roll_number: USER_CONFIG.roll_number,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: String(sumOfNumbers),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET endpoint for testing
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('BFHL API is running! Use POST /bfhl to process data.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/bfhl`);
});

// Export for testing purposes

module.exports = app;
