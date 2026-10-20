$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$pages = @(
  @{ name = "home"; url = "http://localhost:5055/" },
  @{ name = "size"; url = "http://localhost:5055/water-softener-size-calculator/" },
  @{ name = "cost"; url = "http://localhost:5055/water-softener-cost/" },
  @{ name = "salt"; url = "http://localhost:5055/water-softener-salt-calculator/" },
  @{ name = "hardness"; url = "http://localhost:5055/water-hardness-converter/" },
  @{ name = "pressure"; url = "http://localhost:5055/well-pressure-tank-size-calculator/" }
)
New-Item -ItemType Directory -Force "e:\hwm\scripts\lh" | Out-Null
foreach ($p in $pages) {
  $out = "e:\hwm\scripts\lh\$($p.name).json"
  npx --yes lighthouse@12 $p.url --quiet --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile=true --output=json --output-path=$out --chrome-flags="--headless=new --no-sandbox --disable-gpu" 2>&1 | Out-Null
  if (Test-Path $out) {
    $j = Get-Content $out -Raw | ConvertFrom-Json
    $perf = [math]::Round($j.categories.performance.score * 100)
    $a11y = [math]::Round($j.categories.accessibility.score * 100)
    $bp = [math]::Round($j.categories.'best-practices'.score * 100)
    $seo = [math]::Round($j.categories.seo.score * 100)
    $cls = $j.audits.'cumulative-layout-shift'.displayValue
    $lcp = $j.audits.'largest-contentful-paint'.displayValue
    "{0,-10} Perf={1,3}  A11y={2,3}  BP={3,3}  SEO={4,3}  CLS={5}  LCP={6}" -f $p.name, $perf, $a11y, $bp, $seo, $cls, $lcp
  } else {
    "{0,-10} FAILED" -f $p.name
  }
}
