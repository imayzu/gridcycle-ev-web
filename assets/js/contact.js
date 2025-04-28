document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const navContentRight = document.querySelector(".nav-content-right");
  const cartCounts = document.querySelectorAll(".cart-count");
  const toastContainer = document.getElementById("toastContainer");
  const faqItems = document.querySelectorAll(".faq-item");
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const subtotal = document.getElementById("subtotal");
  const total = document.getElementById("total");
  const emptyCartBtn = document.getElementById("emptyCart");
  const checkoutBtn = document.getElementById("checkout");
  const contactForm = document.getElementById("contactForm");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  init();

  function init() {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    });

    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("active");
      navContentRight.classList.toggle("active");
      this.setAttribute("aria-expanded", this.classList.contains("active"));
      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });

    document
      .querySelectorAll("#menu li a, .mobile-nav-buttons a")
      .forEach((element) => {
        element.addEventListener("click", function () {
          if (window.innerWidth <= 768) {
            hamburger.classList.remove("active");
            menu.classList.remove("active");
            navContentRight.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          }
        });
      });

    document.addEventListener("click", function (e) {
      if (
        !e.target.closest(".nav-content-right") &&
        !e.target.closest("#hamburger")
      ) {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
        navContentRight.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    const currentPage = location.pathname.split("/").pop() || "index.html";
    if (currentPage !== "cart.html") {
      document.querySelectorAll("#menu li a").forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) link.classList.add("active");
      });
    }

    loadCartItems();
    updateCartCount();
    if (emptyCartBtn) emptyCartBtn.addEventListener("click", emptyCart);
    if (checkoutBtn) checkoutBtn.addEventListener("click", handleCheckout);
    window.addEventListener("storage", handleStorageChange);

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", function () {
          const isExpanded = question.getAttribute("aria-expanded") === "true";
          faqItems.forEach((otherItem) => {
            const otherQuestion = otherItem.querySelector(".faq-question");
            otherQuestion.setAttribute("aria-expanded", "false");
            otherItem.classList.remove("active");
          });
          if (!isExpanded) {
            question.setAttribute("aria-expanded", "true");
            item.classList.add("active");
          }
        });

        question.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            question.click();
          }
        });
      }
    });

    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        if (name && email && subject && message) {
          showToast("Message sent successfully!", "success");
          contactForm.reset();
        } else {
          showToast("Please fill in all fields.", "error");
        }
      });
    }
  }

  function handleStorageChange(e) {
    if (e.key === "cart") {
      cart = JSON.parse(e.newValue) || [];
      loadCartItems();
      updateCartCount();
    }
  }

  function loadCartItems() {
    if (cartItems && cartSummary && subtotal && total) {
      if (cart.length === 0) {
        cartItems.innerHTML = `
    <div class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <h3>Your Cart is Empty</h3>
      <p>Explore our eco-friendly bikes and book your ride today!</p>
      <a href="booking.html" class="btn btn-primary">Book a Ride Now</a>
    </div>
  `;
        cartSummary.style.display = "none";
      } else {
        let itemsHTML = "";
        let calculatedSubtotal = 0;
        const productImages = {
          "Gridcycle Pro": "assets/img/products/product-1.png",
          "Gridcycle Lite": "assets/img/products/product-2.png",
          "Gridcycle Tour": "assets/img/products/product-3.png",
        };

        cart.forEach((item, index) => {
          const date = new Date(item.date);
          const formattedDate = date.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          calculatedSubtotal += item.price;

          itemsHTML += `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-details">
          <div class="cart-item-image">
            <img src="${
              productImages[item.product] || "assets/img/product/product1.png"
            }" alt="${item.product}" />
          </div>
          <div class="cart-item-info">
            <h3>${item.product}</h3>
            <p>£${item.price.toFixed(2)} per hour</p>
            <p class="cart-item-date">${formattedDate} at ${item.time}</p>
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

        document.querySelectorAll(".action-btn.delete").forEach((button) => {
          button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            removeFromCart(index);
          });
        });
      }
    }
    updateCartCount();
  }

  function updateCartCount() {
    const count = cart.length;
    cartCounts.forEach((el) => (el.textContent = count));
  }

  function dispatchCartUpdate() {
    const event = new StorageEvent("storage", {
      key: "cart",
      newValue: JSON.stringify(cart),
    });
    window.dispatchEvent(event);
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    const itemToRemove = document.querySelector(
      `.cart-item[data-index="${index}"]`
    );
    if (itemToRemove) {
      itemToRemove.style.transform = "translateX(-100%)";
      itemToRemove.style.opacity = "0";
      setTimeout(() => loadCartItems(), 300);
    } else {
      loadCartItems();
    }
  }

  function emptyCart() {
    if (confirm("Are you sure you want to empty your cart?")) {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatchCartUpdate();
      const items = document.querySelectorAll(".cart-item");
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        item.style.transform = "translateX(-100%)";
        item.style.opacity = "0";
      });
      setTimeout(() => loadCartItems(), 300 + items.length * 100);
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

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    let icon = "";
    switch (type) {
      case "success":
        icon = "✓";
        break;
      case "error":
        icon = "✗";
        break;
      case "warning":
        icon = "⚠";
        break;
      case "info":
        icon = "ℹ";
        break;
    }
    toast.innerHTML = `
<span class="toast-icon">${icon}</span>
<span class="toast-message">${message}</span>
<span class="toast-close">×</span>
`;
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", function () {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    });
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
