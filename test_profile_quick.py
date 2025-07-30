#!/usr/bin/env python3
"""
Quick test script to verify profile functionality
"""

import requests
import json
import random
import string

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def generate_unique_email():
    """Generate a unique email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser{random_string}@example.com"

def test_profile_functionality():
    """Test the profile functionality end-to-end"""
    
    print("🧪 Testing Profile Functionality")
    print("=" * 50)
    
    # Generate unique email
    test_email = generate_unique_email()
    print(f"Using test email: {test_email}")
    
    # Step 1: Register a test user
    print("\n1. Registering test user...")
    register_data = {
        "firstName": "Test",
        "lastName": "User", 
        "email": test_email,
        "phone": "+1 (555) 123-4567",
        "password": "TestPassword123!",
        "confirmPassword": "TestPassword123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        if response.status_code == 201:
            print("✅ User registered successfully")
            user_data = response.json()
            print(f"   User ID: {user_data['user']['id']}")
        else:
            print(f"❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # Step 2: Verify OTP (using any 6-digit number since it's bypassed)
    print("\n2. Verifying OTP...")
    otp_data = {
        "email": test_email,
        "otp": "123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/verify-otp/", json=otp_data)
        if response.status_code == 200:
            print("✅ OTP verified successfully")
            auth_data = response.json()
            access_token = auth_data['tokens']['access']
            print(f"   Access token received")
        else:
            print(f"❌ OTP verification failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ OTP verification error: {e}")
        return
    
    # Step 3: Get profile data
    print("\n3. Getting profile data...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        if response.status_code == 200:
            print("✅ Profile data retrieved successfully")
            profile_data = response.json()
            print(f"   Name: {profile_data['firstName']} {profile_data['lastName']}")
            print(f"   Email: {profile_data['email']}")
            print(f"   Phone: {profile_data['phone']}")
            print(f"   Company: {profile_data.get('company', 'Not set')}")
            print(f"   Addresses: {len(profile_data.get('addresses', []))} addresses")
        else:
            print(f"❌ Failed to get profile: {response.text}")
            return
    except Exception as e:
        print(f"❌ Profile retrieval error: {e}")
        return
    
    # Step 4: Update profile with company and address
    print("\n4. Updating profile...")
    update_data = {
        "firstName": "Test",
        "lastName": "User",
        "email": test_email, 
        "phone": "+1 (555) 123-4567",
        "company": "Corporate Solutions Inc.",
        "addresses": [
            {
                "id": "1",
                "type": "billing",
                "name": "Test User",
                "address": "123 Business Street",
                "city": "Corporate City",
                "state": "CC",
                "zip": "12345",
                "country": "US",
                "isDefault": True
            }
        ]
    }
    
    try:
        response = requests.put(f"{BASE_URL}/auth/profile/", json=update_data, headers=headers)
        if response.status_code == 200:
            print("✅ Profile updated successfully")
            updated_profile = response.json()
            print(f"   Company: {updated_profile.get('company', 'Not set')}")
            print(f"   Addresses: {len(updated_profile.get('addresses', []))} addresses")
        else:
            print(f"❌ Failed to update profile: {response.text}")
            return
    except Exception as e:
        print(f"❌ Profile update error: {e}")
        return
    
    print("\n" + "=" * 50)
    print("🎉 Profile functionality test completed!")
    print(f"\nYou can now login with: {test_email} / TestPassword123!")
    print("Navigate to /profile to see the My Account page")

if __name__ == "__main__":
    test_profile_functionality()