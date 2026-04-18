@AGENTS.md

# Deploy

Production server: `ssh root@85.239.48.122`
App directory: `/var/www/printscan-site`
Process manager: PM2 (process name: `printscan-site`)
Node: v22 · Ubuntu 24.04

## Deploy steps

```bash
ssh root@85.239.48.122
cd /var/www/printscan-site
git pull
npm run build
pm2 restart printscan-site
```

Deploy is **manual** — no CI/CD. Always run `npm run build` before `pm2 restart`.
