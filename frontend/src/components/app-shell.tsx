import { Header } from "./header";
import { TabBar } from "./tab-bar";
import type { CurrentUser } from "@/lib/session";

export function AppShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      <Header user={user} />
      <TabBar />
      <main className="flex-1 overflow-y-auto px-8 py-7">{children}</main>
    </div>
  );
}
