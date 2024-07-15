#!/bin/bash

# Create year directories if they don't exist
for year in {2014..2024}; do
    mkdir -p "$year"
done

# Loop through each month directory and move image files to the respective year directory
for dir in */; do
    if [[ -d $dir ]]; then
        year=$(echo $dir | sed -n 's/[^0-9]*\([0-9]\{4\}\)[^0-9]*/\1/p')
        if [[ -n $year && $year -ge 2014 && $year -le 2024 ]]; then
            mv "$dir"*.jpg "$year"/ 2>/dev/null
            mv "$dir"*.jpeg "$year"/ 2>/dev/null
            mv "$dir"*.png "$year"/ 2>/dev/null
        fi
    fi
done
