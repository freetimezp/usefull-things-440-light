const lenis = new Lenis({
    autoRaf: true,
    duration: 1.2,
    smoothWheel: true,
});

/* =========================================
   ELEMENTS
========================================= */

const fairyWorld = document.querySelector(".fairy-world");
const spotlight = document.querySelector(".spotlight");
const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");

const hiddenObjects = [...document.querySelectorAll(".hidden-object")];

const discoveryCount = document.querySelector(".discovery-count");

/* =========================================
   STATE
========================================= */

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,

    currentX: window.innerWidth / 2,
    currentY: window.innerHeight / 2,
};

let discovered = 0;

/* =========================================
   POINTER
========================================= */

function updatePointer(x, y) {
    mouse.x = x;
    mouse.y = y;
}

window.addEventListener("mousemove", (e) => {
    updatePointer(e.clientX, e.clientY);
});

fairyWorld.addEventListener(
    "touchstart",
    (e) => {
        const touch = e.touches[0];

        updatePointer(touch.clientX, touch.clientY);
    },
    { passive: true },
);

fairyWorld.addEventListener(
    "touchmove",
    (e) => {
        const touch = e.touches[0];

        updatePointer(touch.clientX, touch.clientY);
    },
    { passive: true },
);

/* =========================================
   MOBILE INITIAL POSITION
========================================= */

if (window.matchMedia("(max-width: 700px)").matches) {
    const rect = fairyWorld.getBoundingClientRect();

    mouse.x = window.innerWidth / 2;
    mouse.y = rect.top + rect.height / 2;

    mouse.currentX = mouse.x;
    mouse.currentY = mouse.y;
}

/* =========================================
   OBJECT DISCOVERY
========================================= */

function checkObjects() {
    const rect = fairyWorld.getBoundingClientRect();

    const mouseX = mouse.currentX;
    const mouseY = mouse.currentY;

    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    const revealDistance = isMobile ? 105 : 150;

    hiddenObjects.forEach((object) => {
        const objectRect = object.getBoundingClientRect();

        const objectX = objectRect.left + objectRect.width / 2;

        const objectY = objectRect.top + objectRect.height / 2;

        const dx = mouseX - objectX;
        const dy = mouseY - objectY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
            distance < revealDistance &&
            mouseY > rect.top &&
            mouseY < rect.bottom
        ) {
            if (!object.classList.contains("visible")) {
                object.classList.add("visible");

                discovered++;

                discoveryCount.textContent = discovered;
            }
        } else {
            object.classList.remove("visible");
        }
    });
}

/* =========================================
   ANIMATION
========================================= */

function animate() {
    mouse.currentX += (mouse.x - mouse.currentX) * 0.12;

    mouse.currentY += (mouse.y - mouse.currentY) * 0.12;

    cursor.style.transform = `
        translate3d(
            ${mouse.currentX}px,
            ${mouse.currentY}px,
            0
        )
    `;

    const worldRect = fairyWorld.getBoundingClientRect();

    const localX = mouse.currentX - worldRect.left;

    const localY = mouse.currentY - worldRect.top;

    fairyWorld.style.setProperty("--mouse-x", `${localX}px`);

    fairyWorld.style.setProperty("--mouse-y", `${localY}px`);

    /*
        Cursor ring follows slightly slower.
    */

    cursorRing.style.transform = `
        translate3d(
            ${(mouse.currentX - mouse.currentX * 0.02) * 0}px,
            0,
            0
        )
    `;

    checkObjects();

    requestAnimationFrame(animate);
}

/* =========================================
   RESET DISCOVERY WHEN ENTERING
========================================= */

window.addEventListener("resize", () => {
    mouse.currentX = window.innerWidth / 2;
    mouse.currentY = window.innerHeight / 2;
});

/* =========================================
   START
========================================= */

animate();
