import socketIO from 'socket.io';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

/**
 * DEV API
 */
export function firehoseStatusReport(io: socketIO.Socket) {
    const connection = `${new Date().toISOString()}-${io.client.id}`;
    let isClientConnectionOpen = true;
    let highWaterMark: Date = new Date();

    // if (req.query.start_date) {
    //     const now = new Date();
    //     const queryStartDate = new Date(Date.parse(req.query.start_date));

    //     if (!isValidDate(queryStartDate)) {
    //         return res.status(400)
    //             .json(Presenter.badRequest(`start_date '${req.query.start_date}' is invalid. Provide a valid ISO 8601 UTC format.`));
    //     }

    //     if (now < queryStartDate) {
    //         return res.status(400)
    //             .json(Presenter.badRequest(`cannot use start_date value from the future, ${queryStartDate}`));
    //     }

    //     const oldestStartDate = 1000 * 60 * 60 * 12;
    //     if ((now.getTime() - queryStartDate.getTime()) > oldestStartDate) {
    //         return res.status(400)
    //             .json(Presenter.badRequest(`cannot use start_date value older than ${oldestStartDate / (1000 * 60 * 60)} hours from now`));
    //     }

    //     // valid start date
    //     highWaterMark = queryStartDate;
    // }

    io.on('disconnect', function () {
        console.log(connection, 'client disconnected');
        isClientConnectionOpen = false;
    });

    function streamReports() {
        const stream = StatusReportStore.streamReports(highWaterMark);

        stream
            .on('error', (error) => {
                console.log(connection, 'end');
            })
            .on('data', (entity: StatusReport) => {
                console.log(connection, 'entity', entity.name, entity.startDate);
                highWaterMark = entity.startDate;

                io.emit('status_report', Presenter.statusReports([entity]));
            })
            .on('end', async () => {
                if (isClientConnectionOpen) {
                    const sleepTimeMs = Math.floor(Math.random() * (10000 - 5000));
                    await new Promise(resolve => setTimeout(resolve, sleepTimeMs));
                    console.log(connection, 'stream new reports', highWaterMark);
                    streamReports();
                } else {
                    stream.end();
                }
            });
    }

    console.log(connection, 'client connected', highWaterMark);
    streamReports();
};