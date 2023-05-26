const express = require('express');
const app = express();
const port = 3001; // Specify the port you want to listen on

const { spawn } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');

// const pythonAPI = () => {
// 	// Path to the Python file you want to run
// 	const pythonFile = 'path/to/your/python/file.py';

// 	// Run the Python file
// 	const pythonProcess = spawn('python', [pythonFile]);

// 	// Listen to the Python process output
// 	pythonProcess.stdout.on('data', (data) => {
// 	console.log(`Python stdout: ${data}`);
// 	});

// 	// Listen to any errors that occur
// 	pythonProcess.stderr.on('data', (data) => {
// 	console.error(`Python stderr: ${data}`);
// 	});

// 	// Handle the Python process exit
// 	pythonProcess.on('close', (code) => {
// 	console.log(`Python process exited with code ${code}`);
// 	});
// };

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('Received a POST request!');
  console.log(req.body);

  const pythonProcess = spawn('python', ['python_file.py']);

  pythonProcess.stdout.on('data', (data) => {
    // Process the output from Python if needed
    console.log(`Received data from Python: ${data}`);
    res.send(data.toString()); // Send the processed data back as the response
  });

  pythonProcess.on('error', (error) => {
    console.error(`Python process error: ${error.message}`);
    res.status(500).send('Internal server error');
  });

  pythonProcess.on('exit', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  res.send('Received your POST request!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});