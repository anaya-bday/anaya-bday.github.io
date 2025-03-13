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
      if (!this.holdingPaper) return;
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

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      this.prevTouchX = clientX;
      this.prevTouchY = clientY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const startEvent = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;

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
      e.preventDefault();
    };

    const endEvent = () => {
      this.holdingPaper = false;
    };

    if (isTouchDevice) {
      paper.addEventListener("touchstart", startEvent);
      paper.addEventListener("touchmove", moveEvent);
      paper.addEventListener("touchend", endEvent);
    } else {
      paper.addEventListener("mousedown", startEvent);
      paper.addEventListener("mousemove", moveEvent);
      paper.addEventListener("mouseup", endEvent);
    }
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

const audio = document.getElementById("bg-music");

const enableAutoplay = () => {
  if (audio.paused) {
    audio.play().catch(() => {
      console.log("Autoplay blocked, waiting for interaction.");
    });
  }
};

document.addEventListener("click", enableAutoplay, { once: true });
document.addEventListener("touchstart", enableAutoplay, { once: true });
