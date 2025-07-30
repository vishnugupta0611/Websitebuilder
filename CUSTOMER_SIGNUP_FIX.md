# Customer Signup Fix

## Issue Description
Customer signup was failing on subsites with a 400 Bad Request error. The signup endpoint was returning errors and users couldn't register on subsites, while login was working fine.

## Root Cause Analysis
The issue was a **data structure mismatch** between frontend and backend:

### Frontend Data Structure (from GetStarted.jsx):
```javascript
const userData = {
  email: signupData.email,
  password: signupData.password,
  confirmPassword: signupData.confirmPassword,
  firstName: signupData.firstName,
  lastName: signupData.lastName,
  phone: signupData.phone
}
```

### Backend Expected Structure (original):
```python
email = request.data.get('email')
password = request.data.get('password')
name = request.data.get('name')  # ❌ Expected 'name' but got 'firstName'/'lastName'
website_slug = request.data.get('website_slug')
```

## Solution Implemented

### 1. Updated Backend Data Handling
**File**: `Websitebuilderbackend/builderbackend/builderapi/views.py`

**Before**:
```python
def customer_signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    website_slug = request.data.get('website_slug')
    
    if not all([email, password, name, website_slug]):
        return Response({'error': 'All fields are required'}, status=400)
```

**After**:
```python
def customer_signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirmPassword')
    first_name = request.data.get('firstName', '')
    last_name = request.data.get('lastName', '')
    phone = request.data.get('phone', '')
    website_slug = request.data.get('website_slug')
    
    # Handle both name formats (legacy and new)
    name = request.data.get('name')
    if not name and (first_name or last_name):
        name = f"{first_name} {last_name}".strip()
    
    if not all([email, password, website_slug]):
        return Response({'error': 'Email, password, and website are required'}, status=400)
    
    # Validate password confirmation if provided
    if confirm_password and password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=400)
```

### 2. Enhanced User Creation
**Before**:
```python
user = User.objects.create_user(
    username=email,
    email=email,
    password=password,
    firstName=first_name,
    lastName=last_name,
    isVerified=False
)
```

**After**:
```python
user = User.objects.create_user(
    username=email,
    email=email,
    password=password,
    firstName=first_name,
    lastName=last_name,
    phone=phone,  # ✅ Added phone field support
    isVerified=False
)
```

### 3. Backward Compatibility
The fix maintains backward compatibility by supporting both data formats:
- **New format**: `firstName` + `lastName` (from subsite signup)
- **Legacy format**: `name` (if needed for other parts of the system)

## Features Added

### ✅ Password Confirmation Validation
```python
if confirm_password and password != confirm_password:
    return Response({
        'success': False,
        'error': 'Passwords do not match'
    }, status=status.HTTP_400_BAD_REQUEST)
```

### ✅ Phone Number Support
- Phone field is now properly saved during signup
- Optional field (blank=True in User model)

### ✅ Improved Error Handling
- More specific error messages
- Better validation of required fields
- Proper HTTP status codes

## Corporate Portal Integration

### Automatic Registration
When a customer signs up on a subsite, they are automatically registered in the corporate portal because:

1. **Shared User Model**: Both subsite and corporate portal use the same `User` model
2. **Single Database**: All users are stored in the same database table
3. **Unified Authentication**: Same authentication system across all platforms

### User Access After Signup
After signing up on a subsite, users can:
- ✅ Login to the subsite where they registered
- ✅ Login to the corporate portal with the same credentials
- ✅ Access all corporate portal features
- ✅ Manage their profile across both platforms

## Testing Results

### ✅ Successful Signup Test
```bash
Status Code: 201
✅ Signup successful!
   Success: True
   Message: Account created successfully. Please check your email for verification code.
   User ID: 32
   User Email: john.doe.test@example.com
   User Name: John Doe
   Requires Verification: True
```

### ✅ Password Mismatch Validation
```bash
Status Code: 400
✅ Password mismatch validation working!
   Error: Passwords do not match
```

## Data Flow

1. **User fills signup form** on subsite (e.g., `/wwe/getstarted`)
2. **Frontend sends data** with `firstName`, `lastName`, `email`, `password`, `confirmPassword`, `phone`
3. **Backend processes data** and creates user in shared User table
4. **OTP email sent** for verification
5. **User verifies OTP** and account is activated
6. **User can now login** to both subsite and corporate portal

## Files Modified

1. **Backend**: `Websitebuilderbackend/builderbackend/builderapi/views.py`
   - Updated `customer_signup` function
   - Added field validation and processing
   - Enhanced error handling

2. **Testing**: `Websitebuilder/test_customer_signup_fix.py`
   - Comprehensive test suite
   - Validation testing
   - Error scenario testing

## Result

✅ **Customer signup now works on all subsites**
✅ **Users are automatically registered in corporate portal**
✅ **Password validation works correctly**
✅ **Phone numbers are properly saved**
✅ **Backward compatibility maintained**
✅ **Proper error messages displayed**

Customers can now successfully sign up on any subsite and immediately have access to both the subsite and the corporate portal with the same credentials.