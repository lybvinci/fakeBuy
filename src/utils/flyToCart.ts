export function flyToCart(sourceImg: HTMLImageElement): void {
  const target = document.getElementById("header-cart");
  if (!target || !sourceImg) return;
  const srcRect = sourceImg.getBoundingClientRect();
  const tgtRect = target.getBoundingClientRect();

  const ghost = sourceImg.cloneNode(true) as HTMLImageElement;
  ghost.style.position = "fixed";
  ghost.style.left = `${srcRect.left}px`;
  ghost.style.top = `${srcRect.top}px`;
  ghost.style.width = `${srcRect.width}px`;
  ghost.style.height = `${srcRect.height}px`;
  ghost.style.margin = "0";
  ghost.style.zIndex = "9999";
  ghost.style.borderRadius = "50%";
  ghost.style.objectFit = "cover";
  ghost.style.transition =
    "transform 700ms cubic-bezier(0.5, -0.2, 0.4, 1), width 700ms ease, height 700ms ease, opacity 700ms ease";
  ghost.style.pointerEvents = "none";
  ghost.style.boxShadow = "0 6px 18px rgba(0,0,0,.2)";
  document.body.appendChild(ghost);

  const dx = tgtRect.left + tgtRect.width / 2 - (srcRect.left + srcRect.width / 2);
  const dy = tgtRect.top + tgtRect.height / 2 - (srcRect.top + srcRect.height / 2);

  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.15)`;
    ghost.style.opacity = "0.2";
    ghost.style.width = `${srcRect.width * 0.5}px`;
    ghost.style.height = `${srcRect.height * 0.5}px`;
  });

  window.setTimeout(() => {
    ghost.remove();
    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      { duration: 300, easing: "ease-out" },
    );
  }, 720);
}
