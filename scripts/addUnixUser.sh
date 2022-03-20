#!/bin/bash

# Check if running as root user
if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root!"
  exit
fi

if [ ! $# -eq 2 ]
then
    echo "-- Create a new user --"
    echo 
    read -p "Username: " username
    read -p "Password: " password
else
    username=$1
    password=$2
fi

echo 
echo "The following user will be created:"
echo "Username: $username"
echo "Password: $password"
echo 

read -p "Is this correct? " -n 1 -r
echo 
echo 
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

echo "Adding user $username..."
echo 

adduser --gecos "" --disabled-password $username
chpasswd <<<"$username:$password"
