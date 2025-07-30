#!/usr/bin/env python3
"""
Test script to verify OTP functionality with real email sending
"""

import requests
import json
import random
import string
import time

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def generate_unique_email():
    """Generate a unique email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser{random_string}@example.com"

def test_otp_functionality():
    """Test the OTP functionality end-to-end"""
    
    print("🧪 Testing OTP Functionality with Real Email")
    print("=" * 60)
    
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
            print(f"   📧 OTP email should be sent to: {test_email}")
        else:
            print(f"❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # Step 2: Test resend OTP
    print("\n2. Testing resend OTP...")
    try:
        response = requests.post(f"{BASE_URL}/auth/resend-otp/", json={"email": test_email})
        if response.status_code == 200:
            print("✅ OTP resend successful")
            print(f"   📧 New OTP email should be sent to: {test_email}")
        else:
            print(f"❌ OTP resend failed: {response.text}")
    except Exception as e:
        print(f"❌ OTP resend error: {e}")
    
    # Step 3: Prompt for manual OTP entry
    print("\n3. Manual OTP verification test...")
    print("📧 Check your email and enter the OTP code you received:")
    
    # In a real scenario, you would check the email
    # For testing, we'll simulate with a prompt
    otp_code = input("Enter the 6-digit OTP from email (or press Enter to skip): ").strip()
    
    if otp_code and len(otp_code) == 6 and otp_code.isdigit():
        print(f"\n4. Verifying OTP: {otp_code}")
        try:
            response = requests.post(f"{BASE_URL}/auth/verify-otp/", json={
                "email": test_email,
                "otp": otp_code
            })
            
            if response.status_code == 200:
                print("✅ OTP verification successful!")
                auth_data = response.json()
                print(f"   Message: {auth_data.get('message', 'Verified')}")
                print(f"   User verified: {auth_data['user']['isVerified']}")
                print("   📧 Welcome email should be sent")
            else:
                print(f"❌ OTP verification failed: {response.text}")
        except Exception as e:
            print(f"❌ OTP verification error: {e}")
    else:
        print("⏭️  Skipping OTP verification (no valid code entered)")
    
    # Step 4: Test invalid OTP
    print("\n5. Testing invalid OTP...")
    try:
        response = requests.post(f"{BASE_URL}/auth/verify-otp/", json={
            "email": test_email,
            "otp": "000000"  # Invalid OTP
        })
        
        if response.status_code == 400:
            print("✅ Invalid OTP correctly rejected")
            error_data = response.json()
            print(f"   Error message: {error_data.get('error', 'Invalid OTP')}")
        else:
            print(f"❌ Invalid OTP should have been rejected: {response.text}")
    except Exception as e:
        print(f"❌ Invalid OTP test error: {e}")
    
    # Step 6: Test resend for non-existent user
    print("\n6. Testing resend for non-existent user...")
    try:
        response = requests.post(f"{BASE_URL}/auth/resend-otp/", json={
            "email": "nonexistent@example.com"
        })
        
        if response.status_code == 404:
            print("✅ Non-existent user correctly handled")
            error_data = response.json()
            print(f"   Error message: {error_data.get('error', 'User not found')}")
        else:
            print(f"❌ Non-existent user should return 404: {response.text}")
    except Exception as e:
        print(f"❌ Non-existent user test error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 OTP functionality test completed!")
    print("\nWhat was tested:")
    print("✅ User registration with OTP email sending")
    print("✅ OTP resend functionality")
    print("✅ Real OTP verification (if code was entered)")
    print("✅ Invalid OTP rejection")
    print("✅ Error handling for non-existent users")
    print("\nEmail Configuration:")
    print("📧 From: fleetyofficial@gmail.com")
    print("📧 SMTP: Gmail (smtp.gmail.com:587)")
    print("📧 Template: Beautiful HTML email with professional design")
    
    print(f"\nTest user created: {test_email}")
    print("Password: TestPassword123!")

if __name__ == "__main__":
    test_otp_functionality()