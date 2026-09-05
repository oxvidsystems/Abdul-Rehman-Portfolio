import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Expertise } from "@/components/expertise";
import { HeroSlider } from "@/components/hero-slider";
import { HowIBuild } from "@/components/how-i-build";
import { Journey } from "@/components/journey";
import { SiteShell } from "@/components/site-shell";
import { Work } from "@/components/work";
import { NAV_ITEMS } from "@/lib/nav-items";

/** Sections that now have a real build. Anything left in NAV_ITEMS but
 *  not listed here still renders the Step 03 structural placeholder, so
 *  the nav, scroll progress and active-state detection keep working. */
const BUILT = ["home", "about", "expertise", "how-i-build", "work", "experience", "contact"];

/**
 * Every section in NAV_ITEMS is now built: Hero (`home`), About
 * (`about`), Expertise (`expertise`), How I Build (`how-i-build`),
 * Work (`work`), Journey (`experience`) and Contact (`contact`). The
 * placeholder loop below is kept — it costs nothing while BUILT
 * covers everything, and it is what lets a new nav entry appear
 * before its section exists.
 */
export default function Home() {
  return (
    <SiteShell>
      <HeroSlider />
      <About />
      <Expertise />
      <HowIBuild />
      <Work />
      <Journey />

      {NAV_ITEMS.filter((item) => !BUILT.includes(item.id)).map((item) => (
        <section
          key={item.id}
          id={item.id}
          className="flex min-h-screen scroll-mt-16 flex-col items-center justify-center gap-4 bg-paper-100 px-6 text-center lg:scroll-mt-0"
        >
          <span className="font-mono text-micro tracking-widest text-accent-teal">
            {item.num}
          </span>
          <h1 className="text-display-2 font-semibold tracking-tight text-ink-900">
            {item.label}
          </h1>
          <p className="max-w-md text-body text-ink-500">
            Section placeholder — built in a later step. This block only
            exists to test the nav, scroll progress and active-state
            detection built in Step 03.
          </p>
        </section>
      ))}

      <Contact />
    </SiteShell>
  );
}
