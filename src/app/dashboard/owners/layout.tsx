import OwnerNavbar from "@/components/OwnerNavbar";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <OwnerNavbar />
      <main>{children}</main>
    </div>
  );
}
