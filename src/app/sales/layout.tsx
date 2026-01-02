import Layout from "@/components/layout/layout";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
