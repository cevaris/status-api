import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReport } from '..';

export async function getAllStatusReportFailures(): Promise<StatusReport[]> {
    const results = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/failures.json`);
    return results.data;
}

export async function getStatusReportFailures(key: string, limit: number): Promise<StatusReport[]> {
    const results = await axios.get<StatusReport[]>(`${environment.apiHost}/reports/failures/${key}.json?latest_failures=${limit}`);
    return results.data;
}

export async function getStatusReports(key: string): Promise<StatusReport[]> {
    const results = await axios.get<Array<StatusReport>>(`${environment.apiHost}/reports/${key}.json`);
    return results.data;
}