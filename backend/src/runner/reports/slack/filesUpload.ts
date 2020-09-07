import { WebAPICallResult } from '@slack/web-api';
import fs from 'fs';
import { SlackApi } from '.';
import { ApiRegion } from '..';
import { Config } from '../../../common/config';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response extends WebAPICallResult {
    file?: {
        size: number
    }
}

class SlackFilesUpload extends Report {
    localFilePath: string = ''

    constructor() {
        super(SlackApi.Service, ApiRegion.Global, SlackApi.Api.Files, SlackApi.Version, 'Upload')
    }

    description(): string {
        return `Slack file upload, asserts on response success.`;
    }

    async run(): Promise<boolean> {
        const nowTime = new Date().getTime();
        const filename = `${nowTime}.txt`;

        const localFolderPath = `/tmp/SlackGlobalFilesUpload/`;

        if (!fs.existsSync(localFolderPath)) {
            await fs.promises.mkdir(localFolderPath);
        }

        this.localFilePath = `${localFolderPath}/${filename}.txt`;
        await fs.promises.writeFile(this.localFilePath, `example txt content ${nowTime}`);

        const response: Response = await clients.slack.files.upload({
            channels: Config.SLACK_CHANNEL,
            initial_comment: `test upload file ${nowTime}`,
            file: fs.createReadStream(this.localFilePath)
        });

        if (!response.file?.size) {
            throw Error('no file found in the response');
        }

        return true;
    }

    async cleanup(): Promise<void> {
        await fs.promises.unlink(this.localFilePath);
    }

}

export const SlackFilesUploadRunners: Array<Report> = [
    new SlackFilesUpload()
];