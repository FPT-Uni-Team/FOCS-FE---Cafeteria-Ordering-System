import NavBottom from "@/components/nav/NavBottom";

export default function NavLayoutFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="m-4">{children}</div>
      <NavBottom />
    </>
  );
}
