# Tokenhalle Pages (thin second site)

GitHub Pages allows **one custom domain per site**. TurmFarm already owns
`idlegame.micana.de` on [michael-linuxdev/idlegame](https://github.com/michael-linuxdev/idlegame).

This folder is a **thin mirror repo** for **Tokenhalle** at `tokenhalle.micana.de`.
It does not vendor the game source: each deploy checks out public `idlegame`,
runs `npm run build:arcade`, and publishes the result.

## One-time setup

1. Create an empty **public** repo: [`michael-linuxdev/tokenhalle`](https://github.com/new?name=tokenhalle&description=Tokenhalle%20arcade%20Pages%20(tokenhalle.micana.de)&visibility=public).
2. Push this folder as the repo root:

   ```bash
   # from idlegame checkout
   ./scripts/bootstrap-tokenhalle-repo.sh
   ```

   Or manually:

   ```bash
   git init tokenhalle && cd tokenhalle
   cp -a ../idlegame/deploy/tokenhalle-repo/. .
   git add . && git commit -m "Tokenhalle Pages mirror"
   git branch -M main
   git remote add origin https://github.com/michael-linuxdev/tokenhalle.git
   git push -u origin main
   ```

3. In the new repo: **Settings → Pages → Source = GitHub Actions**.
4. Wait for the first workflow run (or **Actions → Deploy Tokenhalle Pages → Run**).
5. Set DNS (IONOS / ui-dns) — see below.

Until this second repo exists, Tokenhalle is also served at
https://idlegame.micana.de/arcade/ from the main idlegame Pages deploy.

## DNS (exact record)

| Type  | Name         | Value                         | TTL  |
|-------|--------------|-------------------------------|------|
| CNAME | `tokenhalle` | `michael-linuxdev.github.io`  | 3600 |

Same pattern as `idlegame.micana.de` → `michael-linuxdev.github.io`.

After DNS propagates, open https://tokenhalle.micana.de and enable **Enforce HTTPS**
on the tokenhalle repo Pages settings if the workflow did not already.
