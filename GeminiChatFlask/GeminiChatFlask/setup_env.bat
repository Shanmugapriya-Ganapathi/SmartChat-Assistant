@echo off
REM Setup script for Windows (Command Prompt)
echo ========================================
echo GeminiChatFlask - Environment Setup
echo ========================================
echo.
echo Please enter your Gemini API Key:
echo (You can get one from: https://makersuite.google.com/app/apikey)
echo.
set /p API_KEY="Enter your API key: "

if "%API_KEY%"=="" (
    echo Error: API key cannot be empty!
    pause
    exit /b 1
)

echo.
echo Setting GEMINI_API_KEY environment variable...
setx GEMINI_API_KEY "%API_KEY%"
set GEMINI_API_KEY=%API_KEY%

echo.
echo ========================================
echo Environment variable set successfully!
echo ========================================
echo.
echo Note: You may need to restart your terminal/IDE for the changes to take effect.
echo.
echo To run the application, use:
echo   python app.py
echo.
pause

