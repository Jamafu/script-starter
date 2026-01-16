#!/bin/bash
set -e

if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js to proceed."
    exit 1
fi

# validate that IntelliJ is installed
if ! open -a "IntelliJ IDEA" &> /dev/null
then
    echo "IntelliJ IDEA is not installed. Please install IntelliJ IDEA to proceed."
    echo "Alternatively, you can adapt the script and use you IDE of choice ($(pwd))"
    exit 1
fi

# Use HOME variable for better portability
BASE_DIR="$HOME/Projects/scripts/script-starter"
DEST_DIR="$HOME/Desktop/tmpScripts"

# Prompt user for script name
echo "Enter the name for your new script:"
read script_name

# Validate input
if [ -z "$script_name" ]; then
    echo "Error: Script name cannot be empty"
    exit 1
fi

# Sanitize filename (remove problematic characters)
script_name=$(echo "$script_name" | tr -cd '[:alnum:]-_')

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    mkdir -p "$DEST_DIR" || { echo "Error: Failed to create scripts directory"; exit 1; }
fi

# Navigate to base directory
cd "$BASE_DIR" || { echo "Error: Base directory not found"; exit 1; }

# Remove _dist directory if it exists
if [ -d "_dist" ]; then
    rm -rf "_dist"
fi

# Create destination folder
mkdir -p "$DEST_DIR/$script_name" || { echo "Error: Failed to create script directory"; exit 1; }

# Copy template contents (not the directory itself)
cp -r "$BASE_DIR/script-base/"* "$DEST_DIR/$script_name/" || { echo "Error: Failed to copy base script files"; exit 1; }

# Navigate to new script directory
cd "$DEST_DIR/$script_name" || { echo "Error: Failed to navigate to new script directory"; exit 1; }

# Install dependencies
echo "Installing dependencies..."
npm install

# Open in IntelliJ
echo "Opening in IntelliJ IDEA..."
open -a "IntelliJ IDEA" .

echo "Script $script_name has been created successfully!"
