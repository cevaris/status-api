import { DigitalOcean } from '.';
import { ApiRegion } from '..';
import { clients } from '../../clients';
import { Report } from '../report';

interface Response {
  account: {
    uuid: string;
  };
}

class DigitalOceanAccountGet extends Report {
  constructor() {
    super(
      DigitalOcean.Service,
      ApiRegion.Global,
      DigitalOcean.Api.Account,
      DigitalOcean.Version,
      'Get'
    );
  }

  description(): string {
    return `Gets Account information, asserts correct data is returned.`;
  }

  async run(): Promise<boolean> {
    const expectedUUID = '8513e34a-1226-4fc9-abd1-129d0061bb5a';

    const response: Response = await clients.digitalOcean.accounts.get();
    if (response?.account?.uuid === expectedUUID) {
      return true;
    } else {
      throw Error('incorrect Account.uuid returned');
    }
  }
}

export const DigitalOceanAccountGetRunners: Array<Report> = [
  new DigitalOceanAccountGet(),
];
