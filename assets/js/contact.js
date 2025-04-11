document.addEventListener("DOMContentLoaded", function () {
  
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const cartCount = document.getElementById("cartCount");
  const mobileCartCount = document.getElementById("mobileCartCount");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  
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

    
    updateCartCount();

    
    setupFAQ();

    
    if (contactForm) {
      contactForm.addEventListener("submit", handleFormSubmit);
    }
  }

  function updateCartCount() {
    const count = cart.length;
    cartCount.textContent = count;
    mobileCartCount.textContent = count;
  }

  function setupFAQ() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const item = question.parentElement;
        item.classList.toggle("active");

        
        faqQuestions.forEach((q) => {
          if (q !== question) {
            q.parentElement.classList.remove("active");
          }
        });
      });
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    
    

    showToast("Your message has been sent successfully!", "success");

    
    contactForm.reset();
  }

  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toast.className = "toast";
    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});
