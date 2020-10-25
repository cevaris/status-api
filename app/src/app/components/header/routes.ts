import { AppRoute } from 'src/app';
import { environment } from 'src/environments/environment';

export const appRoutes: Array<AppRoute> = [
  // This really only applies to paid accounts.
  { name: 'Docs', route: '/docs', external: false },
  { name: 'FAQ', route: '/faq', external: false },
  {
    name: 'Contact Us',
    route: `mailto:${environment.contactUsEmail}?subject=StatusAPI: Contact us`,
    external: true,
  },
];

if (!environment.production) {
  // still under development
  appRoutes.push({ name: 'Pricing', route: '/pricing', external: false });
}
