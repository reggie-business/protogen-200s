# Bootstrap Runbook — Protogen Deliverable 2 (Vue + Vuetify dashboard)

## CRITICAL — folder structure (read first)
# protogen-200s is a SIBLING of protogen-100s, NOT inside it.
# Correct:   Developer/protogen-100s/   AND   Developer/protogen-200s/
# WRONG:     Developer/protogen-100s/protogen-200s/  (nested repos = broken)
# When you open the folder in VS Code and when Copilot scaffolds, the working
# directory must be protogen-200s at the SAME level as protogen-100s.

## 0 · Prereqs (Vue needs Node this time)
git --version
gh --version
node --version     # REQUIRED now. If missing: brew install node
npm --version
# ✅ All four print versions → continue. (D1 didn't need node; D2 does — build step.)

## 1 · GitHub CLI auth (if not still authed from D1)
gh auth status     # if already logged in from D1, skip gh auth login
# ⚠️ Corporate SSO: authorize the token for your org if pushes get rejected.

## 2 · Make the project folder as a SIBLING of protogen-100s
# Navigate to the PARENT folder that contains protogen-100s:
cd path/to/Developer        # the folder where protogen-100s lives
mkdir protogen-200s && cd protogen-200s
# Confirm you're a sibling: `ls ..` should show BOTH protogen-100s and protogen-200s.
# Do NOT run this inside protogen-100s.

## 3 · Drop in BRIEF.md + first commit = your plan
# Save the BRIEF.md (provided) into this protogen-200s folder.
git init
git add -A && git commit -m "Add project brief (FastForward ops dashboard plan)"
# ✅ First commit is your plan, before any code — same pattern as D1.
#    (Vue scaffold comes next, AFTER this, so the brief leads the history.)

## 4 · Connect to the existing GitHub repo + push
# Repo already created (empty) at: https://github.com/reggie-business/protogen-200s
# In protogen-200s/ (sibling of protogen-100s), after your brief commit:
git remote add origin https://github.com/reggie-business/protogen-200s.git
git branch -M main
git push -u origin main
# ⚠️ Corporate SSO: if the push is rejected, authorize the token for the org in the
#    browser, then push again.
# ⚠️ The repo must be EMPTY (no README/.gitignore added on GitHub) or the push will
#    reject with "updates were rejected." If you added files on creation, either
#    delete them on GitHub, or run: git pull --rebase origin main  then push.
# ✅ Refresh github.com/reggie-business/protogen-200s — your brief commit is there.

## 5 · Vercel — WAIT
# Do NOT set up Vercel yet. Vue needs to be scaffolded first (Vercel needs a
# framework + build command to detect). We deploy AFTER the Vue project exists and
# builds. (This is different from D1, where static deployed immediately.)