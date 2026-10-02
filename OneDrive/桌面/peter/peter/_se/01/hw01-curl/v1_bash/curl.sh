#!/bin/bash

# Check if enough arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <resource> <id>"
    exit 1
fi

RESOURCE=$1
ID=$2
URL="https://jsonplaceholder.typicode.com/$RESOURCE/$ID"

# Execute curl
# -s: silent mode
# -f: fail silently on server errors (returns non-zero exit code)
curl -s -f "$URL"

# Capture the exit status of curl
EXIT_STATUS=$?

if [ $EXIT_STATUS -ne 0 ]; then
    exit $EXIT_STATUS
fi

exit 0
