# Patient ID Implementation Guide

## Overview

This document describes the implementation of Patient ID (PI######) in the Wellness application. Patient IDs are unique identifiers for patients that replace name/email based patient identification in prescriptions.

**Format:** `PI` + 6 digits (e.g., PI000123, PI348921)

---

## Changes Made

### 1. Backend - Database Schema

**File:** `backend/models/customerModel.js`

#### Added Patient ID Field:

```javascript
patientId: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
}
```

#### Auto-Generation in Pre-Validate Hook:

```javascript
CustomerSchema.pre("validate", async function (next) {
  if (this.patientId) {
    return next();
  }
  try {
    const Customer = this.constructor;
    let patientId;
    let exists = true;
    while (exists) {
      const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      patientId = `PI${random}`;
      exists = await Customer.exists({ patientId });
    }
    this.patientId = patientId;
    next();
  } catch (error) {
    next(error);
  }
});
```

**How it works:**

- Every new patient automatically gets a unique Patient ID when created
- Format: `PI` + random 6-digit number (e.g., `PI000123`)
- Patient IDs are checked for uniqueness before assignment
- If a patient doesn't have a Patient ID, one is generated on save

---

### 2. Backend - Patient Controller

**File:** `backend/controllers/patientController.js`

#### Search Functionality:

Added `patientId` to searchable fields:

```javascript
if (search) {
  const searchRegex = new RegExp(search, "i");
  filter.$or = [
    { firstName: searchRegex },
    { lastName: searchRegex },
    { email: searchRegex },
    { phone: searchRegex },
    { bloodGroup: searchRegex },
    { patientId: searchRegex }, // NEW
  ];
}
```

#### Auto-Generation for Existing Patients:

```javascript
await Promise.all(
  patients
    .filter((patient) => !patient.patientId)
    .map(async (patient) => {
      patient.markModified("patientId");
      await patient.save();
    }),
);
```

#### Protected Field Update:

```javascript
delete updateData.patientId; // Prevent changing patient ID
```

---

### 3. Backend - Prescription Controller

**File:** `backend/controllers/prescriptionController.js`

#### Create Prescription - Accepts Both Patient ID and ObjectId:

```javascript
let patient = null;
if (isId(patientId)) {
  // Try MongoDB ObjectId first
  patient = await Customer.findById(patientId).select(
    "firstName lastName patientId",
  );
  if (!patient) {
    patient = await User.findById(patientId).select("firstName lastName");
  }
} else {
  // Try Patient ID (PI######)
  patient = await Customer.findOne({ patientId }).select(
    "firstName lastName patientId",
  );
}
```

#### Search Prescriptions by Patient ID:

```javascript
if (search) {
  const searchRegex = new RegExp(search, "i");
  aggregationPipeline.push({
    $match: {
      $or: [
        { "patientInfo.firstName": searchRegex },
        { "patientInfo.lastName": searchRegex },
        { "patientInfo.email": searchRegex },
        { "patientInfo.patientId": searchRegex }, // NEW
        { diagnosis: searchRegex },
      ],
    },
  });
}
```

#### Export Prescriptions - Include Patient ID:

```javascript
const formattedData = prescriptions.map((p) => ({
  prescriptionId: p._id,
  patientId: p.patient.patientId, // NEW
  patientName: `${p.patient.firstName} ${p.patient.lastName}`,
  patientEmail: p.patient.email,
  // ... other fields
}));
```

#### Updated Populate Queries:

```javascript
// Create
.populate('patient', 'firstName lastName patientId')

// Update
.populate('patient', 'firstName lastName patientId')

// Export
.populate('patient', 'firstName lastName email patientId')
```

---

### 4. Frontend - Patient Slice (Redux)

**File:** `frontend/lib/redux/features/patientSlice.ts`

#### Added Patient ID to Patient Interface:

```typescript
export interface Patient {
  _id: string;
  patientId?: string; // NEW
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // ... other fields
}
```

#### Updated API Mapping:

```typescript
const mapApiPatientToPatient = (apiPatient: any): Patient => ({
  _id: apiPatient._id,
  patientId: apiPatient.patientId, // NEW
  // ... other fields
});
```

---

### 5. Frontend - Prescription Slice (Redux)

**File:** `frontend/lib/redux/features/prescriptionSlice.ts`

#### Updated Prescription Type:

```typescript
export interface Prescription {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    patientId?: string; // NEW
    email?: string;
    phone?: string;
  };
  // ... other fields
}
```

---

### 6. Frontend - Patient Management Page

**File:** `frontend/app/(dashboard)/doctors/patients/page.tsx`

#### Updated Patient UI Interface:

```typescript
interface PatientUI {
  id: string;
  patientId?: string; // NEW
  name: string;
  email: string;
  // ... other fields
}
```

#### Updated Patient Mapping:

```typescript
const patients: PatientUI[] = rawPatients.map((patient) => {
  return {
    id: patient._id,
    patientId: patient.patientId, // NEW
    // ... other fields
  };
});
```

#### Updated Search:

```typescript
const matchesSearch =
  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  patient.phone.includes(searchTerm) ||
  (patient.patientId &&
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())) || // NEW
  patient.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
```

#### Updated Patient Table:

```tsx
<TableHead>Patient ID</TableHead>  // NEW

<TableCell>
    <div className="font-mono font-bold text-primary">
        {patient.patientId || "N/A"}
    </div>
</TableCell>  // NEW
```

#### Updated Patient Details Modal:

```tsx
<div>
  <Label htmlFor="editPatientId">Patient ID</Label>
  <Input
    id="editPatientId"
    type="text"
    value={selectedPatient.patientId || ""}
    disabled
    className="bg-muted text-muted-foreground"
  />
  <p className="text-xs text-muted-foreground mt-1">
    Auto-generated and cannot be changed
  </p>
</div>
```

---

### 7. Frontend - Prescription Management Page

**File:** `frontend/app/(dashboard)/doctors/prescriptions/page.tsx`

#### Updated Patient Selection Dropdown:

```tsx
<Select value={patientId} onValueChange={setPatientId}>
  <SelectTrigger>
    <SelectValue placeholder="Choose a patient by ID..." />
  </SelectTrigger>
  <SelectContent className="max-h-60">
    {patients.map((patient) => (
      <SelectItem key={patient._id} value={patient._id}>
        {patient.patientId ? `${patient.patientId} – ` : ""}
        {patient.firstName} {patient.lastName}
        {patient.email ? ` (${patient.email})` : ""}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Display Format:** `PI000123 – John Doe (john@example.com)`

---

## Database Migration for Existing Patients

### Automatic Generation

When the patient list is fetched or a patient is viewed, Patient IDs are automatically generated for patients who don't have one.

**In `patientController.js`:**

```javascript
await Promise.all(
  patients
    .filter((patient) => !patient.patientId)
    .map(async (patient) => {
      patient.markModified("patientId");
      await patient.save();
    }),
);
```

### Manual Migration (Optional)

If you need to backfill all existing patients:

```javascript
// Run this in your database console
db.customers.updateMany({ patientId: { $exists: false } }, [
  {
    $set: {
      patientId: {
        $concat: [
          "PI",
          {
            $substr: [
              {
                $toString: {
                  $toInt: { $substr: [{ $toString: ObjectId() }, 0, 4] },
                },
              },
              0,
              6,
            ],
          },
        ],
      },
    },
  },
]);
```

---

## API Usage Examples

### Creating a Patient

```bash
POST /v1/patients
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1990-01-01"
}
```

**Response includes:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patientId": "PI000123",
    "firstName": "John",
    "lastName": "Doe"
    // ... other fields
  }
}
```

### Creating a Prescription

#### Option 1: Using Patient ID

```bash
POST /v1/prescriptions
{
  "patientId": "PI000123",
  "diagnosis": "Type 2 Diabetes",
  "medications": [...]
}
```

#### Option 2: Using MongoDB ObjectId (Still Supported)

```bash
POST /v1/prescriptions
{
  "patientId": "507f1f77bcf86cd799439011",
  "diagnosis": "Type 2 Diabetes",
  "medications": [...]
}
```

### Searching Prescriptions by Patient ID

```bash
GET /v1/prescriptions?search=PI000123
```

---

## Frontend Features

### Patient Management

- **Table View:** Displays Patient ID prominently in a separate column
- **Search:** Can search patients by Patient ID, name, email, phone, or blood group
- **Patient Details:** Shows read-only Patient ID field with note "Auto-generated and cannot be changed"

### Prescription Management

- **Patient Selection:** Dropdown shows format: `PI000123 – John Doe (john@example.com)`
- **Search:** Can search for prescriptions by Patient ID
- **Export:** CSV export includes Patient ID column

---

## Backward Compatibility

✅ **Fully Backward Compatible**

- Old prescriptions continue to work without modification
- MongoDB ObjectId still accepted when creating prescriptions
- Automatic fallback mechanism in place
- Existing patients automatically assigned Patient IDs

---

## Validation & Constraints

### Patient ID Constraints

- ✅ Unique: No two patients can have the same Patient ID
- ✅ Immutable: Patient IDs cannot be changed after creation
- ✅ Format: Always `PI` + 6 digits (e.g., `PI000000` to `PI999999`)
- ✅ Indexed: Database queries by Patient ID are fast

### Prescription Constraints

- ✅ Required: Prescription cannot be created without a valid Patient ID
- ✅ Validated: System checks if Patient ID exists before creation
- ✅ Searchable: Patient ID is fully searchable in prescription list

---

## Testing Checklist

- [ ] Create a new patient → Verify Patient ID is generated (PI######)
- [ ] View patient list → Patient ID visible in table
- [ ] Search by Patient ID → Returns correct patient
- [ ] Create prescription with Patient ID → Prescription created successfully
- [ ] Create prescription with ObjectId → Falls back and works
- [ ] Search prescriptions by Patient ID → Returns correct prescriptions
- [ ] Export prescriptions → CSV includes Patient ID column
- [ ] Existing patients → Auto-assigned Patient IDs when fetched
- [ ] Patient details modal → Patient ID shown as read-only

---

## Troubleshooting

### Patient ID Not Generating

**Issue:** New patients don't have a Patient ID
**Solution:**

1. Check if `patientId` field exists in database schema
2. Ensure pre-validate hook is running
3. Manually trigger save: `patient.markModified("patientId"); await patient.save();`

### Duplicate Patient IDs

**Issue:** Two patients have the same Patient ID
**Solution:**

1. Add unique index: `db.customers.createIndex({ patientId: 1 }, { unique: true, sparse: true })`
2. Remove duplicates and regenerate

### Prescription Creation Fails

**Issue:** Cannot create prescription with Patient ID
**Solution:**

1. Verify Patient ID format (should be PI######)
2. Check if patient exists: `db.customers.findOne({ patientId: "PI000123" })`
3. Try with MongoDB ObjectId instead

---

## Summary

Patient ID implementation provides:

- ✅ Unique identifier for each patient (PI######)
- ✅ Auto-generated on patient creation
- ✅ Used in prescription selection instead of name/email
- ✅ Searchable in both patient and prescription lists
- ✅ Visible in patient profile and prescription exports
- ✅ Fully backward compatible
- ✅ Automatic migration for existing patients

This replaces the previous name/email-based patient identification with a more reliable and unique identifier system.
