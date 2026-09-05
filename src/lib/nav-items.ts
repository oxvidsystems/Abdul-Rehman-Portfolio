export type NavItem = {
  num: string;
  id: string;
  label: string;
};

/**
 * Single source of truth for section order, anchors and numbering.
 * The left nav (desktop), the mobile menu, and the placeholder
 * sections in app/page.tsx all read from this list — add a new
 * section here and it appears everywhere consistently.
 */
export const NAV_ITEMS: NavItem[] = [
  { num: "01", id: "home", label: "Home" },
  { num: "02", id: "about", label: "About" },
  { num: "03", id: "expertise", label: "Expertise" },
  { num: "04", id: "how-i-build", label: "How I Build" },
  { num: "05", id: "work", label: "Work" },
  { num: "06", id: "experience", label: "Experience" },
  { num: "07", id: "contact", label: "Contact" },
];

/** Fixed width/height (px) of each square icon button inside the
 *  floating desktop nav pill — used to position the sliding
 *  active-highlight via a transform. Keep in sync with the inline
 *  `style={{ width, height }}` on each pill item in desktop-nav.tsx.
 *  (Was 56 when the pill showed an icon *and* a text label; the pill
 *  is icon-only now, so the button is tighter.) */
export const PILL_ITEM_SIZE = 44;
