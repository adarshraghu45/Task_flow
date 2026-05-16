# TaskFlow — Railway deploy helper (run after: npm i -g @railway/cli && railway login)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "TaskFlow Railway deploy helper" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
  npm install -g @railway/cli
}

railway --version
Write-Host ""
Write-Host "1. Run: railway login" -ForegroundColor Green
Write-Host "2. Run: railway init   (link this folder to a Railway project)" -ForegroundColor Green
Write-Host "3. Set variables from railway.env.example in the Railway dashboard" -ForegroundColor Green
Write-Host "4. Run: railway up     (deploy from your machine)" -ForegroundColor Green
Write-Host ""
Write-Host "Or connect GitHub in railway.app → Deploy from repo (root = repo root, uses /Dockerfile)" -ForegroundColor Green
