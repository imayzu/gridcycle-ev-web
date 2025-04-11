document.addEventListener("DOMContentLoaded", function () {
  
  const hamburger = document.getElementById("hamburger");
  const menuContainer = document.getElementById("menu-container");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    menuContainer.classList.toggle("active");

    
    if (menuContainer.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElements = document.querySelectorAll(".cart-count");
    countElements.forEach((element) => {
      element.textContent = cart.length;
    });
  };

  
  updateCartCount();

  
  document
    .querySelectorAll("#menu-mobile a, #menu-container .nav-btn")
    .forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          hamburger.classList.remove("active");
          menuContainer.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

  
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth <= 768 &&
      !event.target.closest("#menu-container") &&
      !event.target.closest("#hamburger") &&
      menuContainer.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      menuContainer.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".hero-section, .feature-item, .testimonials-section, .cta-card, .footer-container"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
        element.classList.add("animated");
      }
    });
  };

  
  animateOnScroll();

  
  window.addEventListener("scroll", animateOnScroll);

  
  const setupButtonActions = () => {
    const cartButtons = document.querySelectorAll(
      ".cart-btn, #cartButtonMobile"
    );
    const loginButtons = document.querySelectorAll(
      ".login-btn, #loginButtonMobile"
    );

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
  };

  setupButtonActions();

  
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      
      hamburger.classList.remove("active");
      menuContainer.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});
