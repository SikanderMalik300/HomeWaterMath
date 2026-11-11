# HomeWaterMath fix 06: water softener installation cost upgrade (+ cost page de-overlap)

Date: 2026-11-11. Written by: browser agent. For: the coding agent.
All rules from the main spec, batch 03, fix 04 (WebPage + Person + dates, table captions, title 30-60 / description 110-160, no em dashes) and batch 04 apply. Set `lastUpdated` (dateModified) to the day you ship; keep `publishedDate`.

## Why
Search Console, last 28 days: "water softener installation cost" and its variants are our biggest query group, but two pages split it. `/water-softener-cost/` now gets 433 impressions for "install" queries (avg position 73.7) and `/water-softener-installation-cost/` gets 259 (position 77.4); since about Oct 30 Google mostly shows the cost page. The fix: make the installation page clearly the deeper answer (cost by state, by softener type, DIY vs pro, retailer installs), and stop the cost page from targeting "installed".

Information gain: no ranking page gives installation labor by state. Angi gives no regional prices and Fixr has no state table. We scale labor by each state's plumber wage from BLS (May 2025), with the method shown.

---

## 1. `/water-softener-installation-cost/`

- Title: `Water Softener Installation Cost by State | HomeWaterMath` (57)
- Meta: `Water softener installation cost in your state: plumber labor from BLS wage data, plus loop, drain, outlet and permit, cost by softener type and DIY savings.` (157)
- H1: keep `Water Softener Installation Cost Calculator`.

**Quick answer (exact, replaces the current one):**
Installing a water softener usually costs $150 to $1,000 in labor, and most installs land between $500 and $700 when the home already has a softener loop. With no loop, adding one costs $200 to $2,000 more, and a new drain or outlet adds more again. Labor tracks local plumber pay: the average plumber earns $34.70 an hour nationally, from $24.35 in Arkansas to $47.33 in Oregon (BLS, May 2025). The calculator below itemizes your install for your state. For the softener itself, see our [water softener cost calculator](/water-softener-cost/).

**Calculator change: add a State input (first input)**
- `State` select: `United States average` [default] + 50 states + District of Columbia, alphabetical.
- Helper (exact): "Labor is scaled by your state's average plumber wage from the Bureau of Labor Statistics (May 2025)."
- Data, new file `lib/data/plumberWages.ts`:

```ts
export const PLUMBER_WAGE_MAY2025: Record<string, number> = {
  'United States': 34.70,
  'Alabama': 27.77,
  'Alaska': 43.49,
  'Arizona': 32.66,
  'Arkansas': 24.35,
  'California': 39.58,
  'Colorado': 33.22,
  'Connecticut': 36.25,
  'Delaware': 32.75,
  'District of Columbia': 43.85,
  'Florida': 26.94,
  'Georgia': 27.99,
  'Hawaii': 39.81,
  'Idaho': 28.10,
  'Illinois': 44.91,
  'Indiana': 36.37,
  'Iowa': 33.67,
  'Kansas': 34.33,
  'Kentucky': 33.11,
  'Louisiana': 30.11,
  'Maine': 32.00,
  'Maryland': 35.34,
  'Massachusetts': 43.46,
  'Michigan': 37.14,
  'Minnesota': 41.68,
  'Mississippi': 27.25,
  'Missouri': 36.06,
  'Montana': 37.59,
  'Nebraska': 31.59,
  'Nevada': 34.38,
  'New Hampshire': 31.84,
  'New Jersey': 44.51,
  'New Mexico': 29.71,
  'New York': 40.29,
  'North Carolina': 27.27,
  'North Dakota': 31.81,
  'Ohio': 33.51,
  'Oklahoma': 28.35,
  'Oregon': 47.33,
  'Pennsylvania': 37.05,
  'Rhode Island': 39.23,
  'South Carolina': 26.87,
  'South Dakota': 26.70,
  'Tennessee': 29.09,
  'Texas': 29.22,
  'Utah': 30.87,
  'Vermont': 33.16,
  'Virginia': 29.16,
  'Washington': 42.69,
  'West Virginia': 28.26,
  'Wisconsin': 40.73,
  'Wyoming': 29.76,
};
```

- Formula change (labor line only; removal, loop, drain, outlet and permit stay national):
```
stateIndex = wage[state] / 34.70
laborLow   = round5(150  × stateIndex)
laborHigh  = round5(1000 × stateIndex)
laborTyp   = round5(600  × stateIndex)
round5(x)  = Math.round(x / 5) × 5
```
- Under the result when a state is chosen (exact template): "Labor in {state}: {laborLow} to {laborHigh} (typical {laborTyp}), using a plumber wage of ${wage} an hour, {pct} the US average." where pct = "about X% above" / "about X% below" / "about the same as" (|index - 1| < 0.03), X = Math.round(|index - 1| × 100).
- Show the math gets one extra line: `labor index = {wage} ÷ 34.70 = {index to 2 decimals}`.
- Default render MUST still show: `$675`, `$200 to $1,100 total`, `Labor $150 to $1,000` (United States average, replacing an old softener).

**Tests (add at least these):**
- default (US average, replacing) → labor $150 to $1,000, typical total $675 (unchanged).
- Oregon, replacing → labor $205 to $1,365, typical labor $820, typical total $895; text says "about 36% above".
- Arkansas, replacing → labor $105 to $700, typical $420, typical total $495; "about 30% below".
- Wisconsin → typical labor $705. Texas → $505. California → $685. Florida → $465.
- Kentucky (index 0.954) → "about 5% below". Kansas (34.33, index 0.989) → "about the same as".
- Every state in the data has a value; no NaN on empty inputs.

**New sections (exact), placed after "What changes an installation quote" and before Tips:**

H2 "Installation cost by state"
Plumbers' pay drives the labor part of a quote, and it varies more than you might expect. The table scales our typical labor figures ($150 to $1,000, typically $600, for a home with a loop) by each state's average plumber wage. Parts, the loop, the drain, the outlet and permits are not scaled, and local quotes still vary by city and company.

Table (all 51 rows, from the data file), caption: `Installation labor by state`. Source note under the table (exact): "Wages: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, Plumbers, Pipefitters, and Steamfitters (47-2152), mean hourly wage, May 2025. Labor = our national figures × state wage ÷ $34.70, rounded to $5."

| State | Plumber mean hourly wage | Index vs US | Labor, home with a loop (typical) |
|---|---|---|---|
| Alabama | $27.77 | 0.80 | $120 to $800 ($480) |
| Alaska | $43.49 | 1.25 | $190 to $1,255 ($750) |
| Arizona | $32.66 | 0.94 | $140 to $940 ($565) |
| Arkansas | $24.35 | 0.70 | $105 to $700 ($420) |
| California | $39.58 | 1.14 | $170 to $1,140 ($685) |
| Colorado | $33.22 | 0.96 | $145 to $955 ($575) |
| Connecticut | $36.25 | 1.04 | $155 to $1,045 ($625) |
| Delaware | $32.75 | 0.94 | $140 to $945 ($565) |
| District of Columbia | $43.85 | 1.26 | $190 to $1,265 ($760) |
| Florida | $26.94 | 0.78 | $115 to $775 ($465) |
| Georgia | $27.99 | 0.81 | $120 to $805 ($485) |
| Hawaii | $39.81 | 1.15 | $170 to $1,145 ($690) |
| Idaho | $28.10 | 0.81 | $120 to $810 ($485) |
| Illinois | $44.91 | 1.29 | $195 to $1,295 ($775) |
| Indiana | $36.37 | 1.05 | $155 to $1,050 ($630) |
| Iowa | $33.67 | 0.97 | $145 to $970 ($580) |
| Kansas | $34.33 | 0.99 | $150 to $990 ($595) |
| Kentucky | $33.11 | 0.95 | $145 to $955 ($575) |
| Louisiana | $30.11 | 0.87 | $130 to $870 ($520) |
| Maine | $32.00 | 0.92 | $140 to $920 ($555) |
| Maryland | $35.34 | 1.02 | $155 to $1,020 ($610) |
| Massachusetts | $43.46 | 1.25 | $190 to $1,250 ($750) |
| Michigan | $37.14 | 1.07 | $160 to $1,070 ($640) |
| Minnesota | $41.68 | 1.20 | $180 to $1,200 ($720) |
| Mississippi | $27.25 | 0.79 | $120 to $785 ($470) |
| Missouri | $36.06 | 1.04 | $155 to $1,040 ($625) |
| Montana | $37.59 | 1.08 | $160 to $1,085 ($650) |
| Nebraska | $31.59 | 0.91 | $135 to $910 ($545) |
| Nevada | $34.38 | 0.99 | $150 to $990 ($595) |
| New Hampshire | $31.84 | 0.92 | $140 to $920 ($550) |
| New Jersey | $44.51 | 1.28 | $190 to $1,285 ($770) |
| New Mexico | $29.71 | 0.86 | $130 to $855 ($515) |
| New York | $40.29 | 1.16 | $175 to $1,160 ($695) |
| North Carolina | $27.27 | 0.79 | $120 to $785 ($470) |
| North Dakota | $31.81 | 0.92 | $140 to $915 ($550) |
| Ohio | $33.51 | 0.97 | $145 to $965 ($580) |
| Oklahoma | $28.35 | 0.82 | $125 to $815 ($490) |
| Oregon | $47.33 | 1.36 | $205 to $1,365 ($820) |
| Pennsylvania | $37.05 | 1.07 | $160 to $1,070 ($640) |
| Rhode Island | $39.23 | 1.13 | $170 to $1,130 ($680) |
| South Carolina | $26.87 | 0.77 | $115 to $775 ($465) |
| South Dakota | $26.70 | 0.77 | $115 to $770 ($460) |
| Tennessee | $29.09 | 0.84 | $125 to $840 ($505) |
| Texas | $29.22 | 0.84 | $125 to $840 ($505) |
| Utah | $30.87 | 0.89 | $135 to $890 ($535) |
| Vermont | $33.16 | 0.96 | $145 to $955 ($575) |
| Virginia | $29.16 | 0.84 | $125 to $840 ($505) |
| Washington | $42.69 | 1.23 | $185 to $1,230 ($740) |
| West Virginia | $28.26 | 0.81 | $120 to $815 ($490) |
| Wisconsin | $40.73 | 1.17 | $175 to $1,175 ($705) |
| Wyoming | $29.76 | 0.86 | $130 to $860 ($515) |

H2 "Installed cost by softener type"
| Type | Labor (Fixr) | Total installed (Fixr) | Cost range (Angi) |
|---|---|---|---|
| Single-tank salt-based | $150 to $1,000 | $650 to $1,500 | $500 to $1,700 |
| Dual-tank salt-based | $150 to $1,000 | $1,500 to $3,000 | $1,000 to $5,000 |
| Salt-free conditioner | not listed | not listed | $800 to $4,000 |
| Electronic descaler | $50 to $150 | $250 to $750 | not listed |
| Magnetic | $50 to $150 | $250 to $550 | $200 to $600 |
Caption: `Installed cost by softener type`. Source note (exact): "Fixr, Water softener installation cost (updated January 31, 2025); Angi, How much does water softener installation cost (2026). Ranges include the unit."
Paragraph (exact): Across all types, Angi puts the average at about $1,500 for the softener and installation together, with most homes between $200 and $6,000. Fixr's national average is higher, at $2,500. A dual-tank system costs more mainly because the unit does; the plumbing work is similar.

H2 "DIY or hire a plumber?"
Doing it yourself saves the labor charge, $150 to $1,000 by Angi's figures, and a straightforward swap takes a plumber two to four hours. You'll need to cut into the main supply line, fit a bypass valve, run a drain line with an air gap, and plug the softener into an outlet. Fixr calls anything beyond a magnetic or electronic unit a major plumbing job that should be left to professionals. Before you start, check whether your city requires a permit or a licensed plumber; some do (examples: $37 in La Habra, CA; from $84 in St. Paul, MN).
- DIY makes sense: replacing a softener on an existing loop, with a drain and outlet already there.
- Hire a pro: no loop, no drain within reach, a slab or finished basement, or local rules that require a licensed plumber.

H2 "Big-box and dealer installs"
Retailers and dealers sell the softener and installation as a package, so their prices include the unit. Fixr's estimates for installed systems: Lowe's $1,000 to $2,800, The Home Depot $2,500 to $6,000, and Costco $4,000 to $6,000. These are Fixr's estimates, not the retailers' published prices. Ask any seller for an itemized quote so you can compare the installation part with this calculator.

**FAQ: keep the existing questions and add these 4 (exact), also in FAQPage schema:**
1. Q: How much does it cost to install a water softener in my state? A: Labor follows local plumber pay. The average plumber earns $34.70 an hour nationally (BLS, May 2025), from $24.35 in Arkansas to $47.33 in Oregon, so the same install can cost about 30% less or 36% more in labor than average. Pick your state in the calculator.
2. Q: Can I install a water softener myself? A: Yes, if you're comfortable cutting into the supply line, fitting a bypass valve and running a drain line. You save the $150 to $1,000 labor charge. Check first whether your city requires a permit or a licensed plumber.
3. Q: How long does it take to install a water softener? A: About two to four hours when the home already has a softener loop, a drain and an outlet. Adding a loop, a drain line or an outlet takes longer.
4. Q: Are big-box store installs cheaper? A: Not necessarily. Fixr estimates installed systems at $1,000 to $2,800 at Lowe's and $2,500 to $6,000 at The Home Depot, and those prices include the softener. Ask for an itemized quote and check the installation part here.

**Sources (add to the registry if missing; reuse existing keys if already there):**
- bls-oews-472152-may2025: U.S. Bureau of Labor Statistics, OEWS May 2025, Plumbers, Pipefitters, and Steamfitters (47-2152), hourly mean wage by state, OEWS Query System, extracted 2026-11-11: https://data.bls.gov/oes/#/occGeo/One%20occupation%20for%20multiple%20geographical%20areas (also link the occupation profile https://www.bls.gov/oes/current/oes472152.htm)
- fixr-softener-install: Fixr, Water softener installation cost (updated 2025-01-31): https://www.fixr.com/costs/water-softener-installation
- angi-softener-install: Angi, How much does water softener installation cost: https://angi.com/articles/how-much-does-water-softener-installation-cost.htm
Keep the page's existing sources (This Old House, HomeGuide, La Habra and St. Paul permit pages).

---

## 2. `/water-softener-cost/` (stop competing for "installation cost")
- Title: `Water Softener Cost Calculator (10-Year) | HomeWaterMath` (56) (drops "Installed").
- Meta: `Estimate water softener cost for your home: unit price, salt and service, with a 10-year total. Installation is priced on its own page, by state.` (145)
- In the quick answer, make the installation mention one short sentence that links with the exact anchor "water softener installation cost" to `/water-softener-installation-cost/`. Don't repeat installation ranges elsewhere on the page beyond what the calculator needs; point to the installation page instead.
- Keep the calculator and its defaults unchanged.

## 3. Internal links
- `/water-softeners/` hub: the installation cost tile/table entry text becomes "Water softener installation cost by state".
- `/water-softener-size-calculator/` and `/water-softener-salt-types/`: if not already linked, add `/water-softener-installation-cost/` to Related (replace the weakest card).

## 4. Definition of done
Both pages live; default values in static HTML; all 51 state rows in static HTML; schema per fix 04 (WebPage + WebApplication + FAQPage, Person, dates; dateModified = ship date); captions on every table; title/meta limits; no em dashes; IndexNow submits on push; PageSpeed mobile >= 90, CLS 0.
Report: commit, tests passed/total, screenshot of the installation page at 390 px with Oregon selected.
