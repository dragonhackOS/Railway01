document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var enlaces = document.querySelector(".nav-enlaces");

  if (toggle && enlaces) {
    toggle.addEventListener("click", function () {
      enlaces.classList.toggle("abierto");
      toggle.classList.toggle("activo");
    });

    enlaces.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        enlaces.classList.remove("abierto");
        toggle.classList.remove("activo");
      });
    });
  }

  var encabezado = document.querySelector(".encabezado");
  if (encabezado) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) {
        encabezado.style.boxShadow = "0 8px 24px rgba(74, 15, 24, 0.12)";
      } else {
        encabezado.style.boxShadow = "none";
      }
    });
  }

  var anio = document.querySelector("[data-anio]");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  fetch("/api/site-config")
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (config) {
      if (!config) return;

      if (config.bannerEnabled && config.bannerMessage) {
        var banner = document.getElementById("banner-anuncio");
        var texto = document.getElementById("banner-anuncio-texto");
        if (banner && texto) {
          texto.textContent = config.bannerMessage;
          banner.hidden = false;
          var altura = banner.offsetHeight;
          document.documentElement.style.setProperty("--banner-offset", altura + "px");
        }
      }

      if (config.contact) {
        ["tel-mayor", "tel-menor", "tel-mayor-don", "tel-menor-don"].forEach(function (id) {
          var el = document.getElementById(id);
          if (!el) return;
          if (id.indexOf("mayor") !== -1) el.textContent = config.contact.phoneMayor;
          if (id.indexOf("menor") !== -1) el.textContent = config.contact.phoneMenor;
        });
      }

      if (config.social) {
        document.querySelectorAll("[data-social]").forEach(function (el) {
          var red = el.getAttribute("data-social");
          if (config.social[red]) {
            el.setAttribute("href", config.social[red]);
          }
        });
      }
    })
    .catch(function () {});
});
