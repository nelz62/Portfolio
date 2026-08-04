(function () {
  "use strict";

  // ===== Navigation (your existing code) =====
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = {
    home: document.getElementById("section-home"),
    about: document.getElementById("section-about"),
    contact: document.getElementById("section-contact"),
  };

  function setActiveSection(sectionId) {
    Object.values(sections).forEach((sec) =>
      sec.classList.remove("active-section"),
    );
    if (sections[sectionId])
      sections[sectionId].classList.add("active-section");
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = Array.from(navLinks).find(
      (link) => link.dataset.section === sectionId,
    );
    if (activeLink) activeLink.classList.add("active");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      if (section) setActiveSection(section);
    });
  });

  // ===== Project cards (your existing code) =====
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.tagName === "A") return;
      const link = this.querySelector("a");
      if (link) link.click();
    });
  });

  // =============================================
  // ===== DOT ANIMATION + PORTFOLIO TOGGLE =====
  // =============================================

  // ----- DOM refs -----
  const dot = document.getElementById("movingDot");
  const container = document.getElementById("dotContainer");
  const portfolioPanel = document.getElementById("portfolioPanel");
  const dotArea = document.getElementById("dotArea");
  const closeBtn = document.getElementById("closePortfolioBtn");

  // ----- animation state -----
  let x = 20,
    y = 20;
  let vx = 2.3,
    vy = 1.9;
  const dotSize = 44;
  let containerWidth = 0,
    containerHeight = 0;
  let animFrameId = null;

  // ----- bounds update -----
  function updateBounds() {
    const rect = container.getBoundingClientRect();
    containerWidth = rect.width;
    containerHeight = rect.height;
    x = Math.min(Math.max(x, 0), containerWidth - dotSize);
    y = Math.min(Math.max(y, 0), containerHeight - dotSize);
    dot.style.left = x + "px";
    dot.style.top = y + "px";
  }

  // ----- animation loop (bouncing) -----
  function animateDot() {
    if (!containerWidth || !containerHeight) {
      updateBounds();
      if (!containerWidth || !containerHeight) {
        animFrameId = requestAnimationFrame(animateDot);
        return;
      }
    }

    x += vx;
    y += vy;

    if (x + dotSize >= containerWidth) {
      x = containerWidth - dotSize;
      vx = -vx;
    } else if (x <= 0) {
      x = 0;
      vx = -vx;
    }

    if (y + dotSize >= containerHeight) {
      y = containerHeight - dotSize;
      vy = -vy;
    } else if (y <= 0) {
      y = 0;
      vy = -vy;
    }

    dot.style.left = x + "px";
    dot.style.top = y + "px";

    animFrameId = requestAnimationFrame(animateDot);
  }

  // ----- start / stop -----
  function startAnimation() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    updateBounds();
    animateDot();
  }

  function stopAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  // ----- resize handling -----
  const resizeObserver = new ResizeObserver(() => updateBounds());
  resizeObserver.observe(container);
  window.addEventListener("resize", updateBounds);

  // =============================================
  // ===== Toggle portfolio + dot =====
  // =============================================
  function togglePortfolio() {
    const isPortfolioHidden = portfolioPanel.classList.contains("hidden");

    if (isPortfolioHidden) {
      // Show portfolio → hide dot & stop animation
      dotArea.classList.add("hidden");
      stopAnimation();
      portfolioPanel.classList.remove("hidden");

      setTimeout(() => {
        portfolioPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } else {
      // Hide portfolio → show dot & resume animation
      dotArea.classList.remove("hidden");
      startAnimation();
      portfolioPanel.classList.add("hidden");
    }
  }

  // ----- Click on dot -----
  dot.addEventListener("click", function (e) {
    e.stopPropagation();
    togglePortfolio();
  });

  // ----- Keyboard support (Enter / Space) -----
  dot.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePortfolio();
    }
  });

  // ----- Close button inside portfolio -----
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!portfolioPanel.classList.contains("hidden")) {
        togglePortfolio();
      }
    });
  }

  // ----- Click outside to close (restores dot) -----
  document.addEventListener("click", function (e) {
    if (portfolioPanel.classList.contains("hidden")) return;

    const isClickInsidePortfolio = portfolioPanel.contains(e.target);
    const isClickOnDot = dot.contains(e.target);
    const isClickOnCloseBtn = closeBtn && closeBtn.contains(e.target);

    if (!isClickInsidePortfolio && !isClickOnDot && !isClickOnCloseBtn) {
      togglePortfolio();
    }
  });

  // Start with portfolio hidden, dot visible & bouncing
  portfolioPanel.classList.add("hidden");
  dotArea.classList.remove("hidden");

  setTimeout(() => {
    updateBounds();
    startAnimation();
  }, 40);

  // pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });

  // cleanup
  window.addEventListener("beforeunload", () => {
    stopAnimation();
    resizeObserver.disconnect();
  });
})(); 