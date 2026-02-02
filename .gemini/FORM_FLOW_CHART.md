# Property Form Flow Chart

## Form Flow Based on Purpose Selection

```
START: Post Property Form
│
├─ STEP 1: Basic Information
│  ├─ [REQUIRED] Purpose (Radio Buttons)
│  │  ├─ Sale
│  │  ├─ Rent
│  │  └─ PG
│  │
│  ├─ [CONDITIONAL] Property Type (Dropdown)
│  │  ├─ IF Purpose = Sale OR Rent → SHOW
│  │  │  └─ Options: Apartment, House, Villa, Plot, Commercial, Shop
│  │  └─ IF Purpose = PG → HIDE
│  │
│  └─ [REQUIRED] Property Title
│     └─ Dynamic placeholder based on Purpose
│
├─ STEP 2: Location Details (ALWAYS REQUIRED)
│  ├─ City (Tamil Nadu)
│  ├─ Area / Locality (dependent on city)
│  ├─ Address (optional)
│  ├─ Landmark (optional)
│  └─ Pincode (optional)
│
├─ STEP 3: Price Details (DYNAMIC)
│  │
│  ├─ IF Purpose = SALE
│  │  ├─ Expected Price (Required)
│  │  └─ Price Negotiable (Yes/No)
│  │
│  ├─ IF Purpose = RENT
│  │  ├─ Monthly Rent (Required)
│  │  ├─ Security Deposit (Optional)
│  │  └─ Maintenance Charges (Optional)
│  │
│  └─ IF Purpose = PG
│     ├─ Monthly Rent (Required)
│     ├─ Food Included (Yes/No)
│     └─ Security Deposit (Optional)
│
├─ STEP 4: Property Specifications (SMART LOGIC)
│  │
│  ├─ IF Purpose = PG (EXCLUSIVE BLOCK)
│  │  ├─ PG Type (Boys/Girls/Co-Living)
│  │  ├─ Room Type (Single/Double/Shared)
│  │  ├─ Number of Beds
│  │  ├─ Food Type (Veg/Non-Veg/Both)
│  │  ├─ Electricity Charges Included
│  │  └─ House Rules
│  │
│  ├─ ELSE IF Property Type = Plot
│  │  ├─ Plot Area (Sq.ft/Cents)
│  │  ├─ Plot Facing
│  │  ├─ Road Width
│  │  └─ Boundary Wall
│  │
│  ├─ ELSE IF Property Type = Commercial/Shop
│  │  ├─ Built-up Area / Carpet Area
│  │  ├─ Washrooms
│  │  ├─ Floor Number
│  │  ├─ Total Floors
│  │  └─ Parking
│  │
│  └─ ELSE (Apartment/House/Villa)
│     ├─ BHK
│     ├─ Bathrooms
│     ├─ Balconies
│     ├─ Built-up Area
│     ├─ Parking
│     ├─ Floor Number
│     └─ Total Floors
│
├─ STEP 5: Furnishing & Availability
│  │
│  ├─ IF Property Type = Plot OR Purpose = PG
│  │  └─ Show "Not Applicable" message
│  │
│  └─ ELSE
│     ├─ Furnishing Status (Unfurnished/Semi/Fully)
│     ├─ Available From (Date)
│     └─ Property Age
│
├─ STEP 6: Amenities (AUTO-FILTERED)
│  │
│  ├─ IF Purpose = PG
│  │  └─ Wi-Fi, Food, Laundry, CCTV, Power Backup, Security, Parking
│  │
│  ├─ IF Property Type = Plot
│  │  └─ No amenities (empty)
│  │
│  ├─ IF Property Type = Commercial/Shop
│  │  └─ Lift, Power Backup, Parking, Security, CCTV, Fire Safety
│  │
│  └─ ELSE (Residential)
│     └─ Lift, Power Backup, Security, Parking, Water Supply, Gym, Pool, Club
│
├─ STEP 7: Images & Media
│  ├─ Property Photos (Min 3, Max 10)
│  │  ├─ IF Purpose = PG → Hint: "Include room and washroom images"
│  │  ├─ IF Type = Plot → Hint: "Include land and road access images"
│  │  └─ ELSE → Standard hint
│  │
│  └─ Video Walkthrough (Optional, Max 50MB)
│
└─ STEP 8: Review & Submit
   ├─ Final Review Summary
   ├─ Property Description (Optional)
   ├─ Terms & Conditions (Required)
   └─ Submit Button
      ├─ Regular User → "Submit Property"
      └─ Admin → "Publish Direct"
```

## Key Business Rules

### 1. Purpose-First Approach
- **Purpose** is the first decision point
- Determines entire form flow
- PG is treated as a distinct category (not a property type)

### 2. Conditional Field Display
- Only show fields relevant to the selected purpose/type
- Reduces cognitive load on users
- Improves form completion rates

### 3. Smart Validation
- Required fields vary based on selection
- PG: Only title, purpose, location, price, PG details
- Plot: No BHK, furnishing, or residential amenities
- Commercial: Washrooms instead of bathrooms

### 4. User Experience
- Clear visual hierarchy
- Contextual help text
- Progressive disclosure
- Validation at each step

### 5. Data Integrity
- Auto-clear incompatible fields
- Prevent invalid combinations
- Ensure complete property data

## Form States

### State 1: Purpose = PG
```
Step 1: Purpose ✓ | Title ✓
Step 2: Location ✓
Step 3: Rent ✓ | Food ✓ | Deposit
Step 4: PG Details (Type, Room, Food Type, Rules)
Step 5: Not Applicable (Skip)
Step 6: PG Amenities (Wi-Fi, Food, etc.)
Step 7: Images (Room + Washroom)
Step 8: Review & Submit
```

### State 2: Purpose = Sale, Type = Plot
```
Step 1: Purpose ✓ | Type ✓ | Title ✓
Step 2: Location ✓
Step 3: Price ✓ | Negotiable
Step 4: Plot Details (Area, Facing, Road, Boundary)
Step 5: Not Applicable (Skip)
Step 6: No Amenities
Step 7: Images (Land + Road Access)
Step 8: Review & Submit
```

### State 3: Purpose = Rent, Type = Apartment
```
Step 1: Purpose ✓ | Type ✓ | Title ✓
Step 2: Location ✓
Step 3: Rent ✓ | Deposit | Maintenance
Step 4: Apartment Details (BHK, Bath, Balcony, Area, etc.)
Step 5: Furnishing ✓ | Available From | Age
Step 6: Residential Amenities (Lift, Gym, Pool, etc.)
Step 7: Images (Property Photos)
Step 8: Review & Submit
```

---

**Note**: This flow ensures that users only see fields relevant to their property listing, making the form intuitive and efficient.
