// npm install socket.io-client
const io = require('socket.io-client');

// setting optional start_date parameter
const now = new Date();
const options = { query: `start_date=${now.toISOString()}` };

const socket = io('http://localhost:8080/reports/firehose', options);

socket.on('status_report', (data) => {
    console.log(data);
});
socket.on('exception', (data) => {
    console.error(data);
});