/* ═══════════════════════════════════════════
   TECHQUEST — MAIN.JS
   Three.js arcade hero scene + interactions
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // 1. PLACEHOLDERS (Injected by Build)
  const SB_URL = 'https://hpkudboszdvavczvjrkr.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwa3VkYm9zemR2YXZjenZqcmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzU3MzMsImV4cCI6MjA4MzU1MTczM30.IOnuaR1sZCqyeN1p6rxf4mvWM_H0Of-B7z2ACbzSWGg';
  const EJS_SVC = 'service_d8jbfmc';
  const EJS_TMP = 'htm_enrollment_briefing';
  const EJS_PUB = 'B07gMSHiApMJRrJGj';

  // 2. INITIALIZE SERVICES
  const supabase = window.supabase.createClient(SB_URL, SB_KEY);
  if (EJS_PUB) emailjs.init(EJS_PUB);

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ─────────────────────────────────────────
     THREE.JS SCENE SETUP
  ───────────────────────────────────────── */
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 2, 22);

  /* ─────────────────────────────────────────
     RESIZE HANDLER
  ───────────────────────────────────────── */
  function onResize() {
    const hero = document.getElementById('hero');
    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  /* ─────────────────────────────────────────
     LIGHTING
  ───────────────────────────────────────── */
  // Ambient — very dim
  const ambient = new THREE.AmbientLight(0x111133, 1.2);
  scene.add(ambient);

  // Cyan point light (left)
  const cyanLight = new THREE.PointLight(0x00F5FF, 2.5, 40);
  cyanLight.position.set(-8, 6, 10);
  scene.add(cyanLight);

  // Pink point light (right)
  const pinkLight = new THREE.PointLight(0xFF2D78, 2.5, 40);
  pinkLight.position.set(8, 4, 10);
  scene.add(pinkLight);

  // Amber top light
  const amberLight = new THREE.PointLight(0xFFB800, 1.2, 35);
  amberLight.position.set(0, 14, 5);
  scene.add(amberLight);

  /* ─────────────────────────────────────────
     WIREFRAME GRID — retro floor (TRON style)
  ───────────────────────────────────────── */
  const gridHelper = new THREE.GridHelper(60, 30, 0x00F5FF, 0x0a1a3a);
  gridHelper.position.set(0, -8, 0);
  gridHelper.material.opacity = 0.35;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  /* ─────────────────────────────────────────
     FLOATING 3D OBJECTS
  ───────────────────────────────────────── */

  // Shared materials
  const matCyan = new THREE.MeshStandardMaterial({
    color: 0x00F5FF,
    emissive: 0x004455,
    roughness: 0.3,
    metalness: 0.7,
    wireframe: false,
  });
  const matPink = new THREE.MeshStandardMaterial({
    color: 0xFF2D78,
    emissive: 0x550018,
    roughness: 0.3,
    metalness: 0.7,
  });
  const matAmber = new THREE.MeshStandardMaterial({
    color: 0xFFB800,
    emissive: 0x443300,
    roughness: 0.3,
    metalness: 0.7,
  });
  const matGreen = new THREE.MeshStandardMaterial({
    color: 0x39FF14,
    emissive: 0x104400,
    roughness: 0.3,
    metalness: 0.6,
  });
  const matWire = new THREE.MeshStandardMaterial({
    color: 0x00F5FF,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });

  // ── Object 1: Rotating Torus (portal ring) ──
  const torusGeo = new THREE.TorusGeometry(2.2, 0.25, 10, 48);
  const torus = new THREE.Mesh(torusGeo, matCyan);
  torus.position.set(-9, 3, -4);
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  // ── Object 2: Icosahedron (gem) ──
  const icoGeo = new THREE.IcosahedronGeometry(1.3, 0);
  const ico = new THREE.Mesh(icoGeo, matPink);
  ico.position.set(10, 5, -3);
  scene.add(ico);

  // ── Object 3: Wireframe sphere (data orb) ──
  const sphereGeo = new THREE.SphereGeometry(1.5, 10, 10);
  const sphere = new THREE.Mesh(sphereGeo, matWire);
  sphere.position.set(-6, -2, 2);
  scene.add(sphere);

  // ── Object 4: Octahedron (crystal) ──
  const octaGeo = new THREE.OctahedronGeometry(1.1);
  const octa = new THREE.Mesh(octaGeo, matAmber);
  octa.position.set(7, -1, 0);
  scene.add(octa);

  // ── Object 5: Box (game cube) ──
  const boxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  const box = new THREE.Mesh(boxGeo, matGreen);
  box.position.set(-2, 6, -6);
  scene.add(box);

  // ── Object 6: Small torus knot ──
  const knotGeo = new THREE.TorusKnotGeometry(0.8, 0.22, 60, 8);
  const knot = new THREE.Mesh(knotGeo, matPink);
  knot.position.set(3, -4, -2);
  scene.add(knot);

  // ── Object 7: Cone ──
  const coneGeo = new THREE.ConeGeometry(0.9, 2, 5);
  const cone = new THREE.Mesh(coneGeo, matCyan);
  cone.position.set(-11, 0, -2);
  scene.add(cone);

  // Collect objects for animation
  const floatObjs = [
    { mesh: torus, speed: 0.006, axis: 'y', bob: 0.4, phase: 0 },
    { mesh: ico, speed: 0.009, axis: 'y', bob: 0.5, phase: 1.1 },
    { mesh: sphere, speed: 0.005, axis: 'y', bob: 0.3, phase: 2.3 },
    { mesh: octa, speed: 0.010, axis: 'x', bob: 0.6, phase: 0.7 },
    { mesh: box, speed: 0.007, axis: 'z', bob: 0.4, phase: 1.8 },
    { mesh: knot, speed: 0.008, axis: 'y', bob: 0.5, phase: 3.0 },
    { mesh: cone, speed: 0.006, axis: 'z', bob: 0.3, phase: 0.3 },
  ];

  /* ─────────────────────────────────────────
     PARTICLE FIELD — floating dots
  ───────────────────────────────────────── */
  const PARTICLE_COUNT = 180;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 40;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 28;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0x00F5FF,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ─────────────────────────────────────────
     MOUSE PARALLAX (subtle)
  ───────────────────────────────────────── */
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Touch support
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ─────────────────────────────────────────
     FLOATING LABELS — project from 3D to 2D
  ───────────────────────────────────────── */
  const labelData = [
    { el: document.getElementById('label-laptop'), mesh: torus },
    { el: document.getElementById('label-gear'), mesh: ico },
    { el: document.getElementById('label-code'), mesh: sphere },
    { el: document.getElementById('label-star'), mesh: octa },
  ];

  function projectToScreen(obj) {
    const hero = document.getElementById('hero');
    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    const vec = new THREE.Vector3();
    obj.getWorldPosition(vec);
    vec.project(camera);
    return {
      x: (vec.x * 0.5 + 0.5) * W,
      y: (-vec.y * 0.5 + 0.5) * H,
    };
  }

  function updateLabels() {
    labelData.forEach(({ el, mesh }) => {
      if (!el) return;
      const pos = projectToScreen(mesh);
      el.style.left = pos.x + 'px';
      el.style.top = pos.y + 'px';
      el.style.transform = 'translate(-50%, -50%)';
    });
  }

  /* ─────────────────────────────────────────
     ANIMATION LOOP
  ───────────────────────────────────────── */
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    targetX = lerp(targetX, mouseX, 0.04);
    targetY = lerp(targetY, mouseY, 0.04);

    // Camera gentle parallax
    camera.position.x = targetX * 1.5;
    camera.position.y = 2 - targetY * 0.8;
    camera.lookAt(0, 0, 0);

    // Float + rotate each 3D object
    floatObjs.forEach(({ mesh, speed, axis, bob, phase }) => {
      mesh.rotation[axis] += speed;
      // secondary rotation for more life
      mesh.rotation.z += speed * 0.3;
      // bob up and down
      const baseY = mesh.userData.baseY ?? mesh.position.y;
      if (mesh.userData.baseY === undefined) mesh.userData.baseY = mesh.position.y;
      mesh.position.y = baseY + Math.sin(elapsed * 0.8 + phase) * bob;
    });

    // Spin grid forward (TRON effect) — very slow
    gridHelper.position.z = (gridHelper.position.z + 0.015) % 2;

    // Slow particle drift
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Pulse lights
    cyanLight.intensity = 2.2 + Math.sin(elapsed * 1.5) * 0.4;
    pinkLight.intensity = 2.2 + Math.cos(elapsed * 1.3) * 0.4;
    amberLight.intensity = 1.0 + Math.sin(elapsed * 0.9) * 0.3;

    // Update 2D label positions
    updateLabels();

    renderer.render(scene, camera);
  }

  animate();

  /* ─────────────────────────────────────────
     XP BAR — animate on load
  ───────────────────────────────────────── */
  const xpFill = document.getElementById('xp-fill');
  const xpVal = document.querySelector('.xp-val');

  let xpCurrent = 0;
  const xpTarget = 320; // show partial progress
  const xpMax = 1000;

  function animateXP() {
    xpCurrent = lerp(xpCurrent, xpTarget, 0.03);
    if (xpCurrent > xpTarget - 0.5) xpCurrent = xpTarget;

    const pct = (xpCurrent / xpMax) * 100;
    xpFill.style.width = pct + '%';
    xpFill.nextElementSibling.style.width = pct + '%'; // glow layer
    xpVal.textContent = Math.round(xpCurrent) + ' / ' + xpMax;

    if (xpCurrent < xpTarget) requestAnimationFrame(animateXP);
  }

  // Start XP animation after a delay
  setTimeout(animateXP, 1400);

  /* ─────────────────────────────────────────
     ENROLL BUTTON — ripple + XP burst
  ───────────────────────────────────────── */
  const enrollBtn = document.getElementById('enroll-btn');

  enrollBtn.addEventListener('click', () => {
    // Scroll to the contact section (account for fixed nav)
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      const navOffset = 72; // matches nav height + small cushion
      const top = contactSec.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // XP burst effect
    const burst = document.createElement('div');
    // Updated from emoji to a stylized 'bolt' character or text
    burst.innerHTML = '+50 XP <i class="fa-solid fa-bolt"></i>';
    burst.style.cssText = `
      position: fixed;
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #FFB800;
      text-shadow: 0 0 10px rgba(255,184,0,0.8);
      pointer-events: none;
      z-index: 9999;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: xpBurst 1.2s ease forwards;
    `;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1300);
  });

  // Inject burst keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes xpBurst {
      0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
      40%  { opacity: 1; transform: translate(-50%, -80%) scale(1.3); }
      100% { opacity: 0; transform: translate(-50%, -120%) scale(1); }
    }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     CHARACTER HOVER INTERACTIONS
  ───────────────────────────────────────── */
  ['char-girl', 'char-boy'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('mouseenter', () => {
      el.style.filter = 'drop-shadow(0 0 30px rgba(0,245,255,0.5))';
      el.style.pointerEvents = 'auto';
    });

    el.addEventListener('mouseleave', () => {
      el.style.filter = '';
    });
  });

  /* ─────────────────────────────────────────
     SCROLL — fade out hero elements slightly
  ───────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    const scrollY = window.scrollY;
    const opacity = Math.max(0, 1 - scrollY / 500);
    heroContent.style.opacity = opacity;
  }, { passive: true });

  /* ─────────────────────────────────────────
     INTERSECTION OBSERVER — placeholder reveal
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('.placeholder-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach((s) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(30px)';
    s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    sectionObserver.observe(s);
  });

  /* ─────────────────────────────────────────
     CLEANUP ON VISIBILITY CHANGE
     (pause Three.js when tab not visible)
  ───────────────────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clock.stop();
    } else {
      clock.start();
    }
  });

  /* ─────────────────────────────────────────
       STRICT PRICE SEGREGATION (SILENT)
    ───────────────────────────────────────── */
  const pricingGrid = document.getElementById('pricing-grid');
  const priceRemote = document.getElementById('price-remote');
  const currSymbol = document.getElementById('curr-symbol');
  const pricingNote = document.getElementById('dynamic-pricing-note');

  const forceInternationalUI = () => {
    pricingGrid.classList.add('is-intl');
    currSymbol.textContent = '$';
    priceRemote.textContent = '120 / mo';
    pricingNote.textContent = 'Clients are expected to pay $120 per month for the duration of the program.';
  };

  const initPricingIntelligence = async () => {
    // 1. Check for cached location status
    const cachedLocation = localStorage.getItem('htm_location_status');

    if (cachedLocation === 'international') {
      forceInternationalUI();
      return;
    }

    if (cachedLocation === 'ghana') return; // Stay on default

    // 2. No cache? Perform Silent Detection
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.country_code !== 'GH') {
        localStorage.setItem('htm_location_status', 'international');
        forceInternationalUI();
      } else {
        localStorage.setItem('htm_location_status', 'ghana');
      }
    } catch (err) {
      // Fail silently: Default GHS view remains active
      console.log("Uplink detection restricted. Operating in standard mode.");
    }
  };

  initPricingIntelligence();
  /* ─────────────────────────────────────────
     ENROLLMENT COMMAND CENTER LOGIC
  ───────────────────────────────────────── */
  const enrollForm = document.getElementById('enrollment-form');
  const contactContainer = document.getElementById('contact-container');
  const countrySelect = document.getElementById('country-select');

  const chipInPerson = document.getElementById('chip-inperson');
  const chipRemoteInput = document.querySelector('#chip-remote input');
  const chipInPersonInput = document.querySelector('#chip-inperson input');
  const logisticsNote = document.getElementById('logistics-note');

  if (enrollForm) {
    // UI: Handle Digital Uplink vs Physical Lab logic
    countrySelect?.addEventListener('change', (e) => {
      if (e.target.value !== 'Ghana') {
        // 1. Force selection to Remote
        chipRemoteInput.checked = true;

        // 2. Lock the In-Person chip visually
        chipInPerson.classList.add('locked');

        // 3. Disable the input so it can't be clicked
        chipInPersonInput.disabled = true;

        // 4. Show the explanation note
        logisticsNote.classList.remove('hidden');
      } else {
        // 1. Unlock the In-Person chip
        chipInPerson.classList.remove('locked');

        // 2. Re-enable the input
        chipInPersonInput.disabled = false;

        // 3. Hide the note
        logisticsNote.classList.add('hidden');
      }
    });

    // Form Submission
    enrollForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(enrollForm);
      const phoneVal = formData.get('parent_phone').trim();
      const comms = formData.getAll('comms'); // Array of checked values

      // 1. Validation: If they want a Call or WhatsApp, they MUST provide a phone number
      const requestsPhoneComms = comms.includes('WhatsApp') || comms.includes('Phone Call');

      if (requestsPhoneComms && !phoneVal) {
        const phoneInput = enrollForm.querySelector('input[name="parent_phone"]');
        phoneInput.style.borderColor = 'var(--pink)';
        phoneInput.style.boxShadow = '0 0 10px rgba(255, 45, 120, 0.3)';
        phoneInput.focus();
        alert("Please provide a Phone Number so Godwin can reach you via " + (comms.includes('WhatsApp') ? "WhatsApp" : "Phone Call") + ".");
        return;
      }

      // Reset border if validation passes
      const phoneInput = enrollForm.querySelector('input[name="parent_phone"]');
      phoneInput.style.borderColor = '';
      phoneInput.style.boxShadow = '';

      // 2. Transmit State UI
      const btn = document.getElementById('submit-enrollment');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';

      const data = {
        student_name: formData.get('student_name'),
        student_age: formData.get('student_age'),
        parent_name: formData.get('parent_name'),
        parent_email: formData.get('parent_email'),
        parent_phone: phoneVal || 'Not Provided',
        country: formData.get('country'),
        comms_method: comms.join(', ') || 'Email Only',
        mode: formData.get('training_mode'),
        message: formData.get('goals')
      };

      try {
        // A. Primary Action: Supabase Log (Blocking)
        const { error: sbError } = await supabase.from('enrollments').insert([data]);
        if (sbError) throw sbError;

        // B. Secondary Action: EmailJS (Non-Blocking)
        // Wrapped in its own try-catch so an EmailJS error doesn't break the success UI
        try {
          await emailjs.send(EJS_SVC, EJS_TMP, {
            parent_name: data.parent_name,
            student_name: data.student_name,
            parent_email: data.parent_email,
            admin_email: "info@entrevahub.org",
            program_name: "The Human Thinking Machine"
          });
        } catch (ejsError) {
          console.warn("Email uplink failed, but data saved to Supabase:", ejsError);
        }

        // C. Success UI
        contactContainer.innerHTML = `
          <div class="success-screen">
            <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h3 class="ph-title">Signal Received</h3>
            <p class="ph-body">Briefing logged. Godwin will contact you within 24 hours to coordinate the quest.</p>
            <div class="quest-links">
              <a href="https://saharansub.com/the-human-thinking-machine/" class="ph-card">Main Hub</a>
              <a href="https://saharansub.com/the-human-thinking-machine/launchpad-lab/launchpad-lab" class="ph-card">Launchpad</a>
              <a href="https://saharansub.com/the-human-thinking-machine/first-principles-tutor/first-principles-tutor" class="ph-card">1st Principles</a>
              <a href="https://saharansub.com/the-human-thinking-machine/ready-2-play/ready-2-play" class="ph-card">Ready 2 Play</a>
            </div>
          </div>`;
      } catch (err) {
        console.error("Critical Failure:", err);
        alert("Transmission failed: " + (err.message || "Connection Error"));
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> RETRY TRANSMISSION';
      }
    });
  }


})();
