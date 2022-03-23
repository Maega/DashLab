#!/bin/bash

. /boot/dietpi/func/dietpi-globals
G_CHECK_ROOT_USER
G_CHECK_ROOTFS_RW
G_INIT

if [ $# -lt 1 ]
then
    echo "--- Changing Global Passwords ---"
    echo 
    read -s -p "New Password: " password
    echo 
    read -s -p "Confirm Password: " passwordConfirm
    echo 
else
    password=$1
    passwordConfirm=$1
fi

# Nullify automated PW
grep -q '^[[:blank:]]*AUTO_SETUP_GLOBAL_PASSWORD=' /boot/dietpi.txt && G_EXEC sed -i '/^[[:blank:]]*AUTO_SETUP_GLOBAL_PASSWORD=/c\#AUTO_SETUP_GLOBAL_PASSWORD= # Password has been encrypted and saved to rootfs' /boot/dietpi.txt

[[ -d '/var/lib/dietpi/dietpi-software' ]] || G_EXEC mkdir -p /var/lib/dietpi/dietpi-software # Should already exist, failsafe

openssl enc -e -a -md sha256 -aes-256-cbc -iter 10000 -salt -pass pass:'DietPiRocks!' -out /var/lib/dietpi/dietpi-software/.GLOBAL_PW.bin <<< "$password"

G_EXEC chown root:root /var/lib/dietpi/dietpi-software/.GLOBAL_PW.bin
G_EXEC chmod 0600 /var/lib/dietpi/dietpi-software/.GLOBAL_PW.bin

echo "DashLab global application passwords changed"

# Apply | root/dietpi users PW

chpasswd <<< "root:$password"
chpasswd <<< "dietpi:$password"
chpasswd <<< "dashlab:$password"
echo "Unix login passwords changed"
