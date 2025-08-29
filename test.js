// test.js - Test script to verify API functionality

const http = require('http');

// Test cases from the problem statement
const testCases = [
    {
        name: "Example A",
        input: {
            data: ["a", "1", "334", "4", "R", "$"]
        },
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334", "4"],
            alphabets: ["A", "R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "rA"
        }
    },
    {
        name: "Example B",
        input: {
            data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"]
        },
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2", "4", "92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "bYa"
        }
    },
    {
        name: "Example C",
        input: {
            data: ["A", "ABcD", "DOE"]
        },
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A", "ABCD", "DOE"],
            special_characters: [],
            sum: "0",
            concat_string: "eOdDcBaA"
        }
    }
];

// Function to make POST request
function testAPI(testCase) {
    const data = JSON.stringify(testCase.input);
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/bfhl',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(responseData);
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(data);
        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting API tests...\n');
    
    for (const testCase of testCases) {
        console.log(`Testing: ${testCase.name}`);
        console.log('Input:', JSON.stringify(testCase.input));
        
        try {
            const response = await testAPI(testCase);
            console.log('Response:', JSON.stringify(response, null, 2));
            
            // Validate response
            let passed = true;
            const errors = [];
            
            // Check is_success
            if (!response.is_success) {
                passed = false;
                errors.push('is_success is false');
            }
            
            // Check arrays
            for (const key of ['odd_numbers', 'even_numbers', 'alphabets', 'special_characters']) {
                if (JSON.stringify(response[key]) !== JSON.stringify(testCase.expected[key])) {
                    passed = false;
                    errors.push(`${key} mismatch. Expected: ${JSON.stringify(testCase.expected[key])}, Got: ${JSON.stringify(response[key])}`);
                }
            }
            
            // Check sum
            if (response.sum !== testCase.expected.sum) {
                passed = false;
                errors.push(`sum mismatch. Expected: ${testCase.expected.sum}, Got: ${response.sum}`);
            }
            
            // Check concat_string
            if (response.concat_string !== testCase.expected.concat_string) {
                passed = false;
                errors.push(`concat_string mismatch. Expected: ${testCase.expected.concat_string}, Got: ${response.concat_string}`);
            }
            
            if (passed) {
                console.log('✅ Test passed!\n');
            } else {
                console.log('❌ Test failed!');
                errors.forEach(error => console.log(`  - ${error}`));
                console.log();
            }
            
        } catch (error) {
            console.log('❌ Test failed with error:', error.message);
            console.log();
        }
    }
    
    console.log('Testing complete!');
}

// Wait a bit for server to start, then run tests
setTimeout(runTests, 1000);

console.log('Make sure the server is running on port 3000 before running tests.');