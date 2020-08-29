import dropboxV2Api from 'dropbox-v2-api';
import { Config } from '../../common/utils/config';

export const dropbox = dropboxV2Api.authenticate({
    token: Config.DROPBOX_ACCESS_TOKEN
});