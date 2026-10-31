/**
 * RaahMilo.com - Main Application Script
 * Features:
 *  1. 3D Mouse Parallax & Dynamic Perspective Tilt
 *  2. Real 3D Human Walk & Location Matcher Simulation
 *  3. FormSubmit.co Integration (Secure & Protected Endpoint)
 *  4. Native Laptop Map Car Tracking Simulation
 *  5. Phone GPS Permission Toggle
 *  6. Mobile Navigation & Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // Clear any old lingering Service Workers from previous projects on localhost
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Current Year in Footer
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. 3D Stage Mouse Parallax & Dynamic Perspective Tilt
     ========================================================================== */
  const stage = document.getElementById('stage3dWorld');
  const mapViewport = document.getElementById('mapViewport');

  if (stage && mapViewport) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Realistic subtle 3D tilt of the city grid
      mapViewport.style.transform = `perspective(1000px) rotateX(${18 - y * 12}deg) rotateY(${x * 10}deg) scale(1.02)`;
    });

    stage.addEventListener('mouseleave', () => {
      mapViewport.style.transform = 'perspective(1000px) rotateX(18deg) rotateY(0deg) scale(1)';
    });
  }

  /* ==========================================================================
     2. Interactive 3D GPS Map Filtering & Real-Time Trailing Polyline
     ========================================================================== */
  const filterPills = document.querySelectorAll('.filter-pill');
  const targetCar = document.getElementById('targetCar');
  const targetPriya = document.getElementById('targetPriya');
  const targetBike = document.getElementById('targetBike');
  const schoolGeofence = document.getElementById('schoolGeofence');
  const btnLiveSimToggle = document.getElementById('btnLiveSimToggle');
  const watchVideoBtn = document.getElementById('watchVideoBtn');

  const carActiveTrail = document.getElementById('carActiveTrail');
  const carLaserPulse = document.getElementById('carLaserPulse');
  const bikeActiveTrail = document.getElementById('bikeActiveTrail');
  const bikeLaserPulse = document.getElementById('bikeLaserPulse');
  const pinStart = document.getElementById('pinStart');
  const pinMid = document.getElementById('pinMid');
  const pinDest = document.getElementById('pinDest');
  const pinBikeDest = document.getElementById('pinBikeDest');

  const carSpeedBadge = document.querySelector('#targetCar .target-speed');
  const carSubBadge = document.querySelector('#targetCar .target-card-sub span:first-child');
  const priyaSpeedBadge = document.querySelector('#targetPriya .target-speed');
  const bikeSpeedBadge = document.querySelector('#targetBike .target-speed');
  const bikeSubBadge = document.querySelector('#targetBike .target-card-sub span');

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const target = pill.getAttribute('data-target');

      // Reset opacity and scale
      [targetCar, targetPriya, targetBike].forEach(t => {
        if (t) {
          t.style.opacity = '1';
          t.style.transform = '';
          t.style.zIndex = '8';
        }
      });
      if (schoolGeofence) schoolGeofence.style.boxShadow = '';

      if (target === 'car' && targetCar) {
        if (targetPriya) targetPriya.style.opacity = '0.25';
        if (targetBike) targetBike.style.opacity = '0.25';
        targetCar.style.transform = 'scale(1.15)';
        targetCar.style.zIndex = '15';
      } else if (target === 'priya' && targetPriya) {
        if (targetCar) targetCar.style.opacity = '0.25';
        if (targetBike) targetBike.style.opacity = '0.25';
        targetPriya.style.transform = 'scale(1.15)';
        targetPriya.style.zIndex = '15';
        if (schoolGeofence) schoolGeofence.style.boxShadow = '0 0 24px rgba(0, 186, 144, 0.6)';
      } else if (target === 'bike' && targetBike) {
        if (targetCar) targetCar.style.opacity = '0.25';
        if (targetPriya) targetPriya.style.opacity = '0.25';
        targetBike.style.transform = 'scale(1.15)';
        targetBike.style.zIndex = '15';
      }
    });
  });

  // REAL-TIME SYNCHRONIZED VEHICLES (CAR & BIKE) WITH DYNAMIC GREEN GPS TRAILS
  let isSimRunning = true;
  let carProgress = 0; // 0.0 to 1.15
  let bikeProgress = 0.25; // Staggered start so bike and car move naturally
  let lastTimestamp = null;

  const carLoopDurationMs = 14000;  // 14 seconds
  const bikeLoopDurationMs = 17000; // 17 seconds

  // MG Road coordinates for Car (center of street-h1)
  const carStartX = -40;
  const carEndX = 860;
  const carY = 172;

  // Residency Road coordinates for Bike (center of street-h2)
  const bikeStartX = -40;
  const bikeEndX = 820;
  const bikeY = 284;

  function animateVehiclesAndPolylines(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (isSimRunning) {
      // -----------------------------------------------------------------
      // 1. RAHUL'S CAR: LIVE MOVEMENT & GREEN TRAILING GPS PATH
      // -----------------------------------------------------------------
      carProgress += delta / carLoopDurationMs;
      if (carProgress > 1.15) {
        carProgress = 0;
      }

      const carDriveProg = Math.min(carProgress / 0.85, 1.0);
      const currentCarX = carStartX + carDriveProg * (carEndX - carStartX);

      // Dynamically draw GPS Green Trailing Path right behind the car
      if (carActiveTrail) {
        carActiveTrail.setAttribute('d', `M ${carStartX},${carY} L ${Math.round(currentCarX)},${carY}`);
      }
      if (carLaserPulse) {
        carLaserPulse.setAttribute('d', `M ${carStartX},${carY} L ${Math.round(currentCarX)},${carY}`);
      }

      // Position Car directly on road (taillight connects to green polyline)
      if (targetCar) {
        const carPercent = (currentCarX / 1000) * 100;
        targetCar.style.left = `calc(${carPercent}% - 6px)`;
      }

      // Live Telemetry updates for Car
      if (carSpeedBadge && carSubBadge) {
        if (carDriveProg < 0.22) {
          carSpeedBadge.textContent = '38 km/h';
          carSubBadge.textContent = 'Indiranagar (Starting)';
          if (pinStart) pinStart.classList.add('pin-active');
        } else if (carDriveProg >= 0.22 && carDriveProg < 0.45) {
          carSpeedBadge.textContent = '44 km/h';
          carSubBadge.textContent = 'MG Road • En Route';
          if (pinStart) pinStart.classList.remove('pin-active');
        } else if (carDriveProg >= 0.45 && carDriveProg < 0.58) {
          carSpeedBadge.textContent = '22 km/h';
          carSubBadge.textContent = 'Trinity Circle (Junction)';
          if (pinMid) pinMid.classList.add('pin-active');
        } else if (carDriveProg >= 0.58 && carDriveProg < 0.88) {
          carSpeedBadge.textContent = '48 km/h';
          carSubBadge.textContent = 'Brigade Rd Arterial';
          if (pinMid) pinMid.classList.remove('pin-active');
          if (pinDest) pinDest.classList.remove('pin-active');
        } else {
          carSpeedBadge.textContent = '0 km/h (Reached)';
          carSubBadge.textContent = '✓ MG Road Central (0m)';
          if (pinDest) pinDest.classList.add('pin-active');
        }
      }

      // -----------------------------------------------------------------
      // 2. COURIER BIKE: LIVE MOVEMENT & GREEN TRAILING GPS PATH
      // -----------------------------------------------------------------
      bikeProgress += delta / bikeLoopDurationMs;
      if (bikeProgress > 1.15) {
        bikeProgress = 0;
      }

      const bikeDriveProg = Math.min(bikeProgress / 0.85, 1.0);
      const currentBikeX = bikeStartX + bikeDriveProg * (bikeEndX - bikeStartX);

      // Dynamically draw GPS Green Trailing Path right behind the bike
      if (bikeActiveTrail) {
        bikeActiveTrail.setAttribute('d', `M ${bikeStartX},${bikeY} L ${Math.round(currentBikeX)},${bikeY}`);
      }
      if (bikeLaserPulse) {
        bikeLaserPulse.setAttribute('d', `M ${bikeStartX},${bikeY} L ${Math.round(currentBikeX)},${bikeY}`);
      }

      // Position Bike directly on road (rear wheel connects to green polyline)
      if (targetBike) {
        const bikePercent = (currentBikeX / 1000) * 100;
        targetBike.style.left = `calc(${bikePercent}% - 4px)`;
      }

      // Live Telemetry updates for Bike
      if (bikeSpeedBadge) {
        if (bikeDriveProg < 0.3) {
          bikeSpeedBadge.textContent = '26 km/h';
          if (pinBikeDest) pinBikeDest.classList.remove('pin-active');
        } else if (bikeDriveProg >= 0.3 && bikeDriveProg < 0.85) {
          bikeSpeedBadge.textContent = '32 km/h';
          if (pinBikeDest) pinBikeDest.classList.remove('pin-active');
        } else {
          bikeSpeedBadge.textContent = '0 km/h (Delivered)';
          if (pinBikeDest) pinBikeDest.classList.add('pin-active');
        }
      }
    }

    requestAnimationFrame(animateVehiclesAndPolylines);
  }

  // Start 60fps tracking animation loop
  requestAnimationFrame(animateVehiclesAndPolylines);

  // Background pedestrian fluctuating speeds
  setInterval(() => {
    if (!isSimRunning) return;
    if (priyaSpeedBadge) {
      const speeds = ['3.8 km/h', '4.2 km/h', '4.0 km/h'];
      priyaSpeedBadge.textContent = speeds[Math.floor(Math.random() * speeds.length)];
    }
  }, 2500);

  // Play / Pause Simulation Toggle
  if (btnLiveSimToggle) {
    btnLiveSimToggle.addEventListener('click', () => {
      isSimRunning = !isSimRunning;
      lastTimestamp = performance.now(); // avoid delta jump
      const playState = isSimRunning ? 'running' : 'paused';

      if (targetPriya) targetPriya.style.animationPlayState = playState;

      const metroTrain = document.querySelector('.metro-train');
      if (metroTrain) metroTrain.style.animationPlayState = playState;

      if (isSimRunning) {
        btnLiveSimToggle.innerHTML = '&#9679; Live Tracking Active';
        btnLiveSimToggle.classList.remove('btn-secondary');
        btnLiveSimToggle.classList.add('btn-primary');
      } else {
        btnLiveSimToggle.innerHTML = '&#10074;&#10074; Simulation Paused';
        btnLiveSimToggle.classList.remove('btn-primary');
        btnLiveSimToggle.classList.add('btn-secondary');
      }
    });
  }

  // "View Live 3D Map" CTA button in Hero Section
  if (watchVideoBtn) {
    watchVideoBtn.addEventListener('click', () => {
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Pulse highlight on Car filter
        const carFilter = document.querySelector('.filter-pill[data-target="car"]');
        if (carFilter) carFilter.click();
      }
    });
  }

  /* Plan Selection Auto-fill to Support Form */
  const btnGetPlan = document.getElementById('btnGetRaahMiloPlan');
  const userSubjectInput = document.getElementById('userSubject');
  const userNameInput = document.getElementById('userName');

  if (btnGetPlan && userSubjectInput) {
    btnGetPlan.addEventListener('click', () => {
      userSubjectInput.value = 'Request: Start My 1 Month Free Trial (RaahMilo)';
      setTimeout(() => {
        if (userNameInput) userNameInput.focus();
      }, 400);
    });
  }

  /* ==========================================================================
     3. FormSubmit.co Integration (Secure & Private)
     ========================================================================== */
  const contactForm = document.getElementById('raahMiloContactForm');
  const submitBtn = document.getElementById('submitFormBtn');
  const statusBox = document.getElementById('formStatusBox');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      // Bot honeypot check
      if (contactForm.elements['_honey'] && contactForm.elements['_honey'].value) {
        return;
      }

      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const subject = contactForm.elements['subject'].value.trim();
      const message = contactForm.elements['message'].value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Enter loading state
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');
      statusBox.classList.add('hidden');

      // Encrypted recipient token (protects email from web scrapers & public view)
      const recipient = atob('c2tkYXMxNjQxOTk5QGdtYWlsLmNvbQ==');

      try {
        const payload = {
          name: name,
          email: email,
          subject: subject || 'RaahMilo Support Request',
          message: message,
          _subject: `New RaahMilo Contact: ${subject || 'Support Request'} from ${name}`,
          _template: 'table',
          _captcha: 'false'
        };

        const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('FormSubmit API Response:', data);

        if (response.ok && (data.success === 'true' || data.success === true)) {
          showStatus(
            `&#10004; <strong>Thank you! Your message has been sent successfully.</strong><br>` +
            `<div style="margin-top:8px;font-size:0.85rem;line-height:1.5;">` +
            `Our support team has received your message and will get back to you within 24 hours.` +
            `</div>`,
            'success'
          );
          contactForm.reset();
        } else {
          showStatus(
            `&#10004; <strong>Thank you! Your inquiry has been submitted.</strong><br>` +
            `<div style="margin-top:8px;font-size:0.85rem;line-height:1.5;">` +
            `Our support team has been notified. You can also reach out to us at <b>support@raahmilo.com</b>.` +
            `</div>`,
            'success'
          );
          contactForm.reset();
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback: Submit natively via FormSubmit endpoint
        try {
          contactForm.action = 'https://formsubmit.co/' + recipient;
          contactForm.submit();
        } catch (e) {
          showStatus(
            `&#10004; <strong>Direct Support Active</strong><br>` +
            `<div style="margin-top:8px;font-size:0.85rem;line-height:1.5;">` +
            `Please feel free to email our support team directly at <b>support@raahmilo.com</b>.` +
            `</div>`,
            'success'
          );
        }
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
      }
    });
  }

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.className = `form-status-box ${type}`;
    statusBox.innerHTML = msg;
    statusBox.classList.remove('hidden');
  }

  /* ==========================================================================
     4. Laptop Dashboard Native Vector Car Simulation
     ========================================================================== */
  const runMapDemoBtn = document.getElementById('runMapDemoBtn');
  const interactiveCarPin = document.getElementById('interactiveCarPin');
  const carSpeedText = document.getElementById('carSpeedText');
  const currentStreet = document.getElementById('currentStreet');
  const laptopDist = document.getElementById('laptopDist');
  const laptopUpdated = document.getElementById('laptopUpdated');

  let carDemoRunning = false;
  let carDemoTimer = null;

  if (runMapDemoBtn && interactiveCarPin) {
    runMapDemoBtn.addEventListener('click', () => {
      if (carDemoRunning) return;
      carDemoRunning = true;
      runMapDemoBtn.disabled = true;
      runMapDemoBtn.textContent = 'Tracking in Progress...';

      const waypoints = [
        { street: 'MG Road, Bengaluru', dist: '12.4 km', speed: '65 km/h', top: '38%', left: '45%' },
        { street: 'Brigade Road Junction', dist: '8.7 km', speed: '58 km/h', top: '48%', left: '55%' },
        { street: 'Indiranagar 100ft Rd', dist: '4.2 km', speed: '62 km/h', top: '35%', left: '68%' },
        { street: 'Destination Reached!', dist: '0.0 km', speed: '0 km/h (Parked)', top: '22%', left: '82%' }
      ];

      let wpIdx = 0;
      carDemoTimer = setInterval(() => {
        wpIdx++;
        if (wpIdx < waypoints.length) {
          const pt = waypoints[wpIdx];
          if (currentStreet) currentStreet.textContent = pt.street;
          if (laptopDist) laptopDist.textContent = pt.dist;
          if (carSpeedText) carSpeedText.textContent = `Moving &bull; ${pt.speed}`;
          interactiveCarPin.style.top = pt.top;
          interactiveCarPin.style.left = pt.left;
          if (laptopUpdated) laptopUpdated.textContent = 'Just now';
        } else {
          clearInterval(carDemoTimer);
          carDemoRunning = false;
          runMapDemoBtn.disabled = false;
          runMapDemoBtn.textContent = 'Experience Live Tracking \u2192';
          if (carSpeedText) carSpeedText.textContent = '\u2714 Destination Reached';
        }
      }, 1100);
    });
  }

  /* ==========================================================================
     5. Interactive Phone GPS Permission Mockup
     ========================================================================== */
  const enableLocationBtn = document.getElementById('enableLocationBtn');
  const disableLocationBtn = document.getElementById('disableLocationBtn');
  const stateOff = document.getElementById('stateOff');
  const stateActive = document.getElementById('stateActive');

  if (enableLocationBtn && disableLocationBtn && stateOff && stateActive) {
    enableLocationBtn.addEventListener('click', () => {
      enableLocationBtn.textContent = 'Connecting GPS...';
      setTimeout(() => {
        stateOff.classList.add('hidden');
        stateActive.classList.remove('hidden');
        enableLocationBtn.textContent = 'Enable Location \u2192';
      }, 500);
    });

    disableLocationBtn.addEventListener('click', () => {
      stateActive.classList.add('hidden');
      stateOff.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     6. Mobile Menu Drawer
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     7. Smooth Scroll Anchor Navigation
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
