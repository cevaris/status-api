import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReportMetadata } from '..';

export async function getReportMetadata(key: string): Promise<StatusReportMetadata> {
    const results = await axios.get<StatusReportMetadata>(`${environment.apiHost}/report_metadata/${key}.json`);
    return results.data;
}