# Hero Button Text Fix

## Issue Description
The hero button text was not showing on created subsites even when passed during the website creation process.

## Root Cause Analysis
1. **Backend Data**: ✅ The `heroButtonText` field was properly saved in the database and retrieved via API
2. **Frontend Issue**: ❌ Several template components were missing the hero button implementation

## Templates Fixed

### 1. ProductsBlogsComboTemplate
- **Issue**: Hero section had title and description but was missing the button
- **Fix**: Added hero button with proper styling and scroll functionality
- **Button Text**: `{templateContent.heroButtonText || "Shop Now"}`

### 2. BlogFocusedTemplate  
- **Issue**: Hero section was missing the button
- **Fix**: Added hero button with scroll to blogs section
- **Button Text**: `{templateContent.heroButtonText || "Read More"}`

### 3. MinimalCleanTemplate
- **Issue**: Hero section was missing the button
- **Fix**: Added hero button with outline style to match minimal design
- **Button Text**: `{templateContent.heroButtonText || "Explore"}`

## Templates Already Working
- ✅ HeroProductsTemplate - Already had hero button
- ✅ TextImageSplitTemplate - Already had hero button  
- ✅ ImageLeftContentTemplate - Already had hero button

## Code Changes Made

### ProductsBlogsComboTemplate
```jsx
// Added hero button to the content overlay
<Button
  size="lg"
  style={{
    backgroundColor: customizations.colors.primary,
    color: "white",
  }}
  onClick={() =>
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  {templateContent.heroButtonText || "Shop Now"}
</Button>
```

### BlogFocusedTemplate
```jsx
// Added hero button and blogs section id
<Button
  size="lg"
  style={{
    backgroundColor: customizations.colors.primary,
    color: "white",
  }}
  onClick={() =>
    document
      .getElementById("blogs")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  {templateContent.heroButtonText || "Read More"}
</Button>

// Added id to blogs section
<section id="blogs" className="py-16">
```

### MinimalCleanTemplate
```jsx
// Added hero button with outline style
<Button
  size="lg"
  variant="outline"
  style={{
    borderColor: customizations.colors.primary,
    color: customizations.colors.primary,
  }}
  onClick={() =>
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  {templateContent.heroButtonText || "Explore"}
</Button>

// Added id to products section
<section id="products" className="py-16">
```

## Testing
- ✅ Backend API returns correct `heroButtonText` value
- ✅ Frontend templates now include hero button implementation
- ✅ Button text displays custom text or appropriate fallback

## Result
The hero button text now properly displays on all template types when a subsite is created with custom button text.