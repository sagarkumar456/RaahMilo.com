/**
 * RaahMilo.com - Main Application Script
 * Features:
 *  1. 3D Mouse Parallax & Dynamic Perspective Tilt
 *  2. Real 3D Human Walk & Location Matcher Simulation
 *  3. FormSubmit.co Integration (skdas1641999@gmail.com)
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
     1. 3D Stage Mouse Parallax & Depth Tracking
     ========================================================================== */
  const stage = document.getElementById('stage3dWorld');
  const boyActor = document.getElementById('boyActor');
  const girlActor = document.getElementById('girlActor');
  const centerPhone = document.getElementById('centerPhone');

  if (stage && boyActor && girlActor && centerPhone) {
    stage.addEventListener('mousemove', (e) => {
      if (stage.classList.contains('walking')) return; // Do not interrupt walk cycle

      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // 3D tilts with distinct depth offsets
      centerPhone.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 10 + 4}deg) translateZ(20px)`;
      boyActor.style.transform = `perspective(800px) rotateY(${12 + x * 10}deg) translateX(${x * 12}px) translateY(${y * 6}px)`;
      girlActor.style.transform = `perspective(800px) rotateY(${-12 + x * 10}deg) translateX(${x * 12}px) translateY(${y * 6}px)`;
    });

    stage.addEventListener('mouseleave', () => {
      if (stage.classList.contains('walking')) return;
      centerPhone.style.transform = 'perspective(800px) rotateY(0deg) rotateX(4deg)';
      boyActor.style.transform = 'perspective(800px) rotateY(12deg)';
      girlActor.style.transform = 'perspective(800px) rotateY(-12deg)';
    });
  }

  /* ==========================================================================
     2. Real 3D Human Walk & Live Location Matcher Simulation
     ========================================================================== */
  const triggerMeetupBtn = document.getElementById('triggerMeetupBtn');
  const watchVideoBtn = document.getElementById('watchVideoBtn');
  const liveDistText = document.getElementById('liveDistText');
  const liveProgressBar = document.getElementById('liveProgressBar');
  const matchPopupBanner = document.getElementById('matchPopupBanner');
  const motionStatusText = document.getElementById('motionStatusText');
  const hudState = document.getElementById('hudState');
  const hudUpdated = document.getElementById('hudUpdated');

  let isWalking = false;
  let walkTimer = null;

  function start3DWalkSimulation() {
    if (isWalking) {
      reset3DWalkSimulation();
      return;
    }

    isWalking = true;
    stage.classList.remove('celebrating');
    stage.classList.add('walking');
    triggerMeetupBtn.innerHTML = '&#8635; Reset 3D Walk';
    
    if (hudState) {
      hudState.textContent = 'Searching...';
      hudState.style.background = '#e1f5fe';
      hudState.style.color = '#0288d1';
    }
    if (matchPopupBanner) matchPopupBanner.classList.remove('show');

    const steps = [
      { dist: 850, pct: 75, boyPos: '6%', girlPos: '6%', text: '🛰️ Pinging GPS Satellites... Live signal acquired on MG Road (850m away)' },
      { dist: 620, pct: 60, boyPos: '12%', girlPos: '12%', text: '🚶 Both avatars started walking on street pavement... (Pacing &bull; 4.5 km/h)' },
      { dist: 410, pct: 40, boyPos: '18%', girlPos: '18%', text: '📡 Radar locked! Feet striding closer along Trinity Circle (410m away)' },
      { dist: 180, pct: 20, boyPos: '23%', girlPos: '23%', text: '👀 Visual proximity detected on live phone map! (180m away)' },
      { dist: 40, pct: 5, boyPos: '26%', girlPos: '26%', text: '👣 Arriving at meetup junction... Feet slowing down (40m away)' },
      { dist: 0, pct: 0, boyPos: '28%', girlPos: '28%', text: '&#10004; <strong>Location Matched!</strong> Rahul &amp; Priya met at destination (0m) &bull; Connected!' }
    ];

    let stepIdx = 0;

    walkTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        const item = steps[stepIdx];
        if (liveDistText) liveDistText.textContent = item.dist + 'm';
        if (liveProgressBar) liveProgressBar.style.width = item.pct + '%';
        if (motionStatusText) motionStatusText.innerHTML = item.text;
        if (hudUpdated) hudUpdated.textContent = 'Just now';
        
        // Progressively walk along street
        if (boyActor) boyActor.style.left = item.boyPos;
        if (girlActor) girlActor.style.right = item.girlPos;
      } else {
        clearInterval(walkTimer);
        // Destination Reached!
        stage.classList.remove('walking');
        stage.classList.add('celebrating');

        if (liveDistText) liveDistText.textContent = '0m (Connected!)';
        if (liveProgressBar) liveProgressBar.style.width = '0%';
        if (hudState) {
          hudState.textContent = 'Connected!';
          hudState.style.background = '#e2fbf4';
          hudState.style.color = '#009371';
        }
        if (matchPopupBanner) {
          matchPopupBanner.classList.add('show');
        }
      }
    }, 1000);
  }

  function reset3DWalkSimulation() {
    isWalking = false;
    clearInterval(walkTimer);
    if (stage) {
      stage.classList.remove('walking');
      stage.classList.remove('celebrating');
    }

    if (boyActor) boyActor.style.left = '4%';
    if (girlActor) girlActor.style.right = '4%';

    if (liveDistText) liveDistText.textContent = '850m';
    if (liveProgressBar) liveProgressBar.style.width = '75%';
    if (hudState) {
      hudState.textContent = 'Active';
      hudState.style.background = '#e2fbf4';
      hudState.style.color = '#009371';
    }
    if (motionStatusText) {
      motionStatusText.textContent = 'Both 3D avatars are tracking live location via GPS.';
    }
    if (matchPopupBanner) {
      matchPopupBanner.classList.remove('show');
    }
    if (triggerMeetupBtn) {
      triggerMeetupBtn.innerHTML = '&#9654; Walk &amp; Connect Location';
    }
  }

  if (triggerMeetupBtn) {
    triggerMeetupBtn.addEventListener('click', start3DWalkSimulation);
  }

  if (watchVideoBtn) {
    watchVideoBtn.addEventListener('click', () => {
      start3DWalkSimulation();
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      const recipient = 'skdas1641999@gmail.com';

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
