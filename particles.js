/* =====================================================
   DOFIRI AL-MADURI
   PARTICLE NETWORK ANIMATION
   ===================================================== */

const canvas = document.getElementById("particle-network");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame;


/* =====================================================
   PENGATURAN
   ===================================================== */

const settings = {

    desktopParticles: 75,

    mobileParticles: 35,

    connectionDistance: 145,

    particleSpeed: 0.35,

    particleSize: 2,

    lineOpacity: 0.18,

    particleOpacity: 0.55

};


/* =====================================================
   RESIZE CANVAS
   ===================================================== */

function resizeCanvas() {

    const hero = canvas.parentElement;

    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    createParticles();
}


/* =====================================================
   JUMLAH PARTICLE
   ===================================================== */

function getParticleCount() {

    if (window.innerWidth <= 768) {

        return settings.mobileParticles;

    }

    return settings.desktopParticles;
}


/* =====================================================
   BUAT PARTICLES
   ===================================================== */

function createParticles() {

    particles = [];

    const total = getParticleCount();

    for (let i = 0; i < total; i++) {

        particles.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height,

            vx:
                (Math.random() - 0.5)
                * settings.particleSpeed,

            vy:
                (Math.random() - 0.5)
                * settings.particleSpeed,

            size:
                Math.random()
                * settings.particleSize
                + 1,

            opacity:
                Math.random()
                * 0.35
                + settings.particleOpacity,

            pulse:
                Math.random() * Math.PI * 2,

            pulseSpeed:
                Math.random() * 0.02
                + 0.005

        });

    }
}


/* =====================================================
   UPDATE PARTICLES
   ===================================================== */

function updateParticles() {

    particles.forEach(particle => {

        particle.x += particle.vx;

        particle.y += particle.vy;


        /* Pantulan kiri kanan */

        if (
            particle.x < 0 ||
            particle.x > canvas.width
        ) {

            particle.vx *= -1;

        }


        /* Pantulan atas bawah */

        if (
            particle.y < 0 ||
            particle.y > canvas.height
        ) {

            particle.vy *= -1;

        }


        /* Pulse */

        particle.pulse += particle.pulseSpeed;

    });

}


/* =====================================================
   GAMBAR PARTICLE
   ===================================================== */

function drawParticles() {

    particles.forEach(particle => {

        const pulse =
            Math.sin(particle.pulse)
            * 0.35
            + 0.65;

        const radius =
            particle.size * pulse;


        /* Glow */

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            radius * 3,
            0,
            Math.PI * 2
        );

        const gradient =
            ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                radius * 4
            );

        gradient.addColorStop(
            0,
            `rgba(220,255,130,${0.18 * pulse})`
        );

        gradient.addColorStop(
            1,
            "rgba(220,255,130,0)"
        );

        ctx.fillStyle = gradient;

        ctx.fill();


        /* Titik utama */

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(
                245,
                255,
                220,
                ${particle.opacity * pulse}
            )`;

        ctx.fill();

    });

}


/* =====================================================
   HUBUNGKAN PARTICLES
   ===================================================== */

function drawConnections() {

    for (let i = 0; i < particles.length; i++) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const p1 = particles[i];
            const p2 = particles[j];


            const dx =
                p1.x - p2.x;

            const dy =
                p1.y - p2.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                settings.connectionDistance
            ) {

                const opacity =
                    (1 - distance /
                    settings.connectionDistance)
                    * settings.lineOpacity;


                ctx.beginPath();

                ctx.moveTo(
                    p1.x,
                    p1.y
                );

                ctx.lineTo(
                    p2.x,
                    p2.y
                );


                ctx.strokeStyle =
                    `rgba(
                        245,
                        255,
                        220,
                        ${opacity}
                    )`;


                ctx.lineWidth = 0.7;

                ctx.stroke();

            }

        }

    }

}


/* =====================================================
   ANIMASI
   ===================================================== */

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    updateParticles();

    drawConnections();

    drawParticles();


    animationFrame =
        requestAnimationFrame(animate);
}


/* =====================================================
   START
   ===================================================== */

function startAnimation() {

    resizeCanvas();

    animate();

}


/* =====================================================
   RESIZE WINDOW
   ===================================================== */

let resizeTimeout;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimeout);

        resizeTimeout =
            setTimeout(() => {

                resizeCanvas();

            }, 200);

    }
);


/* =====================================================
   JALANKAN
   ===================================================== */

startAnimation();
