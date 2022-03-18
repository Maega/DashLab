#!/bin/bash

# Check if running as root user
if [ "$EUID" -ne 0 ]
  then echo "Please run this script as root"
  exit
fi

echo "Installing DashLab Dependencies..."
echo 

# Import dietpi-globals so we can use shell functions within this script's shell session
source /boot/dietpi/func/dietpi-globals

# Perform apt update
G_AGUP

# Install bc package for systemStats.sh script
# Install libnss3 for Electron
G_AGI bc libnss3

# Install DietPi Optimised Software
# Should already be preinstalled -- 103: DietPi-RAMlog, 104: Dropbear
# For dev/debug -- 16: Build-Essential, 200: DietPi-Dashboard

# Set dietpi-software alias so we can invoke it within this script's shell session
alias dietpi-software='/boot/dietpi/dietpi-software'

# Install Desktop Environment Stack
# 5: ALSA, 6: XOrg, 25: Xfce, 175: Xfce Power Manager
dietpi-software install 5 6 25 175

# Install Docker
# 134: Docker Compose, 162: Docker, 185: Portainer
dietpi-software install 162 185

# Install DashLab Software Deps
# 9: Node.js, 17: Git
dietpi-software install 9 17
