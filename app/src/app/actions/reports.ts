import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReport } from '..';

export async function getStatusReports(key: string, limit: number): Promise<StatusReport[]> {
    const results = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/failures/${key}.json?latest_failures=${limit}`);
    return results.data;
}