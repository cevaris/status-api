import { DropboxApi } from ".";
import { ApiRegion } from "..";
import { clients } from "../../clients";
import { Report } from "../report";

type Response = {
    account_id: string
}

class DropboxV2UsersGetCurrentAccountConfig extends Report {
    constructor() {
        super(DropboxApi.Service, ApiRegion.Global, DropboxApi.Api.Users, DropboxApi.Version, 'Get Current Account');
    }

    description(): string {
        return `Fetches users/get_current_account http endpoint, asserts expected account_id value is present.`;
    }

    async run(): Promise<boolean> {
        const response: Response = await clients.dropbox({
            resource: 'users/get_current_account'
        });

        // account_id should not change
        const expectedAccountId = 'dbid:AAAg3G4iUj3tMI2CwwzNXOmSDjXLLgC6H5c'
        return response.account_id === expectedAccountId;
    }
}

export const DropboxV2UsersGetCurrentAccountRunners: Array<Report> = [
    new DropboxV2UsersGetCurrentAccountConfig()
]