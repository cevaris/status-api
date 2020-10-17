import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReportMetadata } from '..';

export async function getReportMetadata(key: string): Promise<StatusReportMetadata> {
    const results = await axios.get<StatusReportMetadata>(`${environment.apiHost}/private/report_metadata/${key}.json`);
    return results.data;
}

export async function queryReportMetadata(q?: string): Promise<Array<StatusReportMetadata>> {
    const promise = q === undefined ?
        axios.get<Array<StatusReportMetadata>>(`${environment.apiHost}/private/report_metadata.json`) :
        axios.get<Array<StatusReportMetadata>>(`${environment.apiHost}/private/report_metadata.json?q=${q}`);
    const response = await promise;
    return response.data;
}