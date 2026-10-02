const CORRECT_PASSWORD = "3103";

function pressKey(num) {
  const input = document.getElementById("passcode-input");
  if (input && input.value.length < 10) {
    input.value += num;
  }
}

function clearPin() {
  const input = document.getElementById("passcode-input");
  const errorMsg = document.getElementById("error-msg");
  if (input) input.value = "";
  if (errorMsg) errorMsg.classList.add("hidden");
}

function deletePin() {
  const input = document.getElementById("passcode-input");
  if (input) {
    input.value = input.value.slice(0, -1);
  }
}

function checkPassword() {
  const inputField = document.getElementById("passcode-input");
  const errorMsg = document.getElementById("error-msg");

  if (inputField && inputField.value === CORRECT_PASSWORD) {
    document.getElementById("step-password").classList.add("hidden");
    document.getElementById("step-photos").classList.remove("hidden");
  } else if (errorMsg) {
    errorMsg.classList.remove("hidden");
  }
}

function showCakeSection() {
  document.getElementById("step-photos").classList.add("hidden");
  document.getElementById("step-cake").classList.remove("hidden");
  
  // Show bottom-right disc fixed on screen
  const disc = document.getElementById("website-disc");
  if (disc) disc.classList.remove("hidden");
}

const popNotesData = [
  "✨ My favorite person to annoy for the rest of my life.",
  "💖 Having you by my side is my favourite privilege.",
  "🌸 I love you even when you ragebait me 😤💖",
  "✨ You owe me a thousand hugs for making this whole website for you.",
  "💫 A quick reminder that you're stuck with me 😜❤",
  "🌷 So grateful for all the sweet memories we share.",
  "⭐ Another quick reminder that I'm obsessed with you 🫣",
  "💌 Forever cheering for you in everything you do!",
  "👑 You're cute, but I'm still the boss here 👑",
  "🎁 Admit it, I'm the best gift you're getting today 😚"
];

// Screen destination positions (no overlapping):
// Notes 1-5 stack top to bottom on the RIGHT
// Notes 6-10 stack top to bottom on the LEFT
const orderedNotePositions = [
  { top: "5%", right: "3%" },   // Note 1 (Right top)
  { top: "18%", right: "3%" },  // Note 2
  { top: "31%", right: "3%" },  // Note 3
  { top: "44%", right: "3%" },  // Note 4
  { top: "57%", right: "3%" },  // Note 5 (Right bottom)
  { top: "5%", left: "3%" },    // Note 6 (Left top)
  { top: "18%", left: "3%" },   // Note 7
  { top: "31%", left: "3%" },   // Note 8
  { top: "44%", left: "3%" },   // Note 9
  { top: "57%", left: "3%" }    // Note 10 (Left bottom)
];

let interactiveTapped = false;

function handleInteractiveTap() {
  if (interactiveTapped) return;
  interactiveTapped = true;

  const record = document.getElementById("vinyl-record");
  const arm = document.getElementById("turntable-arm");
  const flames = document.querySelectorAll(".flame");
  const smokes = document.querySelectorAll(".smoke");
  const hint = document.getElementById("cake-tap-hint");

  // Blow out candles
  flames.forEach(f => f.classList.add("hidden"));
  smokes.forEach(s => s.classList.remove("hidden"));

  // Spin disc & swing arm
  if (record) record.classList.add("spinning");
  if (arm) arm.classList.add("playing");
  if (hint) hint.innerText = "🎶 Playing your special notes... 🎶";

  triggerHeartConfetti();

  // Spawn notes popping directly OUT OF THE DISC with smooth pacing
popNotesData.forEach((noteText, index) => {
  setTimeout(() => {
    spawnNoteFromDisc(noteText, orderedNotePositions[index]);

    if (index === popNotesData.length - 1) {
      setTimeout(() => {
        if (hint) hint.classList.add("hidden");
        const readBtn = document.getElementById("read-letter-btn");
        if (readBtn) readBtn.classList.remove("hidden");
        triggerHeartConfetti();
      }, 1500);
    }
  }, (index + 1) * 1250); // Paced nicely for a smooth sequence
});
}

function spawnNoteFromDisc(text, targetPos) {
  const noteEl = document.createElement("div");
  noteEl.className = "pop-note ordered-floating-note";
  noteEl.innerText = text;

  // Calculate coordinates of the disc center (bottom right)
  const discEl = document.getElementById("website-disc");
  const discRect = discEl ? discEl.getBoundingClientRect() : { left: window.innerWidth - 80, top: window.innerHeight - 80, width: 100, height: 100 };
  
  const discCenterX = discRect.left + (discRect.width / 2);
  const discCenterY = discRect.top + (discRect.height / 2);

  // Calculate target coordinates on screen
  let targetX = 0;
  if (targetPos.right) {
    const rightPx = (parseFloat(targetPos.right) / 100) * window.innerWidth;
    targetX = window.innerWidth - rightPx - 100;
  } else if (targetPos.left) {
    const leftPx = (parseFloat(targetPos.left) / 100) * window.innerWidth;
    targetX = leftPx + 100;
  }

  const topPx = (parseFloat(targetPos.top) / 100) * window.innerHeight;
  const targetY = topPx + 20;

  // Set translation offsets relative to target slot
  const startOffsetX = discCenterX - targetX;
  const startOffsetY = discCenterY - targetY;

  noteEl.style.setProperty('--start-x', `${startOffsetX}px`);
  noteEl.style.setProperty('--start-y', `${startOffsetY}px`);

  if (targetPos.top) noteEl.style.top = targetPos.top;
  if (targetPos.right) noteEl.style.right = targetPos.right;
  if (targetPos.left) noteEl.style.left = targetPos.left;

  document.body.appendChild(noteEl);
}

function showLetterSection() {
  const screenNotes = document.querySelectorAll(".ordered-floating-note");
  screenNotes.forEach(note => note.remove());

  const disc = document.getElementById("website-disc");
  if (disc) disc.classList.add("hidden");

  document.getElementById("step-cake").classList.add("hidden");
  document.getElementById("step-letter").classList.remove("hidden");
  
  triggerHeartConfetti();
}

function triggerHeartConfetti() {
  if (typeof confetti === "function") {
    const scalar = 2;
    const heart = confetti.shapeFromText({ text: '❤️', scalar });

    confetti({
      shapes: [heart],
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6 },
      scalar
    });
  }
}