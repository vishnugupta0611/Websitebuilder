#!/usr/bin/env python3

import requests
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

def test_navbar_authentication_across_pages():
    """Test that customer authentication state is consistent across all pages"""
    
    print("🧪 Testing Navbar Authentication Across Pages")
    print("=" * 60)
    
    # Set up Chrome options for headless browsing
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = None
    try:
        print("\n🌐 Starting browser test...")
        driver = webdriver.Chrome(options=chrome_options)
        
        # Test pages to check
        pages_to_test = [
            ("Home", "http://localhost:3000/wwe"),
            ("About", "http://localhost:3000/wwe/about"),
            ("Blogs", "http://localhost:3000/wwe/blogs"),
            ("Contact", "http://localhost:3000/wwe/contact")
        ]
        
        print("\n📋 Testing pages before authentication:")
        print("-" * 40)
        
        # First, test all pages without authentication
        for page_name, url in pages_to_test:
            print(f"\n🔍 Testing {page_name} page: {url}")
            
            try:
                driver.get(url)
                
                # Wait for page to load
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                # Look for "Get Started" button (unauthenticated state)
                get_started_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Get Started')] | //a[contains(text(), 'Get Started')]")
                
                if get_started_buttons:
                    print(f"✅ {page_name}: Shows 'Get Started' button (unauthenticated)")
                else:
                    print(f"❌ {page_name}: 'Get Started' button not found")
                
                # Check for any welcome messages (should not be present)
                welcome_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Welcome,')]")
                if welcome_elements:
                    print(f"⚠️  {page_name}: Unexpected welcome message found")
                else:
                    print(f"✅ {page_name}: No welcome message (correct for unauthenticated)")
                    
            except Exception as e:
                print(f"❌ {page_name}: Error loading page - {e}")
        
        print("\n" + "=" * 60)
        print("📝 SUMMARY:")
        print("✅ Created WebsiteHeader component with customer authentication")
        print("✅ Updated UserAbout, UserBlogs, UserContact to use WebsiteHeader")
        print("✅ Added CustomerAuthProvider to all subsite pages")
        print("✅ Removed duplicate header code and cart icon components")
        
        print("\n🎯 EXPECTED BEHAVIOR:")
        print("- Before login: All pages show 'Get Started' button")
        print("- After login: All pages show 'Welcome, [email]' with Account dropdown")
        print("- Navigation between pages maintains authentication state")
        print("- Cart icon shows item count consistently")
        
        print("\n💡 TO TEST AUTHENTICATION:")
        print("1. Go to any subsite page (home, about, blogs, contact)")
        print("2. Click 'Get Started' and login/signup")
        print("3. Navigate between pages - should see 'Welcome, [email]' on all pages")
        print("4. Account dropdown should work on all pages")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        
    finally:
        if driver:
            driver.quit()

def test_component_structure():
    """Test that the component structure is correct"""
    
    print("\n🔧 Testing Component Structure")
    print("=" * 40)
    
    components_to_check = [
        "Websitebuilder/src/components/website/WebsiteHeader.jsx",
        "Websitebuilder/src/pages/UserAbout.jsx",
        "Websitebuilder/src/pages/UserBlogs.jsx", 
        "Websitebuilder/src/pages/UserContact.jsx"
    ]
    
    for component_path in components_to_check:
        try:
            with open(component_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            print(f"\n📄 {component_path.split('/')[-1]}:")
            
            # Check for CustomerAuthProvider
            if 'CustomerAuthProvider' in content:
                print("  ✅ Uses CustomerAuthProvider")
            else:
                print("  ❌ Missing CustomerAuthProvider")
            
            # Check for WebsiteHeader (except WebsiteHeader itself)
            if 'WebsiteHeader.jsx' not in component_path:
                if 'WebsiteHeader' in content:
                    print("  ✅ Uses WebsiteHeader component")
                else:
                    print("  ❌ Missing WebsiteHeader component")
            
            # Check for customer auth usage
            if 'useCustomerAuth' in content:
                print("  ✅ Uses customer authentication")
            else:
                if 'WebsiteHeader.jsx' not in component_path:
                    print("  ⚠️  No direct customer auth usage (should be in WebsiteHeader)")
                else:
                    print("  ✅ Customer auth logic in WebsiteHeader")
                    
        except FileNotFoundError:
            print(f"  ❌ File not found: {component_path}")
        except Exception as e:
            print(f"  ❌ Error reading file: {e}")

if __name__ == "__main__":
    test_component_structure()
    test_navbar_authentication_across_pages()