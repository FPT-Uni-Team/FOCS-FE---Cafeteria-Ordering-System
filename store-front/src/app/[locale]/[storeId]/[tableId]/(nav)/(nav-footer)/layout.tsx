import NavBottom from "@/components/nav/NavBottom";

export default function NavLayoutFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="m-4 mb-[80px]">{children}</div>
      <NavBottom />
    </>
  );
}
