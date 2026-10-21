# Birthday Invite Setup (about 15 minutes, $0)

You'll end up with:
- **A link you text or email to guests.** It opens with an envelope animation, then shows your invitation and an RSVP form.
- **A Google Sheet** that fills in as people respond, with a Summary tab showing live headcounts and allergies.

---

## Step 1: Add your invitation image

1. Export your design as a **JPG or PNG**. About 1200 px wide is ideal, portrait or square. Keep it under 1 MB if you can, so it loads quickly on phones.
2. Name it **`invite.jpg`** and put it in the same folder as `index.html`.
   - If it's a PNG, either rename the reference in `index.html` (`src="invite.jpg"`) or convert it.
3. Optional: in `index.html`, find `alt="Birthday party invitation"` and replace it with the party details in plain words, such as "Maya's 6th birthday, Saturday Nov 14, 2–4pm, Sky Zone, Edison NJ." This helps guests who use screen readers and shows if the image fails to load.
4. Optional: change `--accent:#d9546b;` near the top of `index.html` to your invite's main color. This sets the wax seal, buttons, and confetti.

## Step 2: Create the Google Sheet back end

1. Go to **sheets.new** while signed into your Google account. Name the sheet something like "Birthday RSVPs."
2. Click **Extensions → Apps Script**.
3. Delete everything in the editor and paste in all of `Code.gs`.
   - Optional: put your email between the quotes in `NOTIFY_EMAIL = ""` to get an email for each RSVP.
4. Click the **Save** icon (💾).
5. In the toolbar's function dropdown, choose **`setup`** and click **Run**.
   - Google will ask you to authorize the script. Choose your account, then click **Advanced → Go to (project name) (unsafe) → Allow**. The warning appears because the script is yours and unverified, not because anything is wrong.
   - Back in your sheet, you'll now see **Summary** and **RSVPs** tabs.
6. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** **Anyone**. This setting is required so guests can submit without a Google login.
   - Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
7. In `index.html`, find `SCRIPT_URL: "PASTE_YOUR_WEB_APP_URL_HERE"` and paste your URL between the quotes.
   - Optional: also fill in `RSVP_BY`, for example `"Please reply by November 1"`.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same URL.

## Step 3: Put it online (free)

**Netlify Drop (easiest):**
1. Create a free account at **app.netlify.com**. Without an account, dropped sites expire.
2. Go to **app.netlify.com/drop** and drag the whole folder containing `index.html` and `invite.jpg` onto the page.
3. You'll get a link like `random-name-123.netlify.app`. Under **Site configuration → Change site name**, you can rename it to something like `mayas-6th-birthday.netlify.app`.
4. Recommended: in `index.html`, replace `YOUR-SITE` in the `og:image` line with your real site name, then drag the folder onto **Deploys** again. This makes your invitation image appear as a preview when you text the link.

**Alternative: GitHub Pages.** This is also free. Upload the files to a public repository and turn on Pages in its Settings.

## Step 4: Test before sending

1. Open your link on your phone. Tap the envelope and submit a test RSVP.
2. Check the **RSVPs** tab. Your test row should appear within a few seconds.
3. Delete the test row, then send the link to guests.

## Good to know

- **Changed answers:** if a guest RSVPs again, the sheet keeps both rows, and the Summary counts only their latest answer. This matching uses the name, so it works best if they type it the same way.
- **Returning guests** skip the envelope and see "Change my response" on the same phone.
- **Privacy:** only you can see the sheet. The invitation page itself is public to anyone with the link, so keep your home address on the image only if you're comfortable sharing it that way.
