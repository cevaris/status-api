import axios from 'axios';
import { environment } from 'src/environments/environment';
import { StatusReport } from '..';

export async function getAllStatusReportFailures(): Promise<StatusReport[]> {
    const results = await axios.get<StatusReport[]>(`${environment.apiHost}/private/reports/failures.json`);
    return results.data;
}

export async function getStatusReportFailures(key: string, limit: number): Promise<StatusReport[]> {
    const results = await axios.get<StatusReport[]>(`${environment.apiHost}/private/reports/failures/${key}.json?limit=${limit}`);
    return results.data;
}

export async function getStatusReports(key: string): Promise<StatusReport[]> {
    const results = await axios.get<Array<StatusReport>>(`${environment.apiHost}/private/reports/${key}.json`);
    return results.data;
}