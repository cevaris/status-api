import { AppRoute } from 'src/app';
import { environment } from 'src/environments/environment';

export const appRoutes: Array<AppRoute> = [
    // This really only applies to paid accounts.
    { name: "Docs", route: "/docs" },
    { name: "FAQ", route: "/faq" },
];

if (!environment.production) {
    // still under development
    appRoutes.push({ name: "Pricing", route: "/pricing" });
}