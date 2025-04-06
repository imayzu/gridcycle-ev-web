document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const cartCount = document.getElementById("cartCount");
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

    renderProducts();
    updateCartCount();
    setupEventListeners();
    generateCalendar(currentMonth, currentYear);
  }

  function renderProducts() {
    const productsGrid = document.getElementById("productsGrid");
    let html = "";

    products.forEach((product) => {
      html += `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
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
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        duration: hours,
        location: selectedLocation,
        price: parseFloat(totalPrice),
        image: products.find((p) => p.name === selectedProduct).image,
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

    useCurrentLocation.addEventListener("click", function () {
      const originalHTML = this.innerHTML;

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
            this.innerHTML = originalHTML;
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
            this.innerHTML = originalHTML;
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
