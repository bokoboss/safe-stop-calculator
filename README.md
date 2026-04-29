# Safe Stop Calculator

A professional web application designed to calculate and simulate vehicle safe stopping distances based on physics principles. 
Developed for learning and assessing road safety, referencing standards like AASHTO and variable environmental conditions.

## Features
- **Dynamic Calculation**: Instantly computes Reaction Distance, Braking Distance, and Total Safe Stopping Distance (SSD).
- **Interactive Parameters**: Adjust vehicle speed (km/h), reaction time (s), friction coefficient (μ), and road gradient (%) via simple sliders.
- **Visual Simulation**: An animated representation demonstrating the vehicle's stopping trajectory across reaction and braking zones.
- **Reference Presets**: Quickly load real-world scenarios such as AASHTO Standards, Dry Asphalt, Wet Asphalt, and Alert Driver states.
- **Distance Analytics Charts**: View the correlation between initial speed and the required stopping distance under the current road physics profile.

## Mathematics & Physics Engine
Calculations follow standard kinetic principles:
- **Reaction Distance** ($d_r$): $v \times t$
- **Braking Distance** ($d_b$): $\frac{v^2}{2g(\mu \pm G)}$
- **Total SSD**: $d_r + d_b$

*(Where $v$ = speed in m/s, $t$ = reaction time in seconds, $g$ = 9.81 m/s², $\mu$ = friction coefficient, and $G$ = gradient percentage / 100).*

## Development & Run
This project runs entirely in the browser using React and Vite, styled with Tailwind CSS, and powered by simple static hosting or Node environments.

### Prerequisites
- Node.js (v18+)

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
This will compile static files into the `dist/` directory, which can be hosted on any static site host (e.g., GitHub Pages, Firebase Hosting, Vercel, Netlify).

## License
MIT
