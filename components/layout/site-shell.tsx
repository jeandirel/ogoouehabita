import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CompareTray } from "@/components/compare/compare-tray";
import { HelpWidget } from "@/components/aide/help-widget";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pt-[64px]">{children}</main>
      <Footer />
      <CompareTray />
      <HelpWidget />
    </>
  );
}
