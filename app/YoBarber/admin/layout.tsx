export const metadata = {
  title: "Admin Dashboard — YoBarber",
  description: "YoBarber Admin Management Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
