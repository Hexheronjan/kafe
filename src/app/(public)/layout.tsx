import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { FloatingActions } from "@/components/public/floating-actions";
import { CursorGlow } from "@/components/public/cursor-glow";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <CursorGlow />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
