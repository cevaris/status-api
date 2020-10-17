import { program } from 'commander';
import http from 'http';

program
    .requiredOption('-u, --url <value>', 'target stream url');

program.parse(process.argv);


http.get(program.url, function (res) {
    res.on('data', function (chunk: Buffer) {
        process.stdout.write(chunk.toString());
    });
    res.on('end', function () {
        console.log('closed connection');
    });
});


// import https from 'https';

// const StreamURL = 'https://api.status-api.com/stream/reports/failures.json';

// https.get(StreamURL, function (res) {
//     res.on('data', function (chunk: Buffer) {
//         process.stdout.write(chunk.toString());
//     });
//     res.on('end', function () {
//         console.log('closed connection');
//     });
// });