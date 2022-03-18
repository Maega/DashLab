#!/bin/bash

if [[ ${#1} -lt 7 ]] ; then
    echo "Password is too short, must be at least 6 characters."
    exit 1
else
    echo "Good to go..."
fi

echo "Password will be set to: $1"

#chpasswd <<<"dashlab:dashlab"