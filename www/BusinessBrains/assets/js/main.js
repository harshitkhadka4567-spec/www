(function () {
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const consentKey = "businessBrainsCookieConsent";
  const validConsent = ["accepted", "rejected"];

  const getConsent = () => {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  };

  const setConsent = (value) => {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      return;
    }
  };

  document.querySelectorAll("[data-current-year]").forEach((target) => {
    target.textContent = new Date().getFullYear();
  });

  const closeMenu = () => {
    if (!header || !navToggle || !navMenu) {
      return;
    }

    header.classList.remove("nav-open");
    header.style.removeProperty("--mobile-menu-offset");
    navMenu.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    if (!header || !navToggle || !navMenu) {
      return;
    }

    header.classList.add("nav-open");
    navMenu.classList.add("active");
    header.style.setProperty("--mobile-menu-offset", `${navMenu.offsetHeight}px`);
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  if (header && navToggle && navMenu) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      if (header.classList.contains("nav-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;

      if (target && target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;

      if (target && header.classList.contains("nav-open") && !target.closest(".site-header")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) {
        closeMenu();
      } else if (header.classList.contains("nav-open")) {
        header.style.setProperty("--mobile-menu-offset", `${navMenu.offsetHeight}px`);
      }
    });
  }

  const buildCookieBanner = () => {
    const existingBanner = document.querySelector(".cookie-banner");

    if (existingBanner) {
      return existingBanner;
    }

    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Cookie privacy choices");
    banner.hidden = true;
    banner.innerHTML = `
      <div class="cookie-content">
        <p>Business Brains uses essential website functionality and may use optional cookies to improve the browsing experience. You can accept all cookies or reject optional cookies. <a class="cookie-privacy-link" href="/BusinessBrains/privacy-cookies/index.html">Privacy &amp; Cookies</a></p>
        <div class="cookie-actions">
          <button class="cookie-accept" type="button">Accept All Cookies</button>
          <button class="cookie-reject" type="button">Reject All Cookies</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    return banner;
  };

  const cookieBanner = buildCookieBanner();
  const acceptButton = cookieBanner.querySelector(".cookie-accept");
  const rejectButton = cookieBanner.querySelector(".cookie-reject");

  const showCookieBanner = () => {
    cookieBanner.hidden = false;
    document.body.classList.add("cookie-banner-visible");
  };

  const hideCookieBanner = () => {
    cookieBanner.hidden = true;
    document.body.classList.remove("cookie-banner-visible");
  };

  const saveCookieChoice = (value) => {
    setConsent(value);
    hideCookieBanner();
  };

  if (validConsent.includes(getConsent())) {
    hideCookieBanner();
  } else {
    showCookieBanner();
  }

  acceptButton.addEventListener("click", () => saveCookieChoice("accepted"));
  rejectButton.addEventListener("click", () => saveCookieChoice("rejected"));

  document.querySelectorAll(".cookie-preferences-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showCookieBanner();
      acceptButton.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll(".reveal-stagger").forEach((group) => {
    group.querySelectorAll(".reveal").forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 7% 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
})();
