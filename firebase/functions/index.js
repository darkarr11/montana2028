/* Email Darren when a blab lands on a montana2028.com policy page.
   Sends through iCloud SMTP as dkarr@mac.com, to dkarr@mac.com.
   The app-specific password lives in Secret Manager as ICLOUD_APP_PASSWORD
   (set it with: firebase functions:secrets:set ICLOUD_APP_PASSWORD). */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');

const ICLOUD_APP_PASSWORD = defineSecret('ICLOUD_APP_PASSWORD');
const ME = 'dkarr@mac.com';

/* docKey -> policy title + page. Add a line per new issue page. */
const POLICIES = {
  montana2028_education: { title: 'Education Reform', page: 'education.html' }
};

const STANCE = { question: 'Question', support: 'Agree', oppose: 'Disagree', context: 'Add info' };

exports.emailNewMontanaBlab = onDocumentCreated(
  { document: 'blabs/{blabId}', region: 'us-central1', secrets: [ICLOUD_APP_PASSWORD] },
  async (event) => {
    const b = event.data && event.data.data();
    if (!b || typeof b.docKey !== 'string' || !b.docKey.startsWith('montana2028_')) return;
    const policy = POLICIES[b.docKey];
    if (!policy) return; // test keys and unknown pages don't email

    const link = 'https://montana2028.com/' + policy.page + '#blab=' + encodeURIComponent(event.params.blabId);
    const where = b.anchor && b.anchor.exact
      ? (b.anchor.type === 'blab-text' ? 'Replying to part of a comment: "' : 'On the passage: "') + b.anchor.exact + '"'
      : (b.parentId ? 'A reply in the discussion' : 'In General discussion');
    const who = (b.name || 'Anonymous') + (b.signedIn ? ' (signed in)' : '');

    const transport = nodemailer.createTransport({
      host: 'smtp.mail.me.com', port: 587, secure: false,
      auth: { user: ME, pass: ICLOUD_APP_PASSWORD.value() }
    });
    await transport.sendMail({
      from: 'Montana2028 <' + ME + '>',
      to: ME,
      subject: 'New blab on Montana2028: ' + policy.title,
      text: [
        who + (STANCE[b.stance] ? ' [' + STANCE[b.stance] + ']' : ''),
        where,
        '',
        b.text || '',
        '',
        'Open it: ' + link
      ].join('\n')
    });
  }
);
