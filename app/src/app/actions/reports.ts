import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ApiEntities, ApiStatusReport } from '..';

export async function getAllStatusReportFailures(): Promise<ApiStatusReport[]> {
    const results =
        await axios.get<ApiEntities<ApiStatusReport>>(`${environment.apiHost}/private/reports/failures.json`);
    return results.data.data;
}

export async function getStatusReportFailures(key: string, limit: number): Promise<ApiStatusReport[]> {
    const results =
        await axios.get<ApiEntities<ApiStatusReport>>(`${environment.apiHost}/private/reports/failures/${key}.json?limit=${limit}`);
    return results.data.data;
}

export async function getStatusReports(key: string): Promise<ApiStatusReport[]> {
    const results =
        await axios.get<ApiEntities<ApiStatusReport>>(`${environment.apiHost}/private/reports/${key}.json`);
    return results.data.data;
}