#!/bin/bash -e

# Updates config.local.ts
project_config_file="src/config/config.$1.ts"

if [ ! -f "$project_config_file" ]; then
  if [ -n "$1" ]; then
    echo "The file '$project_config_file' is required but does not exist."
  else
    echo "env argument not given, using 'stg' instead"
  fi
  project_config_file="src/config/config.stg.ts"
fi

cp "$project_config_file" "src/config/index.ts"

echo "APPLIED CONFIG FROM: $project_config_file"
