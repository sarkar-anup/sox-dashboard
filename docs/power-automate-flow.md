# Power Automate Flow: Due Date Notifications

**Trigger**: Scheduled (Daily at 9:00 AM)

## Logic Steps
1. **Get Items**: 
   - Source: `ControlsInventory` List
   - Filter Query: `DueDate le '@{addDays(utcNow(), 7)}' and Status ne 'Completed'`
2. **Group Data**:
   - Initialize Variable `Notifications` (Array/Object).
   - Iterate through items. Key by `ControlOwner.Email`.
3. **Send Emails**:
   - For each unique Owner in `Notifications`:
     - Create HTML Table of their pending items.
     - Send Email (Outlook Connector).
       - To: `ControlOwner`
       - Subject: "Action Required: Upcoming Control Due Dates"
       - Body: "You have controls due within 7 days..." + HTML Table.

## Anti-Spam Strategy
- **Option A**: Add `LastNotifiedDate` column to List. Update it after email. Only email if `LastNotifiedDate < Today - 2 days`.
- **Option B**: Only notify exactly 7 days before, 3 days before, and Overdue.
