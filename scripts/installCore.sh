#!/bin/bash

# * This script will install the DashLab software from either a local tarball or the master branch on GitHub

# Make dashlab directory and set permissions
mkdir /opt/dashlab
chown dashlab:dashlab /opt/dashlab
chmod 774 /opt/dashlab

cd /opt/dashlab

cat <<EOT >> /usr/local/bin/dashlab
#!/bin/bash
cd "/opt/dashlab"
npm run \$1
exit 0
EOT

chmod +x /usr/local/bin/dashlab