#!/usr/bin/env python3
"""
Test script to verify profile functionality
"""

import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_profile_functionality():
    """Test the profile functionality end-to-end"""
    
    print("🧪 Testing Profile Functionality")
    print("=" * 50)
    
    # Step 1: Register a test user
    print("\n1. Registering test user...")
    register_data = {
        "firstName": "Jane",
        "lastName": "Smith", 
        "email": "jane.smith@example.com",
        "phone": "+1 (555) 987-6543",
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
        "email": "jane.smith@example.com",
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
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com", 
        "phone": "+1 (555) 987-6543",
        "company": "Corporate Solutions Inc.",
        "addresses": [
            {
                "id": "1",
                "type": "billing",
                "name": "Jane Smith",
                "address": "123 Business Street",
                "city": "Corporate City",
                "state": "CC",
                "zip": "12345",
                "country": "US",
                "isDefault": True
            },
            {
                "id": "2", 
                "type": "shipping",
                "name": "Jane Smith",
                "address": "456 Office Avenue",
                "city": "Business Town",
                "state": "BT",
                "zip": "67890",
                "country": "US",
                "isDefault": False
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
    
    # Step 5: Verify updated profile
    print("\n5. Verifying updated profile...")
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        if response.status_code == 200:
            print("✅ Updated profile verified successfully")
            profile_data = response.json()
            print(f"   Company: {profile_data.get('company', 'Not set')}")
            addresses = profile_data.get('addresses', [])
            print(f"   Addresses: {len(addresses)} addresses")
            for addr in addresses:
                print(f"     - {addr['type']}: {addr['address']}, {addr['city']} ({addr['zip']})")
        else:
            print(f"❌ Failed to verify updated profile: {response.text}")
    except Exception as e:
        print(f"❌ Profile verification error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Profile functionality test completed!")
    print("\nYou can now:")
    print("1. Login with: jane.smith@example.com / TestPassword123!")
    print("2. Navigate to /profile to see the My Account page")
    print("3. Test profile editing, address management, etc.")

if __name__ == "__main__":
    test_profile_functionality()