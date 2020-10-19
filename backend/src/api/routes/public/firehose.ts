import express from 'express';
import { isValidDate } from '../../../common/date';
import { renderJson } from '../../../common/renderer';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

interface StreamReportFailuresRequest extends express.Request {
    query: { start_date?: string };
}

const router = express.Router();

/**
 * DEV API
 */
router.get('/development/reports/firehose.json', function (req: StreamReportFailuresRequest, res: express.Response) {
    res.type('json');

    const connection = `${new Date().toISOString()}-${req.sessionID}`;
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
    // req.connection.addListener('close', () => {
    //     isClientConnectionOpen = false;
    // });
    // req.connection.addListener('end', () => {
    //     console.log(connection, 'client closed connection');
    //     isClientConnectionOpen = false;
    // });
    // req.on('close', () => {
    //     isClientConnectionOpen = false;
    // });
    // req.on('end', () => {
    //     isClientConnectionOpen = false;
    // });

    function streamReports() {
        const stream = StatusReportStore.streamReports(highWaterMark);

        stream
            .on('error', (error) => {
                console.log(connection, 'end');
                res.status(503).json(Presenter.serverUnavailable(error));
                res.end();
            })
            .on('data', (entity: StatusReport) => {
                console.log(connection, 'entity', entity.name, entity.startDate);
                highWaterMark = entity.startDate;
                isClientConnectionOpen = res.write(renderJson(Presenter.statusReports([entity])) + '\n');

                if (!isClientConnectionOpen) {
                    console.log('failed to write to client');
                    res.status(200).end();
                    stream.end();
                }
            })
            .on('end', async () => {
                if (isClientConnectionOpen) {
                    // when we reach to end of stream, sleep, then attempt to query for latest events
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    console.log(connection, 'checking for new reports', highWaterMark);
                    streamReports();
                } else {
                    // close the connection successfully
                    console.log(connection, 'closed connection');
                    res.status(200).end();
                }
            });
    }

    console.log(connection, 'start', highWaterMark);
    streamReports();
});

module.exports = router;