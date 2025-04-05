document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const openBookingModal = document.getElementById("openBookingModal");
  const bookingModal = document.getElementById("bookingModal");
  const closeModal = document.getElementById("closeModal");
  const loginButton = document.getElementById("loginButton");
  const loginRequiredModal = document.getElementById("loginRequiredModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const goToLogin = document.getElementById("goToLogin");
  const goToSignup = document.getElementById("goToSignup");
  const toastContainer = document.getElementById("toastContainer");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");
  const step5 = document.getElementById("step5");
  const dateSelection = document.getElementById("dateSelection");
  const timeSelection = document.getElementById("timeSelection");
  const durationSelection = document.getElementById("durationSelection");
  const locationSelection = document.getElementById("locationSelection");
  const reviewSelection = document.getElementById("reviewSelection");
  const toTimeSelection = document.getElementById("toTimeSelection");
  const backToDateSelection = document.getElementById("backToDateSelection");
  const toDurationSelection = document.getElementById("toDurationSelection");
  const backToTimeSelection = document.getElementById("backToTimeSelection");
  const toLocationSelection = document.getElementById("toLocationSelection");
  const backToDurationSelection = document.getElementById(
    "backToDurationSelection"
  );
  const toReview = document.getElementById("toReview");
  const backToLocationSelection = document.getElementById(
    "backToLocationSelection"
  );
  const completeBooking = document.getElementById("completeBooking");
  const currentMonthYear = document.getElementById("currentMonthYear");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const calendarDates = document.getElementById("calendarDates");
  const timeSlots = document.getElementById("timeSlots");
  const durationOptions = document.querySelectorAll(".duration-option");
  const dropoffLocation = document.getElementById("dropoffLocation");
  const useCurrentLocation = document.getElementById("useCurrentLocation");
  const reviewDate = document.getElementById("reviewDate");
  const reviewTime = document.getElementById("reviewTime");
  const reviewDuration = document.getElementById("reviewDuration");
  const reviewLocation = document.getElementById("reviewLocation");
  const reviewProduct = document.getElementById("reviewProduct");
  const reviewPrice = document.getElementById("reviewPrice");
  const cookiesAlert = document.getElementById("cookiesAlert");
  const acceptCookies = document.getElementById("acceptCookies");
  const declineCookies = document.getElementById("declineCookies");

  let selectedDate = null;
  let selectedTime = null;
  let selectedDuration = null;
  let selectedLocation = null;
  let selectedProduct = null;
  let selectedPrice = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let isLoggedIn = false;

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

    
    document.querySelectorAll("#menu li a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          hamburger.classList.remove("active");
          menu.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#menu li a").forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });

    const featureItems = document.querySelectorAll(".feature-item");
    featureItems.forEach((item) => {
      item.addEventListener("touchstart", function () {
        this.classList.add("active-touch");
      });
      item.addEventListener("touchend", function () {
        setTimeout(() => {
          this.classList.remove("active-touch");
        }, 300);
      });
    });

    initAnimations();
    const heroSections = document.querySelectorAll(".hero-section");
    heroSections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }, index * 300 + 200);
    });

    setupBookingModal();
    updateCartCount();

    if (!localStorage.getItem("cookiesAccepted")) {
      setTimeout(() => {
        cookiesAlert.classList.add("show");
      }, 2000);
    }
  }

  function initAnimations() {
    if ("IntersectionObserver" in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };
      const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            if (target.classList.contains("feature-item")) {
              target.style.opacity = "1";
              target.style.transform = "translateX(0)";
            } else if (
              target.classList.contains("product-card") ||
              target.classList.contains("cta-card") ||
              target.classList.contains("footer-container")
            ) {
              target.classList.add("animated");
            }
            observer.unobserve(target);
          }
        });
      };
      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
      );
      document
        .querySelectorAll(
          ".feature-item, .product-card, .cta-card, .footer-container"
        )
        .forEach((el) => {
          observer.observe(el);
        });
    } else {
      const animateElements = () => {
        const windowHeight = window.innerHeight;
        const elements = document.querySelectorAll(
          ".feature-item, .product-card, .cta-card, .footer-container"
        );
        elements.forEach((el) => {
          const elementTop = el.getBoundingClientRect().top;
          if (elementTop < windowHeight - 100) {
            if (el.classList.contains("feature-item")) {
              el.style.opacity = "1";
              el.style.transform = "translateX(0)";
            } else {
              el.classList.add("animated");
            }
          }
        });
      };
      animateElements();
      window.addEventListener("scroll", animateElements);
    }
  }

  function setupBookingModal() {
    openBookingModal.addEventListener("click", function () {
      bookingModal.classList.add("active");
      document.body.style.overflow = "hidden";
      generateCalendar(currentMonth, currentYear);
    });

    closeModal.addEventListener("click", function () {
      bookingModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    cartButton.addEventListener("click", function () {
      window.location.href = "cart.html";
    });

    loginButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });

    closeLoginModal.addEventListener("click", function () {
      loginRequiredModal.style.display = "none";
      document.body.style.overflow = "";
    });

    goToLogin.addEventListener("click", function () {
      showToast("Redirecting to login page", "info");
    });

    goToSignup.addEventListener("click", function () {
      showToast("Redirecting to signup page", "info");
    });

    document.querySelectorAll(".book-now-btn").forEach((button) => {
      button.addEventListener("click", function () {
        selectedProduct = this.getAttribute("data-product");
        selectedPrice = parseFloat(this.getAttribute("data-price"));
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";
        generateCalendar(currentMonth, currentYear);
      });
    });

    toTimeSelection.addEventListener("click", function () {
      if (!selectedDate) {
        showToast("Please select a date", "error");
        return;
      }
      step1.classList.remove("active");
      step1.classList.add("completed");
      step2.classList.add("active");
      dateSelection.classList.remove("active");
      timeSelection.classList.add("active");
      generateTimeSlots();
    });

    backToDateSelection.addEventListener("click", function () {
      step1.classList.add("active");
      step1.classList.remove("completed");
      step2.classList.remove("active");
      dateSelection.classList.add("active");
      timeSelection.classList.remove("active");
    });

    toDurationSelection.addEventListener("click", function () {
      if (!selectedTime) {
        showToast("Please select a time slot", "error");
        return;
      }
      step2.classList.remove("active");
      step2.classList.add("completed");
      step3.classList.add("active");
      timeSelection.classList.remove("active");
      durationSelection.classList.add("active");
    });

    backToTimeSelection.addEventListener("click", function () {
      step2.classList.add("active");
      step2.classList.remove("completed");
      step3.classList.remove("active");
      timeSelection.classList.add("active");
      durationSelection.classList.remove("active");
    });

    toLocationSelection.addEventListener("click", function () {
      if (!selectedDuration) {
        showToast("Please select a duration", "error");
        return;
      }
      step3.classList.remove("active");
      step3.classList.add("completed");
      step4.classList.add("active");
      durationSelection.classList.remove("active");
      locationSelection.classList.add("active");
    });

    backToDurationSelection.addEventListener("click", function () {
      step3.classList.add("active");
      step3.classList.remove("completed");
      step4.classList.remove("active");
      durationSelection.classList.add("active");
      locationSelection.classList.remove("active");
    });

    toReview.addEventListener("click", function () {
      if (!dropoffLocation.value) {
        showToast("Please enter a drop-off location", "error");
        return;
      }
      selectedLocation = dropoffLocation.value;
      step4.classList.remove("active");
      step4.classList.add("completed");
      step5.classList.add("active");
      locationSelection.classList.remove("active");
      reviewSelection.classList.add("active");
      updateReviewDetails();
    });

    backToLocationSelection.addEventListener("click", function () {
      step4.classList.add("active");
      step4.classList.remove("completed");
      step5.classList.remove("active");
      locationSelection.classList.add("active");
      reviewSelection.classList.remove("active");
    });

    completeBooking.addEventListener("click", function () {
      if (
        !selectedDate ||
        !selectedTime ||
        !selectedDuration ||
        !selectedLocation ||
        !selectedProduct ||
        !selectedPrice
      ) {
        showToast("Please complete your booking details", "error");
        return;
      }
      const hours = parseInt(selectedDuration);
      const totalPrice = (selectedPrice * hours).toFixed(2);
      const booking = {
        product: selectedProduct,
        date: selectedDate,
        time: selectedTime,
        duration: hours,
        location: selectedLocation,
        price: parseFloat(totalPrice),
      };
      cart.push(booking);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      bookingModal.classList.remove("active");
      document.body.style.overflow = "";
      resetBookingModal();
      showToast(`${selectedProduct} has been added to your cart!`, "success");
    });

    durationOptions.forEach((option) => {
      option.addEventListener("click", function () {
        durationOptions.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");
        selectedDuration = this.getAttribute("data-hours");
      });
    });

    
    useCurrentLocation.addEventListener("click", function () {
      if (navigator.geolocation) {
        
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
        this.disabled = true;

        
        const timeout = setTimeout(() => {
          showToast("Location service is taking longer than usual", "info");
        }, 6000);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeout);
            const { latitude, longitude } = position.coords;
            dropoffLocation.value = `Current Location (${latitude.toFixed(
              4
            )}, ${longitude.toFixed(4)})`;
            showToast("Current location set", "success");
            this.innerHTML =
              '<i class="fas fa-location-arrow"></i> Use Current Location';
            this.disabled = false;
          },
          (error) => {
            clearTimeout(timeout);
            let errorMessage = "Unable to get your location";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access was denied";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information unavailable";
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out";
                break;
            }
            showToast(errorMessage, "error");
            console.error("Geolocation error:", error);
            this.innerHTML =
              '<i class="fas fa-location-arrow"></i> Use Current Location';
            this.disabled = false;
          },
          {
            enableHighAccuracy: true, 
            maximumAge: 30000, 
            timeout: 10000, 
          }
        );
      } else {
        showToast("Geolocation is not supported by your browser", "error");
      }
    });

    prevMonthBtn.addEventListener("click", function () {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener("click", function () {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      generateCalendar(currentMonth, currentYear);
    });
  }

  function generateCalendar(month, year) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    let calendarHTML = "";
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += `<div class="calendar-day disabled"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isPast = date < today && !isToday;
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      let dayClass = "calendar-day";
      if (isToday) dayClass += " today";
      if (isPast) dayClass += " disabled";
      if (isSelected) dayClass += " selected";
      calendarHTML += `<div class="${dayClass}" data-day="${day}">${day}</div>`;
    }
    calendarDates.innerHTML = calendarHTML;
    document.querySelectorAll(".calendar-day:not(.disabled)").forEach((day) => {
      day.addEventListener("click", function () {
        const day = parseInt(this.getAttribute("data-day"));
        selectedDate = new Date(year, month, day);
        document.querySelectorAll(".calendar-day").forEach((d) => {
          d.classList.remove("selected");
        });
        this.classList.add("selected");
      });
    });
  }

  function generateTimeSlots() {
    if (!selectedDate) return;
    const timeSlotsHTML = [];
    const startHour = 8;
    const endHour = 20;
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeLabel = `${hour}:00 - ${hour + 1}:00`;
      const isSelected = selectedTime === timeLabel;
      const isPast = isTimeSlotInPast(hour);
      let slotClass = "time-slot";
      if (isSelected) slotClass += " selected";
      if (isPast) slotClass += " disabled";
      timeSlotsHTML.push(
        `<div class="${slotClass}" data-hour="${hour}">${timeLabel}</div>`
      );
    }
    timeSlots.innerHTML = timeSlotsHTML.join("");
    document.querySelectorAll(".time-slot:not(.disabled)").forEach((slot) => {
      slot.addEventListener("click", function () {
        selectedTime = this.textContent;
        document.querySelectorAll(".time-slot").forEach((s) => {
          s.classList.remove("selected");
        });
        this.classList.add("selected");
      });
    });
  }

  function isTimeSlotInPast(hour) {
    if (!selectedDate) return true;
    const now = new Date();
    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hour
    );
    return selectedDateTime < now;
  }

  function updateReviewDetails() {
    if (
      !selectedDate ||
      !selectedTime ||
      !selectedDuration ||
      !selectedLocation ||
      !selectedProduct ||
      !selectedPrice
    )
      return;
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = selectedDate.toLocaleDateString("en-US", options);
    const hours = parseInt(selectedDuration);
    const totalPrice = (selectedPrice * hours).toFixed(2);
    reviewDate.textContent = `Date: ${formattedDate}`;
    reviewTime.textContent = `Time: ${selectedTime}`;
    reviewDuration.textContent = `Duration: ${hours} ${
      hours === 1 ? "hour" : "hours"
    }`;
    reviewLocation.textContent = `Location: ${selectedLocation}`;
    reviewProduct.textContent = `Product: ${selectedProduct}`;
    reviewPrice.textContent = `Total Price: £${totalPrice}`;
  }

  function resetBookingModal() {
    step1.classList.add("active");
    step1.classList.remove("completed");
    step2.classList.remove("active");
    step2.classList.remove("completed");
    step3.classList.remove("active");
    step3.classList.remove("completed");
    step4.classList.remove("active");
    step4.classList.remove("completed");
    step5.classList.remove("active");
    dateSelection.classList.add("active");
    timeSelection.classList.remove("active");
    durationSelection.classList.remove("active");
    locationSelection.classList.remove("active");
    reviewSelection.classList.remove("active");
    selectedDate = null;
    selectedTime = null;
    selectedDuration = null;
    selectedLocation = null;
    dropoffLocation.value = "";
    durationOptions.forEach((opt) => opt.classList.remove("selected"));
    generateCalendar(currentMonth, currentYear);
  }

  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  function showToast(message, type) {
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
      default:
        icon = "";
    }
    toast.innerHTML = `
          <span class="toast-icon">${icon}</span>
          <span class="toast-message">${message}</span>
          <span class="toast-close">×</span>
      `;
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", function () {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }

  acceptCookies.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookiesAlert.classList.remove("show");
    showToast("Cookie preferences saved", "success");
  });

  declineCookies.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "false");
    cookiesAlert.classList.remove("show");
    showToast("Cookie preferences saved", "success");
  });

  generateCalendar(new Date().getMonth(), new Date().getFullYear());
});
