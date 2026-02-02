# Property Form Testing Checklist

## Test Scenarios

### ✅ Scenario 1: PG Property Listing

**Steps:**
1. Navigate to Post Property page
2. Select Purpose = **PG**
3. Verify Property Type field is **HIDDEN**
4. Enter Property Title (e.g., "Boys PG with Food in RS Puram")
5. Click Continue

**Expected Results:**
- [ ] Property Type dropdown is not visible
- [ ] Title placeholder shows PG-specific example
- [ ] Can proceed to Step 2 without selecting property type

**Step 2 - Location:**
- [ ] All location fields are visible
- [ ] City and Area are required

**Step 3 - Pricing:**
- [ ] Shows "Monthly Rent" label (not "Total Price")
- [ ] Shows "Food Included" checkbox
- [ ] Shows "Security Deposit" field
- [ ] Hides "Price Negotiable"

**Step 4 - Specifications:**
- [ ] Shows "PG-Specific Details" header with blue background
- [ ] Shows PG Type dropdown (Boys/Girls/Co-Living)
- [ ] Shows Room Type dropdown (Single/Double/Shared)
- [ ] Shows Number of Beds input
- [ ] Shows Food Type dropdown (Veg/Non-Veg/Both)
- [ ] Shows Electricity Charges checkbox
- [ ] Shows House Rules textarea
- [ ] Does NOT show BHK, Bathrooms, Built-up Area, etc.

**Step 5 - Furnishing:**
- [ ] Shows "Not applicable for PG" message
- [ ] Does NOT show furnishing options
- [ ] Does NOT show property age

**Step 6 - Amenities:**
- [ ] Shows PG-specific amenities: Wi-Fi, Food, Laundry, CCTV, Power Backup, Security, Parking
- [ ] Does NOT show: Lift, Gym, Swimming Pool, Club House

**Step 7 - Images:**
- [ ] Upload hint says "Include room and washroom images"
- [ ] Minimum 3 images required

**Step 8 - Submit:**
- [ ] Can submit successfully
- [ ] All PG data is captured

---

### ✅ Scenario 2: Plot/Land for Sale

**Steps:**
1. Navigate to Post Property page
2. Select Purpose = **Sale**
3. Verify Property Type dropdown appears
4. Select Property Type = **Plot / Land**
5. Enter Property Title
6. Click Continue

**Expected Results:**

**Step 1:**
- [ ] Property Type dropdown is visible
- [ ] Can select "Plot / Land"

**Step 3 - Pricing:**
- [ ] Shows "Total Price" label
- [ ] Shows "Price Negotiable" checkbox
- [ ] Hides "Monthly Rent", "Security Deposit", "Food Included"

**Step 4 - Specifications:**
- [ ] Shows Plot Area input with unit selector (Sqft/Cents)
- [ ] Shows Plot Facing dropdown
- [ ] Shows Road Width input
- [ ] Shows Boundary Wall checkbox
- [ ] Does NOT show BHK, Bathrooms, Balconies, Floor, etc.

**Step 5 - Furnishing:**
- [ ] Shows "Not applicable for Plot / Land" message
- [ ] Does NOT show furnishing options

**Step 6 - Amenities:**
- [ ] Shows "No specific amenities for this property type" message
- [ ] Amenities list is empty

**Step 7 - Images:**
- [ ] Upload hint says "Include land and road access images"

---

### ✅ Scenario 3: Apartment for Rent

**Steps:**
1. Select Purpose = **Rent**
2. Select Property Type = **Apartment / Flat**
3. Fill in all required fields

**Expected Results:**

**Step 1:**
- [ ] Both Purpose and Property Type are visible
- [ ] Title placeholder shows rent-specific example

**Step 3 - Pricing:**
- [ ] Shows "Monthly Rent" label
- [ ] Shows "Security Deposit" field
- [ ] Shows "Maintenance Charges" field
- [ ] Hides "Price Negotiable"
- [ ] Hides "Food Included"

**Step 4 - Specifications:**
- [ ] Shows BHK dropdown
- [ ] Shows Bathrooms input
- [ ] Shows Balconies input
- [ ] Shows Built-up Area input (required)
- [ ] Shows Parking dropdown
- [ ] Shows Floor Number input
- [ ] Shows Total Floors input
- [ ] Does NOT show PG-specific fields

**Step 5 - Furnishing:**
- [ ] Shows Furnishing Status radio buttons (Unfurnished/Semi/Fully)
- [ ] Shows Available From date picker
- [ ] Shows Property Age dropdown

**Step 6 - Amenities:**
- [ ] Shows residential amenities: Lift, Power Backup, Security, Parking, Water Supply, Gym, Swimming Pool, Club House
- [ ] Does NOT show PG amenities (Wi-Fi, Food, Laundry)

---

### ✅ Scenario 4: Commercial Office for Sale

**Steps:**
1. Select Purpose = **Sale**
2. Select Property Type = **Commercial Office**
3. Fill in all required fields

**Expected Results:**

**Step 4 - Specifications:**
- [ ] Shows Built-up Area (required)
- [ ] Shows "Washrooms" label (not "Bathrooms")
- [ ] Shows Floor Number
- [ ] Shows Total Floors
- [ ] Shows Parking
- [ ] Does NOT show BHK
- [ ] Does NOT show Balconies

**Step 6 - Amenities:**
- [ ] Shows commercial amenities: Lift, Power Backup, Parking, Security, CCTV, Fire Safety
- [ ] Does NOT show residential amenities (Gym, Pool, Club House)

---

### ✅ Scenario 5: Form Validation

**Test Required Fields:**
- [ ] Cannot proceed from Step 1 without Title
- [ ] Cannot proceed from Step 1 without Purpose
- [ ] Cannot proceed from Step 1 without Type (if Purpose ≠ PG)
- [ ] Cannot proceed from Step 2 without City
- [ ] Cannot proceed from Step 2 without Area
- [ ] Cannot proceed from Step 3 without Price
- [ ] Cannot proceed from Step 4 without Built-up Area (if not Plot/PG)
- [ ] Cannot proceed from Step 4 without Plot Area (if Plot)
- [ ] Cannot submit without accepting Terms & Conditions
- [ ] Cannot submit with less than 3 images

**Test Field Clearing:**
- [ ] When changing Purpose to PG, Property Type is cleared
- [ ] When changing City, Area updates to new city's localities

---

### ✅ Scenario 6: Dynamic UI Updates

**Test Real-time Updates:**
1. Start with Purpose = Sale, Type = Apartment
2. Change Purpose to PG
   - [ ] Property Type field disappears
   - [ ] Title placeholder updates
3. Change Purpose back to Rent
   - [ ] Property Type field reappears
   - [ ] Type value is cleared
4. Select Type = Plot
   - [ ] Step 4 shows plot-specific fields
   - [ ] Step 5 shows "Not applicable" message
5. Change Type to Villa
   - [ ] Step 4 shows residential fields
   - [ ] Step 5 shows furnishing options

---

### ✅ Scenario 7: Image Upload

**Test Image Validation:**
- [ ] Can upload multiple images via drag & drop
- [ ] Can upload images via file selector
- [ ] Can remove uploaded images
- [ ] Shows error if trying to submit with < 3 images
- [ ] Shows correct hint based on property type/purpose
- [ ] Accepts valid image formats (PNG, JPG, JPEG, WebP)
- [ ] Rejects files > 5MB

**Test Video Upload:**
- [ ] Can upload video file
- [ ] Shows video file name and size
- [ ] Can change video file
- [ ] Accepts video files up to 50MB

---

### ✅ Scenario 8: Step Navigation

**Test Navigation:**
- [ ] Can navigate forward through steps
- [ ] Can navigate backward through steps
- [ ] Step indicator shows current step
- [ ] Completed steps show checkmark
- [ ] Cannot skip required fields
- [ ] Form state is preserved when going back

---

### ✅ Scenario 9: Admin Mode

**Test Admin Features:**
1. Access form as admin user
2. Fill in property details
3. Navigate to Step 8
   - [ ] Shows "Admin Mode: Instant publishing enabled" message
   - [ ] Submit button says "Publish Direct" instead of "Submit Listing"
   - [ ] Button has amber/yellow color scheme

---

### ✅ Scenario 10: Data Submission

**Test Form Submission:**
1. Fill in complete form with all required fields
2. Upload 3+ images
3. Accept terms and conditions
4. Click Submit
   - [ ] Shows loading state
   - [ ] Images are uploaded to Cloudinary
   - [ ] Property data is saved to Supabase
   - [ ] Success message is displayed
   - [ ] Form is reset or user is redirected

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Responsive Design Testing

Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Bug Report Template

If you find any issues, report using this format:

```
**Issue Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots**:
[If applicable]

**Environment**:
- Browser: 
- Device: 
- Screen Size: 
```

---

## Test Results Summary

**Date Tested**: _______________  
**Tested By**: _______________  
**Total Scenarios**: 10  
**Passed**: _____ / 10  
**Failed**: _____ / 10  
**Blocked**: _____ / 10  

**Critical Issues Found**: _____  
**Minor Issues Found**: _____  

**Overall Status**: ⬜ PASS | ⬜ FAIL | ⬜ NEEDS REVIEW

**Notes**:
_____________________________________
_____________________________________
_____________________________________
