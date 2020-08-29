import { DropboxApi } from ".";
import { ApiRegion } from "..";
import { clients } from "../../clients";
import { Report } from "../report";

type Response = {
    account_id: string
}

class DropboxV2UsersGetAccountConfig extends Report {
    constructor() {
        super(DropboxApi.Service, ApiRegion.Global, DropboxApi.Api.Users, DropboxApi.Version, 'Get Account');
    }

    description(): string {
        return `Fetches account via users/get_account http endpoint, asserts correct account_id is returned.`;
    }

    async run(): Promise<boolean> {
        const accountId = 'dbid:AAAg3G4iUj3tMI2CwwzNXOmSDjXLLgC6H5c';
        const response: Response = await clients.dropbox({
            resource: 'users/get_account',
            parameters: {
                'account_id': accountId
            }
        });

        return response.account_id === accountId;
    }
}

export const DropboxV2UsersGetAccountRunners: Array<Report> = [
    new DropboxV2UsersGetAccountConfig()
];