"use client";

import type { gsap as GsapType } from "gsap";

type GsapBundle = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let pendingCore: Promise<typeof GsapType> | null = null;
let pendingBundle: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<typeof GsapType> {
  if (!pendingCore) {
    pendingCore = import("gsap").then((m) => m.gsap);
  }
  return pendingCore;
}

export function loadGsapBundle(): Promise<GsapBundle> {
  if (!pendingBundle) {
    pendingBundle = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]).then(([core, st, split]) => {
      const bundle: GsapBundle = {
        gsap: core.gsap,
        ScrollTrigger: st.ScrollTrigger,
        SplitText: split.SplitText,
      };
      bundle.gsap.registerPlugin(bundle.ScrollTrigger, bundle.SplitText);
      return bundle;
    });
  }
  return pendingBundle;
}
