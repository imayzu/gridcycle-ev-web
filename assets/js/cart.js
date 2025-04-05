document.addEventListener("DOMContentLoaded", function () {
  
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const subtotal = document.getElementById("subtotal");
  const total = document.getElementById("total");
  const emptyCartBtn = document.getElementById("emptyCart");
  const checkoutBtn = document.getElementById("checkout");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const cartCount = document.getElementById("cartCount");
  const mobileCartCount = document.getElementById("mobileCartCount");

  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  
  init();

  function init() {
    
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    });

    
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });

    
    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#menu li a").forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });

    
    loadCartItems();

    
    updateCartCount();

    
    emptyCartBtn.addEventListener("click", emptyCart);
    checkoutBtn.addEventListener("click", handleCheckout);
  }

  function loadCartItems() {
    if (cart.length === 0) {
      cartItems.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>You haven't added any items to your cart yet</p>
            <a href="booking.html" class="btn btn-primary">
               Book a Ride Now
            </a>
          </div>
        `;
      cartSummary.style.display = "none";
      return;
    }

    
    let itemsHTML = "";
    let calculatedSubtotal = 0;

    
    const productImages = {
      "Gridcycle Pro": "assets/img/products/product-1.png",
      "Gridcycle Lite": "assets/img/products/product-2.png",
      "Gridcycle Tour": "assets/img/products/product-3.png",
    };

    cart.forEach((item, index) => {
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const time = item.time;

      calculatedSubtotal += item.price;

      itemsHTML += `
          <div class="cart-item" data-index="${index}">
            <div class="cart-item-details">
              <div class="cart-item-image">
                <img src="${
                  productImages[item.product] ||
                  "assets/img/product/product1.png"
                }" alt="${item.product}" />
              </div>
              <div class="cart-item-info">
                <h3>${item.product}</h3>
                <p>£${item.price.toFixed(2)} per hour</p>
                <p class="cart-item-date">${formattedDate} at ${time}</p>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-price">£${item.price.toFixed(2)}</div>
              <button class="action-btn delete" data-index="${index}">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        `;
    });

    cartItems.innerHTML = itemsHTML;
    cartSummary.style.display = "block";

    
    subtotal.textContent = `£${calculatedSubtotal.toFixed(2)}`;
    total.textContent = `£${(calculatedSubtotal + 2).toFixed(2)}`;

    
    updateCartCount();

    
    document.querySelectorAll(".action-btn.delete").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        removeFromCart(index);
      });
    });
  }

  function updateCartCount() {
    const count = cart.length;
    cartCount.textContent = count;
    mobileCartCount.textContent = count;
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();

    
    const itemToRemove = document.querySelector(
      `.cart-item[data-index="${index}"]`
    );
    if (itemToRemove) {
      itemToRemove.style.transform = "translateX(-100%)";
      itemToRemove.style.opacity = "0";
      setTimeout(() => {
        loadCartItems();
      }, 300);
    }
  }

  function emptyCart() {
    if (confirm("Are you sure you want to empty your cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      
      const items = document.querySelectorAll(".cart-item");
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        item.style.transform = "translateX(-100%)";
        item.style.opacity = "0";
      });

      setTimeout(() => {
        loadCartItems();
      }, 300 + items.length * 100);
    }
  }

  function handleCheckout() {
    
    if (cart.length === 0) {
      showToast(
        "Your cart is empty. Please add items to proceed to checkout.",
        "error"
      );
      return;
    }

    
    const currentUser =
      JSON.parse(localStorage.getItem("gridcycleCurrentUser")) || null;
    if (!currentUser) {
      showToast("Please log in or create an account to checkout.", "error");
      return;
    }

    
    showToast("Proceeding to checkout...", "success");
  }

  function showToast(message, type = "error") {
    toastMessage.textContent = message;
    toast.className = "toast";
    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});
