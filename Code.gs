/**
 * Birthday RSVP collector — paste this into Extensions > Apps Script of your Google Sheet.
 * Every RSVP from the invitation page becomes a row in the "RSVPs" tab,
 * and the "Summary" tab shows live totals.
 */

// Put your email here to get a notification for each RSVP, or leave "" to turn it off.
const NOTIFY_EMAIL = "";

const HEADERS = ["Received", "Name", "Attending", "Adults", "Kids", "Allergies", "Contact", "Note", "Changed response?"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getRsvpSheet_();
    const p = e.parameter || {};
    const clean = v => String(v || "").slice(0, 500).replace(/^[=+\-@]/, "'$&"); // block formula injection
    const row = [
      new Date(),
      clean(p.name),
      p.attending === "Yes" ? "Yes" : "No",
      Math.max(0, Math.min(20, Number(p.adults) || 0)),
      Math.max(0, Math.min(20, Number(p.kids) || 0)),
      clean(p.allergies),
      clean(p.contact),
      clean(p.note),
      p.updated ? "Yes" : ""
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      const msg = row[2] === "Yes"
        ? `${row[1]} is coming! ${row[3]} adult(s), ${row[4]} kid(s).` + (row[5] ? `\nAllergies: ${row[5]}` : "")
        : `${row[1]} can't make it.`;
      MailApp.sendEmail(NOTIFY_EMAIL, `New RSVP: ${row[1]} (${row[2]})`, msg + (row[7] ? `\nNote: ${row[7]}` : ""));
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the Web App URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput("RSVP collector is running.");
}

// Run this once from the Apps Script editor (select "setup" and click Run) to build both tabs.
function setup() {
  getRsvpSheet_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName("Summary") || ss.insertSheet("Summary", 0);
  s.clear();
  // Counts each family once, using their MOST RECENT response (so changed answers don't double count).
  const latest = "LET(n,RSVPs!B2:B,r,ROW(RSVPs!B2:B),keep,(n<>\"\")*(r=MAXIFS(r,n,n)),keep)";
  s.getRange("A1:B1").setValues([["Birthday RSVPs", ""]]).setFontWeight("bold").setFontSize(14);
  s.getRange("A3:A8").setValues([["Families responded"], ["Coming"], ["Not coming"], ["Adults coming"], ["Kids coming"], ["Total guests"]]);
  s.getRange("B3").setFormula(`=SUMPRODUCT(${latest})`);
  s.getRange("B4").setFormula(`=SUMPRODUCT(${latest}*(RSVPs!C2:C="Yes"))`);
  s.getRange("B5").setFormula(`=SUMPRODUCT(${latest}*(RSVPs!C2:C="No"))`);
  s.getRange("B6").setFormula(`=SUMPRODUCT(${latest}*N(+RSVPs!D2:D))`);
  s.getRange("B7").setFormula(`=SUMPRODUCT(${latest}*N(+RSVPs!E2:E))`);
  s.getRange("B8").setFormula("=B6+B7");
  s.getRange("A8:B8").setFontWeight("bold");
  s.getRange("A10").setValue("Allergies to plan for").setFontWeight("bold");
  s.getRange("A11").setFormula(`=IFERROR(FILTER(RSVPs!B2:B&": "&RSVPs!F2:F,${latest},RSVPs!F2:F<>""),"None reported")`);
  s.setColumnWidth(1, 220);
  s.setColumnWidth(2, 90);
  s.getRange("B3:B8").setHorizontalAlignment("center");
}

function getRsvpSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("RSVPs");
  if (!sheet) {
    sheet = ss.insertSheet("RSVPs");
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#f3e9dc");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("mmm d, h:mm am/pm");
  }
  return sheet;
}
