// Every source cited on the site. Pages reference ids; the Sources block renders
// from here. All accessed 2026-10-20.

export interface Source {
  id: string;
  name: string;
  url: string;
  accessed: string; // YYYY-MM-DD
}

const ACCESSED = '2026-10-20';

export const SOURCES = {
  'nist-hb44': {
    id: 'nist-hb44',
    name: 'NIST Handbook 44 (2026), Appendix C',
    url: 'https://www.nist.gov/document/2026-nist-handbook-44-appendix-c',
    accessed: ACCESSED,
  },
  'wqa-ion-exchange': {
    id: 'wqa-ion-exchange',
    name: 'WQA Ion Exchange Fact Sheet',
    url: 'https://wqa.org/wp-content/uploads/2023/10/Ion-Exchange-Fact-Sheet.pdf',
    accessed: ACCESSED,
  },
  'wqa-dummies': {
    id: 'wqa-dummies',
    name: 'WQA, Water Treatment for Dummies, 2nd ed.',
    url: 'https://wqa.org/wp-content/uploads/2022/09/Water-Treatment-for-Dummies-2nd-Edition.pdf',
    accessed: ACCESSED,
  },
  'wqa-design-2025': {
    id: 'wqa-design-2025',
    name: 'WQA, Residential Water Treatment Design (2025)',
    url: 'https://wqa.org/wp-content/uploads/2025/03/Article-2-Residential-Water-Treatment-Design-w-tables-2025.pdf',
    accessed: ACCESSED,
  },
  'wqa-getting-smart-2024': {
    id: 'wqa-getting-smart-2024',
    name: 'WQA, Getting Smart with Softeners (2024)',
    url: 'https://wqa.org/wp-content/uploads/2024/06/GettingSmartSofteners.pdf',
    accessed: ACCESSED,
  },
  'usgs-hardness': {
    id: 'usgs-hardness',
    name: 'USGS Water Science School, Hardness of Water',
    url: 'https://www.usgs.gov/water-science-school/science/hardness-water',
    accessed: ACCESSED,
  },
  'unl-g1274': {
    id: 'unl-g1274',
    name: 'University of Nebraska-Lincoln Extension, NebGuide G1274 (2016)',
    url: 'https://extensionpubs.unl.edu/publication/g1274/2016/pdf/view/g1274-2016.pdf',
    accessed: ACCESSED,
  },
  'psu-softening': {
    id: 'psu-softening',
    name: 'Penn State Extension, Water Softening',
    url: 'https://extension.psu.edu/water-softening',
    accessed: ACCESSED,
  },
  'ndsu-wq1031': {
    id: 'ndsu-wq1031',
    name: 'NDSU Extension WQ1031',
    url: 'https://ndsu.edu/agriculture/node/2527',
    accessed: ACCESSED,
  },
  'alberta-agdex': {
    id: 'alberta-agdex',
    name: 'Alberta Agriculture, Agdex 716(D32) Water Softening',
    url: 'https://www1.agric.gov.ab.ca/$department/deptdocs.nsf/all/agdex9354',
    accessed: ACCESSED,
  },
  'sigma-hardness': {
    id: 'sigma-hardness',
    name: 'Sigma-Aldrich, water hardness test (product 37194)',
    url: 'https://sigmaaldrich.com/JP/en/product/sial/37194',
    accessed: ACCESSED,
  },
  'epa-watersense-stats': {
    id: 'epa-watersense-stats',
    name: 'EPA WaterSense, Statistics and Facts',
    url: 'https://www.epa.gov/watersense/statistics-and-facts',
    accessed: ACCESSED,
  },
  'epa-privatewells': {
    id: 'epa-privatewells',
    name: 'US EPA, Private Drinking Water Wells',
    url: 'https://www.epa.gov/privatewells',
    accessed: '2026-10-21',
  },
  'nelsen-sizing': {
    id: 'nelsen-sizing',
    name: 'Nelsen Corp., Softener Sizing',
    url: 'https://nelsencorp.com/tech/softener-sizing',
    accessed: ACCESSED,
  },
  'csi-manual': {
    id: 'csi-manual',
    name: 'CSI Water Treatment CT24/CT32 softener manual',
    url: 'https://inspectapedia.com/plumbing/CSI-CT24-CT32-Water-Softener-Manual.pdf',
    accessed: ACCESSED,
  },
  'whirlpool-manual': {
    id: 'whirlpool-manual',
    name: "Whirlpool WHES40/WHES44 owner's manual",
    url: 'https://www.whirlpool.com/content/dam/global/documents/202107/owners-manual-w11484759-reva.pdf',
    accessed: ACCESSED,
  },
  'aosmith-lowes-manual': {
    id: 'aosmith-lowes-manual',
    name: 'A.O. Smith AO-WH-SOFT-350 manual',
    url: 'https://www.aosmithatlowes.com/media/1148/ao-wh-soft-350_ownersmanual.pdf',
    accessed: ACCESSED,
  },
  'aosmith-c43': {
    id: 'aosmith-c43',
    name: 'A.O. Smith C43 Series spec sheet',
    url: 'https://assets.aosmith.com/damroot/Original/10017/C43%20Series%201.0-1.25%20inch%20Spec%20Sheet.pdf',
    accessed: ACCESSED,
  },
  'wcp-slovak-2004': {
    id: 'wcp-slovak-2004',
    name: 'Water Conditioning & Purification, Guidelines for Designing Water Softeners (2004)',
    url: 'https://wcponline.com/2004/03/14/learn-right-first-time-guidelines-designing-water-softeners/',
    accessed: ACCESSED,
  },
  'wcp-michaud-2011': {
    id: 'wcp-michaud-2011',
    name: 'WC&P, The Role of Cross-Linking in Ion Exchange Resins (2011)',
    url: 'https://wcponline.com/2011/06/07/role-cross-linking-ion-exchange-resins/',
    accessed: ACCESSED,
  },
  'pnnl-softeners': {
    id: 'pnnl-softeners',
    name: 'PNNL Building America Solution Center, Water Softeners',
    url: 'https://basc.pnnl.gov/resource-guides/water-softeners',
    accessed: ACCESSED,
  },
  'aquatell-clack-ws1': {
    id: 'aquatell-clack-ws1',
    name: 'Aquatell, Clack WS1 water softener listing',
    url: 'https://www.aquatell.ca/collections/clack/products/clack-ws1-water-softener',
    accessed: ACCESSED,
  },
  'freshwater-fleck-48k': {
    id: 'freshwater-fleck-48k',
    name: 'Fresh Water Systems, Fleck 5600SXT listing',
    url: 'https://freshwatersystems.com/products/fleck-5600sxt-electronic-meter-32-000-grain-water-softener',
    accessed: ACCESSED,
  },
  'lowes-salt-40lb': {
    id: 'lowes-salt-40lb',
    name: "Lowe's, 40 lb water softener salt",
    url: 'https://www.lowes.com/pl/water-filtration-water-softeners/water-softener-salt/40-lb/4294822069-4294704372',
    accessed: ACCESSED,
  },
  'ace-salt': {
    id: 'ace-salt',
    name: 'Ace Hardware, Diamond Crystal Bright & Soft 40 lb',
    url: 'https://www.acehardware.com/p/7036692',
    accessed: ACCESSED,
  },
  'thisoldhouse-cost': {
    id: 'thisoldhouse-cost',
    name: 'This Old House, Water Softener System Cost (updated 2026-06-16)',
    url: 'https://thisoldhouse.com/plumbing/reviews/water-softener-system-cost',
    accessed: ACCESSED,
  },
  'homeguide-cost': {
    id: 'homeguide-cost',
    name: 'HomeGuide, Water Softener Cost',
    url: 'https://homeguide.com/costs/water-softener-cost',
    accessed: ACCESSED,
  },
  'fixr-cost': {
    id: 'fixr-cost',
    name: 'Fixr, Water Softener Installation Cost',
    url: 'https://www.fixr.com/costs/water-softener-installation',
    accessed: ACCESSED,
  },
  'angi-chicago': {
    id: 'angi-chicago',
    name: 'Angi, Water Softener Installation Cost (Chicago, 2026)',
    url: 'https://www.angi.com/articles/how-much-does-water-softener-installation-cost/il/chicago',
    accessed: ACCESSED,
  },
  'homeserve-cost': {
    id: 'homeserve-cost',
    name: 'HomeServe, Water Softener Installation Cost',
    url: 'https://www.homeserve.com/en-us/blog/cost-guide/water-softener-installation',
    accessed: ACCESSED,
  },
  'hd-pentair-kit': {
    id: 'hd-pentair-kit',
    name: 'Home Depot, Pentair water softener install kit',
    url: 'https://www.homedepot.com/p/205803612',
    accessed: ACCESSED,
  },
  'freshwater-clack-bypass': {
    id: 'freshwater-clack-bypass',
    name: 'Fresh Water Systems, Clack WS1 bypass valve',
    url: 'https://freshwatersystems.com/products/clack-ws1-v3006-bypass-for-1-valve',
    accessed: ACCESSED,
  },
  'culligan-lifespan': {
    id: 'culligan-lifespan',
    name: 'Culligan, When to Replace Your Water Softener',
    url: 'https://www.culligan.com/blog/when-to-replace-your-water-softener',
    accessed: ACCESSED,
  },
  // bobvila-salt intentionally dropped: spec A15 says use only if a URL is
  // supplied by the browser agent; none was, so it is omitted.
  'amtrol-mc10188': {
    id: 'amtrol-mc10188',
    name: 'AMTROL Well-X-Trol brochure MC 10188',
    url: 'https://assets.freshwatersystems.com/image/upload/s--8yoD6F34--/fmfb0fru4ngsk446ug51.pdf',
    accessed: ACCESSED,
  },
  'amtrol-older-chart': {
    id: 'amtrol-older-chart',
    name: 'AMTROL Well-X-Trol sizing chart',
    url: 'https://inspectapedia.com/water/Well-X-Trol-Tank-Sizing-Chart-AMTROL.pdf',
    accessed: ACCESSED,
  },
  'goulds-crsgtank': {
    id: 'goulds-crsgtank',
    name: 'Goulds Water Technology, HYDRO-PRO tank sizing guide (2025)',
    url: 'https://prod.xylem.com/siteassets/brand/goulds-water-technology/resources/guideline/crsgtank-r2.pdf',
    accessed: ACCESSED,
  },
  'goulds-brhptank': {
    id: 'goulds-brhptank',
    name: 'Goulds Water Technology, HYDRO-PRO brochure (2025)',
    url: 'https://prod.xylem.com/siteassets/brand/goulds-water-technology/resources/brochure/brhptank.pdf',
    accessed: ACCESSED,
  },
  'driller-pelikan-2006': {
    id: 'driller-pelikan-2006',
    name: 'The Driller, How to Calculate and Control Pressure Tank Drawdown (2006)',
    url: 'https://thedriller.com/articles/84709-how-to-calculate-and-control-pressure-tank-drawdown',
    accessed: ACCESSED,
  },
  'fws-tank-blog': {
    id: 'fws-tank-blog',
    name: 'Fresh Water Systems, How to Size a Well Pressure Tank',
    url: 'https://www.freshwatersystems.com/blogs/blog/how-to-size-a-well-pressure-tank',
    accessed: ACCESSED,
  },
} as const;

export type SourceId = keyof typeof SOURCES;

export function getSource(id: SourceId): Source {
  return SOURCES[id];
}
