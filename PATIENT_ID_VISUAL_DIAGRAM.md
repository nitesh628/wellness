# Patient ID System - Visual Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WELLNESS APPLICATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    FRONTEND (React/Next.js)                    │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │                                                                │ │
│  │  ┌──────────────────────┐    ┌──────────────────────┐        │ │
│  │  │  Patients Page       │    │ Prescriptions Page   │        │ │
│  │  ├──────────────────────┤    ├──────────────────────┤        │ │
│  │  │ • Patient List       │    │ • Create Prescription│        │ │
│  │  │ • Patient ID Column  │    │ • Patient Selector   │        │ │
│  │  │ • Search (incl ID)   │    │ • Search (incl ID)   │        │ │
│  │  │ • Patient Details    │    │ • Prescription List  │        │ │
│  │  │ • Edit/Delete        │    │ • Export (incl ID)   │        │ │
│  │  └──────────────────────┘    └──────────────────────┘        │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────┐            │ │
│  │  │      Redux State Management                  │            │ │
│  │  ├──────────────────────────────────────────────┤            │ │
│  │  │ Patient Interface:                           │            │ │
│  │  │  - _id: string                              │            │ │
│  │  │  - patientId?: string  (PI######)           │            │ │
│  │  │  - firstName: string                        │            │ │
│  │  │  - lastName: string                         │            │ │
│  │  │  - email: string                            │            │ │
│  │  │  - ... other fields                         │            │ │
│  │  └──────────────────────────────────────────────┘            │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│                           ↕ HTTP/REST API                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                   BACKEND (Node.js/Express)                   │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │                                                                │ │
│  │  ┌──────────────────────┐    ┌──────────────────────┐        │ │
│  │  │  Patient Controller  │    │ Prescription Control │        │ │
│  │  ├──────────────────────┤    ├──────────────────────┤        │ │
│  │  │ • getPatients()      │    │ • createPrescription │        │ │
│  │  │ • getPatientById()   │    │   (Accept ID or ObjId)      │ │
│  │  │ • createPatient()    │    │ • getPrescriptions() │        │ │
│  │  │ • updatePatient()    │    │ • searchPrescription │        │ │
│  │  │ • deletePatient()    │    │ • exportPrescription │        │ │
│  │  │                      │    │ (incl patientId)    │        │ │
│  │  │ Search includes:     │    │                     │        │ │
│  │  │ • name, email, phone │    │ Search includes:     │        │ │
│  │  │ • bloodGroup         │    │ • patientId (NEW)   │        │ │
│  │  │ • patientId (NEW)    │    │ • name, email       │        │ │
│  │  └──────────────────────┘    └──────────────────────┘        │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────┐            │ │
│  │  │        Patient ID Generation                 │            │ │
│  │  ├──────────────────────────────────────────────┤            │ │
│  │  │ Pre-Validate Hook:                          │            │ │
│  │  │ 1. Check if patientId exists               │            │ │
│  │  │ 2. Generate random 6-digit number          │            │ │
│  │  │ 3. Create format: PI + digits              │            │ │
│  │  │ 4. Check uniqueness in DB                  │            │ │
│  │  │ 5. Assign to patient                       │            │ │
│  │  │ 6. Save to database                        │            │ │
│  │  └──────────────────────────────────────────────┘            │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│                           ↕ MongoDB Driver                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    DATABASE (MongoDB)                         │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────┐            │ │
│  │  │         Customer Collection                  │            │ │
│  │  ├──────────────────────────────────────────────┤            │ │
│  │  │ {                                            │            │ │
│  │  │   "_id": ObjectId("507f..."),               │            │ │
│  │  │   "patientId": "PI000123",    ← Index: YES  │            │ │
│  │  │   "firstName": "John",                      │            │ │
│  │  │   "lastName": "Doe",                        │            │ │
│  │  │   "email": "john@example.com",              │            │ │
│  │  │   "phone": "9876543210",                    │            │ │
│  │  │   "bloodGroup": "O+",                       │            │ │
│  │  │   ... other fields                          │            │ │
│  │  │ }                                            │            │ │
│  │  │                                              │            │ │
│  │  │ Indexes:                                     │            │ │
│  │  │ • patientId: unique, sparse                 │            │ │
│  │  │ • email: unique                             │            │ │
│  │  │ • phone: unique                             │            │ │
│  │  └──────────────────────────────────────────────┘            │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────┐            │ │
│  │  │      Prescription Collection                 │            │ │
│  │  ├──────────────────────────────────────────────┤            │ │
│  │  │ {                                            │            │ │
│  │  │   "_id": ObjectId("507g..."),               │            │ │
│  │  │   "patient": ObjectId("507f..."),           │            │ │
│  │  │   "doctor": ObjectId("507h..."),            │            │ │
│  │  │   "diagnosis": "Type 2 Diabetes",           │            │ │
│  │  │   "medications": [...],                     │            │ │
│  │  │   "prescriptionDate": "2026-02-04",         │            │ │
│  │  │   "status": "active"                        │            │ │
│  │  │ }                                            │            │ │
│  │  │                                              │            │ │
│  │  │ Note: References patient by _id, patientId  │            │ │
│  │  │ retrieved via populate() with patientId     │            │ │
│  │  └──────────────────────────────────────────────┘            │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Patient Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ USER CREATES NEW PATIENT                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend sends POST request with patient data                   │
│ {firstName, lastName, email, phone, dateOfBirth, ...}           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend receives request                                         │
│ patientController.createPatient()                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Create patient object in memory                                 │
│ {firstName: "John", lastName: "Doe", email: "...", ...}         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Save to database: Customer.create(patientData)                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Pre-Validate Hook Triggers: CustomerSchema.pre("validate")      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ PATIENT ID GENERATION ALGORITHM                             ││
│ ├──────────────────────────────────────────────────────────────┤│
│ │ 1. Check if patient already has patientId                   ││
│ │    → If YES: Skip generation                                ││
│ │    → If NO: Continue to step 2                              ││
│ │                                                              ││
│ │ 2. Loop until unique ID is found:                           ││
│ │    a. Generate random number: 0-999999                      ││
│ │    b. Pad with zeros: "000123"                              ││
│ │    c. Prefix with PI: "PI000123"                            ││
│ │    d. Check if exists in DB: .exists({patientId})           ││
│ │    e. If found: continue loop (try different number)        ││
│ │    f. If not found: break loop (unique found)               ││
│ │                                                              ││
│ │ 3. Assign to patient object: this.patientId = "PI000123"   ││
│ │                                                              ││
│ │ 4. Continue to next pre-hook (password hashing)             ││
│ └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Pre-Save Hook Triggers: CustomerSchema.pre("save")              │
│ Hash password if provided                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Patient saved to MongoDB with patientId                         │
│ {                                                               │
│   _id: ObjectId("507f..."),                                     │
│   patientId: "PI000123",  ← AUTO-GENERATED                      │
│   firstName: "John",                                            │
│   lastName: "Doe",                                              │
│   ... other fields                                              │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend returns response to frontend                            │
│ {success: true, data: {patientId: "PI000123", ...}}             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend displays success                                       │
│ Patient ID is visible: "PI000123"                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prescription Creation with Patient ID

```
┌────────────────────────────────────────────────────────────────────────┐
│ DOCTOR CREATES PRESCRIPTION                                            │
│ 1. Selects patient from dropdown                                       │
│    Format: "PI000123 – John Doe (john@example.com)"                    │
│ 2. Fills in diagnosis and medications                                  │
│ 3. Submits form                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Frontend sends POST /v1/prescriptions                                  │
│ {                                                                      │
│   patientId: "507f1f77bcf86cd799439011",  ← MongoDB _id               │
│   diagnosis: "Type 2 Diabetes",                                        │
│   medications: [...],                                                  │
│   ...                                                                  │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Backend: prescriptionController.createPrescription()                   │
│ Extract patientId from request body                                    │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ PATIENT ID LOOKUP LOGIC                                            ││
│ ├──────────────────────────────────────────────────────────────────────┤│
│ │ IF patientId is MongoDB ObjectId:                                  ││
│ │   1. Try: Customer.findById(patientId)                             ││
│ │   2. If found: Use this patient                                    ││
│ │   3. If not found: Try User.findById(patientId)                    ││
│ │                                                                      ││
│ │ ELSE patientId is Patient ID (PI######):                           ││
│ │   1. Query: Customer.findOne({patientId})                          ││
│ │   2. If found: Use this patient                                    ││
│ │   3. If not found: Return error                                    ││
│ │                                                                      ││
│ │ IF patient found:                                                   ││
│ │   • Extract: firstName, lastName, patientId                        ││
│ │   • Use: patient._id for prescription.patient                      ││
│ │                                                                      ││
│ │ IF patient not found:                                               ││
│ │   • Return 404 error: "Patient not found"                          ││
│ └──────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Create prescription object:                                            │
│ {                                                                      │
│   doctor: req.user._id,                                                │
│   patient: patient._id,      ← MongoDB _id                             │
│   patientName: "John Doe",                                             │
│   diagnosis: "Type 2 Diabetes",                                        │
│   medications: [...],                                                  │
│   ...                                                                  │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Save prescription to database                                          │
│ Populate patient with patientId included                               │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Return response with patient details including patientId               │
│ {                                                                      │
│   success: true,                                                       │
│   data: {                                                              │
│     _id: "prescription_id",                                            │
│     patient: {                                                         │
│       _id: "507f...",                                                  │
│       firstName: "John",                                               │
│       lastName: "Doe",                                                 │
│       patientId: "PI000123"  ← VISIBLE HERE                            │
│     },                                                                 │
│     diagnosis: "Type 2 Diabetes",                                      │
│     ...                                                                │
│   }                                                                    │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ Frontend updates prescription list with patientId                      │
│ Table row shows: "PI000123 | John Doe | Type 2 Diabetes"               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Search Flow

```
┌──────────────────────────────────┐
│ USER SEARCHES: "PI000123"         │
└──────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
┌─────────────┐    ┌──────────────┐
│ Patients    │    │ Prescriptions│
│ Search Page │    │ Search Page  │
└─────────────┘    └──────────────┘
    ↓                   ↓
┌─────────────────────────────────────────────┐
│ Backend Query:                              │
│                                             │
│ For Patients:                               │
│ filter.$or = [                              │
│   {firstName: /PI000123/i},                 │
│   {lastName: /PI000123/i},                  │
│   {email: /PI000123/i},                     │
│   {phone: /PI000123/i},                     │
│   {bloodGroup: /PI000123/i},                │
│   {patientId: /PI000123/i}  ← NEW           │
│ ]                                           │
│                                             │
│ For Prescriptions:                          │
│ $or = [                                     │
│   {'patientInfo.firstName': /PI000123/i},   │
│   {'patientInfo.lastName': /PI000123/i},    │
│   {'patientInfo.email': /PI000123/i},       │
│   {'patientInfo.patientId': /PI000123/i},   │
│   {diagnosis: /PI000123/i}                  │
│ ]                                           │
└─────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ MongoDB matches records with query           │
│ Uses index on patientId for fast lookup      │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ Return filtered results to frontend          │
│ - Patient with ID PI000123                   │
│ - All prescriptions for that patient         │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ Frontend displays results                    │
│ Single patient or multiple prescriptions     │
└──────────────────────────────────────────────┘
```

---

## Patient Selection in Prescription Form

```
┌────────────────────────────────────────────┐
│ PRESCRIPTION CREATION FORM                  │
│ ┌──────────────────────────────────────────┐│
│ │ Select Patient Dropdown                  ││
│ │ Placeholder: "Choose a patient by ID..." ││
│ └──────────────────────────────────────────┘│
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────────────────────┐
│ User clicks dropdown → Fetches patients list from Redux   │
│ {                                                          │
│   patients: [                                              │
│     {                                                      │
│       _id: "507f1f77bcf86cd799439011",                     │
│       patientId: "PI000123",                               │
│       firstName: "John",                                   │
│       lastName: "Doe",                                     │
│       email: "john@example.com"                            │
│     },                                                     │
│     {                                                      │
│       _id: "507f1f77bcf86cd799439012",                     │
│       patientId: "PI000124",                               │
│       firstName: "Jane",                                   │
│       lastName: "Smith",                                   │
│       email: "jane@example.com"                            │
│     }                                                      │
│   ]                                                        │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────────────────────┐
│ Frontend renders dropdown options:                         │
│                                                            │
│ {patients.map((patient) => (                               │
│   <SelectItem value={patient._id}>                         │
│     {patient.patientId} – {patient.firstName} {lastName}   │
│     ({patient.email})                                      │
│   </SelectItem>                                            │
│ ))}                                                        │
└────────────────────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────────────────────┐
│ Dropdown displays options:                                 │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ✓ PI000123 – John Doe (john@example.com)                ││
│ │   PI000124 – Jane Smith (jane@example.com)               ││
│ │   PI000125 – Bob Johnson (bob@example.com)               ││
│ │   PI000126 – Alice Williams (alice@example.com)          ││
│ └──────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────────────────────┐
│ User selects: "PI000123 – John Doe (john@example.com)"     │
│ patientId state = "507f1f77bcf86cd799439011"  (MongoDB _id)│
└────────────────────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────────────────────┐
│ Form submission sends MongoDB _id to backend               │
│ patientController identifies patient by either:           │
│ 1. Patient ID (if not valid MongoDB _id)                  │
│ 2. MongoDB ObjectId (if valid)                            │
└────────────────────────────────────────────────────────────┘
```

---

## Key Components Summary

| Component              | File                         | Changes                                        |
| ---------------------- | ---------------------------- | ---------------------------------------------- |
| **Database**           | customerModel.js             | Added patientId field with pre-validate hook   |
| **Patient API**        | patientController.js         | Search & auto-generation for existing patients |
| **Prescription API**   | prescriptionController.js    | Accept Patient ID, search by ID, export ID     |
| **Patient State**      | patientSlice.ts              | Added patientId to Patient interface           |
| **Prescription State** | prescriptionSlice.ts         | Added patientId to patient object              |
| **Patient UI**         | patients/page.tsx            | Display ID column, show in details, search     |
| **Prescription UI**    | prescriptions/page.tsx       | Updated dropdown format                        |
| **API Docs**           | API_DOCUMENTATION_UPDATED.md | Updated endpoints                              |

---

## Data Flow Example

```
Create Patient: John Doe
        ↓
┌───────────────────────────┐
│ DB saves patient with:    │
│ patientId: "PI000123"     │
│ _id: "507f..."            │
└───────────────────────────┘
        ↓
Redux stores:
{
  _id: "507f...",
  patientId: "PI000123",
  firstName: "John",
  lastName: "Doe"
}
        ↓
Dropdown shows:
"PI000123 – John Doe"
        ↓
Doctor selects patient
        ↓
API receives: patientId: "507f..."
        ↓
Backend creates prescription with:
patient: "507f...",
patientName: "John Doe"
        ↓
Response includes:
patient: {
  _id: "507f...",
  firstName: "John",
  patientId: "PI000123"
}
        ↓
Frontend displays in table:
"PI000123 | John Doe | Type 2 Diabetes"
```

This visual guide helps understand the complete flow of Patient ID from creation to prescription management.
