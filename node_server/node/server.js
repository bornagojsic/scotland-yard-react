const express = require('express');
const app = express();
const port = 3001; // Specify the port you want to listen on

const { spawn } = require('child_process');

const pythonAPI = () => {
	// Path to the Python file you want to run
	const pythonFile = 'path/to/your/python/file.py';

	// Run the Python file
	const pythonProcess = spawn('python', [pythonFile]);

	// Listen to the Python process output
	pythonProcess.stdout.on('data', (data) => {
	console.log(`Python stdout: ${data}`);
	});

	// Listen to any errors that occur
	pythonProcess.stderr.on('data', (data) => {
	console.error(`Python stderr: ${data}`);
	});

	// Handle the Python process exit
	pythonProcess.on('close', (code) => {
	console.log(`Python process exited with code ${code}`);
	});
};

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});