(function () {
  "use strict";

  var galleries = {
    "chistye-prudy": {
      title: "Фахверк в КП «Чистые пруды»",
      sub: "Чистые пруды, 3",
      images: [
        { src: "assets/img/projects/chistye-prudy/04.svg", alt: "Гостиная-столовая" },
        { src: "assets/img/projects/chistye-prudy/06.svg", alt: "Кухня с мраморным островом" },
        { src: "assets/img/projects/chistye-prudy/05.svg", alt: "Гостиная с камином" },
        { src: "assets/img/projects/chistye-prudy/02.svg", alt: "Крытый бассейн" },
        { src: "assets/img/projects/chistye-prudy/03.svg", alt: "Зона отдыха у бассейна" },
        { src: "assets/img/projects/chistye-prudy/01.svg", alt: "Сауна" }
      ]
    }
  };

  var lightbox = document.getElementById("lightbox");
  var stage = lightbox.querySelector(".lightbox__stage");
  var imgA = lightbox.querySelector(".lightbox__img--a");
  var imgB = lightbox.querySelector(".lightbox__img--b");
  var thumbsWrap = document.getElementById("lightbox-thumbs");
  var titleEl = document.getElementById("lightbox-title");
  var subEl = document.getElementById("lightbox-sub");

  var current = { key: null, index: 0, activeEl: imgA };
  var touchStartX = null;

  function renderThumbs(key) {
    thumbsWrap.innerHTML = "";
    galleries[key].images.forEach(function (img, i) {
      var t = document.createElement("img");
      t.src = img.src;
      t.alt = "";
      t.dataset.index = i;
      t.addEventListener("click", function () { goTo(i); });
      thumbsWrap.appendChild(t);
    });
  }

  function updateThumbActive(index) {
    var thumbs = thumbsWrap.querySelectorAll("img");
    thumbs.forEach(function (t, i) {
      t.classList.toggle("is-active", i === index);
    });
  }

  function showImage(index, animate) {
    var gallery = galleries[current.key];
    var data = gallery.images[index];
    var incoming = current.activeEl === imgA ? imgB : imgA;
    var outgoing = current.activeEl;

    incoming.src = data.src;
    incoming.alt = data.alt || "";

    if (animate) {
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
    } else {
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
    }

    current.activeEl = incoming;
    current.index = index;
    updateThumbActive(index);
  }

  function goTo(index) {
    var gallery = galleries[current.key];
    var len = gallery.images.length;
    var next = (index + len) % len;
    showImage(next, true);
  }

  function open(key, startIndex) {
    current.key = key;
    var gallery = galleries[key];
    titleEl.textContent = gallery.title;
    subEl.textContent = gallery.sub;
    renderThumbs(key);

    imgA.classList.remove("is-active");
    imgB.classList.remove("is-active");
    current.activeEl = imgB;
    showImage(startIndex || 0, false);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-gallery]").forEach(function (card) {
    var key = card.dataset.gallery;
    card.querySelector(".project-card__media").addEventListener("click", function () {
      open(key, 0);
    });
  });

  lightbox.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", close);
  });
  lightbox.querySelector("[data-prev]").addEventListener("click", function () { goTo(current.index - 1); });
  lightbox.querySelector("[data-next]").addEventListener("click", function () { goTo(current.index + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") goTo(current.index - 1);
    if (e.key === "ArrowRight") goTo(current.index + 1);
  });

  stage.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(current.index + (dx < 0 ? 1 : -1));
    }
    touchStartX = null;
  });

  // CTA button: Marquiz not wired up yet.
  document.querySelector('[data-cta="calc"]').addEventListener("click", function () {
    console.log("TODO: подключить Marquiz");
  });
})();
