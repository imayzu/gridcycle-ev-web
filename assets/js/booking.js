document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const cartButtons = document.querySelectorAll(".cart-btn");
  const loginButtons = document.querySelectorAll(".login-btn");
  const cartCounts = document.querySelectorAll(".cart-count");
  const toastContainer = document.getElementById("toastContainer");
  const bookingModal = document.getElementById("bookingModal");
  const closeModal = document.getElementById("closeModal");
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
  const bookNowButtons = document.querySelectorAll(".book-now-btn");

  let selectedDate = null;
  let selectedTime = null;
  let selectedDuration = null;
  let selectedLocation = null;
  let selectedProduct = null;
  let selectedPrice = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let geocodingCache = JSON.parse(localStorage.getItem("geocodingCache")) || {};
  const CACHE_EXPIRY_DAYS = 7;

  function init() {
    setupNavigation();
    setupBookingEventListeners();
    updateCartCount();
    generateCalendar(currentMonth, currentYear);
    initAnimations();
  }

  function setupNavigation() {
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

    document.querySelectorAll("#menu a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          hamburger.classList.remove("active");
          menu.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

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

    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#menu li a").forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === currentPage) link.classList.add("active");
    });
  }

  function setupBookingEventListeners() {
    bookNowButtons.forEach((button) => {
      button.addEventListener("click", function () {
        selectedProduct = this.getAttribute("data-product");
        selectedPrice = parseFloat(this.getAttribute("data-price"));
        openBookingModal();
      });
    });

    closeModal.addEventListener("click", closeBookingModal);

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

    toTimeSelection.addEventListener("click", function () {
      if (!selectedDate) {
        showToast("Please select a date", "error");
        return;
      }
      navigateToStep(2);
      generateTimeSlots();
    });

    backToDateSelection.addEventListener("click", () => navigateToStep(1));

    toDurationSelection.addEventListener("click", function () {
      if (!selectedTime) {
        showToast("Please select a time slot", "error");
        return;
      }
      navigateToStep(3);
    });

    backToTimeSelection.addEventListener("click", () => navigateToStep(2));

    toLocationSelection.addEventListener("click", function () {
      if (!selectedDuration) {
        showToast("Please select a duration", "error");
        return;
      }
      navigateToStep(4);
    });

    backToDurationSelection.addEventListener("click", () => navigateToStep(3));

    toReview.addEventListener("click", function () {
      if (!dropoffLocation.value) {
        showToast("Please enter a drop-off location", "error");
        return;
      }
      selectedLocation = dropoffLocation.value;
      navigateToStep(5);
      updateReviewDetails();
    });

    backToLocationSelection.addEventListener("click", () => navigateToStep(4));

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
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        duration: hours,
        location: selectedLocation,
        price: parseFloat(totalPrice),
        image: document
          .querySelector(`.book-now-btn[data-product="${selectedProduct}"]`)
          .closest(".product-card")
          .querySelector("img").src,
      };

      cart.push(booking);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      closeBookingModal();
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

    useCurrentLocation.addEventListener("click", getCurrentLocation);

    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
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
      calendarHTML += '<div class="calendar-day disabled"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();

      let dayClass = "calendar-day";
      if (isToday) dayClass += " today";
      if (isPast) dayClass += " disabled";
      if (isSelected) dayClass += " selected";

      calendarHTML += `<div class="${dayClass}" data-day="${day}">${day}</div>`;
    }

    calendarDates.innerHTML = calendarHTML;

    document.querySelectorAll(".calendar-day:not(.disabled)").forEach((day) => {
      day.addEventListener("click", function () {
        const dayNum = parseInt(this.getAttribute("data-day"));
        selectedDate = new Date(year, month, dayNum);

        document
          .querySelectorAll(".calendar-day")
          .forEach((d) => d.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
  }

  function generateTimeSlots() {
    if (!selectedDate) return;

    const timeSlotsHTML = [];
    const startHour = 8;
    const endHour = 20;
    const now = new Date();

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeLabel = `${hour}:00 - ${hour + 1}:00`;
      const isSelected = selectedTime === timeLabel;
      const slotTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hour
      );
      const isPast = slotTime < now;

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
        document
          .querySelectorAll(".time-slot")
          .forEach((s) => s.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
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
    const formattedDate = selectedDate.toLocaleDateString("en-GB", options);
    const hours = parseInt(selectedDuration);
    const totalPrice = (selectedPrice * hours).toFixed(2);

    reviewDate.textContent = formattedDate;
    reviewTime.textContent = selectedTime;
    reviewDuration.textContent = `${hours} ${hours === 1 ? "hour" : "hours"}`;
    reviewLocation.textContent = selectedLocation;
    reviewProduct.textContent = selectedProduct;
    reviewPrice.textContent = `£${totalPrice}`;
  }

  function navigateToStep(step) {
    [step1, step2, step3, step4, step5].forEach((s, i) => {
      s.classList.toggle("active", i + 1 === step);
      s.classList.toggle("completed", i + 1 < step);
      s.setAttribute("aria-selected", i + 1 === step);
    });

    dateSelection.classList.toggle("active", step === 1);
    timeSelection.classList.toggle("active", step === 2);
    durationSelection.classList.toggle("active", step === 3);
    locationSelection.classList.toggle("active", step === 4);
    reviewSelection.classList.toggle("active", step === 5);

    [
      dateSelection,
      timeSelection,
      durationSelection,
      locationSelection,
      reviewSelection,
    ].forEach((panel, i) => {
      panel.hidden = i + 1 !== step;
    });
  }

  function openBookingModal() {
    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    generateCalendar(currentMonth, currentYear);
  }

  function closeBookingModal() {
    bookingModal.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    saveGeocodingCache();
  }

  function resetBookingModal() {
    navigateToStep(1);
    selectedDate = null;
    selectedTime = null;
    selectedDuration = null;
    selectedLocation = null;
    dropoffLocation.value = "";
    durationOptions.forEach((opt) => opt.classList.remove("selected"));
    generateCalendar(currentMonth, currentYear);
  }

  function updateCartCount() {
    const count = cart.length;
    cartCounts.forEach((el) => (el.textContent = count));
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }

    const button = useCurrentLocation;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
    button.disabled = true;

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: /Mobi|Android/i.test(navigator.userAgent) ? 0 : 30000,
        });
      });

      const address = await getAddressFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      dropoffLocation.value = address;
      selectedLocation = address;
      showToast("Location set successfully", "success");
    } catch (error) {
      let errorMessage = "Unable to get your location";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location access was denied. Please enable permissions.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "Location information unavailable. Check your connection.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please try again.";
          break;
      }
      showToast(errorMessage, "error");
    } finally {
      button.innerHTML = originalHTML;
      button.disabled = false;
    }
  }

  async function getAddressFromCoordinates(lat, lon) {
    const cacheKey = `${lat.toFixed(4)}|${lon.toFixed(4)}`;
    const cachedResult = geocodingCache[cacheKey];

    if (cachedResult && !isCacheExpired(cachedResult.timestamp)) {
      return cachedResult.address;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en-GB",
            Referer: window.location.href,
          },
        }
      );

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      const address = data.address || {};

      const addressParts = [
        address.house_number,
        address.road,
        `${address.city || address.town || address.village || ""} ${
          address.postcode || ""
        }`.trim(),
        address.country,
      ].filter((part) => part && part.trim() !== "");

      const formattedAddress = addressParts.join(", ");
      geocodingCache[cacheKey] = {
        address: formattedAddress,
        timestamp: Date.now(),
      };
      saveGeocodingCache();

      return (
        formattedAddress ||
        `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`
      );
    } catch (error) {
      console.error("Address lookup failed:", error);
      if (cachedResult) return cachedResult.address;
      return `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  }

  function isCacheExpired(timestamp) {
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return now - timestamp > expiryTime;
  }

  function saveGeocodingCache() {
    for (const key in geocodingCache) {
      if (isCacheExpired(geocodingCache[key].timestamp)) {
        delete geocodingCache[key];
      }
    }
    localStorage.setItem("geocodingCache", JSON.stringify(geocodingCache));
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
    }, 5000);
  }

  function initAnimations() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animated");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      document
        .querySelectorAll(".product-card, .footer-container")
        .forEach((el) => {
          observer.observe(el);
        });
    } else {
      document
        .querySelectorAll(".product-card, .footer-container")
        .forEach((el) => {
          el.classList.add("animated");
        });
    }
  }

  init();
});
