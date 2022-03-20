#!/bin/bash

if [ $# -lt 2 ]
then

    if [ $# -lt 1 ]
    then
        echo "Please provide a username whos password you want to change"
        exit 1
    fi

    echo "-- Change Unix Password for '$1' --"
    echo 
    read -s -p "New Password: " password
    echo 
    read -s -p "Confirm Password: " passwordConfirm
    echo 
else
    password=$2
    passwordConfirm=$2
fi

if [ $password != $passwordConfirm ] ; then
    echo "Password does not match confirmation. Please try again."
    exit 1
fi

if [[ ${#password} -lt 6 ]] ; then
    echo "Password is too short, must be at least 6 characters."
    exit 1
fi

chpassInput="$1:$password"
chpasswd <<<$chpassInput

echo "Password has been changed"
exit 0