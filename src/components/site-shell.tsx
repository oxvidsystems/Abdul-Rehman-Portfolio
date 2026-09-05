import type { ReactNode } from "react";
import { ChatWidget } from "./chat-widget";
import { CustomCursor } from "./custom-cursor";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { ResumeModal } from "./resume-modal";
import { ScrollProgress } from "./scroll-progress";
import { SignatureIntro } from "./signature-intro";

/**
 * Global page shell: scroll-progress rail + nav (desktop sidebar /
 * mobile takeover) + the scrolling content area. `main`'s left
 * padding (22rem) must match DesktopNav's width; `pt-16` matches
 * MobileNav's fixed top-bar height. The chat widget mounts here too,
 * so it is present on every page rather than only the home route.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SignatureIntro />
      <CustomCursor />
      <ScrollProgress />
      <DesktopNav />
      <MobileNav />
      <main className="pt-16 lg:pl-40 lg:pt-0">{children}</main>
      {/* Last in the tree so its fixed layer paints above the nav. */}
      <ChatWidget />
      <ResumeModal />
    </>
  );
}
