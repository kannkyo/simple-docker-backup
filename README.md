# simple-docker-backup

Simple backup scripts for docker container

## Usage

### Manual

### Install

```bash
yarn install
```

### Backup

```bash
npm run start backup -f test/backup-info.json -d test/data
```

```bash
Usage: main backup [options] [container-name]

Simple backup scripts for docker container.

Options:
  -d, --dest [value]  destination directory for backup files
  -f, --file [value]  config file path
  -v, --volume        enable volume backup (default: true)
  -c, --container     enable container backup (default: false)
  -i, --image         enable image backup (default: false)
  -vv, --verbose      enable debug log (default: false)
  -h, --help          display help for command
```
