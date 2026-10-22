# montana2028.com

Darren Karr for Montana Governor 2028. Static site on GitHub Pages (custom domain via `CNAME`, https enforced). Email is karr@montana2028.com (GoDaddy Microsoft 365). DNS at GoDaddy: four A records to GitHub Pages, `www` CNAME to `darkarr11.github.io`, MX to Microsoft 365.

## Pages
- `index.html`: home. Banner is `banner.jpg` (Montana 2028 flag art) with "Darren Karr for Governor" overlaid in HTML.
- `education.html`: Issue 1, Facebook post #1 verbatim. Source of record: Genesis `docs/campaign/comms/2026-10-07-fb-post-01-education.md`. Its statistics are not yet sourced.

## Blabbable policy (`blab.js`, `demo.js`)
Readers highlight any passage and blab on it. There is also a General discussion box at the bottom, and words inside any comment can be highlighted and blabbed too. Highlights show a count badge.

- **Storage:** Blabbertree's Firestore (`blabbertree-app`), collection `blabs`, `docKey: montana2028_<issue>`. It uses the same anchor format as BT's `tree.html`, so the blabs also exist in BT.
- **Identity:** anonymous by default, and the name shows as "Anonymous". Google sign-in shows the account name with a ✓, and the author can edit or remove their own blab. A name never comes from a text box.
- **Rules:** `firebase/firestore.rules` is the live ruleset. Darren deployed it 2026-10-10, and it was attack-tested 9 of 9. Nobody can overwrite or delete anyone's blab. **The BT repo's own `firestore.rules` does not contain the montana2028 block. Merge it in before ever deploying the BT version.**
- **Email alerts:** each new blab POSTs to FormSubmit (`formsubmit.co/ajax/dkarr@mac.com`), which emails Darren "New blab on Montana2028: <policy>" with a `#blab=<id>` link. That link opens the thread and flashes the blab. Pages whose `docKey` ends in `_test` never email.
- **Demo:** "Watch how it works" plays a scripted walkthrough with example comments. Nothing is saved.
- **Moderation:** blabs can't be deleted from the client. Remove one with an admin token against the Firestore REST API, or in the Firebase console.

### Adding an issue page
Copy `education.html`. Change `data-doc="montana2028_<issue>"` and `data-title="<Policy name>"` on `#policy`, then add a card to `index.html`.

## `firebase/`
Excluded from the public site by `_config.yml`.
- `firestore.rules`: deploy with `cd firebase && firebase deploy --only firestore:rules --project blabbertree-app`.
- `functions/`: an iCloud-SMTP email function. **Not deployed**, because FormSubmit replaced it. Keep it or delete it.

## Open (updated 2026-10-22)
- **Mailbox:** now **karr@montana2028.com** (changed from darren@ on 2026-10-15), opened in Outlook web. On 10/11 the domain wasn't set up on Microsoft's mail side yet; by 10/22 Microsoft's mail server resolves. Not recorded here: whether Meta's political-ads verification is done.
- Google sign-in is configured but hasn't had a live test with a real account.
- Google's sign-in popup names `blabbertree-app.firebaseapp.com`, not montana2028.com.
