let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;

    const moveEvent = (e) => {
      let clientX, clientY;

      if (e.type.includes("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (!this.rotating) {
        this.velX = clientX - this.prevTouchX;
        this.velY = clientY - this.prevTouchY;
      }

      const dirX = clientX - this.touchStartX;
      const dirY = clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = clientX;
        this.prevTouchY = clientY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const startEvent = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      let clientX, clientY;
      if (e.type.includes("touch")) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      this.touchStartX = clientX;
      this.touchStartY = clientY;
      this.prevTouchX = clientX;
      this.prevTouchY = clientY;

      if (e.type === "contextmenu" || e.touches?.length > 1) {
        this.rotating = true;
      }

      e.preventDefault();
    };

    const endEvent = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    if (isTouchDevice) {
      paper.addEventListener("touchstart", startEvent);
      paper.addEventListener("touchmove", moveEvent);
      paper.addEventListener("touchend", endEvent);
    } else {
      paper.addEventListener("mousedown", startEvent);
      document.addEventListener("mousemove", moveEvent);
      window.addEventListener("mouseup", endEvent);
    }
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
}, { once: true });
