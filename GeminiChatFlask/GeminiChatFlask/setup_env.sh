#!/bin/bash
# Setup script for macOS/Linux

echo "========================================"
echo "GeminiChatFlask - Environment Setup"
echo "========================================"
echo ""
echo "Please enter your Gemini API Key:"
echo "(You can get one from: https://makersuite.google.com/app/apikey)"
echo ""

read -p "Enter your API key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "Error: API key cannot be empty!"
    exit 1
fi

echo ""
echo "Setting GEMINI_API_KEY environment variable..."

# Add to .bashrc or .zshrc
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_RC="$HOME/.bash_profile"
fi

if [ -n "$SHELL_RC" ]; then
    # Remove old entry if exists
    sed -i.bak '/export GEMINI_API_KEY=/d' "$SHELL_RC"
    # Add new entry
    echo "export GEMINI_API_KEY=\"$API_KEY\"" >> "$SHELL_RC"
    echo "Added to $SHELL_RC"
fi

# Set for current session
export GEMINI_API_KEY="$API_KEY"

echo ""
echo "========================================"
echo "Environment variable set successfully!"
echo "========================================"
echo ""
echo "Note: Please run 'source $SHELL_RC' or restart your terminal for changes to take effect."
echo ""
echo "To run the application, use:"
echo "  python app.py"
echo ""

