import axios from "axios";
import { environment } from "src/environments/environment";
import { ApiContactUs } from '..';

export interface ContactUs {
  email: string;
  name: string;
  message: string;
}

export async function postContactUs(contactUs: ContactUs): Promise<void> {
  const response = await axios.post<ApiContactUs>(
    `${environment.apiHost}/private/contact_us.json`
  );

  const error = response.data.error;
  if (error) {
    console.error(error);
    return Promise.reject(error.message);
  } else {
    return Promise.resolve();
  }
}
