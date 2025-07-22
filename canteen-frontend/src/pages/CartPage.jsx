import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('pickup');
  const [pickupTime, setPickupTime] = useState('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [itemUpdating, setItemUpdating] = useState({});

  // Responsive state
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Enhanced validation
  const validateOrder = useCallback(() => {
    const newErrors = {};
    
    if (pickupTime === 'schedule' && !scheduledTime) {
      newErrors.scheduledTime = 'Please select a time';
    }
    
    if (cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [pickupTime, scheduledTime, cartItems.length]);

  // Debounced quantity update
  const debouncedQuantityUpdate = useCallback(
    debounce((id, quantity) => {
      updateCartQuantity(id, quantity);
      setItemUpdating(prev => ({ ...prev, [id]: false }));
    }, 300),
    [updateCartQuantity]
  );

  const handleQuantityChange = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      setItemUpdating(prev => ({ ...prev, [id]: true }));
      debouncedQuantityUpdate(id, newQuantity);
    }
  }, [removeFromCart, debouncedQuantityUpdate]);

  // Enhanced promo code handling
  const promoCodes = useMemo(() => ({
    'student10': { discount: 15, description: 'Student discount' },
    'firstorder': { discount: 20, description: 'First order discount' },
    'lunch25': { discount: 25, description: 'Lunch special', minOrder: 100 },
    'weekend15': { discount: 15, description: 'Weekend special' }
  }), []);

  const handlePromoApply = useCallback(() => {
    const code = promoCode.toLowerCase();
    const promo = promoCodes[code];
    
    if (!promo) {
      setErrors(prev => ({ ...prev, promo: 'Invalid promo code' }));
      return;
    }
    
    if (promo.minOrder && getTotalPrice() < promo.minOrder) {
      setErrors(prev => ({ 
        ...prev, 
        promo: `Minimum order of ₹${promo.minOrder} required for this promo` 
      }));
      return;
    }
    
    setPromoApplied(true);
    setErrors(prev => ({ ...prev, promo: null }));
    
    showNotification(`✅ ${promo.description} applied! ₹${promo.discount} off`, 'success');
  }, [promoCode, promoCodes, getTotalPrice]);

  // Enhanced order placement
  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      showNotification('Please fix the errors before placing your order', 'error');
      return;
    }

    const token = localStorage.getItem("token");
    const student_id = localStorage.getItem("student_id");

    if (!token || !student_id) {
      showNotification("Please login to place an order", 'error');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        student_id: parseInt(student_id),
        payment_mode: paymentMethod === "upi" ? "Online" : paymentMethod,
        cartItems,
        total_price: getFinalTotal(),
        specialInstructions,
        order_type: orderType,
        pickup_time: pickupTime === "now" ? "Now" : `Today ${scheduledTime}`,
        promo_code: promoApplied ? promoCode : null,
      };

      const response = await fetch("http://localhost:8080/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order failed");
      }

      const result = await response.json();

      clearCart();
      showNotification("Order placed successfully!", 'success');
      
      navigate("/thank-you", {
        state: {
          orderId: result.order_id,
          tokenNumber: result.token_number,
          totalAmount: Number(result.total_price),
          time: result.pickup_time,
          paymentMode: result.payment_mode,
        },
      });
    } catch (err) {
      console.error("❌ Order Error:", err);
      showNotification(err.message || "Failed to place order", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    if (type === 'error') {
      alert(`❌ ${message}`);
    } else if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`ℹ️ ${message}`);
    }
  };

  // Enhanced calculations
  const getItemPrice = useCallback((item) => {
    return typeof item.price === 'object' ? 
      parseFloat(item.price.$numberDecimal || 0) : 
      parseFloat(item.price || 0);
  }, []);

  const getItemTotal = useCallback((item) => {
    return getItemPrice(item) * item.quantity;
  }, [getItemPrice]);

  const getDiscountAmount = useCallback(() => {
    if (!promoApplied || !promoCode) return 0;
    const promo = promoCodes[promoCode.toLowerCase()];
    return promo ? promo.discount : 0;
  }, [promoApplied, promoCode, promoCodes]);

  const getFinalTotal = useCallback(() => {
    return Math.max(0, getTotalPrice() - getDiscountAmount());
  }, [getTotalPrice, getDiscountAmount]);

  // Generate time slots for today only
  const generateTimeSlots = () => {
    const slots = [];
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    
    for (let hour = 8; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          slots.push({ value: timeString, label: displayTime });
        }
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Enhanced item card component
  const ItemCard = ({ item }) => {
    const itemId = item._id || item.food_id;
    const isUpdating = itemUpdating[itemId];
    
    return (
      <div style={styles.itemCard}>
        <div style={styles.itemImageContainer}>
          <img 
            src={item.image_url} 
            alt={item.name} 
            style={styles.itemImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{...styles.imagePlaceholder, display: 'none'}}>
            <span style={styles.placeholderIcon}>🍽️</span>
          </div>
        </div>
        
        <div style={styles.itemInfo}>
          <div style={styles.itemHeader}>
            <h3 style={styles.itemName}>{item.name}</h3>
            <span style={styles.itemPrice}>₹{getItemPrice(item).toFixed(2)}</span>
          </div>
          
          <p style={styles.itemDescription}>{item.description}</p>
          
          <div style={styles.itemFooter}>
            <div style={styles.quantityControls}>
              <button
                style={styles.quantityBtn}
                onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                disabled={isUpdating}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span style={styles.quantity}>
                {isUpdating ? '⏳' : item.quantity}
              </span>
              <button
                style={styles.quantityBtn}
                onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                disabled={isUpdating}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <div style={styles.itemActions}>
              <span style={styles.itemTotal}>₹{getItemTotal(item).toFixed(2)}</span>
              <button
                onClick={() => {
                  if (window.confirm(`Remove ${item.name} from cart?`)) {
                    removeFromCart(itemId);
                  }
                }}
                style={styles.removeBtn}
                aria-label={`Remove ${item.name} from cart`}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic grid styles based on screen size
  const getCartGridStyles = () => {
    if (isDesktop) {
      return {
        ...styles.cartGrid,
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      };
    } else {
      return {
        ...styles.cartGrid,
        gridTemplateColumns: '1fr',
        gap: '20px'
      };
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Your Cart</h1>
          <p style={styles.subtitle}>
            {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛒</div>
            <h3 style={styles.emptyTitle}>Your cart is empty</h3>
            <p style={styles.emptyDescription}>
              Browse our canteen menu and add some delicious items!
            </p>
            <button 
              style={styles.browseMenuBtn}
              onClick={() => navigate('/menu')}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={getCartGridStyles()}>
            {/* Left Column - Cart Items & Order Details */}
            <div style={styles.leftColumn}>
              {/* Cart Items Section */}
              <div style={styles.cartSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Your Items</h2>
                  <button 
                    style={styles.clearAllBtn}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your cart?')) {
                        clearCart();
                      }
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div style={styles.cartItems}>
                  {cartItems.map((item) => (
                    <ItemCard key={item._id || item.food_id} item={item} />
                  ))}
                </div>
              </div>

              {/* Order Details Section */}
              <div style={styles.cartSection}>
                <h3 style={styles.sectionTitle}>Order Details</h3>
                
                {/* Order Type */}
                <div style={styles.orderTypeSection}>
                  <label style={styles.inputLabel}>How would you like to receive your order?</label>
                  <div style={styles.orderTypeButtons}>
                    <button 
                      style={{
                        ...styles.orderTypeBtn,
                        ...(orderType === 'pickup' ? styles.activeOrderTypeBtn : {})
                      }}
                      onClick={() => setOrderType('pickup')}
                    >
                      🏃‍♂️ Pickup from Counter
                    </button>
                    <button 
                      style={{
                        ...styles.orderTypeBtn,
                        ...(orderType === 'table' ? styles.activeOrderTypeBtn : {})
                      }}
                      onClick={() => setOrderType('table')}
                    >
                      🍽️ Serve at Table
                    </button>
                  </div>
                </div>

                {/* Timing */}
                <div style={styles.timingSection}>
                  <label style={styles.inputLabel}>When do you need it?</label>
                  <div style={styles.timeOptions}>
                    <label style={styles.timeOption}>
                      <input 
                        type="radio" 
                        name="pickupTime" 
                        value="now"
                        checked={pickupTime === 'now'}
                        onChange={(e) => setPickupTime(e.target.value)}
                      />
                      <span style={styles.timeText}>🕐 Now (10-15 minutes)</span>
                    </label>
                    <label style={styles.timeOption}>
                      <input 
                        type="radio" 
                        name="pickupTime" 
                        value="schedule"
                        checked={pickupTime === 'schedule'}
                        onChange={(e) => setPickupTime(e.target.value)}
                      />
                      <span style={styles.timeText}>📅 Schedule for Later Today</span>
                    </label>
                  </div>
                  
                  {pickupTime === 'schedule' && (
                    <div style={styles.timeSelectContainer}>
                      <select 
                        style={{
                          ...styles.timeSelect,
                          ...(errors.scheduledTime ? styles.inputError : {})
                        }}
                        value={scheduledTime}
                        onChange={(e) => {
                          setScheduledTime(e.target.value);
                          setErrors(prev => ({ ...prev, scheduledTime: null }));
                        }}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                      {errors.scheduledTime && (
                        <span style={styles.errorText}>
                          {errors.scheduledTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div style={styles.instructionsSection}>
                  <label style={styles.inputLabel}>Special Instructions (Optional)</label>
                  <textarea 
                    style={styles.instructionsInput}
                    placeholder="Any special requests? (e.g., extra spicy, less oil, no onions)"
                    rows="3"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    maxLength={200}
                  />
                  <div style={styles.charCount}>
                    {specialInstructions.length}/200 characters
                  </div>
                </div>

                {/* Payment Method */}
                <div style={styles.paymentSection}>
                  <label style={styles.inputLabel}>Payment Method</label>
                  <div style={styles.paymentOptions}>
                    <label style={styles.paymentOption}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span style={styles.paymentText}>📱 UPI</span>
                      <span style={styles.recommendedBadge}>Recommended</span>
                    </label>
                    <label style={styles.paymentOption}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span style={styles.paymentText}>💵 Cash at Counter</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div style={styles.rightColumn}>
              <div style={{
                ...styles.orderSummary,
                ...(isDesktop ? { position: 'sticky', top: '20px' } : { position: 'static' })
              }}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>
                
                {/* Promo Code */}
                <div style={styles.promoSection}>
                  <div style={styles.promoInputContainer}>
                    <input 
                      type="text" 
                      placeholder="Have a promo code?"
                      style={{
                        ...styles.promoInput,
                        ...(errors.promo ? styles.inputError : {})
                      }}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setErrors(prev => ({ ...prev, promo: null }));
                      }}
                      disabled={promoApplied}
                    />
                    <button 
                      style={styles.promoApplyBtn}
                      onClick={handlePromoApply}
                      disabled={promoApplied || !promoCode}
                    >
                      {promoApplied ? '✅' : 'Apply'}
                    </button>
                  </div>
                  
                  {errors.promo && (
                    <div style={styles.errorText}>{errors.promo}</div>
                  )}
                  
                  {promoApplied && (
                    <div style={styles.promoSuccess}>
                      🎉 {promoCode.toUpperCase()} applied! You saved ₹{getDiscountAmount()}
                    </div>
                  )}
                  
                  {!promoApplied && (
                    <div style={styles.promoHint}>
                      💡 Try: <strong>STUDENT10</strong>, <strong>FIRSTORDER</strong>, or <strong>LUNCH25</strong>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={styles.priceBreakdown}>
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Subtotal ({cartItems.length} items)</span>
                    <span style={styles.priceValue}>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div style={styles.priceRow}>
                      <span style={styles.priceLabel}>Discount ({promoCode.toUpperCase()})</span>
                      <span style={styles.discountValue}>-₹{getDiscountAmount()}</span>
                    </div>
                  )}
                  
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total Amount</span>
                    <span style={styles.totalValue}>₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Info */}
                <div style={styles.orderInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>
                      {orderType === 'pickup' ? '🏃‍♂️' : '🍽️'}
                    </span>
                    <span style={styles.infoText}>
                      {orderType === 'pickup' ? 'Pickup from Counter' : 'Serve at Table'}
                    </span>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>⏰</span>
                    <span style={styles.infoText}>
                      {pickupTime === 'now' ? 'Ready in 10-15 minutes' : `Ready at ${scheduledTime}`}
                    </span>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>
                      {paymentMethod === 'upi' ? '📱' : '💵'}
                    </span>
                    <span style={styles.infoText}>
                      {paymentMethod === 'upi' ? 'UPI Payment' : 'Cash Payment'}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  style={{
                    ...styles.placeOrderBtn,
                    ...(loading ? styles.loadingBtn : {})
                  }}
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <span style={styles.loadingSpinner}>⏳</span>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <span style={styles.buttonIcon}>🛒</span>
                      Place Order • ₹{getFinalTotal().toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles (same as before but with proper grid setup)
const styles = {
  // Page Layout
  pageContainer: {
    minHeight: "100vh",
    background: "#F8F9FA",
    width: "100vw",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  },

  // Header
  header: {
    textAlign: "center",
    marginBottom: "32px",
    padding: "24px 0",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2C5F5F",
    marginBottom: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#6B7280",
    fontWeight: "400",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },

  // Cart Grid Layout - Dynamic based on screen size
  cartGrid: {
    display: "grid",
    alignItems: "start",
  },

  // Columns
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
  },

  // Cart Sections
  cartSection: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },

  sectionTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1F2937",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },

  clearAllBtn: {
    padding: "8px 16px",
    background: "#FFFFFF",
    color: "#EF4444",
    border: "2px solid #EF4444",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
  },

  // Cart Items
  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  itemCard: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "#FFFFFF",
    border: "2px solid #F3F4F6",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  },

  itemImageContainer: {
    width: "100px",
    height: "100px",
    borderRadius: "12px",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
    background: "#F9FAFB",
  },

  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F3F4F6",
  },

  placeholderIcon: {
    fontSize: "2.5rem",
    color: "#9CA3AF",
  },

  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "4px",
    flexWrap: "wrap",
    gap: "8px",
  },

  itemName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1F2937",
    margin: 0,
    lineHeight: "1.3",
    fontFamily: "'Inter', sans-serif",
  },

  itemPrice: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#059669",
    fontFamily: "'Inter', sans-serif",
  },

  itemDescription: {
    fontSize: "0.9rem",
    color: "#6B7280",
    margin: 0,
    lineHeight: "1.4",
    fontFamily: "'Inter', sans-serif",
  },

  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "12px",
    flexWrap: "wrap",
    gap: "12px",
  },

  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#F9FAFB",
    padding: "6px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
  },

  quantityBtn: {
    width: "32px",
    height: "32px",
    border: "none",
    background: "#FFFFFF",
    color: "#374151",
    borderRadius: "6px",
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  quantity: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1F2937",
    minWidth: "24px",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  },

  itemActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  itemTotal: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: "'Inter', sans-serif",
  },

  removeBtn: {
    padding: "8px",
    background: "#FEF2F2",
    color: "#DC2626",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Order Details
  orderTypeSection: {
    marginBottom: "24px",
  },

  inputLabel: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
    fontFamily: "'Inter', sans-serif",
  },

  orderTypeButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  orderTypeBtn: {
    flex: 1,
    minWidth: "200px",
    padding: "16px 20px",
    border: "2px solid #E5E7EB",
    borderRadius: "12px",
    background: "#FFFFFF",
    color: "#374151",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
  },

  activeOrderTypeBtn: {
    background: "#EFF6FF",
    color: "#1D4ED8",
    border: "2px solid #3B82F6",
  },

  // Timing Section
  timingSection: {
    marginBottom: "24px",
  },

  timeOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  timeOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    border: "2px solid #E5E7EB",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "#FFFFFF",
  },

  timeText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#374151",
    fontFamily: "'Inter', sans-serif",
  },

  timeSelectContainer: {
    marginTop: "16px",
  },

  timeSelect: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "#FFFFFF",
    color: "#374151",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },

  // Instructions Section
  instructionsSection: {
    marginBottom: "24px",
  },

  instructionsInput: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "#FFFFFF",
    color: "#374151",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  charCount: {
    fontSize: "0.8rem",
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: "4px",
    fontFamily: "'Inter', sans-serif",
  },

  // Payment Section
  paymentSection: {
    marginBottom: 0,
  },

  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    border: "2px solid #E5E7EB",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "#FFFFFF",
  },

  paymentText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#374151",
    fontFamily: "'Inter', sans-serif",
    flex: 1,
  },

  recommendedBadge: {
    fontSize: "0.75rem",
    background: "#10B981",
    color: "#FFFFFF",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
  },

  // Order Summary
  orderSummary: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    height: "fit-content",
  },

  summaryTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: "20px",
    fontFamily: "'Inter', sans-serif",
  },

  // Promo Section
  promoSection: {
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #F3F4F6",
  },

  promoInputContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },

  promoInput: {
    flex: 1,
    minWidth: "150px",
    padding: "12px 16px",
    border: "2px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    background: "#FFFFFF",
    boxSizing: "border-box",
  },

  promoApplyBtn: {
    padding: "12px 20px",
    background: "#3B82F6",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  },

  promoSuccess: {
    padding: "12px 16px",
    background: "#F0FDF4",
    color: "#166534",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    border: "1px solid #BBF7D0",
  },

  promoHint: {
    fontSize: "0.85rem",
    color: "#6B7280",
    fontFamily: "'Inter', sans-serif",
    background: "#F9FAFB",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
  },

  // Price Breakdown
  priceBreakdown: {
    marginBottom: "24px",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  priceLabel: {
    fontSize: "0.95rem",
    color: "#6B7280",
    fontWeight: "400",
    fontFamily: "'Inter', sans-serif",
  },

  priceValue: {
    fontSize: "0.95rem",
    color: "#1F2937",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },

  discountValue: {
    fontSize: "0.95rem",
    color: "#059669",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "2px solid #F3F4F6",
    marginTop: "12px",
  },

  totalLabel: {
    fontSize: "1.1rem",
    color: "#1F2937",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
  },

  totalValue: {
    fontSize: "1.3rem",
    color: "#1F2937",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },

  // Order Info
  orderInfo: {
    marginBottom: "24px",
    padding: "16px",
    background: "#F9FAFB",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },

  infoIcon: {
    fontSize: "1.1rem",
    width: "20px",
    textAlign: "center",
  },

  infoText: {
    fontSize: "0.9rem",
    color: "#374151",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },

  // Place Order Button
  placeOrderBtn: {
    width: "100%",
    padding: "16px 24px",
    background: "#059669",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
  },

  loadingBtn: {
    background: "#9CA3AF",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  loadingSpinner: {
    fontSize: "1rem",
  },

  buttonIcon: {
    fontSize: "1.1rem",
  },

  // Error States
  errorText: {
    color: "#DC2626",
    fontSize: "0.85rem",
    marginTop: "4px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },

  inputError: {
    borderColor: "#DC2626",
    boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#6B7280",
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    maxWidth: "500px",
    margin: "0 auto",
  },

  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    color: "#9CA3AF",
  },

  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151",
    fontFamily: "'Inter', sans-serif",
  },

  emptyDescription: {
    fontSize: "1rem",
    color: "#6B7280",
    marginBottom: "28px",
    fontFamily: "'Inter', sans-serif",
  },

  browseMenuBtn: {
    padding: "14px 28px",
    background: "#3B82F6",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
  },
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default CartPage;