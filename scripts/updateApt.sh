#!/bin/bash

# * This script will non-interactively refresh APT repos and upgrade packages

# Check if running as root user
if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root"
  exit
fi

# Import dietpi-globals so we can use shell functions within this script's shell session
source /boot/dietpi/func/dietpi-globals

# APT Update
G_AGUP

# APT Upgrade
G_AGUG