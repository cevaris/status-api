import fs from 'fs';
import { DropboxApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    name: string
}

class DropboxFilesUploadConfig extends Report {
    constructor() {
        super(DropboxApi.Service, ApiRegion.Global, DropboxApi.Api.Files, DropboxApi.Version, 'Upload');
    }

    description(): string {
        return `Uploads file via files/upload http endpoint, asserts file is created.`;
    }

    async run(): Promise<boolean> {
        const nowTime = new Date().getTime();
        const fileName = `${nowTime}.txt`;
        const localFolderPath = `/tmp/DropboxV2FilesUpload/`;

        if (!fs.existsSync(localFolderPath)) {
            await fs.promises.mkdir(localFolderPath);
        }

        const localFilePath = `${localFolderPath}/${fileName}.txt`;
        await fs.promises.writeFile(localFilePath, 'example txt content');

        const response: Response = await clients.dropbox({
            resource: 'files/upload',
            parameters: {
                path: `/DropboxV2FilesUpload/${nowTime}.txt`
            },
            readStream: fs.createReadStream(localFilePath)
        });

        try {
            await fs.promises.unlink(localFilePath);
        } catch {
            // ignore failures
        }

        return response.name === fileName;
    }
}

export const DropboxV2FileUploadRunners: Array<Report> = [
    new DropboxFilesUploadConfig()
];