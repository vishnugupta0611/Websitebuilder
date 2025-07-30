#!/usr/bin/env python3

import requests
import json

def test_backend_status():
    """Test if the backend is running and accessible"""
    
    base_url = "http://localhost:8000"
    
    print("🔍 Testing Backend Status")
    print("=" * 40)
    
    # Test basic connectivity
    try:
        response = requests.get(f"{base_url}/api/", timeout=5)
        print(f"✅ Backend is accessible at {base_url}")
        print(f"   Status Code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"❌ Backend is not running at {base_url}")
        print("   Please start the Django backend server first")
        return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False
    
    # Test a simple endpoint
    try:
        response = requests.get(f"{base_url}/api/websites/", timeout=5)
        print(f"✅ API endpoints are accessible")
        print(f"   Websites endpoint status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error accessing API endpoints: {e}")
        return False
    
    return True

if __name__ == "__main__":
    if test_backend_status():
        print("\n✅ Backend is ready for testing!")
    else:
        print("\n❌ Backend is not ready. Please start the Django server.")
        print("   Run: python manage.py runserver 8000")