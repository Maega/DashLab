#!/bin/bash

# * This script is intended to add a user (specifically the dashlab user) to all non-user owned groups on the system. Some groups like tty and video are crucial to start xorg, some others might not be strictly necessary. 'dashlab' needs to be a sudoer, that is not a mistake.

# Check if running as root user
if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root!"
  exit
fi

if [ ! $# -eq 1 ]
then
    echo "-- Add a user to all system groups --"
    echo 
    read -p "Username: " username
else
    username=$1
fi

echo "About to add the user '$username' to all groups"
echo 

read -p "Is this correct? " -n 1 -r
echo 
echo 
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

echo "Adding user $username to groups..."
echo 

declare -a targetGroups=(daemon bin sys adm tty disk lp mail news uucp man proxy kmem dialout fax voice cdrom floppy tape audio sudo dip backup operator list irc src gnats shadow utmp video sasl plugdev staff games users input kvm render crontab netdev spi i2c gpio messagebus www-data docker ssh)

# Iterate through array of groups one at a time since any missing group causes usermod to exit prematurely
# - Real DashLab hardware has some extra groups that are not present in the virtual dev environment
for i in "${targetGroups[@]}"
do
    usermod -aG $i $username
    echo "Added $username to group $i"
done
