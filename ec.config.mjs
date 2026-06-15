import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginFileIcons } from '@xt0rted/expressive-code-file-icons';

// QuenchWorks is dark-only and strictly monochrome. We use a single, near
// monochrome dark theme (vesper) and override the chrome so code blocks sit on
// the ink page exactly like the existing graphite cards.
//
// Brand tokens (mirror src/styles/global.css):
//   ink      #0b0b0c  background
//   graphite #141417  surface / cards / code blocks
//   line     #26262b  borders / dividers
//   ash      #b0b0ba  muted text
//   paper    #fafafa  primary text
const INK = '#0b0b0c';
const GRAPHITE = '#141417';
const LINE = '#26262b';
const MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

export default defineEcConfig({
  themes: ['vesper'],
  // Keep the brand chrome regardless of OS theme; the site is dark-only.
  useDarkModeMediaQuery: false,
  styleOverrides: {
    borderRadius: '16px',
    borderColor: LINE,
    codeBackground: GRAPHITE,
    uiFontFamily: MONO,
    codeFontFamily: MONO,
    frames: {
      editorBackground: GRAPHITE,
      editorActiveTabBackground: GRAPHITE,
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorTabBarBackground: INK,
      editorTabBarBorderBottomColor: LINE,
      terminalBackground: GRAPHITE,
      terminalTitlebarBackground: INK,
      terminalTitlebarBorderBottomColor: LINE,
      frameBoxShadowCssValue: 'none',
    },
  },
  plugins: [
    pluginLineNumbers(),
    pluginCollapsibleSections(),
    pluginFileIcons({
      iconClass: 'size-4',
      titleClass: 'flex items-center gap-2',
    }),
  ],
  // Most blocks are shell/yaml; keep line numbers off for bash/text.
  defaultProps: {
    overridesByLang: {
      bash: { showLineNumbers: false },
      text: { showLineNumbers: false },
    },
  },
});
