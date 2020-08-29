import dropboxV2Api from 'dropbox-v2-api';
import { Config } from '../config';

export const dropbox = dropboxV2Api.authenticate({
    token: Config.required('DROPBOX_ACCESS_TOKEN')
});