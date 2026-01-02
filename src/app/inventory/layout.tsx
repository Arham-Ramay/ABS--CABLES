import Layout from "@/components/layout/layout";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
