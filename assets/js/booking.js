document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const cartCount = document.getElementById("cartCount");
  const mobileCartCount = document.getElementById("mobileCartCount");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
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

  let selectedDate = null;
  let selectedTime = null;
  let selectedDuration = null;
  let selectedLocation = null;
  let selectedProduct = null;
  let selectedPrice = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let geolocationWatchId = null;

  let geocodingCache = JSON.parse(localStorage.getItem("geocodingCache")) || {};
  const CACHE_EXPIRY_DAYS = 7;

  const products = [
    {
      id: 1,
      name: "Gridcycle Pro",
      description: "Our premium electric bike with extended battery life",
      price: 15.99,
      features: [
        "50 mile range",
        "3 hour charge time",
        "25 mph top speed",
        "Smartphone integration",
      ],
      image: "assets/img/products/product-1.png",
    },
    {
      id: 2,
      name: "Gridcycle Lite",
      description: "Lightweight and agile for city commuting",
      price: 12.99,
      features: [
        "30 mile range",
        "2.5 hour charge time",
        "20 mph top speed",
        "Foldable design",
      ],
      image: "assets/img/products/product-2.png",
    },
    {
      id: 3,
      name: "Gridcycle Tour",
      description: "Comfortable ride for longer journeys",
      price: 14.5,
      features: [
        "45 mile range",
        "4 hour charge time",
        "22 mph top speed",
        "Ergonomic seating",
      ],
      image: "assets/img/products/product-3.png",
    },
  ];

  init();

  function init() {
    window.addEventListener(
      "scroll",
      throttle(function () {
        navbar.classList.toggle("scrolled", window.scrollY > 10);
      }, 100)
    );

    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });

    document.querySelectorAll("#menu a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    renderProducts();
    updateCartCount();
    setupEventListeners();
    generateCalendar(currentMonth, currentYear);

    window.addEventListener("storage", (e) => {
      if (e.key === "cart") {
        cart = JSON.parse(e.newValue) || [];
        updateCartCount();
      }
    });
  }

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  function renderProducts() {
    const productsGrid = document.getElementById("productsGrid");
    let html = "";

    products.forEach((product) => {
      html += `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">&pound;${product.price.toFixed(
              2
            )}/hour</div>
            <ul class="product-features">
              ${product.features
                .map((feature) => `<li>${feature}</li>`)
                .join("")}
            </ul>
            <button class="book-now-btn" 
              data-product="${product.name}" 
              data-price="${product.price}">
              Book Now
            </button>
          </div>
        </div>
      `;
    });

    productsGrid.innerHTML = html;

    document.querySelectorAll(".book-now-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        selectedProduct = this.getAttribute("data-product");
        selectedPrice = parseFloat(this.getAttribute("data-price"));
        openBookingModal();
      });
    });
  }

  function setupEventListeners() {
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

    backToDateSelection.addEventListener("click", function () {
      navigateToStep(1);
    });

    toDurationSelection.addEventListener("click", function () {
      if (!selectedTime) {
        showToast("Please select a time slot", "error");
        return;
      }
      navigateToStep(3);
    });

    backToTimeSelection.addEventListener("click", function () {
      navigateToStep(2);
    });

    toLocationSelection.addEventListener("click", function () {
      if (!selectedDuration) {
        showToast("Please select a duration", "error");
        return;
      }
      navigateToStep(4);
    });

    backToDurationSelection.addEventListener("click", function () {
      navigateToStep(3);
    });

    toReview.addEventListener("click", function () {
      if (!dropoffLocation.value) {
        showToast("Please enter a drop-off location", "error");
        return;
      }
      selectedLocation = dropoffLocation.value;
      navigateToStep(5);
      updateReviewDetails();
    });

    backToLocationSelection.addEventListener("click", function () {
      navigateToStep(4);
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
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        duration: hours,
        location: selectedLocation,
        price: parseFloat(totalPrice),
        image: products.find((p) => p.name === selectedProduct).image,
      };

      cart.push(booking);
      saveCart();
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

    useCurrentLocation.addEventListener("click", function () {
      getCurrentLocation();
    });

    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  function navigateToStep(step) {
    [step1, step2, step3, step4, step5].forEach((s, i) => {
      s.classList.toggle("active", i + 1 === step);
      s.classList.toggle("completed", i + 1 < step);
    });

    dateSelection.classList.toggle("active", step === 1);
    timeSelection.classList.toggle("active", step === 2);
    durationSelection.classList.toggle("active", step === 3);
    locationSelection.classList.toggle("active", step === 4);
    reviewSelection.classList.toggle("active", step === 5);
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

        document.querySelectorAll(".time-slot").forEach((s) => {
          s.classList.remove("selected");
        });
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
    const formattedDate = selectedDate.toLocaleDateString("en-US", options);
    const hours = parseInt(selectedDuration);
    const totalPrice = (selectedPrice * hours).toFixed(2);

    reviewDate.textContent = formattedDate;
    reviewTime.textContent = selectedTime;
    reviewDuration.textContent = `${hours} ${hours === 1 ? "hour" : "hours"}`;
    reviewLocation.textContent = selectedLocation;
    reviewProduct.textContent = selectedProduct;
    reviewPrice.textContent = `£${totalPrice}`;
  }

  function openBookingModal() {
    bookingModal.classList.add("active");
    document.body.style.overflow = "hidden";
    generateCalendar(currentMonth, currentYear);
  }

  function closeBookingModal() {
    bookingModal.classList.remove("active");
    document.body.style.overflow = "";

    if (geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(geolocationWatchId);
      geolocationWatchId = null;
    }

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
    cartCount.textContent = count;
    if (mobileCartCount) {
      mobileCartCount.textContent = count;
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    const event = new StorageEvent("storage", {
      key: "cart",
      newValue: JSON.stringify(cart),
    });
    window.dispatchEvent(event);
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

  function getCurrentLocation() {
    const originalHTML = useCurrentLocation.innerHTML;

    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }

    if (geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(geolocationWatchId);
    }

    useCurrentLocation.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Locating...';
    useCurrentLocation.disabled = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const timeout = setTimeout(() => {
      showToast("Location service is taking longer than usual", "info");
      useCurrentLocation.innerHTML = originalHTML;
      useCurrentLocation.disabled = false;
    }, 10000);

    geolocationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        clearTimeout(timeout);
        if (geolocationWatchId !== null) {
          navigator.geolocation.clearWatch(geolocationWatchId);
          geolocationWatchId = null;
        }

        const { latitude, longitude } = position.coords;
        reverseGeocodeWithNominatim(latitude, longitude)
          .then((address) => {
            dropoffLocation.value = address;
            showToast("Current location set", "success");
          })
          .catch((error) => {
            console.error("Geocoding error:", error);
            dropoffLocation.value = `Current Location (${latitude.toFixed(
              4
            )}, ${longitude.toFixed(4)})`;
            showToast("Location set (exact address not available)", "info");
          })
          .finally(() => {
            useCurrentLocation.innerHTML = originalHTML;
            useCurrentLocation.disabled = false;
          });
      },
      (error) => {
        clearTimeout(timeout);
        if (geolocationWatchId !== null) {
          navigator.geolocation.clearWatch(geolocationWatchId);
          geolocationWatchId = null;
        }

        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access was denied. Please check your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Location request timed out. Please try again in an open area.";
            break;
        }
        showToast(errorMessage, "error");
        console.error("Geolocation error:", error);
        useCurrentLocation.innerHTML = originalHTML;
        useCurrentLocation.disabled = false;
      },
      options
    );
  }

  async function reverseGeocodeWithNominatim(latitude, longitude) {
    const cacheKey = `${latitude.toFixed(4)}|${longitude.toFixed(4)}`;

    const cachedResult = geocodingCache[cacheKey];
    if (cachedResult && !isCacheExpired(cachedResult.timestamp)) {
      return cachedResult.address;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }

      const data = await response.json();

      const address = data.address;
      const parts = [];

      if (address.house_number) parts.push(address.house_number);
      if (address.road) parts.push(address.road);

      const cityParts = [];
      if (address.city || address.town || address.village) {
        cityParts.push(address.city || address.town || address.village);
      }
      if (address.postcode) cityParts.push(address.postcode);

      if (cityParts.length > 0) {
        parts.push(cityParts.join(" "));
      }

      if (address.country) parts.push(address.country);

      const formattedAddress = parts.join(", ");

      geocodingCache[cacheKey] = {
        address: formattedAddress,
        timestamp: Date.now(),
      };
      saveGeocodingCache();

      return formattedAddress;
    } catch (error) {
      console.error("Nominatim geocoding failed:", error);

      if (cachedResult) {
        return cachedResult.address;
      }

      throw error;
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
});
