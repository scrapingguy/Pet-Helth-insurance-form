# Meta Pixel Setup Checklist

## Pre-Launch Checklist ✅

### 1. Code Implementation
- [x] Global Meta Pixel code added to `<head>` section
- [x] `PageView` event tracking enabled
- [x] `Lead` event added to calculator button
- [x] `CompleteRegistration` event added to success page
- [ ] **⚠️ Replace domain verification code placeholder**

### 2. Domain Verification (ACTION REQUIRED)
- [ ] Log into Meta Business Manager
- [ ] Navigate to Brand Safety → Domains
- [ ] Add domain: `rechner.vierbeinerabsicherung.de`
- [ ] Copy verification code
- [ ] Update `index.html` line 7: Replace `YOUR_VERIFICATION_CODE_HERE`
- [ ] Wait for verification (can take up to 24 hours)

### 3. Testing
- [ ] Install Meta Pixel Helper Chrome extension
- [ ] Test `PageView` event (loads automatically)
- [ ] Test `Lead` event (submit calculator form)
- [ ] Test `CompleteRegistration` event (complete application)
- [ ] Verify all events in Meta Events Manager → Test Events tab

### 4. Meta Business Manager Setup
- [ ] Verify Pixel (471890769241622) is active
- [ ] Check Events Manager for event activity
- [ ] Review event data quality
- [ ] Set up custom conversions (optional)

### 5. Campaign Setup
- [ ] Create new campaign in Meta Ads Manager
- [ ] Select "Conversions" as campaign objective
- [ ] Choose Pixel 471890769241622
- [ ] Select "Lead" as conversion event
- [ ] Set daily budget (€30-€50 recommended)
- [ ] Configure audience targeting
- [ ] Add creative with "Calculate Contribution" CTA
- [ ] Set optimization for conversions

### 6. Privacy & Compliance
- [ ] Update privacy policy to mention Meta Pixel
- [ ] Implement cookie consent banner (if not already present)
- [ ] Add opt-out mechanism for tracking
- [ ] Verify GDPR compliance

### 7. Monitoring & Optimization
- [ ] Set up conversion tracking reports
- [ ] Monitor daily event volume
- [ ] Track cost per lead
- [ ] Wait for 50+ leads before optimization
- [ ] Review and adjust targeting based on performance

---

## Quick Reference

**Pixel ID:** 471890769241622  
**Domain:** https://rechner.vierbeinerabsicherung.de  
**Email Recipient:** kaikossendey.vkb@gmail.com

### Events Implemented:
1. **PageView** - Automatic on page load
2. **Lead** - Button: "Jetzt Tarif berechnen"
3. **CompleteRegistration** - Success/Thank-you page

### Files Modified:
- `index.html` (Meta Pixel code in `<head>`)
- `script.js` (Lead and CompleteRegistration events)

---

## Next Steps After Deployment

1. ✅ Deploy the updated code to production
2. ⚠️ Complete domain verification in Meta Business Manager
3. 🧪 Test all events using Pixel Helper
4. 📊 Launch Meta Ads campaign with "Lead" conversion objective
5. 📈 Monitor performance for 7-14 days
6. 🎯 Optimize based on data after 50+ leads

---

## Contact for Issues

**Technical Issues:**
- Check `META_PIXEL_IMPLEMENTATION.md` for troubleshooting
- Review browser console for JavaScript errors
- Use Meta Pixel Helper for diagnostics

**Meta Platform Issues:**
- [Meta Business Help Center](https://www.facebook.com/business/help)
- Meta Business Support (available in Business Manager)

---

**Last Updated:** January 2025
