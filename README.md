# RaahMilo.com — Official Website & Landing Page

Modern, high-conversion landing page for RaahMilo — GPS live tracking, family safety, and route history app.

## ✨ Features & Architecture
- **3D Hero Scene & Interactive Movement Simulation**:
  - Live 3D boy and girl avatars searching and matching locations via simulated GPS.
  - Interactive radar pulse waves, live distance countdown ticker (850m &rarr; 0m), and location connection popup ("Raah Mil Gayi!").
- **Real-Time Tracking Dashboard (Laptop Mockup)**:
  - Interactive Bangalore route simulation with live car speed, destination, and distance readout.
- **Turn Your Phone Into a GPS Tracker**:
  - Interactive phone mockup with real-time GPS toggle (simulates permission grant and shows live coordinates).
- **Tracking for Every Part of Your Life**:
  - Specialized cards for Families, Vehicles, and Field Teams.
- **FormSubmit.co Email Integration**:
  - Direct email delivery to your configured support inbox.
  - Powered by [FormSubmit.co](https://formsubmit.co) with AJAX submission, custom template, and anti-spam protection.

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply double-click `index.html` or drag it into any web browser (Chrome, Safari, Firefox, Edge).

### Option 2: Local HTTP Server (Python)
Open terminal in the website folder:
```bash
cd /Users/sagarkumar/Downloads/raahmilo_website
python3 -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 📬 FormSubmit Activation Note
When a user submits the contact form for the very first time:
1. FormSubmit sends a **one-time activation email** to your registered inbox.
2. Open that email and click **"Activate Form"**.
3. After this one-time step, all incoming contact form messages will be directly delivered to your inbox!
