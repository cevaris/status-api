#!/usr/bin/env python
import json
import requests
import argparse

parser = argparse.ArgumentParser(description='Stream StatusAPI Failures.')
parser.add_argument('--url', help='target stream url', required=True)

args = parser.parse_args()

try:
    r = requests.get(args.url, stream=True)
    r.encoding = 'utf-8'

    for line in r.iter_lines(decode_unicode=True):
        if line:
            print(str(line))
except (requests.exceptions.ConnectionError, requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError):
    print('connection disconnected')