/* ===== effects.js : visual extras only. Load AFTER app.js ===== */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. extra icons (P and svg() come from app.js) */
  Object.assign(P, {
    arrow: "M5 12h14M13 6l6 6-6 6",
    star: "M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"
  });
  $$("i[data-i]").forEach(e => e.innerHTML = svg(e.dataset.i));

  /* 2. endless marquee: duplicate the content once */
  const track = $(".track");
  if (track) track.innerHTML += track.innerHTML;

  /* 3. header shadow + scroll progress bar */
  const hd = $("header"), bar = $("#bar");
  const onScroll = () => {
    hd.classList.toggle("scrolled", scrollY > 10);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 4. reveal on scroll */
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      io.unobserve(el);
      setTimeout(() => { el.classList.remove("rv", "in"); el.style.transitionDelay = ""; }, 1300);
    }), { threshold: 0.12 });
    $$(".head, .arch, .txt, .box, .step, .qrcard, .ci, .cform").forEach(el => {
      el.classList.add("rv");
      el.style.transitionDelay = ([...el.parentNode.children].indexOf(el) % 4) * 90 + "ms";
      io.observe(el);
    });
  }

  /* 5. hero parallax (desktop mouse only) */
  const hero = $(".hero");
  if (hero && !reduce && matchMedia("(hover:hover)").matches) {
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  }

  /* 6. floating "View order" bar */
  const fab = $("#fab"), cnt = $("#cnt"), drawerEl = $("#drawer");
  const syncFab = () => {
    const n = +cnt.textContent || 0;
    fab.hidden = n === 0 || drawerEl.classList.contains("on");
    $("#fabt").textContent = "View order · " + n + " item" + (n > 1 ? "s" : "") + " · " + $("#sub").textContent;
  };
  new MutationObserver(syncFab).observe(cnt, { childList: true, characterData: true, subtree: true });
  new MutationObserver(syncFab).observe(drawerEl, { attributes: true, attributeFilter: ["class"] });
  fab.onclick = () => $("#open").click();
  syncFab();

  /* 7. small feedback when a dish is added */
  $("#list").addEventListener("click", e => {
    const b = e.target.closest(".add");
    if (!b) return;
    b.classList.add("pop");
    $("#open").classList.add("bump");
    setTimeout(() => { b.classList.remove("pop"); $("#open").classList.remove("bump"); }, 450);
  });
})();
