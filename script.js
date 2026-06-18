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

  document.querySelectorAll("[data-evaluation-form]").forEach((form) => {
    const registerDate = form.querySelector("[data-register-date]");
    const params = new URLSearchParams(window.location.search);
    const utmFields = ["utm_source", "utm_campaign", "utm_medium", "utm_keyword"];

    if (registerDate) {
      registerDate.value = new Date().toISOString();
    }

    utmFields.forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        input.value = params.get(field) || "";
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const status = form.querySelector(".form-status");
      const data = new FormData(form);
      const labels = {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email Address",
        company: "Company Name",
        job_title: "Job Title",
        phone: "Phone Number",
        country: "Country",
        state: "State",
        inquiry_type: "Inquiry Type",
        project_timeline: "Project Timeline",
        comment: "Comment",
        register_date: "Register Date",
        utm_source: "utm_source",
        utm_campaign: "utm_campaign",
        utm_medium: "utm_medium",
        utm_keyword: "utm_keyword",
        privacy_consent: "Privacy Consent",
        publications_opt_in: "Industrial Publications Opt-in",
      };

      const body = Object.entries(labels)
        .map(([name, label]) => {
          const value = data.get(name);
          if (name === "privacy_consent" || name === "publications_opt_in") {
            return `${label}: ${value ? "Yes" : "No"}`;
          }
          return `${label}: ${value || ""}`;
        })
        .join("\n");

      const mailto = new URL("mailto:Ramzi.Karoui@Zettascale.tech, Contact@Zettascale.tech");
      mailto.searchParams.set("subject", "New Zetta OpenspliceDDS Evaluation");
      mailto.searchParams.set("body", body);

      if (status) {
        status.textContent = "Opening your email application and preparing the evaluation downloads.";
      }

      window.location.href = mailto.toString();
      window.setTimeout(() => {
        window.location.href = form.action || "download-evaluation.html";
      }, 700);
    });
  });

  const walletButtons = document.querySelectorAll("[data-wallet-target]");
  const walletPanels = document.querySelectorAll(".wallet-panel");
  const walletContent = document.querySelector("[data-wallet-content]");

  const activateWalletPanel = (targetId, shouldScroll = false) => {
    const targetPanel = document.getElementById(targetId);

    if (!targetPanel) {
      return;
    }

    if (walletContent) {
      walletContent.hidden = false;
    }

    walletButtons.forEach((item) => {
      const isActive = item.dataset.walletTarget === targetId;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    walletPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    if (shouldScroll) {
      targetPanel.scrollIntoView({ block: "start" });
    }
  };

  walletButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateWalletPanel(button.dataset.walletTarget);
    });
  });

  const activateWalletPanelFromHash = () => {
    const targetId = window.location.hash.slice(1);
    if (targetId) {
      activateWalletPanel(targetId, true);
    }
  };

  activateWalletPanelFromHash();
  window.addEventListener("hashchange", activateWalletPanelFromHash);

  document.querySelectorAll("[data-benefits-workflow]").forEach((workflow) => {
    const steps = Array.from(workflow.querySelectorAll("[data-benefit-target]"));
    const details = Array.from(workflow.querySelectorAll(".benefit-detail"));

    const activateBenefit = (targetId) => {
      steps.forEach((step) => {
        const isActive = step.dataset.benefitTarget === targetId;
        step.classList.toggle("is-active", isActive);
        step.setAttribute("aria-selected", String(isActive));
      });

      details.forEach((detail) => {
        const isActive = detail.id === targetId;
        detail.hidden = !isActive;
        detail.classList.toggle("is-active", isActive);
      });
    };

    steps.forEach((step) => {
      step.addEventListener("click", () => {
        activateBenefit(step.dataset.benefitTarget);
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
