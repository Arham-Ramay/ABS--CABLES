import Layout from "@/components/layout/layout";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
