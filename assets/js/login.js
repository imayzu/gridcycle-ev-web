document.addEventListener("DOMContentLoaded", function () {
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginContent = document.getElementById("loginContent");
    const signupContent = document.getElementById("signupContent");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");
    const authFooterText = document.getElementById("authFooterText");
    const toggleAuthLink = document.getElementById("toggleAuthLink");

    function showLogin() {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginContent.classList.add("active");
      signupContent.classList.remove("active");
      authTitle.textContent = "Welcome Back";
      authSubtitle.textContent = "Login to access your account";
      authFooterText.innerHTML =
        'Don\'t have an account? <a href="#" id="toggleAuthLink">Sign up</a>';
      document.getElementById("loginErrorMessage").textContent = "";
    }

    function showSignup() {
      loginTab.classList.remove("active");
      signupTab.classList.add("active");
      loginContent.classList.remove("active");
      signupContent.classList.add("active");
      authTitle.textContent = "Create Account";
      authSubtitle.textContent = "Join our eco-friendly community";
      authFooterText.innerHTML =
        'Already have an account? <a href="#" id="toggleAuthLink">Login</a>';
      document.getElementById("signupErrorMessage").textContent = "";
    }

    loginTab.addEventListener("click", showLogin);
    signupTab.addEventListener("click", showSignup);

    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "toggleAuthLink") {
        e.preventDefault();
        if (loginTab.classList.contains("active")) {
          showSignup();
        } else {
          showLogin();
        }
      }
    });

    
    const currentUser = JSON.parse(
      localStorage.getItem("gridcycleCurrentUser")
    );
    const urlParams = new URLSearchParams(window.location.search);

    
    if (currentUser && urlParams.get("fromCart") === "true") {
      const redirectUrl =
        localStorage.getItem("redirectAfterLogin") || "cart.html";
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectUrl.includes("?")
        ? `${redirectUrl}&fromLogin=true`
        : `${redirectUrl}?fromLogin=true`;
      return;
    }

    
    

    
    const loginForm = document.getElementById("loginForm");
    const loginErrorMessage = document.getElementById("loginErrorMessage");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      
      if (!email || !password) {
        loginErrorMessage.textContent = "Please fill in all fields";
        return;
      }

      authenticateUser(email, password);
    });

    
    const signupForm = document.getElementById("signupForm");
    const signupErrorMessage =
      document.getElementById("signupErrorMessage");

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword"
      ).value;

      
      if (!name || !email || !password || !confirmPassword) {
        signupErrorMessage.textContent = "Please fill in all fields";
        return;
      }

      if (password !== confirmPassword) {
        signupErrorMessage.textContent = "Passwords do not match";
        return;
      }

      if (password.length < 6) {
        signupErrorMessage.textContent =
          "Password must be at least 6 characters";
        return;
      }

      registerUser(name, email, password);
    });

    function authenticateUser(email, password) {
      
      const loginBtn = loginForm.querySelector("button");
      loginBtn.disabled = true;
      loginBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

      
      setTimeout(() => {
        
        if (email === "demo@gridcycle.com" && password === "demo123") {
          const userData = {
            name: "Demo User",
            email: email,
            token: "mock-auth-token",
          };

          localStorage.setItem(
            "gridcycleCurrentUser",
            JSON.stringify(userData)
          );

          
          const urlParams = new URLSearchParams(window.location.search);
          let redirectUrl = "index.html"; 

          if (urlParams.get("fromCart") === "true") {
            redirectUrl =
              localStorage.getItem("redirectAfterLogin") || "cart.html";
          }

          
          localStorage.removeItem("redirectAfterLogin");

          
          const separator = redirectUrl.includes("?") ? "&" : "?";
          window.location.href = `${redirectUrl}${separator}fromLogin=true`;
        } else {
          loginErrorMessage.textContent = "Invalid email or password";
          loginBtn.disabled = false;
          loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
      }, 1000);
    }

    function registerUser(name, email, password) {
      
      const signupBtn = signupForm.querySelector("button");
      signupBtn.disabled = true;
      signupBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

      
      setTimeout(() => {
        const userData = {
          name: name,
          email: email,
          token: "mock-auth-token",
        };

        localStorage.setItem(
          "gridcycleCurrentUser",
          JSON.stringify(userData)
        );

        
        const urlParams = new URLSearchParams(window.location.search);
        let redirectUrl = "index.html"; 

        if (urlParams.get("fromCart") === "true") {
          redirectUrl =
            localStorage.getItem("redirectAfterLogin") || "cart.html";
        }

        
        localStorage.removeItem("redirectAfterLogin");

        
        const separator = redirectUrl.includes("?") ? "&" : "?";
        window.location.href = `${redirectUrl}${separator}fromLogin=true`;
      }, 1500);
    }
  });