
// Utilitaire: année du footer
(function() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

const page = document.body.dataset.page || "";

// Page d'accueil (index)
if (page === "home") {
  // Tabs (visuel uniquement)
  const tabs = document.querySelectorAll(".search-card .tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("tab-active"));
      tab.classList.add("tab-active");
    });
  });

  // Recherche -> redirection vers résultats
  const searchBtn = document.getElementById("searchBtn");
  const searchForm = document.getElementById("searchForm");

  if (searchBtn && searchForm) {
    searchBtn.addEventListener("click", () => {
      const from = document.getElementById("from").value.trim();
      const to = document.getElementById("to").value.trim();
      const date = document.getElementById("date").value;
      const seats = document.getElementById("seats").value;

      if (!from || !to || !date) {
        alert("Merci de renseigner au moins le départ, l'arrivée et la date.");
        return;
      }

      const params = new URLSearchParams({
        from,
        to,
        date,
        seats
      });

      window.location.href = `recherche.html?${params.toString()}`;
    });
  }

  // Raccourcis trajets populaires
  document.querySelectorAll(".search-meta-links button").forEach(button => {
    button.addEventListener("click", () => {
      const [from, to] = button.textContent.split("→").map(t => t.trim());
      const fromEl = document.getElementById("from");
      const toEl = document.getElementById("to");
      const dateEl = document.getElementById("date");
      if (fromEl && toEl && dateEl) {
        fromEl.value = from;
        toEl.value = to;
        const today = new Date().toISOString().split("T")[0];
        dateEl.value = today;
      }
    });
  });
}

// Page résultats
if (page === "results") {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from") || "Ville de départ";
  const to = params.get("to") || "Ville d'arrivée";
  const date = params.get("date") || "";
  const seats = params.get("seats") || "1";

  const searchTitle = document.getElementById("searchTitle");
  if (searchTitle) {
    const dateLabel = date ? new Date(date).toLocaleDateString("fr-FR") : "date flexible";
    searchTitle.textContent = `${from} → ${to} · ${dateLabel} · ${seats} place(s)`;
  }

  const chipsContainer = document.getElementById("chipsContainer");
  if (chipsContainer) {
    const dateLabel = date ? new Date(date).toLocaleDateString("fr-FR") : "date flexible";
    chipsContainer.innerHTML = `
      <div class="chip">
        <span>${from}</span>
        <span>Départ</span>
      </div>
      <div class="chip">
        <span>${to}</span>
        <span>Arrivée</span>
      </div>
      <div class="chip">
        <span>${dateLabel}</span>
        <span>Date</span>
      </div>
      <div class="chip">
        <span>${seats}</span>
        <span>place(s)</span>
      </div>
    `;
  }

  const resultsContainer = document.getElementById("resultsContainer");
  if (resultsContainer) {
    const fakeTrips = [
      {
        driver: "Clément",
        initials: "C",
        rating: "4.9★",
        fromTime: "08:15",
        toTime: "11:30",
        duration: "3h15",
        price: 19,
        seatsLeft: 1,
        comment: "Départ devant la gare principale",
        tags: ["Bagage cabine OK", "Musique douce"]
      },
      {
        driver: "Sonia",
        initials: "S",
        rating: "4.8★",
        fromTime: "13:30",
        toTime: "16:40",
        duration: "3h10",
        price: 17,
        seatsLeft: 3,
        comment: "Pause café sur la route",
        tags: ["Discussion", "Animaux non admis"]
      },
      {
        driver: "Mehdi",
        initials: "M",
        rating: "5.0★",
        fromTime: "18:05",
        toTime: "21:15",
        duration: "3h10",
        price: 22,
        seatsLeft: 2,
        comment: "Idéal après le travail",
        tags: ["Silencieux", "Chargeur téléphone"]
      }
    ];

    if (fakeTrips.length === 0) {
      resultsContainer.innerHTML = `
        <p class="empty">
          Aucun trajet trouvé pour cette recherche. Essaie avec une date ou un horaire flexible.
        </p>
      `;
    } else {
      resultsContainer.innerHTML = fakeTrips.map(trip => `
        <article class="trip-item">
          <div class="avatar-sm">${trip.initials}</div>
          <div class="trip-main">
            <div class="trip-city">${from} → ${to}</div>
            <div class="trip-info">
              ${trip.fromTime} · ${trip.duration} · arrivée vers ${trip.toTime} · ${trip.driver} • ${trip.rating}
            </div>
            <div class="trip-tags">
              <span class="pill-small">${trip.comment}</span>
              ${trip.tags.map(t => `<span class="pill-small">${t}</span>`).join("")}
            </div>
          </div>
          <div class="trip-price-block">
            <strong>${trip.price} €</strong>
            <div>${trip.seatsLeft} place(s) restante(s)</div>
            <button class="trip-btn" type="button">Réserver</button>
          </div>
        </article>
      `).join("");
    }
  }
}

// Page proposer
if (page === "propose") {
  const priceInput = document.getElementById("price");
  const seatsSelect = document.getElementById("seats");
  const recPrice = document.getElementById("recPrice");
  const totalAmount = document.getElementById("totalAmount");
  const co2Saved = document.getElementById("co2Saved");
  const summaryNote = document.getElementById("summaryNote");
  const form = document.getElementById("tripForm");

  function updateEstimates() {
    if (!priceInput || !seatsSelect) return;
    const price = Number(priceInput.value || 0);
    const seats = Number(seatsSelect.value || 1);

    if (!price) {
      if (recPrice) recPrice.textContent = "– € / passager";
      if (totalAmount) totalAmount.textContent = "– €";
      if (co2Saved) co2Saved.textContent = "– kg";
      if (summaryNote) summaryNote.textContent = "Montant total estimé : – €";
      return;
    }

    const suggested = Math.round(price * 0.9);
    const total = price * seats;

    if (recPrice) recPrice.textContent = suggested + " € / passager";
    if (totalAmount) totalAmount.textContent = total + " €";
    if (summaryNote) summaryNote.textContent = "Montant total estimé : " + total + " €";

    const approxCo2 = Math.round(0.15 * 400 * seats);
    if (co2Saved) co2Saved.textContent = approxCo2 + " kg";
  }

  if (priceInput) priceInput.addEventListener("input", updateEstimates);
  if (seatsSelect) seatsSelect.addEventListener("change", updateEstimates);

  // Pré-remplir depuis URL si dispo
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("from");
  const toParam = params.get("to");
  const dateParam = params.get("date");
  if (fromParam && document.getElementById("from")) document.getElementById("from").value = fromParam;
  if (toParam && document.getElementById("to")) document.getElementById("to").value = toParam;
  if (dateParam && document.getElementById("date")) document.getElementById("date").value = dateParam;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const terms = document.getElementById("terms");
      if (terms && !terms.checked) {
        alert("Merci de confirmer que tu acceptes les conditions avant de publier ton trajet.");
        return;
      }

      const from = document.getElementById("from").value;
      const to = document.getElementById("to").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const seats = document.getElementById("seats").value;

      alert(
        "Ton trajet " +
          from + " → " + to +
          " le " + date +
          " à " + time +
          " pour " + seats +
          " place(s) a été simulé comme publié ✅ (à connecter plus tard à un vrai backend)."
      );
    });
  }
}

// Page connexion / inscription
if (page === "auth") {
  const tabs = document.querySelectorAll(".auth-card .tab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("tab-active"));
        tab.classList.add("tab-active");
        const mode = tab.dataset.tab;
        if (!loginForm || !signupForm || !authTitle || !authSubtitle) return;

        if (mode === "login") {
          loginForm.style.display = "flex";
          signupForm.style.display = "none";
          authTitle.textContent = "Content de te revoir 👋";
          authSubtitle.textContent = "Connecte-toi pour retrouver tes trajets, tes conducteurs et tes passagers.";
        } else {
          loginForm.style.display = "none";
          signupForm.style.display = "flex";
          authTitle.textContent = "Bienvenue dans CovoitExpress 🚗";
          authSubtitle.textContent = "Crée ton compte pour réserver ou proposer ton premier trajet.";
        }
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      alert("Connexion simulée pour " + email + " ✅ (à connecter plus tard à un vrai backend).");
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pwd = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("signupConfirm").value;
      const acceptTerms = document.getElementById("acceptTerms").checked;

      if (pwd !== confirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!acceptTerms) {
        alert("Merci d’accepter les Conditions générales pour créer un compte.");
        return;
      }

      const email = document.getElementById("signupEmail").value;
      const name = document.getElementById("signupName").value;
      alert("Compte simulé pour " + name + " (" + email + ") ✅ (à connecter plus tard à un vrai backend).");
    });
  }
}
