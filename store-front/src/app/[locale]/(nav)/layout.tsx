import NavBottom from "@/components/nav/NavBottom";
import NavHeader from "@/components/nav/NavHeader";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <NavHeader />
      <div className="m-4 mt-[120px]">{children}</div>
      <NavBottom />
    </div>
  );
}
