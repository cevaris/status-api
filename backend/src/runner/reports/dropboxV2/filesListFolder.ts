import { DropboxApi } from '.';
import { ApiRegion } from '..';
import { clients } from "../../clients";
import { Report } from '../report';


interface Response {
    entries: any[]
}

class DropboxFilesList extends Report {
    localFilePath: string = ''

    constructor() {
        super(DropboxApi.Service, ApiRegion.Global, DropboxApi.Api.Files, DropboxApi.Version, 'List Folders');
    }

    description(): string {
        return `Lists files in non-empty folder, asserts files are returned.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.dropbox({
            resource: 'files/list_folder',
            parameters: {
                path: `/DropboxV2FilesUpload`
            },
        });

        if (response.entries.length === 0) {
            throw Error('Files list folder response returned no files for a non-empty directory.')
        }

        return true;
    }
}

export const DropboxFilesListRunners: Array<Report> = [
    new DropboxFilesList()
];