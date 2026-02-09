# Unified User Model Migration Guide

## 🎯 Overview

This project has been refactored to use a **single unified User collection** with role-based differentiation instead of separate Admin, Doctor, Influencer, and Customer collections.

## ✅ Benefits

1. **Guaranteed Uniqueness**: Email and phone are unique across ALL user types
2. **Simplified Authentication**: One login system for all roles
3. **Consistent References**: All relationships use `ref: 'User'`
4. **Less Code Duplication**: Single authentication logic and validation
5. **Better Performance**: Single collection queries vs multiple fallback searches

## 📋 What Changed

### Schema Changes

**Before:**

- Separate collections: `admins`, `doctors`, `influencers`, `customers`
- Each with their own models: `adminModel.js`, `doctorModel.js`, etc.
- Role field was inconsistent or inside each collection

**After:**

- Single collection: `users`
- Single model: `userModel.js`
- Role field: `["Admin", "Doctor", "Influencer", "Customer"]`
- Role-specific fields with conditional requirements

### Field Mapping

All unique fields from separate models have been consolidated:

#### Admin-specific:

- `adminRole`: super_admin | admin | moderator
- `permissions`: Array of permission strings

#### Customer-specific:

- `patientId`: Auto-generated (format: PI123456)
- `age`, `bloodGroup`, `maritalStatus`
- `medicalHistory`, `currentMedications`, `allergies`
- `emergencyContact`, `insuranceProvider`

#### Doctor-specific:

- `licenseNumber`, `bio`, `emergencyFee`
- `hospital`, `experience`, `consultationFee`
- `specialization`, `qualifications`
- Clinic fields: `clinicName`, `clinicAddress`, `clinicPhone`, `clinicEmail`
- `operatingHours`, `appointmentDuration`, `maxPatientsPerDay`

#### Influencer-specific:

- `platform`, `followers`, `engagementRate`
- `collaborationRate`, `sponsoredPostRate`
- `brandName`, `businessAddress`, `businessPhone`

#### Shared Security Fields:

- `twoFactorEnabled`, `loginAlerts`
- `sessionTimeout`, `passwordExpiry`
- `ipWhitelist`, `auditLogs`, `dataEncryption`

## 🚀 Migration Steps

### 1. Backup Your Database

```bash
mongodump --uri="mongodb://localhost:27017/wellness" --out=./backup
```

### 2. Run Migration Script

```bash
cd backend
node migrateToUnifiedUser.js
```

The script will:

- ✅ Migrate all users from separate collections
- ✅ Preserve all data and ObjectIds
- ✅ Skip duplicates (based on email)
- ✅ Provide detailed migration report

### 3. Verify Migration

Check the User collection:

```javascript
// In MongoDB shell or Compass
use wellness
db.users.countDocuments()
db.users.find({ role: "Admin" })
db.users.find({ role: "Doctor" })
db.users.find({ role: "Influencer" })
db.users.find({ role: "Customer" })
```

### 4. Test Authentication

Test login/signup for each role:

- Admin login
- Doctor login
- Influencer login
- Customer signup

### 5. Clean Up (Optional)

Once verified, drop old collections:

```javascript
db.admins.drop();
db.doctors.drop();
db.influencers.drop();
db.customers.drop();
```

## 🔧 Code Changes

### Controllers Updated

All controllers now use the unified `User` model:

- ✅ `authController.js` - Signup/Login
- ✅ `patientController.js`
- ✅ `doctorUserController.js`
- ✅ `doctorSettingsController.js`
- ✅ `influencerController.js`
- ✅ `influencerSettingsController.js`
- ✅ `influencerReferralController.js`
- ✅ `influencerReportController.js`
- ✅ `prescriptionController.js`
- ✅ `appointmentController.js`

### Middleware Updated

- ✅ `isLogin.js` - Now searches only in User collection

### Usage Examples

#### Creating a new user:

```javascript
// Signup - automatically assigns role
const user = await User.create({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "secure123",
  phone: "1234567890",
  role: "Doctor", // or "Admin", "Influencer", "Customer"
  // Role-specific fields...
});
```

#### Querying by role:

```javascript
// Find all doctors
const doctors = await User.find({ role: "Doctor" });

// Find specific customer with patientId
const patient = await User.findOne({
  role: "Customer",
  patientId: "PI123456",
});

// Find admins only
const admins = await User.find({ role: "Admin" });
```

#### Conditional fields:

```javascript
// dateOfBirth is required only for Customers
// adminRole is required only for Admins
// patientId auto-generates for Customers during validation
```

## ⚠️ Important Notes

### Uniqueness Constraints

- `email`: Unique across ALL users
- `phone`: Unique across ALL users
- `patientId`: Unique, auto-generated for Customers
- `referralCode`: Unique, sparse (optional)

### Password Hashing

Passwords are automatically hashed on save using bcrypt (10 rounds).

### PatientId Auto-Generation

For users with `role: "Customer"`, a patientId is automatically generated on validation in format `PI123456` if not provided.

### Backward Compatibility

The migration preserves all ObjectIds, so existing references (orders, appointments, prescriptions, etc.) will continue to work without changes.

## 🧪 Testing Checklist

- [ ] Admin login works
- [ ] Doctor login works
- [ ] Influencer login works
- [ ] Customer signup works
- [ ] No duplicate emails possible
- [ ] Role-specific features work (prescriptions, referrals, etc.)
- [ ] Session management works
- [ ] Password reset works
- [ ] Profile updates work for all roles

## 📞 Troubleshooting

### Issue: "Email already exists"

**Problem**: User with that email already in User collection
**Solution**: This is expected behavior - email must be unique across all roles

### Issue: "User not found" after migration

**Problem**: References still pointing to old collections
**Solution**: Verify migration completed and old ObjectIds preserved

### Issue: PatientId not generating

**Problem**: Role not set to "Customer" or patientId already exists
**Solution**: Ensure `role: "Customer"` is set before save

## 🔄 Rollback Plan

If you need to rollback:

1. Restore from backup:

```bash
mongorestore --uri="mongodb://localhost:27017/wellness" --drop ./backup
```

2. Revert code changes:

```bash
git revert <commit-hash>
```

## 📚 Additional Resources

- MongoDB Schema Design Best Practices
- Role-Based Access Control (RBAC) patterns
- Data Migration Strategies

## ✨ Next Steps

1. Update frontend to work with unified User model
2. Implement role-based access control middleware
3. Add comprehensive logging for user actions
4. Consider adding user activity tracking

---

**Migration Date**: ${new Date().toISOString()}
**Version**: 2.0.0
