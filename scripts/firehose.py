#!/usr/bin/env python
# pip install python-socketio

import socketio
import datetime

sio = socketio.Client()

# setting optional start_date parameter
now = datetime.datetime.utcnow()

sio.connect(
    f'http://localhost:8080?start_date=dd{now}',
    namespaces=['/reports/firehose'],
)

@sio.event(namespace='/reports/firehose')
def status_report(data):
    print(data)

@sio.event(namespace='/reports/firehose')
def exception(data):
    print(data)