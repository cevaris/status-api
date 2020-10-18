import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ApiEntities, ApiStatusReportMetadata } from '..';

export async function getReportMetadata(key: string): Promise<ApiStatusReportMetadata> {
    const results = await axios.get<ApiEntities<ApiStatusReportMetadata>>(`${environment.apiHost}/private/report_metadata/${key}.json`);
    if (results.data.data.length > 0) {
        return results.data.data[0];
    } else {
        return Promise.reject(Error(`key ${key} not found`));
    }
}

export async function queryReportMetadata(q?: string): Promise<Array<ApiStatusReportMetadata>> {
    const promise = q === undefined ?
        axios.get<ApiEntities<ApiStatusReportMetadata>>(`${environment.apiHost}/private/report_metadata.json`) :
        axios.get<ApiEntities<ApiStatusReportMetadata>>(`${environment.apiHost}/private/report_metadata.json?q=${q}`);
    const response = await promise;
    return response.data.data;
}