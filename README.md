# CHPing
A powerful Paping alternative made using NodeJS.

## Installation
Github:
```
git clone https://github.com/hanaui-git/chping
```

NpmJS:
```
npm i argparse tcp-ping-node request-async chalk
```

## Usage
```
usage: index.js [-h] --host HOST [-t TCP] [-cp [CPING]] [-ch [CHTTP]] [-ct [CTCP]] [-cu [CUDP]]

optional arguments:
  -h, --help            show this help message and exit
  --host HOST           The target host.
  -t TCP, --tcp TCP     TCP ping the specified port. Usage: -t/--tcp {port}
  -cp [CPING], --cping [CPING]
                        If used, host will be ping using check-host API.
  -ch [CHTTP], --chttp [CHTTP]
                        If used, host will be HTTP ping using check-host API.
  -ct [CTCP], --ctcp [CTCP]
                        If used, host will be TCP ping using check-host API.
  -cu [CUDP], --cudp [CUDP]
                        If used, host will be UDP ping using check-host API.
```

## Examples
TCP Ping:
```
node index.js --host google.com --tcp 80
```

TCP Ping using Check-Host API:
```
node index.js --host google.com --ctcp
```

## License
MIT © Hanaui