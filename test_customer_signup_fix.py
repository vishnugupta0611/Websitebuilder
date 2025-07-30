#!/usr/bin/env python3

import requests
import json

def test_customer_signup():
    """Test the fixed customer signup endpoint"""
    
    base_url = "http://localhost:8000/api"
    
    print("🧪 Testing Customer Signup Fix")
    print("=" * 50)
    
    # Test data matching frontend structure
    signup_data = {
        "firstName": "John",
        "lastName": "Doe", 
        "email": "john.doe.test@example.com",
        "password": "testpassword123",
        "confirmPassword": "testpassword123",
        "phone": "+1234567890",
        "website_slug": "wwe"  # Using existing website slug
    }
    
    try:
        print("📡 Testing customer signup endpoint...")
        print(f"   Data: {json.dumps(signup_data, indent=2)}")
        
        response = requests.post(
            f"{base_url}/customer-auth/signup/",
            json=signup_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Signup successful!")
            print(f"   Success: {result.get('success')}")
            print(f"   Message: {result.get('data', {}).get('message')}")
            print(f"   User ID: {result.get('data', {}).get('user', {}).get('id')}")
            print(f"   User Email: {result.get('data', {}).get('user', {}).get('email')}")
            print(f"   User Name: {result.get('data', {}).get('user', {}).get('name')}")
            print(f"   Requires Verification: {result.get('data', {}).get('requires_verification')}")
            
        elif response.status_code == 400:
            result = response.json()
            print("❌ Signup failed with validation error:")
            print(f"   Error: {result.get('error')}")
            
        else:
            print(f"❌ Signup failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing signup: {e}")
    
    print("\n" + "=" * 50)
    print("🔍 TESTING SUMMARY:")
    print("1. Fixed backend to handle firstName/lastName instead of name")
    print("2. Added support for confirmPassword validation")
    print("3. Added phone field support")
    print("4. Maintained backward compatibility with name field")
    
    print("\n💡 NEXT STEPS:")
    print("- Test the frontend signup form")
    print("- Verify OTP email is sent")
    print("- Test the complete signup flow")

def test_password_mismatch():
    """Test password mismatch validation"""
    
    base_url = "http://localhost:8000/api"
    
    print("\n🧪 Testing Password Mismatch Validation")
    print("=" * 50)
    
    signup_data = {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe.test@example.com", 
        "password": "password123",
        "confirmPassword": "differentpassword",
        "phone": "+1234567890",
        "website_slug": "wwe"
    }
    
    try:
        response = requests.post(
            f"{base_url}/customer-auth/signup/",
            json=signup_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 400:
            result = response.json()
            print("✅ Password mismatch validation working!")
            print(f"   Error: {result.get('error')}")
        else:
            print("❌ Password mismatch validation not working")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing password mismatch: {e}")

if __name__ == "__main__":
    test_customer_signup()
    test_password_mismatch()