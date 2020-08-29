/**
 * This shared index is needed so Status API and Runner
 * can share a common package code easily without dealing 
 * with JS/Typescript shenanigans.
 */
const target = process.argv[2] || undefined;

switch (target) {
    case 'api':
        console.log('starting api');
        require('./api/index');
        break;
    case 'runner':
        console.log('starting runner');
        require('./runner/index');
        break;
    default:
        console.error(`target ${target} not valid; exiting...`);
        process.exit(-1);
}