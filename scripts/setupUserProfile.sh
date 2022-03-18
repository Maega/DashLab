#!/bin/bash

# Check if running as root user
if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root!"
  exit
fi

if [ ! $# -eq 1 ]
then
    echo "-- Setup a user local profile --"
    echo 
    read -p "Username: " username
else
    username=$1
fi

echo "About to setup the user profile for '$username'"
echo 

read -p "Is this correct? " -n 1 -r
echo 
echo 
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

profilePath=/home/$username/.profile

echo "Configuring profile at $profilePath..."
echo 

echo -e '\n# set PATH so it includes sbin so that we can use wpa_cli in node apps' >>$profilePath
echo 'PATH="/usr/sbin:$PATH"' >>$profilePath

echo -e '\n# Start xorg without cursor for touchscreen' >>$profilePath
echo 'if [ ! "$SSH_CLIENT" ] && [ ! "$SSH_TTY" ]; then' >>$profilePath
echo '    startx -- -nocursor' >>$profilePath
echo 'fi' >>$profilePath
