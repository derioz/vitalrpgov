import { getChangelog } from '@/lib/changelog';
import DashboardClient from '@/components/admin/DashboardClient';

export default async function AdminDashboardPage() {
    const changelogs = await getChangelog();

    return <DashboardClient changelogs={changelogs} />;
}
