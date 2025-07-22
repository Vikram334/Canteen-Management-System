import React, { useEffect, useState, useMemo } from "react";
import { getAllFoodItems } from "../services/foodService";
import { useCart } from "../context/CartContext";
import OfferBanner from "../components/OfferBanner";
import { useNavigate } from "react-router-dom";


const CustomerMenu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const { cartItems, addToCart, updateCartQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getAllFoodItems();
        setFoodItems(items);
        setError(null);
      } catch (err) {
        setError("Failed to load menu items. Please try again.");
        console.error("Failed to load food items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', gradient: 'linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)' },
    { id: 'Snacks', name: 'Snacks', icon: '🍟', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' },
    { id: 'Meals', name: 'Meals', icon: '🍛', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'Beverages', name: 'Beverages', icon: '🥤', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'Dessert', name: 'Desserts', icon: '🍰', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { id: 'Other', name: 'Other', icon: '🍲', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  ];

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foodItems, selectedCategory, searchTerm]);

  const handleAddToCart = (item) => {
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price?.$numberDecimal || item.price,
      image_url: item.image_url,
      description: item.description,
      category: item.category,
      available_qty: item.available_qty
    };
    addToCart(cartItem);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartQuantity(id, quantity);
    }
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cartItems.find(item => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOverlay}></div>
        <div style={styles.loadingContent}>
          <div style={styles.loadingAnimation}>
            <div style={styles.loadingCircle}></div>
            <div style={styles.loadingCircle}></div>
            <div style={styles.loadingCircle}></div>
          </div>
          <h2 style={styles.loadingText}>Preparing your feast...</h2>
          <p style={styles.loadingSubtext}>🍽️ Loading delicious menu items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorOverlay}></div>
        <div style={styles.errorContent}>
          <div style={styles.errorIcon}>😞</div>
          <h2 style={styles.errorTitle}>Oops! Something went wrong</h2>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            <span style={styles.retryIcon}>🔄</span>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Background Image with Overlay */}
      <div style={styles.backgroundOverlay}></div>

      {/* Animated Decorative Elements */}
      <div style={styles.decorativeElements}>
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
        <div style={styles.floatingElement3}></div>
      </div>

      <div style={styles.container}>
        {/* Offer Banner */}
        <div style={styles.offerBannerWrapper}>
          <OfferBanner />
        </div>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              <span style={styles.titleGradient}>Welcome to</span> Our Canteen
            </h1>
            <p style={styles.heroSubtitle}>
              ✨ Fresh, delicious food made with love and served with care
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{foodItems.length}</span>
                <span style={styles.statLabel}>Menu Items</span>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>⭐ 4.8</span>
                <span style={styles.statLabel}>Rating</span>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>15min</span>
                <span style={styles.statLabel}>Avg. Wait</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search & Filter Section */}
        <div style={styles.filterSection}>
          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <div style={styles.searchIconWrapper}>
                <svg style={styles.searchIcon} viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for delicious food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button 
                  style={styles.clearButton}
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div style={styles.categoryFilter}>
            {categories.map(category => (
              <button
                key={category.id}
                style={{
                  ...styles.categoryButton,
                  background: selectedCategory === category.id ? category.gradient : 'rgba(255, 255, 255, 0.95)',
                  color: selectedCategory === category.id ? '#ffffff' : '#2C5F5F',
                  transform: selectedCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedCategory === category.id ? '0 12px 30px rgba(44, 95, 95, 0.3)' : '0 8px 20px rgba(44, 95, 95, 0.15)'
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                <span style={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Menu Grid */}
        <div style={styles.menuGrid}>
          {filteredItems.map((item, index) => {
            const quantityInCart = getItemQuantityInCart(item._id);
            return (
              <div 
                key={item._id} 
                style={{
                  ...styles.menuCard,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div style={styles.cardImageContainer}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      ...styles.foodImage,
                      filter: item.available_qty > 0 ? "none" : "grayscale(100%)"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{...styles.imagePlaceholder, display: 'none'}}>
                    <span style={styles.placeholderIcon}>🍽️</span>
                  </div>
                  
                  {/* Enhanced Availability Badge */}
                  <div style={styles.availabilityBadge}>
                    <div style={{
                      ...styles.availabilityIndicator,
                      background: item.available_qty > 0 
                        ? 'linear-gradient(45deg, #2C5F5F, #1e4a4a)' 
                        : 'linear-gradient(45deg, #ef4444, #dc2626)'
                    }}>
                      <span style={styles.availabilityIcon}>
                        {item.available_qty > 0 ? '✓' : '✕'}
                      </span>
                    </div>
                    <span style={styles.availabilityText}>
                      {item.available_qty > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Enhanced Cart Badge */}
                  {quantityInCart > 0 && (
                    <div style={styles.cartBadge}>
                      <span style={styles.cartBadgeText}>{quantityInCart}</span>
                      <div style={styles.cartBadgeRipple}></div>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div style={styles.imageOverlay}></div>
                </div>
                
                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{item.name}</h3>
                    <div style={styles.categoryTag}>
                      {categories.find(cat => cat.id === item.category)?.icon || '🍽️'}
                    </div>
                  </div>
                  
                  <p style={styles.cardDescription}>{item.description}</p>
                  
                  <div style={styles.ratingSection}>
                    <div style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          style={{
                            ...styles.star,
                            color: i < Math.floor(item.rating || 4.2) ? '#fbbf24' : '#e5e7eb'
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span style={styles.ratingText}>
                      {item.rating || 4.2} ({item.reviews_count || 10} reviews)
                    </span>
                  </div>
                  
                  <div style={styles.cardFooter}>
                    <div style={styles.priceSection}>
                      <span style={styles.currency}>₹</span>
                      <span style={styles.price}>{item.price?.$numberDecimal || item.price}</span>
                    </div>
                    
                    {quantityInCart > 0 ? (
                      <div style={styles.quantityControls}>
                        <button
                          style={styles.quantityButton}
                          onClick={() => handleUpdateQuantity(item._id, quantityInCart - 1)}
                        >
                          <span style={styles.quantityIcon}>−</span>
                        </button>
                        <span style={styles.quantity}>{quantityInCart}</span>
                        <button
                          style={styles.quantityButton}
                          onClick={() => handleUpdateQuantity(item._id, quantityInCart + 1)}
                        >
                          <span style={styles.quantityIcon}>+</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        style={{
                          ...styles.addToCartButton,
                          ...(item.available_qty > 0 ? {} : styles.disabledButton)
                        }}
                        onClick={() => handleAddToCart(item)}
                        disabled={item.available_qty <= 0}
                      >
                        <span style={styles.buttonIcon}>
                          {item.available_qty > 0 ? '🛒' : '❌'}
                        </span>
                        {item.available_qty > 0 ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Empty State */}
        {filteredItems.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyAnimation}>
              <div style={styles.emptyIcon}>🔍</div>
            </div>
            <h3 style={styles.emptyTitle}>No delicious items found</h3>
            <p style={styles.emptyDescription}>
              Try searching for something else or explore different categories
            </p>
            <button 
              style={styles.resetButton}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Floating Cart */}
      {getTotalItems() > 0 && (
        <div style={styles.floatingCart} onClick={() => setShowCart(true)}>
          <div style={styles.cartIconContainer}>
            <span style={styles.cartIcon}>🛒</span>
            <div style={styles.cartPulse}></div>
          </div>
          <div style={styles.cartInfo}>
            <div style={styles.cartHeader}>
              <span style={styles.cartCount}>{getTotalItems()} items</span>
            </div>
            <div style={styles.cartTotal}>₹{getTotalPrice().toFixed(2)}</div>
          </div>
          <div style={styles.cartArrow}>→</div>
        </div>
      )}

      {/* Enhanced Cart Modal */}
      {showCart && (
        
        <div style={styles.cartModal}>
          <div style={styles.cartModalOverlay} onClick={() => setShowCart(false)}></div>
          <div style={styles.cartModalContent}>
            <div style={styles.cartModalHeader}>
              <div style={styles.cartTitleSection}>
                <h2 style={styles.cartTitle}>🛒 Your Order</h2>
                <span style={styles.cartItemCount}>{getTotalItems()} items</span>
              </div>
              <button style={styles.closeButton} onClick={() => setShowCart(false)}>
                <span style={styles.closeIcon}>✕</span>
              </button>
            </div>
            
            <div style={styles.cartItems}>
              {cartItems.map(item => (
                <div key={item._id} style={styles.cartItem}>
                  <div style={styles.cartItemImage}>
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      style={styles.cartItemImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{...styles.cartItemPlaceholder, display: 'none'}}>
                      🍽️
                    </div>
                  </div>
                  <div style={styles.cartItemInfo}>
                    <h4 style={styles.cartItemName}>{item.name}</h4>
                    <p style={styles.cartItemPrice}>₹{item.price} each</p>
                    <p style={styles.cartItemTotal}>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div style={styles.quantityControls}>
                    <button
                      style={styles.cartQuantityButton}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span style={styles.cartQuantity}>{item.quantity}</span>
                    <button
                      style={styles.cartQuantityButton}
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={styles.cartFooter}>
              <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Subtotal:</span>
                  <span style={styles.totalValue}>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Delivery:</span>
                  <span style={styles.totalValue}>Free</span>
                </div>
                <div style={styles.finalTotal}>
                  <span style={styles.finalTotalLabel}>Total:</span>
                  <span style={styles.finalTotalAmount}>₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <button style={styles.checkoutButton} onClick={() => navigate("/cart")}>
                <span style={styles.checkoutIcon}>🚀</span>
                     Place Order
               <div style={styles.buttonShine}></div>
                  </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  // Enhanced Page Layout with Background Image
  pageContainer: {
    minHeight: "100vh",
    backgroundImage: `url("/images/74bb95b8-d4cd-4802-896e-f48de79ca399.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    width: "100vw",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },
  
  // Background Overlay for Better Readability
  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
    backdropFilter: "blur(2px)",
    zIndex: 0,
  },

  // Decorative Floating Elements
  decorativeElements: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  floatingElement1: {
    position: "absolute",
    top: "15%",
    left: "8%",
    width: "80px",
    height: "80px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.1), rgba(44, 95, 95, 0.05))",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite",
  },
  floatingElement2: {
    position: "absolute",
    top: "60%",
    right: "12%",
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.08), rgba(44, 95, 95, 0.03))",
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite reverse",
  },
  floatingElement3: {
    position: "absolute",
    bottom: "25%",
    left: "20%",
    width: "70px",
    height: "70px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.06), rgba(44, 95, 95, 0.02))",
    borderRadius: "50%",
    animation: "float 9s ease-in-out infinite",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 2,
  },

  // Enhanced Loading State with Background
  loadingContainer: {
    minHeight: "100vh",
    backgroundImage: `url("/images/74bb95b8-d4cd-4802-896e-f48de79ca399.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(44, 95, 95, 0.8)",
    backdropFilter: "blur(4px)",
  },
  loadingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    position: "relative",
    zIndex: 1,
  },
  loadingAnimation: {
    display: "flex",
    gap: "8px",
    marginBottom: "2rem",
  },
  loadingCircle: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #ffffff, rgba(255, 255, 255, 0.6))",
    animation: "bounce 1.4s ease-in-out infinite both",
  },
  loadingText: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  loadingSubtext: {
    fontSize: "1.1rem",
    opacity: 0.9,
  },

  // Enhanced Error State with Background
  errorContainer: {
    minHeight: "100vh",
    backgroundImage: `url("/images/74bb95b8-d4cd-4802-896e-f48de79ca399.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "20px",
  },
  errorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(44, 95, 95, 0.8)",
    backdropFilter: "blur(4px)",
  },
  errorContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    position: "relative",
    zIndex: 1,
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
    animation: "bounce 2s infinite",
  },
  errorTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  errorText: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  retryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
  },
  retryIcon: {
    fontSize: "1.2rem",
  },

  // Offer Banner Wrapper
  offerBannerWrapper: {
    marginBottom: "2rem",
  },

  // Enhanced Hero Section with Glassmorphism
  heroSection: {
    textAlign: "center",
    marginBottom: "3rem",
    padding: "3rem 2rem",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.2)",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    color: "#2C5F5F",
    textShadow: "0 4px 8px rgba(44, 95, 95, 0.3)",
  },
  titleGradient: {
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSubtitle: {
    fontSize: "1.3rem",
    color: "#2C5F5F",
    marginBottom: "2rem",
    fontWeight: "500",
    opacity: 0.9,
  },
  heroStats: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#2C5F5F",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#2C5F5F",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(44, 95, 95, 0.3)",
  },

  // Enhanced Search & Filter with Glassmorphism
  filterSection: {
    marginBottom: "3rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
  },
  searchBox: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
  },
  searchIconWrapper: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
  },
  searchIcon: {
    width: "24px",
    height: "24px",
    color: "#2C5F5F",
  },
  searchInput: {
    width: "100%",
    padding: "1.2rem 4rem 1.2rem 4rem",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    borderRadius: "60px",
    fontSize: "1.1rem",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px rgba(44, 95, 95, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    color: "#2C5F5F",
  },
  clearButton: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    color: "#2C5F5F",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "50%",
    transition: "all 0.2s ease",
    opacity: 0.7,
  },
  categoryFilter: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "0 1rem",
  },
  categoryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem 1.5rem",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    backdropFilter: "blur(20px)",
  },
  categoryIcon: {
    fontSize: "1.3rem",
  },
  categoryName: {
    whiteSpace: "nowrap",
    letterSpacing: "0.5px",
  },

  // Enhanced Menu Grid
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "2rem",
    justifyItems: "center",
  },
  menuCard: {
    width: "100%",
    maxWidth: "380px",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.15), 0 8px 25px rgba(44, 95, 95, 0.1)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    animation: "slideUp 0.6s ease forwards",
    opacity: 0,
    transform: "translateY(30px)",
  },
  cardImageContainer: {
    height: "220px",
    position: "relative",
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.4s ease",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  },
  placeholderIcon: {
    fontSize: "3rem",
    color: "#9ca3af",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(to top, rgba(44, 95, 95, 0.2), transparent)",
    pointerEvents: "none",
  },
  availabilityBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "50px",
    fontSize: "0.8rem",
    fontWeight: "600",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.15)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
  },
  availabilityIndicator: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "0.7rem",
    fontWeight: "700",
  },
  availabilityIcon: {
    fontSize: "0.7rem",
  },
  availabilityText: {
    color: "#2C5F5F",
    fontSize: "0.75rem",
  },
  cartBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: "700",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  cartBadgeText: {
    fontSize: "0.9rem",
    fontWeight: "700",
    position: "relative",
    zIndex: 2,
  },
  cartBadgeRipple: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%) scale(0)",
    animation: "ripple 2s infinite",
  },

  // Enhanced Card Content
  cardContent: {
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.8rem",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#2C5F5F",
    marginBottom: "0",
    fontFamily: "'Inter', sans-serif",
    flex: 1,
    lineHeight: "1.3",
  },
  categoryTag: {
    fontSize: "1.2rem",
    padding: "0.3rem",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.1), rgba(44, 95, 95, 0.05))",
    borderRadius: "8px",
    marginLeft: "0.5rem",
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#6b7280",
    marginBottom: "1rem",
    lineHeight: "1.5",
    fontFamily: "'Inter', sans-serif",
  },
  ratingSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.2rem",
  },
  starsContainer: {
    display: "flex",
    gap: "0.1rem",
  },
  star: {
    fontSize: "0.8rem",
    transition: "all 0.2s ease",
  },
  ratingText: {
    fontSize: "0.85rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  priceSection: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.2rem",
  },
  currency: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2C5F5F",
  },
  price: {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },

  // Enhanced Buttons with Canteen Theme
  addToCartButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.8rem 1.2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
  disabledButton: {
    background: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
    cursor: "not-allowed",
    boxShadow: "0 4px 15px rgba(156, 163, 175, 0.2)",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    padding: "0.5rem",
    borderRadius: "50px",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    boxShadow: "0 4px 15px rgba(44, 95, 95, 0.1)",
  },
  quantityButton: {
    width: "32px",
    height: "32px",
    border: "none",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    borderRadius: "50%",
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    transition: "all 0.3s ease",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(44, 95, 95, 0.3)",
  },
  quantityIcon: {
    fontSize: "1rem",
    fontWeight: "700",
  },
  quantity: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2C5F5F",
    minWidth: "24px",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  },

  // Enhanced Empty State
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    color: "#2C5F5F",
  },
  emptyAnimation: {
    marginBottom: "2rem",
  },
  emptyIcon: {
    fontSize: "5rem",
    marginBottom: "1.5rem",
    animation: "bounce 2s infinite",
  },
  emptyTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  emptyDescription: {
    fontSize: "1.2rem",
    color: "#2C5F5F",
    opacity: 0.8,
    marginBottom: "2rem",
    fontFamily: "'Inter', sans-serif",
  },
  resetButton: {
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
  },

  // Enhanced Floating Cart
  floatingCart: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem 1.5rem",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "60px",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.2), 0 8px 25px rgba(44, 95, 95, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 1000,
    border: "1px solid rgba(44, 95, 95, 0.1)",
  },
  cartIconContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: {
    fontSize: "1.5rem",
    color: "#2C5F5F",
    position: "relative",
    zIndex: 2,
  },
  cartPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    background: "rgba(44, 95, 95, 0.2)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 2s infinite",
  },
  cartInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  cartHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  cartCount: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  cartTotal: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  cartArrow: {
    fontSize: "1.2rem",
    color: "#2C5F5F",
    fontWeight: "700",
  },

  // Enhanced Cart Modal
  cartModal: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  cartModalOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(44, 95, 95, 0.6)",
    backdropFilter: "blur(8px)",
  },
  cartModalContent: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "85vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 25px 50px rgba(44, 95, 95, 0.2)",
  },
  cartModalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2rem",
    borderBottom: "1px solid rgba(44, 95, 95, 0.1)",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.05), rgba(44, 95, 95, 0.02))",
  },
  cartTitleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  cartTitle: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#2C5F5F",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  cartItemCount: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  closeButton: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
  },
  closeIcon: {
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  cartItems: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.2rem",
    background: "rgba(248, 250, 252, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    transition: "all 0.3s ease",
  },
  cartItemImage: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    overflow: "hidden",
    flexShrink: 0,
  },
  cartItemImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cartItemPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    fontSize: "1.5rem",
  },
  cartItemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  cartItemName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#2C5F5F",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  cartItemPrice: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  cartItemTotal: {
    fontSize: "0.95rem",
    color: "#2C5F5F",
    fontWeight: "600",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  cartQuantityButton: {
    width: "32px",
    height: "32px",
    border: "none",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    borderRadius: "50%",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(44, 95, 95, 0.3)",
  },
  cartQuantity: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2C5F5F",
    minWidth: "24px",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  },
  cartFooter: {
    padding: "2rem",
    borderTop: "1px solid rgba(44, 95, 95, 0.1)",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.02), rgba(44, 95, 95, 0.01))",
  },
  totalSection: {
    marginBottom: "1.5rem",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },
  totalLabel: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#6b7280",
    fontFamily: "'Inter', sans-serif",
  },
  totalValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  finalTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    borderTop: "2px solid rgba(44, 95, 95, 0.2)",
    marginTop: "0.5rem",
  },
  finalTotalLabel: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  finalTotalAmount: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#2C5F5F",
    fontFamily: "'Inter', sans-serif",
  },
  checkoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.8rem",
    padding: "1.2rem 2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "60px",
    fontSize: "1.2rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 12px 30px rgba(44, 95, 95, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  checkoutIcon: {
    fontSize: "1.3rem",
  },
  buttonShine: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    transition: "left 0.6s ease",
  },
};

// Enhanced CSS Animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(3deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-20px); }
    70% { transform: translateY(-10px); }
    90% { transform: translateY(-3px); }
  }
  
  .loadingCircle:nth-child(1) { animation-delay: -0.32s; }
  .loadingCircle:nth-child(2) { animation-delay: -0.16s; }
  .loadingCircle:nth-child(3) { animation-delay: 0s; }
  
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes ripple {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.2; }
  }
  
  /* Enhanced Hover Effects with Canteen Theme */
  input:focus {
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.15), 0 0 0 3px rgba(44, 95, 95, 0.2) !important;
    transform: translateY(-2px) !important;
    border-color: #2C5F5F !important;
  }
  
  .categoryButton:hover {
    transform: scale(1.05) translateY(-3px) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.3) !important;
  }
  
  .menuCard:hover {
    transform: translateY(-8px) scale(1.02) !important;
    box-shadow: 0 25px 50px rgba(44, 95, 95, 0.2), 0 15px 35px rgba(44, 95, 95, 0.15) !important;
  }
  
  .menuCard:hover .foodImage {
    transform: scale(1.1) !important;
  }
  
  .addToCartButton:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  .addToCartButton:hover .buttonShine {
    left: 100% !important;
  }
  
  .quantityButton:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 8px 20px rgba(44, 95, 95, 0.4) !important;
  }
  
  .floatingCart:hover {
    transform: scale(1.05) translateY(-3px) !important;
    box-shadow: 0 25px 50px rgba(44, 95, 95, 0.25) !important;
  }
  
  .checkoutButton:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 20px 40px rgba(44, 95, 95, 0.5) !important;
  }
  
  .checkoutButton:hover .buttonShine {
    left: 100% !important;
  }
  
  .closeButton:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 12px 30px rgba(239, 68, 68, 0.4) !important;
  }
  
  .retryButton:hover {
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  .cartItem:hover {
    transform: translateX(5px) !important;
    box-shadow: 0 8px 25px rgba(44, 95, 95, 0.1) !important;
  }
  
  .clearButton:hover {
    background: rgba(44, 95, 95, 0.1) !important;
    color: #2C5F5F !important;
    opacity: 1 !important;
  }
  
  .resetButton:hover {
    transform: translateY(-2px) scale(1.05) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .heroTitle { font-size: 2.5rem !important; }
    .heroSubtitle { font-size: 1.1rem !important; }
    .heroStats { gap: 1rem !important; }
    .statDivider { display: none !important; }
    
    .menuGrid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    
    .categoryFilter {
      gap: 0.8rem !important;
    }
    
    .categoryButton {
      padding: 0.8rem 1.2rem !important;
      font-size: 0.9rem !important;
    }
    
    .floatingCart {
      bottom: 1rem !important;
      right: 1rem !important;
      padding: 0.8rem 1.2rem !important;
    }
    
    .cartModalContent {
      margin: 1rem !important;
      max-height: 90vh !important;
    }
  }
  
  @media (max-width: 480px) {
    .heroTitle { font-size: 2rem !important; }
    .searchInput { padding: 1rem 3rem 1rem 3rem !important; }
    .menuCard { max-width: 100% !important; }
  }
`;
document.head.appendChild(styleSheet);

export default CustomerMenu;
