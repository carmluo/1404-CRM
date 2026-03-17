/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Figma token: Font.Name.Heading / Font.Name.Body → "Helvetica Neue"
        crm: ["'Helvetica Neue'", 'Helvetica', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Figma token: Font.Sizes / Font.Line Heights
        // usage: text-h1, text-h2 ... text-body-3
        'h1':     ['67px', { lineHeight: '87px' }],  // Heading 1
        'h2':     ['54px', { lineHeight: '70px' }],  // Heading 2
        'h3':     ['43px', { lineHeight: '56px' }],  // Heading 3
        'h4':     ['34px', { lineHeight: '44px' }],  // Heading 4
        'h5':     ['28px', { lineHeight: '36px' }],  // Heading 5
        'h6':     ['22px', { lineHeight: '29px' }],  // Heading 6
        'body-1': ['22px', { lineHeight: '33px' }],  // Body 1
        'body-2': ['18px', { lineHeight: '27px' }],  // Body 2
        'body-3': ['14px', { lineHeight: '21px' }],  // Body 3
      },
      colors: {

        // ── Figma: color/background/* ─────────────────────────────────────
        surface: {
          DEFAULT:  '#F2F2F2',              // background/neutral/surface
          white:    '#FFFFFF',              // background/neutral/white
          elevated: 'rgba(255,255,255,0.70)', // background/neutral/elevated
          hover:    '#E5E5E5',              // background/neutral/hovered
          press:    '#CBCBCB',              // background/neutral/pressed
          disabled: '#B3B3B3',             // background/neutral/disabled
          invert:   '#2D2D2D',             // background/neutral/invert
        },
        brand: {
          DEFAULT:   '#CFE8E0',            // background/primary/default
          hover:     '#B0D8CD',            // background/primary/hovered
          press:     '#92C9B9',            // background/primary/pressed
          action:    '#326757',            // background/primary/invert
          'action-hover': '#438974',       // background/primary/invert-hovered
          secondary: '#EAE7E4',           // background/secondary/default
          'secondary-hover': '#E9DCCE',   // background/secondary/hovered
          'secondary-press': '#DAC5AE',   // background/secondary/pressed
        },
        warning: {
          DEFAULT: '#FFF5D8',              // background/warning/default
          hover:   '#FFE39D',              // background/warning/hovered
          press:   '#FFC500',              // background/warning/pressed
          border:  '#FFA200',             // border/warning/default
          text:    '#F16300',             // text/warning/default
          bold:    '#3D2B1D',             // text/warning/bold
        },
        danger: {
          DEFAULT: '#FFEBEB',              // background/danger/default
          hover:   '#FFD3D1',              // background/danger/hovered
          press:   '#FFB4B0',             // background/danger/pressed
          border:  '#FF928D',             // border/danger/default
          text:    '#BE1C17',             // text/danger/default
        },
        safe: {
          DEFAULT: '#EBFFD2',              // background/safe/default
          hover:   '#CBF29E',              // background/safe/hovered
          press:   '#B1EB6B',             // background/safe/pressed
          border:  '#A7E160',             // border/safe/default
          text:    '#528002',             // text/safe/default
          bold:    '#3A531C',             // text/safe/bold
        },

        // ── Figma: color/border/* ─────────────────────────────────────────
        border: {
          DEFAULT:          '#E5E5E5',    // border/neutral/default
          input:            '#dde1e6',    // (form input — not in export, kept as-is)
          hover:            '#CBCBCB',    // border/neutral/hovered
          press:            '#B3B3B3',    // border/neutral/pressed
          disabled:         '#9A9A9A',    // border/neutral/disabled
          primary:          '#92C9B9',    // border/primary/default
          'primary-bold':   '#326757',    // border/primary/bold
          'primary-hover':  '#73BAA5',    // border/primary/hovered
          'primary-press':  '#54AB91',    // border/primary/pressed
          secondary:        '#DAC5AE',    // border/secondary/default
          'secondary-hover':'#CCAE8F',    // border/secondary/hovered
          'secondary-press':'#BE976F',    // border/secondary/pressed
        },

        // ── Figma: color/text/* ───────────────────────────────────────────
        content: {
          DEFAULT:   '#232323',           // text/neutral/default
          subtle:    '#414141',           // text/neutral/subtle
          subtlest:  '#565656',           // text/neutral/subtlest
          disabled:  '#838383',           // text/neutral/disabled
          invert:    '#F2F2F2',           // text/neutral/invert
          primary:   '#326757',           // text/primary/default
          'primary-bold': '#11221D',      // text/primary/bold
          secondary: '#8C6740',           // text/secondary/default
          'secondary-bold': '#463320',    // text/secondary/bold
        },

        // ── Figma: color/data-visualization/* ────────────────────────────
        viz: {
          DEFAULT:    '#54AB91',          // monochromatic-primary/default
          dark:       '#438974',          // monochromatic-primary/dark
          subtle:     '#92C9B9',          // monochromatic-primary/subtle
          subtlest:   '#B0D8CD',          // monochromatic-primary/subtlest
          'seq-1':    '#54AB91',
          'seq-2':    '#BF63F3',
          'seq-3':    '#367DE8',
          'seq-4':    '#EF8E1E',
          'seq-5':    '#82B535',
          'seq-6':    '#964AC0',
          'seq-7':    '#AF8150',
        },

        // ── Legacy aliases (backward compat — map to Figma tokens above) ──
        // These keep existing class names working across the codebase.
        primary: {
          text:   '#232323',              // → content.DEFAULT
          action: '#326757',              // → brand.action / content.primary
          hover:  '#11221D',              // → content.primary-bold
        },
        secondary: {
          text: '#565656',                // → content.subtlest
          bg:   '#EAE7E4',                // → brand.secondary
        },
        muted:   '#838383',               // → content.disabled
        page:    '#F2F2F2',               // → surface.DEFAULT
        card:    '#FFFFFF',               // → surface.white
        elevated: 'rgba(255,255,255,0.70)', // → surface.elevated
        ai: {
          bg:   '#CFE8E0',                // updated → brand.DEFAULT
          text: '#326757',               // updated → brand.action
        },
        amber: '#F5A623',

        // ── App-specific (stage/status/risk — not in Figma color system) ──
        stage: {
          qualifying:    '#5BBFA0',
          needsAnalysis: '#9C59C5',
          estPrep:       '#4A8FE0',
          estSubmitted:  '#F5A623',
          negotiation:   '#8A9D35',
          verbalCommit:  '#7B5EA7',
        },
        status: {
          won:      '#16A34A',
          lost:     '#DC2626',
          pending:  '#D97706',
          accepted: '#16A34A',
          drafted:  '#9CA3AF',
        },
        risk: {
          noActivity: '#9CA3AF',
          unresolved: '#D97706',
          overdue:    '#EF4444',
        },
        donut: {
          awarded: '#438974',
          lost:    '#87BDB0',
          pending: '#B8D9D1',
        },
      },
      borderRadius: {
        card:  '8px',
        badge: '4px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), -1px 2px 2px rgba(0,0,0,0.03)',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
