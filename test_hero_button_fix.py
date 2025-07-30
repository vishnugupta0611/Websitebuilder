#!/usr/bin/env python3

import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

def test_hero_button_frontend():
    """Test if hero button text is now showing on the frontend"""
    
    print("🧪 Testing Hero Button Fix on Frontend")
    print("=" * 50)
    
    # First, get the website data from backend
    base_url = "http://localhost:8000/api"
    try:
        response = requests.get(f"{base_url}/websites/by_slug/?slug=newsite")
        if response.status_code == 200:
            website_data = response.json()
            expected_button_text = website_data.get('heroButtonText', 'Shop Now')
            print(f"✅ Backend data retrieved successfully")
            print(f"   Expected button text: '{expected_button_text}'")
        else:
            print(f"❌ Could not retrieve website data: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error retrieving website data: {e}")
        return
    
    # Set up Chrome options for headless browsing
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = None
    try:
        print("\n🌐 Testing frontend...")
        driver = webdriver.Chrome(options=chrome_options)
        
        # Navigate to the website
        frontend_url = "http://localhost:3000/newsite"
        driver.get(frontend_url)
        
        # Wait for the page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Look for buttons in the hero section
        buttons = driver.find_elements(By.TAG_NAME, "button")
        hero_button_found = False
        
        for button in buttons:
            button_text = button.text.strip()
            if button_text and button_text == expected_button_text:
                hero_button_found = True
                print(f"✅ Hero button found with correct text: '{button_text}'")
                break
        
        if not hero_button_found:
            print(f"❌ Hero button with text '{expected_button_text}' not found")
            print("   Available button texts:")
            for button in buttons:
                if button.text.strip():
                    print(f"   - '{button.text.strip()}'")
        
        # Also check the page source for the button text
        page_source = driver.page_source
        if expected_button_text in page_source:
            print(f"✅ Button text '{expected_button_text}' found in page source")
        else:
            print(f"❌ Button text '{expected_button_text}' not found in page source")
            
    except Exception as e:
        print(f"❌ Error testing frontend: {e}")
        
    finally:
        if driver:
            driver.quit()
    
    print("\n" + "=" * 50)
    print("🎯 CONCLUSION:")
    if hero_button_found:
        print("✅ Hero button text issue has been FIXED!")
        print("   The button is now properly displaying on the frontend.")
    else:
        print("❌ Hero button text issue still exists.")
        print("   Additional debugging may be needed.")

if __name__ == "__main__":
    test_hero_button_frontend()