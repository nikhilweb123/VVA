import { cookies } from 'next/headers';
import AdminLogin from '../../components/AdminLogin';
import LogoutButton from '../../components/LogoutButton';
import AdminNavbar from '../../components/AdminNavbar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session?.value) {
    return <AdminLogin />;
  }

  return (
    <div className="bg-obsidian min-h-screen text-ivory">
      <AdminNavbar />
      <div className="fixed top-0 right-0 p-6 z-50">
        <LogoutButton />
      </div>
      <main className="pt-32 pb-16 px-8 md:px-16 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
