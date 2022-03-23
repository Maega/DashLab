# DashLab
### Nebula DashLab System Software

_This project is under heavy development and does not represent the final product._

## :mag: Compatibility

This software is intended to run on a clean install of either a pre-prepared or converted DietPi installation with a Debian 11 base.

It's only fully compatible with the Raspberry Pi 4 Model B, however mostly works fine in an ARM64 virtual machine with a *"Generic Device (aarch64)"* machine type selected during DietPi preparation.

x86_64 DietPi installations might work, however some packages may not be available on the architecture.

## :electric_plug: Installation

This software comes pre-installed on your DashLab, and can be restored to factory settings at any time via the inbuilt recovery mode.

DashLab software is not supported on non-official DashLab hardware, but feel free to try and install it to your personal devices if you wish. DashLab online services are not available on unofficial hardware.

DashLab software **must** be installed to `/opt/dashlab` on a **clean** DietPi installation, and setup using the scripts present in the `scripts` directory. The install scripts will make several system-level changes, so please don't install this on your daily driver. A basic rundown of the install process is below:

```bash
sudo mkdir /opt/dashlab
cd /opt
git clone https://github.com/maega/dashlab
cd dashlab
./scripts/startPreinstall.sh
```

If everything goes to plan, the `startPreinstall.sh` script should do the following:

* Add a `dashlab` user
* Add the `dashlab` user to several system groups
* Install dependencies and desktop environment
* Prepare the `dashlab` user's `~/.profile`
* Fix install directory permissions
* Create dashlab launcher in `/usr/local/bin`

## :information_source: Usage

The command `dashlab` is a shortcut for launching many core DashLab services. You can run `dashlab` with the following arguments to launch various services:

```bash
dashlab api.start # Launch DashLab HTTP API
dashlab api.debug # Launch DashLab HTTP API in Debug Mode

dashlab cli.start # Launch DashLab CLI
dashlab cli.debug # Launch DashLab CLI in Debug Mode

dashlab web.start # Launch DashLab Frontend Web Server
dashlab web.debug # Launch DashLab Frontend Web Server in Debug Mode

dashlab setup.start # Launch DashLab Setup GUI on device
dashlab setup.start # Launch DashLab Setup GUI on device in Debug Mode
```

## :nut_and_bolt: Structure

**[api/:](api/)** DashLab HTTP API

**[web/:](web/)** Web Management Frontend

**[cli/:](cli/)** DashLab Command-Line Interface

**[drivers/:](drivers/)** DashLab Driver Logic

**[config/:](config/)** Service Configuration Data

**[scripts/:](scripts/)** Deployment & Helper Shell Scripts

## :heart: Support

If you'd like to support ongoing development of this and other open-sourced projects, a donation would be very much appreciated to help me dedicate more of my time to open-sourcing larger projects like this. I accept direct crypto donations via any of the addresses below or through [Coinbase Commerce](https://commerce.coinbase.com/checkout/bb4f7665-bfdc-4c22-9fc8-78299010b1c8).

**BTC:** bc1q6kqv5u2368j4l00rls5frg78wt7m6vf7a50sa7

**ETH:** 0x704fb3fD106D00e6D78880C25139141C4B24DFd7

**DOGE:** D6MZp3HMZQA6gFBhmcmYs6AjytXwQJ4bYj

**LTC:** ltc1qhqgsnzwumxm7q3u3m4rj0zcvwcvcvhqqrke07p

**XMR:** 8429Hzck9gdX43MF9NzNGjaeGdKBwjVTjgGDQfXKV6WxfSGubxuBi6mEh2nDWwXtAZUjMejV4Pamr5SfYp96QJZNEQecMqS
