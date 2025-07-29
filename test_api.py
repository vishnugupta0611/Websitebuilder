#!/usr/bin/env python3
import requests
import json

# Test the exact same data that would be sent from the frontend
test_data = {
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "MyStr0ngP@ssw0rd!",
    "confirmPassword": "MyStr0ngP@ssw0rd!"
}

# Test both register and login
def test_register():
    print("=== Testing Register ===")
    url = "http://localhost:8000/api/auth/register/"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=test_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            try:
                error_data = response.json()
                print(f"Error Details: {json.dumps(error_data, indent=2)}")
            except:
                print("Could not parse error response as JSON")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login():
    print("\n=== Testing Login ===")
    login_data = {
        "email": "test@example.com",
        "password": "MyStr0ngP@ssw0rd!"
    }
    
    url = "http://localhost:8000/api/auth/login/"
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=login_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            try:
                error_data = response.json()
                print(f"Error Details: {json.dumps(error_data, indent=2)}")
            except:
                print("Could not parse error response as JSON")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test register first
    register_success = test_register()
    
    # Only test login if register was successful
    if register_success:
        test_login()
    else:
        print("Skipping login test due to register failure")