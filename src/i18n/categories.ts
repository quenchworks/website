// i18n for the catalog CATEGORY NAMES. The English category string (e.g.
// "Databases & engines") stays the underlying data/filter/slug key everywhere;
// these dictionaries provide DISPLAY-ONLY translations for the /ar and /es
// locales. English (en) and any missing key pass through unchanged.
//
// NOTE: the ar/es strings below are INITIAL translations and should be reviewed
// by a native speaker before launch. Acronyms (AI, CI/CD, PaaS, GitOps, Git)
// are intentionally kept; only the descriptive parts are translated.

export const categoryNames: Record<'ar' | 'es', Record<string, string>> = {
  ar: {
    'AI gateway': 'بوابة الذكاء الاصطناعي',
    'Analytical': 'تحليلي',
    'Apps & productivity': 'التطبيقات والإنتاجية',
    'Base image': 'صورة أساس',
    'Build tool': 'أداة بناء',
    'CI/CD & registry': 'CI/CD والسجلّ',
    'Cache': 'تخزين مؤقت',
    'Coordination': 'تنسيق',
    'Coordination & mesh': 'التنسيق والشبكة',
    'Databases & engines': 'قواعد البيانات والمحرّكات',
    'Datastore': 'مخزن بيانات',
    'Document': 'مستندي',
    'Gateway': 'بوابة',
    'Gateways & proxies': 'البوابات والوسطاء',
    'Git': 'Git',
    'GitOps': 'GitOps',
    'Graph': 'رسم بياني',
    'Identity': 'الهوية',
    'Language runtime': 'بيئة تشغيل لغة',
    'Machine learning': 'تعلّم الآلة',
    'Media & streaming': 'الوسائط والبثّ',
    'Messaging': 'المراسلة',
    'Messaging & streaming': 'المراسلة والبثّ',
    'Metrics/Exporter': 'المقاييس/المُصدّر',
    'Object storage': 'تخزين الكائنات',
    'Observability': 'القابلية للمراقبة',
    'PaaS': 'PaaS',
    'Registry': 'سجلّ',
    'Relational': 'علائقي',
    'Runtime base': 'أساس بيئة التشغيل',
    'Search': 'بحث',
    'Search & vector': 'البحث والمتّجهات',
    'Secrets': 'الأسرار',
    'Secrets & identity': 'الأسرار والهوية',
    'Security & supply chain': 'الأمن وسلسلة التوريد',
    'Storage & platform': 'التخزين والمنصّة',
    'Time series': 'السلاسل الزمنية',
    'Vector': 'متّجهي',
    'Wide-column': 'أعمدة عريضة',
    'Workflow': 'سير العمل',
    'Workflow & data': 'سير العمل والبيانات',
  },
  es: {
    'AI gateway': 'Puerta de enlace de IA',
    'Analytical': 'Analítico',
    'Apps & productivity': 'Aplicaciones y productividad',
    'Base image': 'Imagen base',
    'Build tool': 'Herramienta de compilación',
    'CI/CD & registry': 'CI/CD y registro',
    'Cache': 'Caché',
    'Coordination': 'Coordinación',
    'Coordination & mesh': 'Coordinación y malla',
    'Databases & engines': 'Bases de datos y motores',
    'Datastore': 'Almacén de datos',
    'Document': 'Documental',
    'Gateway': 'Puerta de enlace',
    'Gateways & proxies': 'Puertas de enlace y proxies',
    'Git': 'Git',
    'GitOps': 'GitOps',
    'Graph': 'Grafos',
    'Identity': 'Identidad',
    'Language runtime': 'Entorno de ejecución de lenguaje',
    'Machine learning': 'Aprendizaje automático',
    'Media & streaming': 'Medios y streaming',
    'Messaging': 'Mensajería',
    'Messaging & streaming': 'Mensajería y streaming',
    'Metrics/Exporter': 'Métricas/Exportador',
    'Object storage': 'Almacenamiento de objetos',
    'Observability': 'Observabilidad',
    'PaaS': 'PaaS',
    'Registry': 'Registro',
    'Relational': 'Relacional',
    'Runtime base': 'Base de ejecución',
    'Search': 'Búsqueda',
    'Search & vector': 'Búsqueda y vectores',
    'Secrets': 'Secretos',
    'Secrets & identity': 'Secretos e identidad',
    'Security & supply chain': 'Seguridad y cadena de suministro',
    'Storage & platform': 'Almacenamiento y plataforma',
    'Time series': 'Series temporales',
    'Vector': 'Vectorial',
    'Wide-column': 'Columna ancha',
    'Workflow': 'Flujo de trabajo',
    'Workflow & data': 'Flujo de trabajo y datos',
  },
};

/**
 * Display-only localized category name. Returns the translated string for the
 * given language, or the English value unchanged for `en` (the default locale)
 * or any key/locale without a translation. The English string remains the
 * source of truth and filter/slug key everywhere.
 */
export function categoryName(lang: string, en: string): string {
  return categoryNames[lang as 'ar' | 'es']?.[en] ?? en;
}
