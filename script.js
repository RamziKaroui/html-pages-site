(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light" : "Dark";
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  };

  const initialTheme =
    localStorage.getItem("theme") ||
    root.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  applyTheme(initialTheme);

  toggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  document.querySelectorAll("[data-static-login]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Login request ready for support portal integration.";
      }
    });
  });

  const walletButtons = document.querySelectorAll("[data-wallet-target]");
  const walletPanels = document.querySelectorAll(".wallet-panel");
  const walletContent = document.querySelector("[data-wallet-content]");

  walletButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.walletTarget;

      if (walletContent) {
        walletContent.hidden = false;
      }

      walletButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      walletPanels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.hidden = true;
        panel.classList.remove("is-active");

        if (isActive) {
          panel.hidden = false;
          panel.classList.add("is-active");
        }
      });
    });
  });

  document.querySelectorAll("[data-logo-carousel]").forEach((carousel) => {
    const cards = Array.from(carousel.querySelectorAll(".customer-logo-card"));
    let index = 0;
    let isPaused = false;

    if (cards.length < 2) {
      return;
    }

    const advance = () => {
      if (isPaused) {
        return;
      }

      index = (index + 1) % cards.length;
      carousel.scrollTo({
        left: cards[index].offsetLeft - cards[0].offsetLeft,
        behavior: "smooth",
      });
    };

    carousel.addEventListener("mouseenter", () => {
      isPaused = true;
    });

    carousel.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    carousel.addEventListener("focusin", () => {
      isPaused = true;
    });

    carousel.addEventListener("focusout", () => {
      isPaused = false;
    });

    setInterval(advance, 2000);
  });
})();
