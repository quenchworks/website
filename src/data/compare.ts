// Single source of truth for the QuenchWorks-vs-providers comparison.
// Consumed by /compare (the full matrix) AND /alternative/[vendor] (one SEO
// landing per competitor), in all three site languages (en/ar/es). Keeping the
// data here means a fact is edited once and every surface — both pages, every
// language — updates together.
//
// Structure vs. translation: the `vendors` order, each row's `cells` order, and
// the neutral verdict `v` values ('Yes' | 'No' | 'Free' | 'Paid' | 'Freemium' |
// 'Varies' | 'Partial' | 'n/a') are the same across all languages — they are the
// structural keys that drive tone() and the verdict label map. Only the displayed
// prose differs per language, so every human-facing string is an `L` triple.

export type Lang = 'en' | 'ar' | 'es';
// A localized string: the same fact in each supported language.
export type L = { en: string; ar: string; es: string };
// Resolve a localized string for a language, falling back to English.
export const pick = (v: L, lang: Lang): string => v[lang] || v.en;

// Vendor order; QuenchWorks stays first so it keeps the highlighted column.
// Each `cells` array below has one entry per vendor, in this same order.
// Neutral by design — vendor names are not translated.
export const vendors: string[] = ['QuenchWorks', 'Bitnami', 'Chainguard', 'Docker', 'RapidFort', 'Minimus'];

// URL slug for a vendor name (drives /alternative/<slug>).
export const vendorSlug = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Pick a visual treatment per verdict word without adding any color accent.
export function tone(v: string): string {
  const yes = v.toLowerCase();
  if (yes === 'yes' || yes === 'free') return 'text-paper';
  // Everything else (No, Paid, Partial, Varies, Freemium, n/a, —) is muted.
  return 'text-ash';
}

// Pill treatment for a price tier; monochrome, with Free carrying the emphasis.
export function pillTone(tier: string): string {
  return tier === 'Free' ? 'border-paper/40 text-paper' : 'border-line text-ash';
}

// Verdict DISPLAY label per language, keyed by the neutral verdict `v`. English
// is identity (the verdict word is shown as-is); ar/es are harvested from the
// verdictLabel maps in the ar/es compare pages. A page renders verdictLabel[lang][cell.v].
export const verdictLabel: Record<Lang, Record<string, string>> = {
  en: {
    Free: 'Free',
    Paid: 'Paid',
    Freemium: 'Freemium',
    Varies: 'Varies',
    Yes: 'Yes',
    No: 'No',
    Partial: 'Partial',
    'n/a': 'n/a',
  },
  ar: {
    Free: 'مجاني',
    Paid: 'مدفوع',
    Freemium: 'مجاني-جزئيًا',
    Varies: 'يختلف',
    Yes: 'نعم',
    No: 'لا',
    Partial: 'جزئي',
    'n/a': 'غير منطبق',
  },
  es: {
    Free: 'Gratis',
    Paid: 'De pago',
    Freemium: 'Freemium',
    Varies: 'Varía',
    Yes: 'Sí',
    No: 'No',
    Partial: 'Parcial',
    'n/a': 'n/d',
  },
};

// Each cell is { v: short verdict, n?: localized note }. Be factual, conservative,
// and fair. Where a fact could not be confirmed from a primary source, the verdict
// is hedged ("Varies", "Partial", "—") with a neutral note rather than a hard claim.
export type Cell = { v: string; n?: L };
export type Row = { label: L; cells: Cell[] };

export const rows: Row[] = [
  {
    label: {
      en: 'Price / free tier',
      ar: 'السعر / الطبقة المجانية',
      es: 'Precio / nivel gratuito',
    },
    cells: [
      { v: 'Free' },
      {
        v: 'Paid',
        n: {
          en: 'Bitnami Secure Images is commercial; a latest-only hardened community set and a frozen legacy registry remain',
          ar: 'Bitnami Secure Images تجاري؛ تبقى مجموعة مجتمعية مُحصّنة بأحدث إصدار فقط وسجلّ قديم مجمّد',
          es: 'Bitnami Secure Images es comercial; quedan un conjunto comunitario reforzado solo con la última versión y un registro heredado congelado',
        },
      },
      {
        v: 'Freemium',
        n: {
          en: 'A small set of Starter images is free; the full catalog is a paid subscription',
          ar: 'مجموعة صغيرة من صور Starter مجانية؛ الكتالوج الكامل اشتراك مدفوع',
          es: 'Un pequeño conjunto de imágenes Starter es gratis; el catálogo completo es una suscripción de pago',
        },
      },
      {
        v: 'Free',
        n: {
          en: 'Docker Hardened Images opened as free, Apache-2.0 open source in Dec 2025',
          ar: 'فُتحت Docker Hardened Images مجانًا مفتوحة المصدر بترخيص Apache-2.0 في ديسمبر 2025',
          es: 'Docker Hardened Images se abrió como software libre Apache-2.0 en diciembre de 2025',
        },
      },
      {
        v: 'Varies',
        n: {
          en: 'Commercial platform; public pricing for image access is not published',
          ar: 'منصّة تجارية؛ تسعير الوصول إلى الصور غير منشور علنًا',
          es: 'Plataforma comercial; no se publica precio público para el acceso a imágenes',
        },
      },
      {
        v: 'Paid',
        n: {
          en: 'Commercial; a free open-source program exists for eligible projects',
          ar: 'تجاري؛ يوجد برنامج مجاني مفتوح المصدر للمشاريع المؤهّلة',
          es: 'Comercial; existe un programa gratuito de código abierto para proyectos elegibles',
        },
      },
    ],
  },
  {
    label: {
      en: 'Built from source on Wolfi',
      ar: 'مبني من المصدر على Wolfi',
      es: 'Compilado desde el código fuente en Wolfi',
    },
    cells: [
      { v: 'Yes' },
      {
        v: 'No',
        n: {
          en: 'Debian-based hardening, not Wolfi',
          ar: 'تحصين قائم على Debian، لا Wolfi',
          es: 'Endurecimiento basado en Debian, no Wolfi',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Wolfi-based',
          ar: 'قائم على Wolfi',
          es: 'Basado en Wolfi',
        },
      },
      {
        v: 'No',
        n: {
          en: 'Built on Debian and Alpine',
          ar: 'مبني على Debian وAlpine',
          es: 'Construido sobre Debian y Alpine',
        },
      },
      {
        v: 'No',
        n: {
          en: 'Curated / optimized upstream images, not a Wolfi rebuild',
          ar: 'صور رسمية مُنسّقة/مُحسّنة، لا إعادة بناء على Wolfi',
          es: 'Imágenes oficiales curadas/optimizadas, no una recompilación en Wolfi',
        },
      },
      {
        v: 'No',
        n: {
          en: 'Proprietary from-source build, not Wolfi',
          ar: 'بناء مملوك من المصدر، لا Wolfi',
          es: 'Compilación propietaria desde el código fuente, no Wolfi',
        },
      },
    ],
  },
  {
    label: {
      en: '0-CVE goal with daily rebuilds',
      ar: 'هدف صفر ثغرات مع إعادة بناء يومية',
      es: 'Objetivo de cero CVE con reconstrucciones diarias',
    },
    cells: [
      {
        v: 'Yes',
        n: {
          en: 'Hard Trivy gate; a fixable CVE fails the build',
          ar: 'بوابة Trivy صارمة؛ ثغرة قابلة للإصلاح تُفشل البناء',
          es: 'Puerta de control estricta de Trivy; un CVE corregible hace fallar la compilación',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Near-zero-CVE goal; cadence not publicly specified here',
          ar: 'هدف شبه صفر ثغرات؛ الوتيرة غير محدّدة علنًا هنا',
          es: 'Objetivo de casi cero CVE; la cadencia no se especifica públicamente aquí',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Near-zero-CVE goal with frequent rebuilds',
          ar: 'هدف شبه صفر ثغرات مع إعادة بناء متكرّرة',
          es: 'Objetivo de casi cero CVE con reconstrucciones frecuentes',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Near-zero-CVE goal; paid tiers add a remediation SLA',
          ar: 'هدف شبه صفر ثغرات؛ الطبقات المدفوعة تضيف اتفاقية مستوى خدمة للمعالجة',
          es: 'Objetivo de casi cero CVE; los niveles de pago añaden un SLA de remediación',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Near-zero-CVE goal via continuous hardening',
          ar: 'هدف شبه صفر ثغرات عبر تحصين مستمر',
          es: 'Objetivo de casi cero CVE mediante endurecimiento continuo',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Near-zero-CVE goal; paid tiers add a remediation SLA',
          ar: 'هدف شبه صفر ثغرات؛ الطبقات المدفوعة تضيف اتفاقية مستوى خدمة للمعالجة',
          es: 'Objetivo de casi cero CVE; los niveles de pago añaden un SLA de remediación',
        },
      },
    ],
  },
  {
    label: {
      en: 'Signed (cosign keyless)',
      ar: 'موقّع (cosign دون مفتاح)',
      es: 'Firmado (cosign sin clave)',
    },
    cells: [
      { v: 'Yes' },
      {
        v: 'Yes',
        n: {
          en: 'Signed images',
          ar: 'صور موقّعة',
          es: 'Imágenes firmadas',
        },
      },
      { v: 'Yes' },
      { v: 'Yes' },
      {
        v: 'Yes',
        n: {
          en: 'Cryptographic signing',
          ar: 'توقيع تشفيري',
          es: 'Firma criptográfica',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Cosign signatures',
          ar: 'توقيعات cosign',
          es: 'Firmas cosign',
        },
      },
    ],
  },
  {
    label: {
      en: 'SBOM (SPDX or CycloneDX)',
      ar: 'SBOM (SPDX أو CycloneDX)',
      es: 'SBOM (SPDX o CycloneDX)',
    },
    cells: [
      {
        v: 'Yes',
        n: { en: 'SPDX', ar: 'SPDX', es: 'SPDX' },
      },
      { v: 'Yes' },
      { v: 'Yes' },
      {
        v: 'Yes',
        n: {
          en: 'SPDX and CycloneDX',
          ar: 'SPDX وCycloneDX',
          es: 'SPDX y CycloneDX',
        },
      },
      { v: 'Yes' },
      { v: 'Yes' },
    ],
  },
  {
    label: {
      en: 'SLSA build provenance',
      ar: 'منشأ بناء SLSA',
      es: 'Procedencia de compilación SLSA',
    },
    cells: [
      { v: 'Yes' },
      {
        v: 'Partial',
        n: {
          en: 'Attestations vary by offering',
          ar: 'تختلف الشهادات حسب العرض',
          es: 'Las atestaciones varían según la oferta',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'SLSA Build Level 2',
          ar: 'SLSA Build Level 2',
          es: 'SLSA Build Level 2',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'SLSA Build Level 3',
          ar: 'SLSA Build Level 3',
          es: 'SLSA Build Level 3',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'SLSA Level 3 (per vendor)',
          ar: 'SLSA Level 3 (حسب المورّد)',
          es: 'SLSA Level 3 (según el proveedor)',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'SLSA Level 3-aligned (per vendor)',
          ar: 'متوائم مع SLSA Level 3 (حسب المورّد)',
          es: 'Alineado con SLSA Level 3 (según el proveedor)',
        },
      },
    ],
  },
  {
    label: {
      en: 'Multi-arch (amd64 + arm64)',
      ar: 'متعدد المعماريات (amd64 + arm64)',
      es: 'Multiarquitectura (amd64 + arm64)',
    },
    cells: [
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes' },
      { v: 'Yes' },
      {
        v: 'Varies',
        n: {
          en: 'Not confirmed across the catalog',
          ar: 'غير مؤكّد عبر الكتالوج',
          es: 'No confirmado en todo el catálogo',
        },
      },
      {
        v: 'Varies',
        n: {
          en: 'Not confirmed from a primary source',
          ar: 'غير مؤكّد من مصدر أولي',
          es: 'No confirmado desde una fuente primaria',
        },
      },
    ],
  },
  {
    label: {
      en: 'Helm charts included',
      ar: 'مخططات Helm مُضمّنة',
      es: 'Charts de Helm incluidos',
    },
    cells: [
      { v: 'Yes' },
      {
        v: 'Yes',
        n: {
          en: 'Behind the paid catalog',
          ar: 'خلف الكتالوج المدفوع',
          es: 'Tras el catálogo de pago',
        },
      },
      {
        v: 'No',
        n: {
          en: 'Images focused',
          ar: 'مُركّز على الصور',
          es: 'Enfocado en imágenes',
        },
      },
      { v: 'Yes' },
      {
        v: 'Partial',
        n: {
          en: 'Charts-compatible images; integrates with existing charts',
          ar: 'صور متوافقة مع المخططات؛ تتكامل مع المخططات الموجودة',
          es: 'Imágenes compatibles con charts; se integra con charts existentes',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Helm charts offered',
          ar: 'مخططات Helm مُتاحة',
          es: 'Charts de Helm ofrecidos',
        },
      },
    ],
  },
  {
    label: {
      en: 'Charts pin images by digest',
      ar: 'المخططات تثبّت الصور بالبصمة الرقمية',
      es: 'Los charts fijan las imágenes por digest',
    },
    cells: [
      { v: 'Yes' },
      {
        v: 'Varies',
        n: {
          en: 'Not confirmed here',
          ar: 'غير مؤكّد هنا',
          es: 'No confirmado aquí',
        },
      },
      { v: 'n/a' },
      {
        v: 'Varies',
        n: {
          en: 'Not confirmed here',
          ar: 'غير مؤكّد هنا',
          es: 'No confirmado aquí',
        },
      },
      {
        v: 'n/a',
        n: {
          en: 'No first-party charts',
          ar: 'لا مخططات من الطرف الأول',
          es: 'Sin charts propios',
        },
      },
      {
        v: 'Varies',
        n: {
          en: 'Not confirmed here',
          ar: 'غير مؤكّد هنا',
          es: 'No confirmado aquí',
        },
      },
    ],
  },
  {
    label: {
      en: 'License transparency, clean alternatives flagged',
      ar: 'شفافية الترخيص، مع تمييز البدائل النظيفة',
      es: 'Transparencia de licencias, alternativas limpias señaladas',
    },
    cells: [
      {
        v: 'Yes',
        n: {
          en: 'Source-available apps are labeled, with an OSI-clean alternative named',
          ar: 'التطبيقات متاحة المصدر مُعلّمة، مع ذِكر بديل نظيف OSI',
          es: 'Las apps de código disponible se etiquetan, con una alternativa limpia según OSI nombrada',
        },
      },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
      { v: 'Partial' },
    ],
  },
  {
    label: {
      en: 'Open and free to verify',
      ar: 'مفتوح ومجاني للتحقّق',
      es: 'Abierto y gratuito para verificar',
    },
    cells: [
      {
        v: 'Yes',
        n: {
          en: 'Public images, charts, and build workflows',
          ar: 'صور ومخططات ومسارات بناء عامة',
          es: 'Imágenes, charts y flujos de compilación públicos',
        },
      },
      {
        v: 'Partial',
        n: {
          en: 'Full catalog gated behind a subscription',
          ar: 'الكتالوج الكامل محجوب خلف اشتراك',
          es: 'Catálogo completo restringido tras una suscripción',
        },
      },
      {
        v: 'Partial',
        n: {
          en: 'Full catalog gated behind a subscription',
          ar: 'الكتالوج الكامل محجوب خلف اشتراك',
          es: 'Catálogo completo restringido tras una suscripción',
        },
      },
      {
        v: 'Yes',
        n: {
          en: 'Free, open-source catalog with public attestations',
          ar: 'كتالوج مجاني مفتوح المصدر مع شهادات عامة',
          es: 'Catálogo gratuito de código abierto con atestaciones públicas',
        },
      },
      {
        v: 'Partial',
        n: {
          en: 'Commercial platform; not a fully open catalog',
          ar: 'منصّة تجارية؛ ليست كتالوجًا مفتوحًا بالكامل',
          es: 'Plataforma comercial; no es un catálogo totalmente abierto',
        },
      },
      {
        v: 'Partial',
        n: {
          en: 'Commercial; open-source program for eligible projects',
          ar: 'تجاري؛ برنامج مفتوح المصدر للمشاريع المؤهّلة',
          es: 'Comercial; programa de código abierto para proyectos elegibles',
        },
      },
    ],
  },
];

// The handful of things that set QuenchWorks apart, called out above the grid.
export const differentiators: { label: L; body: L }[] = [
  {
    label: {
      en: 'Free, no account',
      ar: 'مجاني، دون حساب',
      es: 'Gratis, sin cuenta',
    },
    body: {
      en: 'Pull images and deploy charts with no subscription, no login, and no registry to add.',
      ar: 'اسحب الصور وانشر المخططات دون اشتراك ودون تسجيل دخول ودون سجلّ لإضافته.',
      es: 'Descarga imágenes y despliega charts sin suscripción, sin inicio de sesión y sin registro que añadir.',
    },
  },
  {
    label: {
      en: 'Fully public, verifiable',
      ar: 'عام بالكامل، قابل للتحقّق',
      es: 'Totalmente público, verificable',
    },
    body: {
      en: 'Images, charts, and the proof (SBOM and SLSA provenance) are public for anyone to check.',
      ar: 'الصور والمخططات والإثبات (SBOM ومنشأ SLSA) عامة ليفحصها أي شخص.',
      es: 'Las imágenes, los charts y la prueba (SBOM y procedencia SLSA) son públicos para que cualquiera los compruebe.',
    },
  },
  {
    label: {
      en: 'Charts pinned by digest',
      ar: 'مخططات مثبّتة بالبصمة الرقمية',
      es: 'Charts fijados por digest',
    },
    body: {
      en: 'Signed Helm charts reference their image by sha256, never a moving tag.',
      ar: 'تشير مخططات Helm الموقّعة إلى صورتها عبر sha256، لا عبر وسم متغيّر.',
      es: 'Los charts de Helm firmados referencian su imagen por sha256, nunca por una etiqueta móvil.',
    },
  },
  {
    label: {
      en: 'License honesty',
      ar: 'صدق الترخيص',
      es: 'Honestidad en las licencias',
    },
    body: {
      en: 'Source-available apps are labeled as such, each with an OSI-clean alternative named.',
      ar: 'التطبيقات متاحة المصدر مُعلّمة كذلك، ولكلٍّ منها بديل نظيف OSI مذكور.',
      es: 'Las apps de código disponible se etiquetan como tales, cada una con una alternativa limpia según OSI nombrada.',
    },
  },
];

// One-line, neutral snapshot per vendor (same order as `vendors`); tier drives the pill.
// `tier` is the neutral key (also feeds pillTone); the displayed tier word comes from
// verdictLabel[lang][tier]. `name` is not translated.
export const vendorMeta: { name: string; tier: string; blurb: L }[] = [
  {
    name: 'QuenchWorks',
    tier: 'Free',
    blurb: {
      en: 'Independent, fully public hardened catalog. Wolfi-built images and signed Helm charts pinned by digest, no account needed.',
      ar: 'كتالوج مُحصّن مستقل وعام بالكامل. صور مبنية على Wolfi ومخططات Helm موقّعة مثبّتة بالبصمة الرقمية، دون حاجة إلى حساب.',
      es: 'Catálogo reforzado independiente y totalmente público. Imágenes construidas en Wolfi y charts de Helm firmados fijados por digest, sin necesidad de cuenta.',
    },
  },
  {
    name: 'Bitnami',
    tier: 'Paid',
    blurb: {
      en: "Broadcom's commercial Bitnami Secure Images. The free community catalog was retired, leaving a frozen legacy registry behind.",
      ar: 'Bitnami Secure Images التجاري من Broadcom. سُحب كتالوج المجتمع المجاني، تاركًا وراءه سجلًّا قديمًا مجمّدًا.',
      es: 'El Bitnami Secure Images comercial de Broadcom. El catálogo comunitario gratuito se retiró, dejando atrás un registro heredado congelado.',
    },
  },
  {
    name: 'Chainguard',
    tier: 'Freemium',
    blurb: {
      en: 'Premium Wolfi-based minimal images. A small Starter set is free; the full catalog is a paid subscription.',
      ar: 'صور مصغّرة متميّزة قائمة على Wolfi. مجموعة Starter صغيرة مجانية؛ الكتالوج الكامل اشتراك مدفوع.',
      es: 'Imágenes mínimas premium basadas en Wolfi. Un pequeño conjunto Starter es gratis; el catálogo completo es una suscripción de pago.',
    },
  },
  {
    name: 'Docker',
    tier: 'Free',
    blurb: {
      en: 'Docker Hardened Images, opened as a free, Apache-2.0 open-source catalog in late 2025. Built on Debian and Alpine.',
      ar: 'Docker Hardened Images، فُتحت ككتالوج مجاني مفتوح المصدر بترخيص Apache-2.0 أواخر 2025. مبنية على Debian وAlpine.',
      es: 'Docker Hardened Images, abierto como un catálogo gratuito de código abierto Apache-2.0 a finales de 2025. Construido sobre Debian y Alpine.',
    },
  },
  {
    name: 'RapidFort',
    tier: 'Varies',
    blurb: {
      en: 'Curated, optimized images that strip attack surface from upstream containers. Commercial platform.',
      ar: 'صور مُنسّقة ومُحسّنة تُزيل سطح الهجوم من الحاويات الرسمية. منصّة تجارية.',
      es: 'Imágenes curadas y optimizadas que recortan la superficie de ataque de los contenedores oficiales. Plataforma comercial.',
    },
  },
  {
    name: 'Minimus',
    tier: 'Paid',
    blurb: {
      en: 'Proprietary from-source minimal images. Commercial, with a free program for eligible open-source projects.',
      ar: 'صور مصغّرة مملوكة من المصدر. تجارية، مع برنامج مجاني للمشاريع المؤهّلة مفتوحة المصدر.',
      es: 'Imágenes mínimas propietarias desde el código fuente. Comercial, con un programa gratuito para proyectos de código abierto elegibles.',
    },
  },
];

// Per-vendor lead copy for the /alternative/<vendor> landing pages. Bitnami gets
// the full Broadcom-paywall narrative; the rest get a concise, factual angle.
// Keyed by vendorSlug. Anything without an entry falls back to the vendor's
// vendorMeta blurb. ar/es here were translated fresh (only en existed before).
export const vendorIntro: Record<string, { headline: L; body: L }> = {
  bitnami: {
    headline: {
      en: 'A free, signed replacement for Bitnami',
      ar: 'بديل مجاني وموقّع لـ Bitnami',
      es: 'Un reemplazo gratuito y firmado para Bitnami',
    },
    body: {
      en: 'Broadcom moved the free Bitnami secure-images catalog to a paid model in 2025, leaving teams that built on bitnami/* images and charts looking for a maintained, hardened replacement. QuenchWorks is that replacement: a free, MIT-licensed, clean-room catalog of 0-CVE container images and signed Helm charts. It is built independently from source on Wolfi — not a fork or copy of Bitnami charts — and every claim is yours to verify.',
      ar: 'نقلت Broadcom كتالوج صور Bitnami الآمنة المجاني إلى نموذج مدفوع في 2025، تاركةً الفِرق التي بَنت على صور ومخططات bitnami/* تبحث عن بديل مُحصّن ومُتابَع. QuenchWorks هو ذلك البديل: كتالوج مجاني بترخيص MIT، مبني في غرفة نظيفة، من صور حاويات بصفر ثغرات ومخططات Helm موقّعة. وهو مبني بشكل مستقل من المصدر على Wolfi — لا فرعٌ ولا نسخةٌ من مخططات Bitnami — وكل ادّعاء لك أن تتحقّق منه.',
      es: 'Broadcom trasladó el catálogo gratuito de imágenes seguras de Bitnami a un modelo de pago en 2025, dejando a los equipos que construyeron sobre imágenes y charts bitnami/* buscando un reemplazo reforzado y mantenido. QuenchWorks es ese reemplazo: un catálogo gratuito, con licencia MIT y de sala limpia, de imágenes de contenedor con cero CVE y charts de Helm firmados. Se construye de forma independiente desde el código fuente en Wolfi —no es un fork ni una copia de los charts de Bitnami— y cada afirmación es tuya para verificar.',
    },
  },
  chainguard: {
    headline: {
      en: 'A fully-free alternative to Chainguard',
      ar: 'بديل مجاني بالكامل لـ Chainguard',
      es: 'Una alternativa totalmente gratuita a Chainguard',
    },
    body: {
      en: 'Chainguard ships excellent Wolfi-based minimal images, but the full catalog sits behind a paid subscription and a small free Starter set. QuenchWorks is also Wolfi-built and 0-CVE, but the entire catalog — images and signed Helm charts pinned by digest — is free, public, and needs no account.',
      ar: 'تطرح Chainguard صورًا مصغّرة ممتازة قائمة على Wolfi، لكن الكتالوج الكامل يقع خلف اشتراك مدفوع ومجموعة Starter مجانية صغيرة. QuenchWorks أيضًا مبني على Wolfi وبصفر ثغرات، لكن الكتالوج بأكمله — صور ومخططات Helm موقّعة مثبّتة بالبصمة الرقمية — مجاني وعام ولا يحتاج إلى حساب.',
      es: 'Chainguard ofrece excelentes imágenes mínimas basadas en Wolfi, pero el catálogo completo está tras una suscripción de pago y un pequeño conjunto Starter gratuito. QuenchWorks también está construido en Wolfi y con cero CVE, pero todo el catálogo —imágenes y charts de Helm firmados fijados por digest— es gratuito, público y no necesita cuenta.',
    },
  },
  docker: {
    headline: {
      en: 'QuenchWorks vs Docker Hardened Images',
      ar: 'QuenchWorks مقابل Docker Hardened Images',
      es: 'QuenchWorks frente a Docker Hardened Images',
    },
    body: {
      en: 'Docker Hardened Images opened as a free, Apache-2.0 catalog in late 2025, built on Debian and Alpine. QuenchWorks takes a different base — every app compiled from source on Wolfi — and ships first-party signed Helm charts that pin their image by digest, so the comparison is more about approach than price.',
      ar: 'فُتحت Docker Hardened Images ككتالوج مجاني بترخيص Apache-2.0 أواخر 2025، مبنية على Debian وAlpine. يتّخذ QuenchWorks أساسًا مختلفًا — كل تطبيق مُجمّع من المصدر على Wolfi — ويطرح مخططات Helm موقّعة من الطرف الأول تثبّت صورتها بالبصمة الرقمية، فالمقارنة عن المنهج أكثر منها عن السعر.',
      es: 'Docker Hardened Images se abrió como un catálogo gratuito Apache-2.0 a finales de 2025, construido sobre Debian y Alpine. QuenchWorks parte de una base distinta —cada app compilada desde el código fuente en Wolfi— y ofrece charts de Helm firmados propios que fijan su imagen por digest, así que la comparación trata más del enfoque que del precio.',
    },
  },
  rapidfort: {
    headline: {
      en: 'A from-source alternative to RapidFort',
      ar: 'بديل مبني من المصدر لـ RapidFort',
      es: 'Una alternativa desde el código fuente a RapidFort',
    },
    body: {
      en: 'RapidFort curates and optimizes upstream images to strip attack surface, as a commercial platform. QuenchWorks instead builds each app from source on Wolfi to a 0-CVE gate and ships signed Helm charts pinned by digest — free, public, and fully verifiable.',
      ar: 'تُنسّق RapidFort الصور الرسمية وتُحسّنها لإزالة سطح الهجوم، كمنصّة تجارية. أمّا QuenchWorks فيبني كل تطبيق من المصدر على Wolfi حتى بوابة صفر ثغرات ويطرح مخططات Helm موقّعة مثبّتة بالبصمة الرقمية — مجاني وعام وقابل للتحقّق بالكامل.',
      es: 'RapidFort cura y optimiza imágenes oficiales para recortar la superficie de ataque, como plataforma comercial. QuenchWorks, en cambio, compila cada app desde el código fuente en Wolfi hasta una puerta de cero CVE y ofrece charts de Helm firmados fijados por digest: gratuito, público y totalmente verificable.',
    },
  },
  minimus: {
    headline: {
      en: 'A free, open alternative to Minimus',
      ar: 'بديل مجاني ومفتوح لـ Minimus',
      es: 'Una alternativa gratuita y abierta a Minimus',
    },
    body: {
      en: 'Minimus ships proprietary from-source minimal images as a commercial product, with a free program for eligible open-source projects. QuenchWorks is from-source and minimal too, but free for everyone, fully public, and shipped with signed Helm charts pinned by digest.',
      ar: 'تطرح Minimus صورًا مصغّرة مملوكة مبنية من المصدر كمنتج تجاري، مع برنامج مجاني للمشاريع المؤهّلة مفتوحة المصدر. QuenchWorks أيضًا مبني من المصدر ومصغّر، لكنه مجاني للجميع وعام بالكامل ويأتي مع مخططات Helm موقّعة مثبّتة بالبصمة الرقمية.',
      es: 'Minimus ofrece imágenes mínimas propietarias desde el código fuente como producto comercial, con un programa gratuito para proyectos de código abierto elegibles. QuenchWorks también es desde el código fuente y mínimo, pero gratuito para todos, totalmente público y entregado con charts de Helm firmados fijados por digest.',
    },
  },
};

// UI chrome strings for the /alternative pages (reusable by /compare). Every key
// provides en/ar/es. {vendor} placeholders are filled by the page at render time.
// ar/es here were translated fresh.
export const ui: Record<string, L> = {
  eyebrow: {
    en: 'Alternatives',
    ar: 'البدائل',
    es: 'Alternativas',
  },
  hubTitle: {
    en: 'Switching from another provider?',
    ar: 'تنتقل من مزوّد آخر؟',
    es: '¿Cambias desde otro proveedor?',
  },
  hubIntro: {
    en: 'Whatever hardened-image catalog you use today, QuenchWorks gives you a free, fully public, no-account alternative: images compiled from source on Wolfi to a 0-CVE gate, and signed Helm charts pinned by digest. Pick your current provider below to see how the two line up, feature by feature.',
    ar: 'أيًّا كان كتالوج الصور المُحصّنة الذي تستخدمه اليوم، يمنحك QuenchWorks بديلًا مجانيًا وعامًا بالكامل ودون حساب: صور مُجمّعة من المصدر على Wolfi حتى بوابة صفر ثغرات، ومخططات Helm موقّعة مثبّتة بالبصمة الرقمية. اختر مزوّدك الحالي أدناه لترى كيف يصطفّ الاثنان، ميزة بميزة.',
    es: 'Sea cual sea el catálogo de imágenes reforzadas que uses hoy, QuenchWorks te da una alternativa gratuita, totalmente pública y sin cuenta: imágenes compiladas desde el código fuente en Wolfi hasta una puerta de cero CVE, y charts de Helm firmados fijados por digest. Elige tu proveedor actual abajo para ver cómo se comparan los dos, característica a característica.',
  },
  leads: {
    en: 'Where QuenchWorks leads',
    ar: 'أين يتقدّم QuenchWorks',
    es: 'En qué destaca QuenchWorks',
  },
  holdsUp: {
    en: 'Where {vendor} holds up',
    ar: 'أين يصمد {vendor}',
    es: 'En qué se mantiene {vendor}',
  },
  fullComparison: {
    en: 'Full comparison',
    ar: 'المقارنة الكاملة',
    es: 'Comparación completa',
  },
  browseCharts: {
    en: 'Browse charts',
    ar: 'تصفّح المخططات',
    es: 'Explorar charts',
  },
  migrate: {
    en: 'Migrate',
    ar: 'الترحيل',
    es: 'Migrar',
  },
  featureByFeature: {
    en: 'QuenchWorks vs {vendor}, feature by feature',
    ar: 'QuenchWorks مقابل {vendor}، ميزة بميزة',
    es: 'QuenchWorks frente a {vendor}, característica a característica',
  },
  conservative: {
    en: 'Conservative on purpose: where a fact about {vendor} could not be confirmed from a primary source, it is marked "Varies" or "Partial" rather than guessed. Verify every claim against {vendor}’s own public sources before relying on it.',
    ar: 'محافظ عن قصد: حيث لم نتمكّن من تأكيد حقيقة عن {vendor} من مصدر أولي، نُعلّمها "يختلف" أو "جزئي" بدل التخمين. تحقّق من كل ادّعاء مقابل مصادر {vendor} العامة قبل أن تعتمد عليه.',
    es: 'Conservador a propósito: donde no se pudo confirmar un dato sobre {vendor} desde una fuente primaria, se marca "Varía" o "Parcial" en lugar de adivinar. Verifica cada afirmación frente a las propias fuentes públicas de {vendor} antes de depender de ella.',
  },
  ctaTitle: {
    en: 'Free, signed, and yours to verify.',
    ar: 'مجاني، ومُوقّع، ولك أن تتحقّق منه.',
    es: 'Gratis, firmado y tuyo para verificar.',
  },
  ctaBody: {
    en: 'Browse the catalog or read the source. No account, no registry to add.',
    ar: 'تصفّح الكتالوج أو اقرأ المصدر. دون حساب، ودون سجلّ لإضافته.',
    es: 'Explora el catálogo o lee el código. Sin cuenta, sin registro que añadir.',
  },
  migrationGuide: {
    en: 'Migration guide',
    ar: 'دليل الترحيل',
    es: 'Guía de migración',
  },
  closelyMatched: {
    en: 'Closely matched across the board.',
    ar: 'متقاربان في كل الجوانب.',
    es: 'Muy parejos en todos los aspectos.',
  },
  noParity: {
    en: 'No clear parity to call out here.',
    ar: 'لا تعادل واضح للإشارة إليه هنا.',
    es: 'Sin paridad clara que señalar aquí.',
  },
  hubCtaTitle: {
    en: 'Want every provider side by side?',
    ar: 'تريد كل المزوّدين جنبًا إلى جنب؟',
    es: '¿Quieres todos los proveedores lado a lado?',
  },
  hubCtaBody: {
    en: 'The full comparison table puts QuenchWorks next to every provider, feature by feature.',
    ar: 'يضع جدول المقارنة الكامل QuenchWorks بجوار كل مزوّد، ميزة بميزة.',
    es: 'La tabla de comparación completa pone a QuenchWorks junto a cada proveedor, característica a característica.',
  },
  browseAll: {
    en: 'Browse all',
    ar: 'تصفّح الكل',
    es: 'Explorar todo',
  },
  fullTable: {
    en: 'Full table',
    ar: 'الجدول الكامل',
    es: 'Tabla completa',
  },
};

// Thematic groups for the /compare matrix. Titles are localized; membership is
// by row index into `rows`, so it stays correct as labels are translated.
export const groupTitles: L[] = [
  { en: 'Access & cost', ar: 'الوصول والتكلفة', es: 'Acceso y costo' },
  { en: 'Build & hardening', ar: 'البناء والتحصين', es: 'Compilación y endurecimiento' },
  { en: 'Supply chain', ar: 'سلسلة التوريد', es: 'Cadena de suministro' },
  { en: 'Charts & licensing', ar: 'المخططات والترخيص', es: 'Charts y licencias' },
];
// One group index (into groupTitles) per row, in the same order as `rows`.
export const rowGroupIndex: number[] = [0, 1, 1, 2, 2, 2, 1, 3, 3, 3, 0];
