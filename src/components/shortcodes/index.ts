// Docs MDX shortcodes, exported as one map to pass to <Content components={...} />.
// Replaces astro-auto-import (incompatible with Astro 7) with Astro's native MDX
// components prop — see src/pages/**/docs/[...slug].astro.
export { default as Notice } from "./Notice.astro";
export { default as Steps } from "./Steps.astro";
export { default as Tabs } from "./Tabs.astro";
export { default as Tab } from "./Tab.astro";
export { default as Kbd } from "./Kbd.astro";
export { default as Card } from "./Card.astro";
export { default as CardGrid } from "./CardGrid.astro";
export { default as FileTree } from "./FileTree.astro";
export { default as Badge } from "./Badge.astro";
