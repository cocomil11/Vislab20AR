#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq could not be found. Please install jq."
    exit 1
fi

# Initialize an empty JSON object
json_output='{}'

# Base directory where year directories are located
base_dir="./public/imgs"

# Loop through each year directory and list image files
for year in {2014..2024}; do
    if [[ -d "$base_dir/$year" ]]; then
        # Find all jpg, jpeg, and png files in the year directory
        files=$(find "$base_dir/$year" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \))
        if [[ -n "$files" ]]; then
            # Convert file paths to an array
            files_array=($files)
            # Remove base_dir prefix from file paths
            files_array=("${files_array[@]#$base_dir/}")
            # Create a JSON array of file paths
            files_json=$(printf '%s\n' "${files_array[@]}" | jq -R . | jq -s .)
            # Add to the JSON object
            json_output=$(echo "$json_output" | jq --arg year "$year" --argjson files "$files_json" '.[$year] = $files')
        fi
    fi
done

# Write the JSON object to a file
echo "$json_output" | jq . > images_by_year.json

echo "JSON file 'images_by_year.json' has been created."
