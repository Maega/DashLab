#!/bin/bash

# * This script will install the DashLab software from either a local tarball or the master branch on GitHub

# Make dashlab directory and set permissions
mkdir /opt/dashlab
chown dashlab:dashlab /opt/dashlab
chmod 774 /opt/dashlab

cd /opt/dashlab


