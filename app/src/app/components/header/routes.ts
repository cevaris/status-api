import { AppRoute } from 'src/app';

export const appRoutes: Array<AppRoute> = [
    { name: "Pricing", route: "/pricing" },
    // This really only applies to paid accounts.
    { name: "Docs", route: "/docs" },
    { name: "FAQ", route: "/faq" },
];