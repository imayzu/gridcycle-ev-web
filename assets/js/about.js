document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const menuContainer = document.getElementById("menu-container");
  const cartButtons = document.querySelectorAll(".cart-btn, #cartButtonMobile");
  const loginButtons = document.querySelectorAll(
    ".login-btn, #loginButtonMobile"
  );

  updateCartCount();

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    menuContainer.classList.toggle("active");
    document.body.style.overflow = menuContainer.classList.contains("active")
      ? "hidden"
      : "";
  });

  document
    .querySelectorAll("#menu-mobile a, #menu-container .nav-btn")
    .forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });

  document.addEventListener("click", function (event) {
    if (shouldCloseMenu(event)) {
      closeMobileMenu();
    }
  });

  setupButtonActions();

  setupScrollAnimations();

  window.addEventListener("resize", handleResize);

  window.addEventListener("storage", function (e) {
    if (e.key === "cart") {
      updateCartCount();
    }
  });

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElements = document.querySelectorAll(".cart-count");
    countElements.forEach((element) => {
      element.textContent = cart.length;
    });

    document.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: cart.length },
      })
    );
  }

  function closeMobileMenu() {
    hamburger.classList.remove("active");
    menuContainer.classList.remove("active");
    document.body.style.overflow = "";
  }

  function shouldCloseMenu(event) {
    return (
      window.innerWidth <= 768 &&
      !event.target.closest("#menu-container") &&
      !event.target.closest("#hamburger") &&
      menuContainer.classList.contains("active")
    );
  }

  function setupButtonActions() {
    cartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "cart.html";
      });
    });

    loginButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "login.html";
      });
    });
  }

  function setupScrollAnimations() {
    const animateElements = () => {
      const elements = document.querySelectorAll(
        ".hero-section, .feature-item, .testimonials-section, .cta-card, .footer-container"
      );
      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        if (elementPosition < windowHeight - 100) {
          element.classList.add("animated");
        }
      });
    };

    animateElements();

    window.addEventListener("scroll", animateElements);
  }

  function handleResize() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }

  document.addEventListener("cartModified", function () {
    updateCartCount();
  });
});
