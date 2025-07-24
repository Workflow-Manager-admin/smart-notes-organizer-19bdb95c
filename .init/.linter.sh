#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-notes-organizer-19bdb95c/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

