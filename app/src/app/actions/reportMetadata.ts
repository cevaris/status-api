import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ApiEntities, ApiStatusReportMetadata } from '..';

export async function getReportMetadata(
  key: string
): Promise<ApiStatusReportMetadata> {
  try {
    const results = await axios.get<ApiEntities<ApiStatusReportMetadata>>(
      `${environment.apiHost}/private/report_metadata/${key}.json`
    );
    // if found, should always return 1 result
    return results.data.data[0];
  } catch (error) {
    console.error(error?.response?.data);
    return Promise.reject(Error(`StatusAPI Report '${key}' not found`));
  }
}

export async function queryReportMetadata(
  q?: string
): Promise<Array<ApiStatusReportMetadata>> {
  const promise =
    q === undefined
      ? axios.get<ApiEntities<ApiStatusReportMetadata>>(
          `${environment.apiHost}/private/report_metadata.json`
        )
      : axios.get<ApiEntities<ApiStatusReportMetadata>>(
          `${environment.apiHost}/private/report_metadata.json?q=${q}`
        );
  const response = await promise;
  return response.data.data;
}
