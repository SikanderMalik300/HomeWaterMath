// Checks every batch-05 source URL for reachability. Reports status per id.
// Some retail/gov sites block bots (403/timeout); those are noted, not failures.

const SOURCES = [
  ['uga-c858-4', 'https://fieldreport.caes.uga.edu/publications/C858-4/disinfecting-your-well-water-shock-chlorination/'],
  ['nevada-fs-06-69', 'https://www.oem.nv.gov/uploadedFiles/demnvgov/content/Resources/NVCoop%20Ext_Shock%20Chlorination_Estimating%20the%20Amount%20of%20Bleach%20Needed.pdf'],
  ['wi-dnr-dg120', 'https://dnr.wisconsin.gov/sites/default/files/topic/DrinkingWater/Publications/DG120.pdf'],
  ['mdh-well-disinfection', 'https://www.health.mn.gov/communities/environment/water/wells/waterquality/disinfection.html'],
  ['cdc-well-disinfection', 'https://www.cdc.gov/water-emergency/about/how-to-disinfect-wells-after-an-emergency.html'],
  ['tamu-scs-2002-04', 'https://legacy.research.agrilife.org/wp-content/uploads/sites/3/2011/10/scs-2002-04-2.pdf'],
  ['pa-dep-well-disinfection', 'https://www.pa.gov/agencies/dep/residents/my-water/private-wells/disinfection-of-home-wells-and-springs'],
  ['osu-oregon-shock', 'https://wellwater.oregonstate.edu/well-water/bacteria/shock-chlorination'],
  ['ohio-aex-318', 'https://ohioline.osu.edu/factsheet/aex-318'],
  ['psu-shock-chlorination', 'https://extension.psu.edu/shock-chlorination-of-wells-and-springs'],
  ['psu-coliform', 'https://extension.psu.edu/coliform-bacteria'],
  ['angi-shock-cost', 'https://angi.com/articles/cost-to-shock-a-well.htm'],
  ['wsc-splashless', 'https://www.watersystemscouncil.org/well-disinfection-and-splashless-bleach/'],
  ['cargill-salt-faq', 'https://www.cargill.com/industrial/water-softener-salt-faq'],
  ['fleck-7000sxt-manual', 'https://www.pentair.com/content/dam/extranet/web/nam/fleck/manuals/42775-fleck-7000sxt-manual.pdf'],
  ['ge-gxsh40v-manual', 'https://images.homedepot-static.com/catalog/pdfImages/ef/ef792180-cd7a-4017-ad70-a9888b4ab4ac.pdf'],
  ['whirlpool-whes40-manual', 'https://www.whirlpool.com/content/dam/global/documents/202107/owners-manual-w11484759-reva.pdf'],
  ['culligan-troubleshooting', 'https://www.culligan.com/blog/water-softener-troubleshooting-common-problems-and-solutions'],
  ['culligan-best-salt', 'https://www.culligan.com/blog/what-is-the-best-water-softener-salt'],
  ['wqa-smart-softeners', 'https://wqa.org/wp-content/uploads/2024/06/GettingSmartSofteners.pdf'],
  ['unl-g1491', 'https://extensionpubs.unl.edu/publication/g1491/2014/html/view'],
  ['diamond-crystal-faq', 'https://www.diamondcrystalsalt.com/water-softener-salt-faqs'],
  ['diamond-crystal-iron-fighter', 'https://www.diamondcrystalsalt.com/product/iron-fighter-water-softener-salt-pellets'],
  ['morton-kcl', 'https://www.mortonsalt.com/home-product/morton-potassium-chloride-pellets'],
  ['tsc-softener-salt', 'https://www.tractorsupply.com/tsc/catalog/water-softener-salt'],
  ['hd-softener-salt', 'https://www.homedepot.com/b/Plumbing-Water-Filters-Water-Softeners-Water-Softener-Salt/N-5yc1vZc6se'],
  ['walmart-morton-pellets', 'https://www.walmart.com/ip/Morton-Clean-and-Protect-Water-Softener-Pellets-40-lb/16674414'],
  ['viqua-faq', 'https://viqua.com/resources-24/faqs/'],
  ['viqua-vh-spec', 'https://viqua.com/wp-content/uploads/SpecSheet_VH200-F10_VH410-F20-1.pdf'],
  ['springwell-uv-manual', 'https://www.springwellwater.com/wp-content/uploads/2019/07/Blackcomb_UV-Manual-1.pdf'],
  ['ct-dph-uv', 'https://portal.ct.gov/-/media/departments-and-agencies/dph/dph/environmental_health/pdf/25ultrvioletradiationtreatmentofpdwspdf.pdf'],
  ['cdc-home-treatment', 'https://www.cdc.gov/drinking-water/about/about-home-water-treatment-systems.html'],
  ['ansi-nsf55-2024', 'https://blog.ansi.org/ansi/nsf-ansi-55-2024-ultraviolet-uv-water-treatment/'],
  ['esp-viqua-vh200', 'https://espwaterproducts.com/collections/viqua-vh200-9-gpm'],
  ['homeguide-uv', 'https://homeguide.com/costs/water-filtration-system-cost'],
  ['angi-uv', 'https://www.angi.com/articles/whole-house-water-filtration-system-cost.htm'],
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36';

async function check(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    let res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': UA, Accept: '*/*' }, signal: ctrl.signal });
    clearTimeout(t);
    return `${res.status}${res.redirected ? ' (redirected)' : ''}`;
  } catch (e) {
    clearTimeout(t);
    return `ERR ${e.cause?.code || e.name || e.message}`;
  }
}

const results = [];
for (const [id, url] of SOURCES) {
  const status = await check(url);
  results.push([id, status]);
  console.log(`${status.padEnd(18)} ${id}`);
}
const bad = results.filter(([, s]) => !/^2\d\d/.test(s) && !/^3\d\d/.test(s));
console.log(`\n${results.length} checked, ${bad.length} non-2xx/3xx:`);
bad.forEach(([id, s]) => console.log(`  ${id}: ${s}`));
