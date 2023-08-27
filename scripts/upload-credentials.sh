#!/bin/bash

# Define variables for the SFTP command
FLY_APP="storyswap-stage"

# Execute the fly SFTP command to connect and start an SFTP session
# Here we assume that 'fly sftp' eventually calls the standard sftp command or behaves like it
# The "-b" option specifies a batch file to read sftp commands from
fly sftp -b batch-credentials.txt $FLY_APP

# Continue with local operations
echo "File transfer complete, continuing with local operations..."
ls -l ~
