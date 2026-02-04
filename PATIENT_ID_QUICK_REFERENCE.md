# Patient ID Implementation - Quick Reference

## What Changed?

### 📋 Old Way

- Patients identified by: Name + Email
- Prescription selection: "John Doe (john@example.com)"
- Not unique if names are similar

### ✅ New Way

- Patients identified by: Patient ID (PI######)
- Prescription selection: "PI000123 – John Doe (john@example.com)"
- Guaranteed unique identifier

---

## Patient ID Format

```
PI + 6 digits
Examples:
- PI000001
- PI000123
- PI348921
- PI999999
```

---

## Key Features

### 1. Auto-Generation

- Every new patient automatically gets a unique Patient ID
- Happens automatically when patient is created
- Existing patients get one automatically when fetched

### 2. Database Storage

- Field name: `patientId`
- Type: String
- Unique: Yes
- Indexed: Yes (for fast queries)

### 3. Search & Find

- Search by Patient ID in patient list
- Search by Patient ID in prescription list
- Works in the search bar on both pages

### 4. Prescription Creation

- Select patient by Patient ID
- Shows format: `PI000123 – John Doe (john@example.com)`
- Also accepts MongoDB ObjectId for backward compatibility

### 5. Data Export

- CSV exports include Patient ID column
- Easier to identify patients in reports

---

## Files Modified

### Backend

1. **models/customerModel.js** - Added patientId field + auto-generation
2. **controllers/patientController.js** - Search & auto-generation logic
3. **controllers/prescriptionController.js** - Accept Patient ID in prescriptions

### Frontend

1. **app/(dashboard)/doctors/patients/page.tsx** - Display & search Patient ID
2. **app/(dashboard)/doctors/prescriptions/page.tsx** - Select by Patient ID
3. **lib/redux/features/patientSlice.ts** - Patient ID in state
4. **lib/redux/features/prescriptionSlice.ts** - Patient ID in prescriptions

### Documentation

1. **API_DOCUMENTATION_UPDATED.md** - Updated API docs
2. **PATIENT_ID_IMPLEMENTATION_GUIDE.md** - Detailed guide

---

## Testing Quick Steps

### 1. Create a Patient

```
Go to Patients → Add Patient
Fill form and submit
→ Check Patient ID is generated (PI######)
```

### 2. View Patient List

```
Go to Patients
→ New "Patient ID" column visible
→ All patients have a PI number
```

### 3. Search by Patient ID

```
Go to Patients
Type "PI000123" in search
→ Shows only that patient
```

### 4. Create Prescription

```
Go to Prescriptions → Create New
→ Patient dropdown shows: "PI000123 – John Doe (john@example.com)"
Select patient and submit
→ Prescription created successfully
```

### 5. Search Prescriptions

```
Go to Prescriptions
Type "PI000123" in search
→ Shows prescriptions for that patient
```

---

## API Endpoints

### Creating Prescription with Patient ID

```
POST /v1/prescriptions
{
  "patientId": "PI000123",
  "diagnosis": "Type 2 Diabetes",
  "medications": [...]
}
```

### Searching Prescriptions

```
GET /v1/prescriptions?search=PI000123
GET /v1/prescriptions?search=Diabetes
```

### Getting Patient List

```
GET /v1/patients?search=PI000123
GET /v1/patients
```

---

## Important Notes

✅ **Unique** - No two patients can have the same Patient ID
✅ **Immutable** - Cannot be changed after creation
✅ **Auto-Generated** - No manual entry needed
✅ **Backward Compatible** - Old code still works
✅ **Searchable** - Find patients/prescriptions by ID
✅ **Indexed** - Fast database queries

---

## If Something Goes Wrong

### Patient ID Not Showing

1. Refresh the page
2. Log out and log back in
3. Check browser console for errors

### Cannot Create Prescription

1. Make sure patient is selected
2. Check if Patient ID exists
3. Try refreshing patient dropdown

### Patient ID Not Generating

1. Check database connection
2. Run: `db.customers.createIndex({ patientId: 1 }, { unique: true, sparse: true })`
3. Restart backend server

---

## Code Examples

### Frontend - Select Patient

```tsx
{
  patients.map((patient) => (
    <SelectItem key={patient._id} value={patient._id}>
      {patient.patientId ? `${patient.patientId} – ` : ""}
      {patient.firstName} {patient.lastName}
    </SelectItem>
  ));
}
```

### Backend - Accept Patient ID

```javascript
let patient = null;
if (isId(patientId)) {
  // Try MongoDB ObjectId
  patient = await Customer.findById(patientId);
} else {
  // Try Patient ID (PI######)
  patient = await Customer.findOne({ patientId });
}
```

### Frontend - Display in List

```tsx
<TableCell>
  <div className="font-mono font-bold text-primary">
    {patient.patientId || "N/A"}
  </div>
</TableCell>
```

---

## Summary Checklist

- ✅ Patient ID field added to database
- ✅ Auto-generation on patient creation
- ✅ Backward compatible with ObjectId
- ✅ Searchable in patient and prescription lists
- ✅ Displayed in patient table
- ✅ Used in prescription selection
- ✅ Included in exports
- ✅ Shows in patient details
- ✅ All existing patients auto-assigned IDs
- ✅ API documentation updated

---

## Questions?

- **Patient ID format:** PI + 6 random digits
- **How it's assigned:** Automatically on patient creation
- **Can it be changed:** No, immutable
- **Can two patients have same ID:** No, unique constraint
- **How to find by Patient ID:** Use search bar or API query parameter
