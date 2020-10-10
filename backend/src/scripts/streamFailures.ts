import { program } from 'commander';
import http from 'http';

program
    .requiredOption('-u, --url <value>', 'target url');

program.parse(process.argv);


http.get(program.url, function (res) {
    res.on('data', function (chunk: Buffer) {
        process.stdout.write(chunk.toString());
    });
    res.on('end', function () {
        console.log('closed connection');
    });
});