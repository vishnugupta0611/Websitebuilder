import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";
import { useWebsiteCart } from "../contexts/WebsiteCartContext";
import { websiteService } from "../services/websiteService";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from "lucide-react";

function SavedItems() {
  const { slug } = useParams();
  const { user, logout } = useCustomerAuth();
  const { addToCart } = useWebsiteCart();
  const [website, setWebsite] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    loadData();
  }, [slug, user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load website data
      const websiteResult = await websiteService.getWebsiteBySlug(slug);
      if (websiteResult.success) {
        setWebsite(websiteResult.data);
      }

      // Load saved items from localStorage
      const saved = JSON.parse(localStorage.getItem("savedForLater") || "[]");
      const websiteSavedItems = saved.filter(
        (item) => item.websiteSlug === slug
      );
      setSavedItems(websiteSavedItems);
    } catch (error) {
      console.error("Error loading saved items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = savedItems.filter((item) => item.id !== itemId);
    setSavedItems(updatedItems);

    // Update localStorage
    const allSavedItems = JSON.parse(
      localStorage.getItem("savedForLater") || "[]"
    );
    const filteredItems = allSavedItems.filter(
      (item) => !(item.id === itemId && item.websiteSlug === slug)
    );
    localStorage.setItem("savedForLater", JSON.stringify(filteredItems));
  };

  const handleAddToCart = async (item) => {
    setAddingToCart((prev) => ({ ...prev, [item.id]: true }));

    try {
      const result = await addToCart(item, 1);
      if (result.success) {
        // Optionally remove from saved items after adding to cart
        // handleRemoveItem(item.id)
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Website not found
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Use website theme colors
  const colors = {
    primary: website.customizations?.colors?.primary || "#2563eb",
    secondary: website.customizations?.colors?.secondary || "#64748b",
    accent: website.customizations?.colors?.accent || "#10b981",
    background: website.customizations?.colors?.background || "#ffffff",
    text: website.customizations?.colors?.text || "#1f2937",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily:
          website.customizations?.typography?.bodyFont ||
          "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="border-b shadow-sm"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.secondary + "20",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={`/${slug}`}
              className="flex items-center hover:opacity-75 transition-opacity"
              style={{ color: colors.primary }}
            >
              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily:
                    website.customizations?.typography?.headingFont ||
                    "Inter, system-ui, sans-serif",
                }}
              >
                {website.name}
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm" style={{ color: colors.text }}>
                {user?.name}
              </span>
              <Button
                variant="outline"
                onClick={logout}
                style={{
                  borderColor: colors.secondary + "40",
                  color: colors.primary,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: colors.secondary + "10",
                  },
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/${slug}`}
            className="hover:opacity-75 transition-opacity inline-flex items-center"
            style={{ color: colors.primary }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Store
          </Link>
        </div>

        {/* Saved Items Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              color: colors.primary,
              fontFamily:
                website.customizations?.typography?.headingFont ||
                "Inter, system-ui, sans-serif",
            }}
          >
            Saved Items
          </h1>
          <p className="text-base" style={{ color: colors.secondary }}>
            Products you've saved for later ({savedItems.length} items)
          </p>
        </div>

        {/* Saved Items List */}
        {savedItems.length === 0 ? (
          <div
            className="text-center py-12 bg-white rounded-lg border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.secondary + "20",
            }}
          >
            <Heart
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: colors.secondary }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: colors.text }}
            >
              No saved items yet
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.secondary }}>
              Save products you're interested in to view them here
            </p>
            <Link
              to={`/${slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: colors.primary,
                color: "white",
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.secondary + "20",
                }}
              >
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://via.placeholder.com/300x300/e5e7eb/9ca3af?text=Product"
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      ${item.price?.toFixed(2)}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Saved {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                      loading={addingToCart[item.id]}
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        borderColor: "#ef4444",
                        color: "#ef4444",
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* View Product Link */}
                  <Link
                    to={`/${slug}/products/${item.id}`}
                    className="block text-center mt-2 text-sm hover:opacity-75 transition-opacity"
                    style={{ color: colors.primary }}
                  >
                    View Product Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={`/${slug}/profile`}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            style={{
              borderColor: colors.secondary + "20",
              backgroundColor: colors.background,
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary }}
            >
              My Profile
            </h3>
            <p className="text-sm" style={{ color: colors.secondary }}>
              Update your account information
            </p>
          </Link>

          <Link
            to={`/${slug}/orders`}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            style={{
              borderColor: colors.secondary + "20",
              backgroundColor: colors.background,
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary }}
            >
              My Orders
            </h3>
            <p className="text-sm" style={{ color: colors.secondary }}>
              View your order history and track orders
            </p>
          </Link>

          <Link
            to={`/${slug}/cart`}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            style={{
              borderColor: colors.secondary + "20",
              backgroundColor: colors.background,
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.primary }}
            >
              Shopping Cart
            </h3>
            <p className="text-sm" style={{ color: colors.secondary }}>
              Review items in your cart and checkout
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SavedItems;
