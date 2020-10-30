import axios, { AxiosRequestConfig } from 'axios';
import { Config } from '../../common/config';

const BaseURL = 'https://api.digitalocean.com/v2';
const RequestConfig: AxiosRequestConfig = {
  headers: { Authorization: `Bearer ${Config.DIGITAL_OCEAN_ACCESS_TOKEN}` },
};

const DigitalOceanClient = {
  accounts: {
    get: async (): Promise<any> => {
      const url = `${BaseURL}/account`;
      const response = await axios.get(url, RequestConfig);
      return response.data;
    },
  },
};

export const digitalOcean = DigitalOceanClient;
