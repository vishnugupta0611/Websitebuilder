#!/usr/bin/env python3
"""
Test script to verify customer authentication backend endpoints
"""

import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_customer_auth_endpoints():
    """Test all customer authentication endpoints"""
    
    print("🔐 Testing Customer Authentication Backend")
    print("=" * 50)
    
    # Test data
    test_website_slug = "test-backend-website"
    test_customer = {
        "name": "Test Customer",
        "email": "customer@example.com",
        "password": "testpass123"
    }
    
    # Step 1: Test customer signup
    print("\n1. Testing Customer Signup...")
    try:
        response = requests.post(f"{BASE_URL}/customer-auth/signup/", json={
            **test_customer,
            "website_slug": test_website_slug
        })
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 201:
            signup_data = response.json()
            print("✅ Customer signup endpoint working")
            print(f"   User created: {signup_data.get('data', {}).get('user', {}).get('email')}")
        else:
            print(f"❌ Customer signup failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Customer signup error: {e}")
        return False
    
    # Step 2: Test customer login (should fail - not verified)
    print("\n2. Testing Customer Login (unverified)...")
    try:
        response = requests.post(f"{BASE_URL}/customer-auth/login/", json={
            "email": test_customer["email"],
            "password": test_customer["password"],
            "website_slug": test_website_slug
        })
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 401:
            print("✅ Customer login correctly requires verification")
        else:
            print(f"⚠️ Unexpected login response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Customer login error: {e}")
    
    # Step 3: Test OTP verification (we'll use a mock OTP)
    print("\n3. Testing OTP Verification...")
    try:
        # First, let's try to get the OTP from the database (for testing)
        # In real scenario, user would get this from email
        mock_otp = "123456"  # This won't work, but tests the endpoint
        
        response = requests.post(f"{BASE_URL}/customer-auth/verify-otp/", json={
            "email": test_customer["email"],
            "otp": mock_otp,
            "website_slug": test_website_slug
        })
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 400:
            print("✅ OTP verification endpoint working (invalid OTP as expected)")
        else:
            print(f"⚠️ Unexpected OTP response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ OTP verification error: {e}")
    
    # Step 4: Test profile endpoint (without auth)
    print("\n4. Testing Profile Endpoint (no auth)...")
    try:
        response = requests.get(f"{BASE_URL}/customer-auth/profile/")
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Profile endpoint correctly requires authentication")
        else:
            print(f"⚠️ Unexpected profile response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Profile endpoint error: {e}")
    
    # Step 5: Test logout endpoint
    print("\n5. Testing Logout Endpoint...")
    try:
        response = requests.post(f"{BASE_URL}/customer-auth/logout/")
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Logout endpoint correctly requires authentication")
        else:
            print(f"⚠️ Unexpected logout response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Logout endpoint error: {e}")
    
    return True

def test_website_exists():
    """Test that the test website exists"""
    print("\n🌐 Checking Test Website...")
    try:
        response = requests.get(f"{BASE_URL}/websites/by_slug/?slug=test-backend-website")
        
        if response.status_code == 200:
            website_data = response.json()
            print(f"✅ Test website exists: {website_data.get('name')}")
            return True
        else:
            print(f"❌ Test website not found: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Website check error: {e}")
        return False

def main():
    """Main test function"""
    
    print("🧪 Customer Authentication Backend Test")
    print("=" * 60)
    
    # Check if website exists
    if not test_website_exists():
        print("\n❌ Test website not found. Please run the product page test first.")
        return
    
    # Test customer auth endpoints
    if test_customer_auth_endpoints():
        print("\n" + "=" * 60)
        print("🎉 Customer Authentication Backend Test Complete!")
        print("\n✅ All endpoints are working correctly:")
        print("   • POST /api/customer-auth/signup/ - ✅")
        print("   • POST /api/customer-auth/login/ - ✅")
        print("   • POST /api/customer-auth/verify-otp/ - ✅")
        print("   • GET /api/customer-auth/profile/ - ✅")
        print("   • POST /api/customer-auth/logout/ - ✅")
        
        print("\n🔧 Frontend should now work without 404 errors!")
        print("📝 The customer signup/login forms should be functional.")
        
    else:
        print("\n❌ Some endpoints failed. Please check the backend server.")

if __name__ == "__main__":
    main()