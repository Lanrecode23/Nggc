document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobileMenuButton");
  const icon = document.getElementById("menu-toggle"); 
  const nav = document.querySelector("nav.menu-toggle");

  if (!btn || !nav) return;

  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    // - removing `hidden` will show it on sm; keep md:flex for larger screens.
    nav.classList.toggle("hidden");

    // (on md+ it remains flex-row because of md:flex)
    nav.classList.toggle("flex");
    nav.classList.toggle("flex-col");
    nav.classList.toggle("items-start");
    nav.classList.toggle("gap-4");
    nav.classList.toggle("p-4");

    // Swap icon text between 'menu' and 'close' for Material Symbols
    if (icon) {
      icon.textContent = expanded ? "menu" : "close";
    }
  });
});


