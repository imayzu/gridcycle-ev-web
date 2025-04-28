document.addEventListener("DOMContentLoaded", function () {
  const cartButtons = document.querySelectorAll(".cart-btn");
  const loginButtons = document.querySelectorAll(".login-btn");
  const footer = document.querySelector(".footer");

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

  const animateElements = () => {
    const elements = document.querySelectorAll(
      ".hero-section, .feature-item, .testimonials-section, .cta-card, .footer"
    );
    const windowHeight = window.innerHeight;
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < windowHeight) {
        element.classList.add("animated");
      }
    });

    if (footer) {
      footer.classList.add("animated");
      footer.style.display = "block";
      footer.style.opacity = "1";
      footer.style.transform = "none";
      footer.style.visibility = "visible";
      footer.style.position = "relative";
      footer.style.zIndex = "1";
    }
  };

  animateElements();
  window.addEventListener("scroll", animateElements);

  if (footer) {
    footer.classList.add("animated");
    footer.style.display = "block";
    footer.style.opacity = "1";
    footer.style.transform = "none";
    footer.style.visibility = "visible";
    footer.style.position = "relative";
    footer.style.zIndex = "1";
  }
});
