#!/usr/bin/env python3
"""
Debug script to identify the exact cause of the 400 error in customer signup
"""

import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def debug_signup_error():
    """Debug the customer signup 400 error"""
    
    print("🔍 Debugging Customer Signup 400 Error")
    print("=" * 50)
    
    # Test data
    test_website_slug = "test-backend-website"
    test_customer = {
        "name": "Debug User",
        "email": "debug@example.com",
        "password": "testpass123"
    }
    
    print(f"\n📤 Sending signup request:")
    print(f"   URL: {BASE_URL}/customer-auth/signup/")
    print(f"   Data: {json.dumps({**test_customer, 'website_slug': test_website_slug}, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/customer-auth/signup/", json={
            **test_customer,
            "website_slug": test_website_slug
        })
        
        print(f"\n📥 Response received:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"   JSON Response: {json.dumps(response_data, indent=2)}")
        except:
            print(f"   Raw Response: {response.text}")
        
        # Analyze the error
        if response.status_code == 400:
            print(f"\n🔍 Analysis:")
            if response.text:
                try:
                    error_data = response.json()
                    if 'error' in error_data:
                        error_msg = error_data['error']
                        print(f"   Error Message: {error_msg}")
                        
                        if "All fields are required" in error_msg:
                            print("   ❌ Issue: Missing required fields")
                            print("   🔧 Check: Ensure name, email, password, website_slug are all provided")
                        elif "User with this email already exists" in error_msg:
                            print("   ❌ Issue: Email already registered")
                            print("   🔧 Solution: Use a different email or delete existing user")
                        elif "Website not found" in error_msg:
                            print("   ❌ Issue: Website slug doesn't exist")
                            print("   🔧 Solution: Check if test-backend-website exists")
                        else:
                            print(f"   ❌ Issue: Unknown error - {error_msg}")
                    else:
                        print("   ❌ Issue: No error message in response")
                except:
                    print("   ❌ Issue: Response is not valid JSON")
            else:
                print("   ❌ Issue: Empty response body")
        
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return
    
    # Test if website exists
    print(f"\n🌐 Checking if website exists...")
    try:
        website_response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={test_website_slug}")
        print(f"   Website check status: {website_response.status_code}")
        if website_response.status_code == 200:
            website_data = website_response.json()
            print(f"   ✅ Website exists: {website_data.get('name')}")
        else:
            print(f"   ❌ Website not found: {website_response.text}")
    except Exception as e:
        print(f"   ❌ Website check failed: {e}")
    
    # Test if user already exists
    print(f"\n👤 Checking if user already exists...")
    try:
        # Try to login with the same credentials to see if user exists
        login_response = requests.post(f"{BASE_URL}/customer-auth/login/", json={
            "email": test_customer["email"],
            "password": test_customer["password"],
            "website_slug": test_website_slug
        })
        print(f"   Login attempt status: {login_response.status_code}")
        if login_response.status_code in [200, 401]:  # 401 means user exists but not verified
            print(f"   ⚠️ User might already exist")
            try:
                login_data = login_response.json()
                print(f"   Login response: {json.dumps(login_data, indent=2)}")
            except:
                print(f"   Login response: {login_response.text}")
        else:
            print(f"   ✅ User doesn't exist (login failed as expected)")
    except Exception as e:
        print(f"   ❌ User check failed: {e}")

if __name__ == "__main__":
    debug_signup_error()