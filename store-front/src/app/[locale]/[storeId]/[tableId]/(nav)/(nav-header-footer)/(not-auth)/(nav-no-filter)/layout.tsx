import NavBottom from "@/components/nav/NavBottom";
import NavHeader from "@/components/nav/NavHeader";

export default function NavLayoutHeaderFooterNoFilter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavHeader />
      <div className="m-4 mt-[120px] mb-[80px]">{children}</div>
      <NavBottom />
    </>
  );
}
