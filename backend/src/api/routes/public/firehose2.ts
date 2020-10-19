import socketIO from 'socket.io';
import { isValidDate } from '../../../common/date';
import { StatusReport, StatusReportStore } from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

/**
 * DEV API
 */
export function firehoseStatusReport(socket: socketIO.Socket) {
    const eventType = 'status_report';
    const connection = `${new Date().toISOString()}-${socket.client.id}`;
    let highWaterMark: Date = new Date();

    const queryStartDate = socket.handshake.query.start_date;
    if (queryStartDate) {
        const now = new Date();
        const startDate = new Date(Date.parse(queryStartDate));

        if (!isValidDate(startDate)) {
            return socket.emit(eventType, Presenter.badRequest(`start_date '${queryStartDate}' is invalid. Provide a valid ISO 8601 UTC format.`));
        }

        if (now < startDate) {
            return socket.emit(eventType, Presenter.badRequest(`cannot use start_date value from the future, ${startDate.toISOString()}`));
        }

        const hour = 1000 * 60 * 60;
        const oldestStartDate = 12 * hour;
        if ((now.getTime() - startDate.getTime()) > oldestStartDate) {
            return socket.emit(eventType, Presenter.badRequest(`cannot use start_date value older than ${oldestStartDate / hour} hours from now`));
        }

        // valid start date
        highWaterMark = startDate;
    }

    function streamReports() {
        const stream = StatusReportStore.streamReports(highWaterMark);

        stream
            .on('error', (error) => {
                console.error(connection, error);
                stream.end();
            })
            .on('data', (entity: StatusReport) => {
                console.log(connection, 'entity', entity.name, entity.startDate);
                highWaterMark = entity.startDate;

                socket.emit(eventType, Presenter.statusReports([entity]));
            })
            .on('end', async () => {
                if (socket.connected) {
                    const sleepTimeMs = Math.floor(Math.random() * (10000 - 5000));
                    await new Promise(resolve => setTimeout(resolve, sleepTimeMs));

                    console.log(connection, 'stream new reports', highWaterMark);
                    streamReports();
                } else {
                    console.log(connection, 'client disconnected');
                    stream.end();
                }
            });
    }

    console.log(connection, 'client connected', highWaterMark);
    streamReports();
};