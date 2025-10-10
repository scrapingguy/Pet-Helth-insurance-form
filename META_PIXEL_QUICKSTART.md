# 🎯 Meta Pixel Quick Start Guide

## Your Meta Pixel Setup is Complete! ✅

**Pixel ID:** `471890769241622`  
**Domain:** `https://rechner.vierbeinerabsicherung.de`

---

## 🚀 What's Been Done

### ✅ Code Installation Complete
All Meta Pixel code has been installed and is ready to track:

1. **PageView** - Tracks every page visitor automatically
2. **Lead** - Tracks when users click "Jetzt Tarif berechnen" (calculator button)
3. **CompleteRegistration** - Tracks completed applications on thank-you page

---

## ⚠️ ONE ACTION REQUIRED: Domain Verification

You need to verify your domain in Meta Business Manager:

### Steps:
1. **Go to:** [Meta Business Manager](https://business.facebook.com/)
2. **Navigate to:** Brand Safety → Domains
3. **Click:** "Add" button
4. **Enter:** `rechner.vierbeinerabsicherung.de`
5. **Copy** the verification code provided by Meta
6. **Edit** `index.html` line 7 and replace:
   ```html
   <meta name="facebook-domain-verification" content="YOUR_VERIFICATION_CODE_HERE" />
   ```
   with your actual code:
   ```html
   <meta name="facebook-domain-verification" content="abc123xyz456..." />
   ```
7. **Save and deploy** the updated file

---

## 🧪 Test Your Pixel (Do This First!)

### Before launching any ads:

1. **Install Pixel Helper**
   - Go to: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
   - Add to Chrome

2. **Test Events**
   - Visit your site: `https://rechner.vierbeinerabsicherung.de`
   - Click the Pixel Helper icon
   - You should see: ✅ **PageView** event

3. **Test Lead Event**
   - Fill out the form (animal type, breed, dates)
   - Click "Jetzt Tarif berechnen"
   - Check Pixel Helper: ✅ **Lead** event should appear

4. **Test Complete Registration**
   - Complete the entire application
   - Submit the final form
   - On success page, check: ✅ **CompleteRegistration** event

---

## 📊 Launch Your Campaign

### Campaign Settings:
```
Campaign Type: Conversions
Pixel: 471890769241622
Conversion Event: Lead
Daily Budget: €30-€50
Optimization: Conversions (Lead)
```

### What to Expect:
- **Days 1-7:** Learning phase (costs may be higher)
- **Days 7-14:** Algorithm starts optimizing
- **After 50 leads:** Full optimization kicks in
- **Ongoing:** Continue monitoring and adjusting

---

## 📈 Monitoring Your Results

### Check These Metrics Daily:
- Number of Lead events
- Cost per Lead
- Lead quality (how many convert to applications)
- CompleteRegistration rate

### Where to Check:
1. **Events Manager:** See all pixel events in real-time
2. **Ads Manager:** Track campaign performance
3. **Pixel Helper:** Verify events are firing correctly

---

## 🆘 Troubleshooting

### Pixel Not Showing in Pixel Helper?
- Clear browser cache
- Disable ad blockers
- Check browser console for errors
- Verify code is in `<head>` section

### Events Not Firing?
- Check that you completed domain verification
- Test in incognito mode
- Verify JavaScript isn't blocked
- Check Meta Events Manager → Test Events

### Need Help?
- Review: `META_PIXEL_IMPLEMENTATION.md` (detailed docs)
- Check: `META_PIXEL_CHECKLIST.md` (step-by-step checklist)
- Contact: [Meta Business Support](https://www.facebook.com/business/help)

---

## 🎉 You're All Set!

Once you:
1. ✅ Complete domain verification
2. ✅ Test all events with Pixel Helper
3. ✅ See events in Meta Events Manager

You're ready to launch your campaigns and start tracking conversions! 🚀

---

**Remember:** The pixel needs about 50 leads before Meta's algorithm can fully optimize your campaigns. Be patient and monitor performance closely in the first 2 weeks.

Good luck! 🍀
