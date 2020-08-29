import express from "express";
import schedule from 'node-schedule';
import { funcRunner } from "./reports/runner";
import { reportFuncRunners } from "./runners";
import { StatusReportStore } from "../common/storage/statusReport";
import { StatusReportMetadata, StatusReportMetadataDB } from "../common/storage/statusReportMetadata";
import { Config } from "../common/config";


const app = express();

app.use(require('./routes/index'));
app.use(require('./routes/gae'));
app.use(require('./routes/lastWritten'));

const PORT = Config.port(9999);
app.listen(PORT, async () => {
    console.log(`server started at http://localhost:${PORT}`);

    const metadata: Array<StatusReportMetadata> = [];
    reportFuncRunners.forEach((reportRunner) => {
        const m: StatusReportMetadata = {
            key: reportRunner.key(),
            description: reportRunner.description(),
            tags: reportRunner.tags(),
            service: reportRunner.service,
            action: reportRunner.action,
            region: reportRunner.region,
            api: reportRunner.api,
            version: reportRunner.version
        };
        metadata.push(m);

    });
    StatusReportMetadataDB.set(metadata);

    reportFuncRunners.forEach((runner) => {
        const secondToRun = Math.floor(Math.random() * Math.floor(60));

        schedule.scheduleJob(`${secondToRun} * * * * *`, function () {
            setTimeout(async function () {
                const result = await funcRunner(runner);
                await StatusReportStore.set(result);
            }, Math.floor(Math.random() * Math.floor(1000)));
        });

        console.log(`scheduled runner ${runner.key()} on the ${secondToRun} second`);
    });
});
