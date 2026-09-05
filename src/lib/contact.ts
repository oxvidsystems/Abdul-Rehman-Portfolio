/**
 * Single source of truth for OXVID's real contact details.
 *
 * Every value here was supplied by the client verbatim. Nothing is
 * derived, formatted-up or invented — in particular there is NO
 * USA-specific email address: the USA office publishes the same
 * `info@oxvidsystems.com` inbox as the Pakistan/general destination,
 * and that is stated as-is rather than papered over with a made-up
 * `usa@…` address. The chat widget (later step) must read from here
 * too, so the two never drift.
 *
 * `display` is what the site shows; `href` is what the link fires.
 */

export type ContactChannel = {
  kind: "phone" | "email" | "address";
  label: string;
  display: string;
  href?: string;
};

export type ContactDestination = {
  id: "pk" | "us";
  /** Short locale tag used by the technical/route graphics. */
  code: string;
  eyebrow: string;
  name: string;
  channels: ContactChannel[];
};

export const CONTACT_DESTINATIONS: ContactDestination[] = [
  {
    id: "pk",
    code: "PK",
    eyebrow: "Pakistan / General Contact",
    name: "Abdul Rehman",
    channels: [
      {
        kind: "phone",
        label: "Direct",
        display: "+92-322-1690030",
        href: "tel:+923221690030",
      },
      {
        kind: "email",
        label: "Personal",
        display: "m.abdulrehman111@gmail.com",
        href: "mailto:m.abdulrehman111@gmail.com",
      },
      {
        kind: "email",
        label: "Studio",
        display: "info@oxvidsystems.com",
        href: "mailto:info@oxvidsystems.com",
      },
    ],
  },
  {
    id: "us",
    code: "US",
    eyebrow: "USA Office",
    name: "OXVID Systems — USA",
    channels: [
      {
        kind: "address",
        label: "Address",
        display: "182 Ridgeley Ave\nIselin, NJ 08830\nUSA",
      },
      {
        kind: "phone",
        label: "Direct",
        display: "+1 571 3761336",
        href: "tel:+15713761336",
      },
      {
        kind: "email",
        label: "Studio",
        display: "info@oxvidsystems.com",
        href: "mailto:info@oxvidsystems.com",
      },
    ],
  },
];

/** Where "START A PROJECT" points. The studio inbox, not the personal one. */
export const PRIMARY_ENQUIRY_EMAIL = "info@oxvidsystems.com";
export const PRIMARY_ENQUIRY_HREF = `mailto:${PRIMARY_ENQUIRY_EMAIL}`;
