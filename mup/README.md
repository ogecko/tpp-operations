# Deploying TPP
TPP Operations is deployed with mup, which is installed under nvm on dev20
```
  $ source ~/.nvm/nvm.sh && nvm use 10.24.1
  $ cd app
  $ npm run deploy
```
`npm run deploy` writes the version page from the git log then runs `mup deploy` from this directory (default node v6 has no mup).
Use `npm run logs` to follow the server logs.

Notes on the deploy tooling (22-Oct-2026)
* Always use `nvm use 10.24.1` (this has mup 1.5.10). 
* Our mongodb container (created by an older mup) reports its replica set member as 127.0.0.1.
  mup 1.5 always sets `MONGO_URL=...?replicaSet=meteor` when mup.js has a `mongo:` section (only needed for `mup setup`). 
  This causes the app crash loops with `ECONNREFUSED 127.0.0.1:27017`. 
  To fix this, the `mongo:` section in mup.js is commented out and `MONGO_URL: "mongodb://mongodb:27017/tpp"` is set explicitly. 
* If a deploy fails verification, mup redeploys the previous bundle but with the new config, so a config problem keeps the site down. Fix the config and redeploy

mup.js uses the standard `abernix/meteord:node-8.9.4-base` image.
(Before Oct-2026 we used a custom meteord-xvfb image with an X Virtual Frame Buffer for the Nightmare headless browser,
used to scrape the old RocketSpark site. RocketSpark and Nightmare are no longer used, so the custom image is no longer needed.)

Also ensure the server hosting docker has the correct timezone using

````
	sudo timedatectl set-timezone Australia/Sydney
````

Finally, one last note

WARNING: simpl-schema no longer works with cheerio objects in the AutoValue functions
to fix this we must monkey patch the file node_modules/simpl-schema/dist/clean/AutoValueRunner.js
and change the line 136 not to use clone
```
	mongoObject.setValueForPosition(position, autoValue);
```
The patched file is in app/node_modules on dev20 and gets bundled by `meteor build`. Reapply it if node_modules is ever reinstalled.

# Updating nginx-proxy and letsencrypt
To update the two docker containters acting as the nginx proxy and letsencrypt companion, use the following commands
```
  $ mup proxy stop
  $ mup proxy start
```
The script /opt/mup-nginx-proxy/start.sh will remove the old containers, pull down the latest version and recreate them.
Last time I did this on 3-Oct-2025, I had to mup proxy stop, then reboot the ubuntu box to clear network locks, then mup proxy start. Fixed it

# 22-Oct-2026 Odoo login required for order sync
The Odoo routes `/web/orderjson` and `/web/ordership` (odoo_sale_addons/website_tpp) now require a logged in Odoo sales user.
`odooFetch.js` and `odooShip.js` pass the `session_id` returned by `odooLogin` as a cookie on these calls,
so the Odoo user in settings.json must be in the Sales group.
When changing this, deploy TPP Operations first (it works against old and new Odoo), then update odoo_sale_addons and restart the Odoo container (it pulls addons from GitHub on boot).
