import express from 'express';
import { v4 as uuid4 } from 'uuid';
import { isValidDate } from '../../../common/date';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

interface StreamReportFailuresRequest extends express.Request {
    query: { start_date?: string };
}

const router = express.Router();

/**
 * PUBLIC API
 */
router.get('/stream/reports/failures.json', async function (req: StreamReportFailuresRequest, res: express.Response) {
    res.type('json');

    const connection = uuid4();
    let isClientConnectionOpen = true;
    let highWaterMark: Date = new Date();

    if (req.query.start_date) {
        const now = new Date();
        const queryStartDate = new Date(Date.parse(req.query.start_date));

        if (!isValidDate(queryStartDate)) {
            return res.status(400)
                .json(Presenter.badRequest(`start_date '${req.query.start_date}' is invalid. Provide a valid ISO 8601 UTC format.`));
        }

        if (now < queryStartDate) {
            return res.status(400)
                .json(Presenter.badRequest(`cannot use start_date value from the future, ${queryStartDate}`));
        }

        const oldestStartDate = 1000 * 60 * 60 * 12;
        if ((now.getTime() - queryStartDate.getTime()) > oldestStartDate) {
            return res.status(400)
                .json(Presenter.badRequest(`cannot use start_date value older than ${oldestStartDate / (1000 * 60 * 60)} hours from now`));
        }

        // valid start date
        highWaterMark = queryStartDate;
    }

    // Listen for client closing their connection
    req.connection.addListener('close', () => {
        console.log(connection, 'client closed connection');
        isClientConnectionOpen = false;
    });

    function streamReportFailures() {
        const stream = StatusReportStore.streamErrors(highWaterMark);

        stream
            .on('error', (error) => {
                console.log(connection, 'end');
                res.status(503).json(Presenter.serverUnavailable(error));
                res.end();
            })
            .on('data', (entity: StatusReport) => {
                console.log(connection, 'entity', entity.name, entity.startDate);
                highWaterMark = entity.startDate;
                res.write(renderJson(Presenter.statusReports([entity])) + '\n');

                if (!isClientConnectionOpen) {
                    res.status(200).end();
                    stream.end();
                }
            })
            .on('info', (info) => {
                console.log(connection, 'info', info);
            })
            .on('end', async () => {
                if (isClientConnectionOpen) {
                    console.log(connection, 'restarting stream', highWaterMark);
                    // when we reach to end of stream, sleep, then attempt to query for latest events
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    streamReportFailures();
                } else {
                    // close the connection successfully
                    res.status(200).end();
                }
            });
    }

    console.log(connection, 'start', highWaterMark);
    streamReportFailures();
});

module.exports = router;