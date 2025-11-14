# Setup script for Windows (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GeminiChatFlask - Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your Gemini API Key:"
Write-Host "(You can get one from: https://makersuite.google.com/app/apikey)"
Write-Host ""

$apiKey = Read-Host "Enter your API key"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "Error: API key cannot be empty!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Setting GEMINI_API_KEY environment variable..." -ForegroundColor Yellow

# Set for current session
$env:GEMINI_API_KEY = $apiKey

# Set permanently for user
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', $apiKey, [System.EnvironmentVariableTarget]::User)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Environment variable set successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Note: You may need to restart your terminal/IDE for permanent changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "To run the application, use:" -ForegroundColor Cyan
Write-Host "  python app.py" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

