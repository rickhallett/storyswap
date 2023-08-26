#!/bin/bash

# Function to execute a command and print output/errors in green/red
execute_command() {
    local command="$1"
    local output

    # Execute the command, capturing both stdout and stderr in the variable "output"
    output=$($command 2>&1)

    # Check the exit status of the command
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32m${output}\033[0m"  # Green for success
    else
        echo -e "\033[0;31m${output}\033[0m" 1>&2  # Red for error
    fi

    echo ""  # Print a new line
}

# List of commands to execute
commands=(
    "fly destroy storyswap --yes"
    "fly destroy storyswap-stage --yes"
    "fly apps create storyswap"
    "fly apps create storyswap-stage"
    "fly secrets set SESSION_SECRET=$(openssl rand -hex 32) INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) --app storyswap"
    "fly secrets set SESSION_SECRET=$(openssl rand -hex 32) INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) --app storyswap-stage"
    "fly volumes create data --region lhr --size 1 --app storyswap --yes"
    "fly volumes create data --region lhr --size 1 --app storyswap-stage --yes"
    "fly consul attach --app storyswap"
    "fly consul attach --app storyswap-stage"
)

# Iterate over each command and execute it
for cmd in "${commands[@]}"; do
    execute_command "$cmd"
done
