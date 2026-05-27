#!/bin/bash
# Safe push — clears git locks then commits and pushes
# Usage: ./push.sh "your commit message"

REPO="/Users/michaelespinoza/Documents/Claude/Projects/|| 2026 Business Calendars websites/lbc-work"

cd "$REPO"

# Clear any stale locks
rm -f .git/HEAD.lock .git/index.lock

git config user.email "michael@localbusinesscalendars.com"
git config user.name "Louis"
git add -A
git commit -m "${1:-update}"
git push
