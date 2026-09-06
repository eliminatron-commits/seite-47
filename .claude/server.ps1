param([int]$Port = 8147)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.pdf'  = 'application/pdf'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Seite 47 laeuft auf http://localhost:$Port/ (root: $root)"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($rel -eq '/') { $rel = '/index.html' }
  $file = Join-Path $root ($rel.TrimStart('/') -replace '/', '\')
  if (Test-Path -LiteralPath $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $ct = $types[$ext]
    if (-not $ct) { $ct = 'application/octet-stream' }
    $ctx.Response.ContentType = $ct
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
