import socketIO from 'socket.io';
import { Transform } from 'stream';
import { isValidDate } from '../../../common/date';
import {
  StatusReport,
  StatusReportStore,
} from '../../../common/storage/statusReport';
import { Presenter } from '../../presenter';

const EventStatusReport = 'status_report';
export const EventException = 'exception';

/**
 * PUBLIC API
 */
export function firehoseStatusReport(socket: socketIO.Socket) {
  const connection = socket.request.connectionId; //`${new Date().toISOString()}-${socket.client.id}`;
  let highWaterMark: Date = new Date();

  socket.on('disconnect', () => {
    console.log(connection, 'client disconnected');
  });

  console.log(connection, 'client connected', highWaterMark);
//   emitCountMap.set(connection, 0);

  const queryStartDate = socket.handshake.query.start_date;
  if (queryStartDate) {
    const now = new Date();
    const startDate = new Date(Date.parse(queryStartDate));

    if (!isValidDate(startDate)) {
      socket.emit(
        EventException,
        Presenter.badRequest(
          `start_date '${queryStartDate}' is invalid. Provide a valid ISO 8601 UTC format.`
        )
      );
      return socket.disconnect(true);
    }

    if (now < startDate) {
      socket.emit(
        EventException,
        Presenter.badRequest(
          `cannot use start_date value from the future, ${startDate.toISOString()}`
        )
      );
      return socket.disconnect(true);
    }

    const hour = 1000 * 60 * 60;
    const oldestStartDate = 1 * hour; // + (5 * 60000); // 5 min fudge factor
    if (now.getTime() - startDate.getTime() > oldestStartDate) {
      socket.emit(
        EventException,
        Presenter.badRequest(
          `cannot use a start_date value older than 1 hours from now`
        )
      );
      return socket.disconnect(true);
    }

    // valid start date
    highWaterMark = startDate;
    console.log(
      connection,
      `client request to start stream from ${startDate.toISOString()}`
    );
  }

  function streamReports() {
    const stream: Transform = StatusReportStore.streamReports(highWaterMark);

    stream
      .on('error', (error) => {
        console.error(connection, error);
        socket.emit(EventException, error.message);
        stream.end();
        socket.disconnect(true);
      })
      .on('data', (entity: StatusReport) => {
        console.log(connection, 'entity', entity.name, entity.startDate);
        highWaterMark = entity.startDate;

        socket.emit(EventStatusReport, Presenter.statusReports([entity]));

        // const currEmitCount = emitCountMap.get(connection) || 0;
        // if (currEmitCount > MaxEmitCount) {
        //   socket.emit(
        //     EventException,
        //     Presenter.rateLimited(
        //       'This endpoint is not production ready yet and is currently heavily rate-limited. StatusAPI will provide a public offering soon.'
        //     )
        //   );
        //   stream.end();
        //   socket.disconnect(true);
        // }

        // increment emit map
        // emitCountMap.set(connection, (emitCountMap.get(connection) || 0) + 1);
      })
      .on('end', async () => {
        if (socket.connected) {
          const sleepTimeMs = Math.floor(Math.random() * 5000) + 5000;
          await new Promise((resolve) => setTimeout(resolve, sleepTimeMs));

          console.log(connection, 'stream new reports', highWaterMark);
          streamReports();
        } else {
          console.log(connection, 'client disconnected');
          stream.end();
        }
      });
  }

  streamReports();
}
