// Three.js 3D Celestial Universe, Interactive Planetary Storytelling & Atmospheric Deep Dive
// Architected by Aanand AB — Cosmic Odyssey, Living Planetary Atmospheres & Hyperspace Warp Engine

(function () {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || !window.THREE) return;

  // -------------------------------------------------------------
  // 1. Scene & Camera Setup
  // -------------------------------------------------------------
  const scene = new THREE.Scene();
  const baseFogColor = new THREE.Color(0x060608);
  const currentFogColor = baseFogColor.clone();
  scene.fog = new THREE.FogExp2(baseFogColor, 0.012);

  const baseFov = 55;
  const camera = new THREE.PerspectiveCamera(baseFov, window.innerWidth / window.innerHeight, 0.1, 1800);
  camera.position.set(0, 0, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // -------------------------------------------------------------
  // Real NASA textures (Solar System Scope - CC BY 4.0) + soft star sprites
  // -------------------------------------------------------------
  const textureLoader = new THREE.TextureLoader();
  const TEX = {
    earth:    textureLoader.load('assets/textures/earth_daymap.jpg'),
    jupiter:  textureLoader.load('assets/textures/jupiter.jpg'),
    saturn:   textureLoader.load('assets/textures/saturn.jpg'),
    mars:     textureLoader.load('assets/textures/mars.jpg'),
    neptune:  textureLoader.load('assets/textures/neptune.jpg'),
    mercury:  textureLoader.load('assets/textures/mercury.jpg'),
    moon:     textureLoader.load('assets/textures/moon.jpg'),
    uranus:   textureLoader.load('assets/textures/uranus.jpg'),
    milkyway: textureLoader.load('assets/textures/milky_way.jpg')
  };

  // Soft round star sprite (procedural radial glow) - replaces square points
  function createStarSprite() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const starSprite = createStarSprite();

  // Real Milky Way backdrop (slowly rotating skybox sphere)
  const milkyWaySphere = new THREE.Mesh(
    new THREE.SphereGeometry(900, 64, 64),
    new THREE.MeshBasicMaterial({ map: TEX.milkyway, side: THREE.BackSide, fog: false, depthWrite: false })
  );
  scene.add(milkyWaySphere);

  // -------------------------------------------------------------
  // 2. Cosmic Lighting (Distant Sun + Ambient + Color Accents)
  // -------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x222633, 0.75);
  scene.add(ambientLight);

  const stellarSun = new THREE.PointLight(0xfffae0, 2.8, 200);
  stellarSun.position.set(25, 35, 30);
  scene.add(stellarSun);

  const deepSpaceRim = new THREE.DirectionalLight(0x88aadd, 1.2);
  deepSpaceRim.position.set(-30, -20, -10);
  scene.add(deepSpaceRim);

  const nebulaGlow = new THREE.PointLight(0xffe8c8, 2.0, 120);
  nebulaGlow.position.set(-15, -15, 10);
  scene.add(nebulaGlow);

  const pulsarLight = new THREE.PointLight(0xffffff, 1.2, 90);
  pulsarLight.position.set(18, -35, -15);
  scene.add(pulsarLight);

  // Dynamic Planet Atmosphere Light (changes color when deep diving)
  const planetAtmosphereLight = new THREE.PointLight(0xffffff, 0, 40);
  scene.add(planetAtmosphereLight);

  // -------------------------------------------------------------
  // 3. Multi-Layer Starfield & Shooting Stars
  // -------------------------------------------------------------
  const starsCountA = 1100;
  const starsGeoA = new THREE.BufferGeometry();
  const starsPosA = new Float32Array(starsCountA * 3);
  const starsColA = new Float32Array(starsCountA * 3);

  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xbfd4ff),
    new THREE.Color(0xfff0d8),
    new THREE.Color(0xffd9a0),
    new THREE.Color(0xa8c8ff)
  ];

  for (let i = 0; i < starsCountA; i++) {
    starsPosA[i * 3] = (Math.random() - 0.5) * 260;
    starsPosA[i * 3 + 1] = (Math.random() - 0.5) * 300;
    starsPosA[i * 3 + 2] = (Math.random() - 0.5) * 200 - 40;

    const c = palette[Math.floor(Math.random() * palette.length)];
    starsColA[i * 3] = c.r;
    starsColA[i * 3 + 1] = c.g;
    starsColA[i * 3 + 2] = c.b;
  }
  starsGeoA.setAttribute('position', new THREE.BufferAttribute(starsPosA, 3));
  starsGeoA.setAttribute('color', new THREE.BufferAttribute(starsColA, 3));

  const starsMatA = new THREE.PointsMaterial({
    size: 0.75,
    map: starSprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const starFieldA = new THREE.Points(starsGeoA, starsMatA);
  scene.add(starFieldA);

  // Layer B: Bright Scintillating Nebula Clusters
  const starsCountB = 350;
  const starsGeoB = new THREE.BufferGeometry();
  const starsPosB = new Float32Array(starsCountB * 3);
  const starsColB = new Float32Array(starsCountB * 3);

  for (let i = 0; i < starsCountB; i++) {
    starsPosB[i * 3] = (Math.random() - 0.5) * 160;
    starsPosB[i * 3 + 1] = (Math.random() - 0.5) * 200;
    starsPosB[i * 3 + 2] = (Math.random() - 0.5) * 110;

    const c = Math.random() > 0.5 ? new THREE.Color(0xcaff00) : new THREE.Color(0x00f0ff);
    starsColB[i * 3] = c.r;
    starsColB[i * 3 + 1] = c.g;
    starsColB[i * 3 + 2] = c.b;
  }
  starsGeoB.setAttribute('position', new THREE.BufferAttribute(starsPosB, 3));
  starsGeoB.setAttribute('color', new THREE.BufferAttribute(starsColB, 3));

  const starsMatB = new THREE.PointsMaterial({
    size: 1.1,
    map: starSprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const starFieldB = new THREE.Points(starsGeoB, starsMatB);
  scene.add(starFieldB);

  // Shooting Stars System
  const shootingStars = [];
  function createShootingStar() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, -4, 2, -2]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xcaff00,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geo, mat);
    line.position.set((Math.random() - 0.5) * 50, Math.random() * 30 + 10, (Math.random() - 0.5) * 30);
    line.velocity = new THREE.Vector3(-0.8 - Math.random() * 0.6, -0.5 - Math.random() * 0.4, 0);
    scene.add(line);
    shootingStars.push(line);
  }

  // -------------------------------------------------------------
  // 4. Hyperspace Warp Lines (Deep Dive Transition Streaks)
  // -------------------------------------------------------------
  const warpLinesCount = 60;
  const warpGeo = new THREE.BufferGeometry();
  const warpPos = new Float32Array(warpLinesCount * 6); // 2 vertices per line
  const warpGroup = new THREE.Group();

  for (let i = 0; i < warpLinesCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 14 + 1.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const z1 = (Math.random() - 0.5) * 20;
    const z2 = z1 - 12 - Math.random() * 10;

    warpPos[i * 6] = x;
    warpPos[i * 6 + 1] = y;
    warpPos[i * 6 + 2] = z1;

    warpPos[i * 6 + 3] = x;
    warpPos[i * 6 + 4] = y;
    warpPos[i * 6 + 5] = z2;
  }
  warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
  const warpMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    linewidth: 2
  });
  const warpLinesMesh = new THREE.LineSegments(warpGeo, warpMat);
  warpGroup.add(warpLinesMesh);
  scene.add(warpGroup);

  // -------------------------------------------------------------
  // 6. Helpers: Atmospheres, Rings & Living Planetary Life Fields
  // -------------------------------------------------------------
  function createAtmosphere(radius, colorHex, opacity = 0.3) {
    const atmoGeo = new THREE.SphereGeometry(radius * 1.16, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: opacity,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Mesh(atmoGeo, atmoMat);
  }

  function createPlanetaryRing(innerR, outerR, colorHex) {
    const ringGeo = new THREE.RingGeometry(innerR, outerR, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.3,
      metalness: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    return ring;
  }

  // Helper: Create Living Planetary Atmospheric Particle Ecosystem
  function createPlanetaryLife(count, colorHex, radiusMin, radiusMax, type = 'orbit') {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const angles = new Float32Array(count);
    const heights = new Float32Array(count);
    const rads = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      rads[i] = radiusMin + Math.random() * (radiusMax - radiusMin);
      heights[i] = (Math.random() - 0.5) * (radiusMax * 0.9);

      pos[i * 3] = Math.cos(angles[i]) * rads[i];
      pos[i * 3 + 1] = heights[i];
      pos[i * 3 + 2] = Math.sin(angles[i]) * rads[i];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      size: type === 'spore' ? 0.22 : 0.16,
      color: colorHex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);

    return {
      points: points,
      update: function (elapsedTime, isFocused) {
        const positions = geo.attributes.position.array;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, isFocused ? 0.95 : 0.65, 0.08);
        mat.size = THREE.MathUtils.lerp(mat.size, isFocused ? 0.26 : 0.16, 0.08);

        for (let i = 0; i < count; i++) {
          angles[i] += speeds[i];

          if (type === 'spore') {
            // Ascending floating spores with gentle sine wave oscillation
            heights[i] += 0.012;
            if (heights[i] > radiusMax * 0.9) heights[i] = -radiusMax * 0.9;
            const r = rads[i] + Math.sin(elapsedTime * 2 + i) * 0.2;
            positions[i * 3] = Math.cos(angles[i]) * r;
            positions[i * 3 + 1] = heights[i];
            positions[i * 3 + 2] = Math.sin(angles[i]) * r;
          } else if (type === 'buoyant') {
            // Underwater plankton buoyancy drift
            const r = rads[i] + Math.cos(elapsedTime * 1.5 + i) * 0.35;
            const y = heights[i] + Math.sin(elapsedTime * 2 + i * 0.5) * 0.4;
            positions[i * 3] = Math.cos(angles[i]) * r;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = Math.sin(angles[i]) * r;
          } else {
            // High-speed orbital ion dust
            const r = rads[i];
            positions[i * 3] = Math.cos(angles[i]) * r;
            positions[i * 3 + 1] = heights[i] + Math.sin(angles[i] * 2) * 0.2;
            positions[i * 3 + 2] = Math.sin(angles[i]) * r;
          }
        }
        geo.attributes.position.needsUpdate = true;
      }
    };
  }

  // -------------------------------------------------------------
  // 7. 8 Celestial Planetary Systems (Mapped to Projects)
  // -------------------------------------------------------------
  const planetarySystems = [];
  const planetsGroup = new THREE.Group();
  scene.add(planetsGroup);

  // --- PLANET 1: FREELANCE HUB (LeadtoClose) — Golden Gas Giant with Rings ---
  const p1Sys = new THREE.Group();
  const p1Geo = new THREE.SphereGeometry(1.9, 36, 36);
  const p1Mat = new THREE.MeshStandardMaterial({
    map: TEX.saturn,
    roughness: 0.9,
    metalness: 0.0
  });
  const p1Body = new THREE.Mesh(p1Geo, p1Mat);
  const p1Ring = createPlanetaryRing(2.4, 3.8, 0xd8c9a3);
  const p1Atmo = createAtmosphere(1.9, 0x9db8ff, 0.15);
  const p1Life = createPlanetaryLife(90, 0xffd700, 2.3, 4.5, 'orbit'); // Golden revenue data dust
  p1Sys.add(p1Body, p1Ring, p1Atmo, p1Life.points);
  p1Sys.position.set(7.5, 4, 3);
  planetsGroup.add(p1Sys);

  planetarySystems.push({
    id: 'leadtoclose',
    alias: ['freelance', 'freelance-hub', 'naro'],
    name: 'PLANET FREELANCE HUB // LEAD-TO-CLOSE',
    sector: 'SECTOR 01: FREELANCE HUB',
    desc: 'Golden Gas Giant • 7-Stage Offline Deal Machine',
    lore: 'A massive golden gas giant encircled by rings of deal state machines. Engineered for high-velocity freelancers who require 100% offline client tracking, airtight stage transitions, and zero recurring monthly SaaS fees.',
    atmosphere: 'Golden Ionized Gas • Swirling Deal Dust • Zero-Cloud Air-Gap Pressure',
    telemetry: { gravity: '1.4G', throughput: '10K DEALS/SEC', encryption: 'SHA-256 LOCAL' },
    themeColor: 0xefc464,
    url: 'projects/leadtoclose.html',
    group: p1Sys,
    body: p1Body,
    life: p1Life,
    orbitSpeed: 0.008,
    ring: p1Ring,
    diveOffset: new THREE.Vector3(2.8, 0.7, 4.8)
  });

  // --- PLANET 2: OMNIGRAPH — Cyan Crystalline World with DAG Constellations ---
  const p2Sys = new THREE.Group();
  const p2Geo = new THREE.IcosahedronGeometry(2.1, 2);
  const p2Mat = new THREE.MeshStandardMaterial({
    map: TEX.uranus,
    roughness: 0.7,
    metalness: 0.0
  });
  const p2Body = new THREE.Mesh(p2Geo, p2Mat);
  p2Sys.add(p2Body);

  const satGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const satMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const satellites = [];
  for (let i = 0; i < 4; i++) {
    const sat = new THREE.Mesh(satGeo, satMat);
    p2Sys.add(sat);
    satellites.push({ mesh: sat, angle: (i * Math.PI) / 2, dist: 3.2 });
  }
  const p2Atmo = createAtmosphere(2.1, 0x9db8ff, 0.18);
  const p2Life = createPlanetaryLife(80, 0x00f0ff, 2.4, 4.2, 'orbit'); // Cyan neural node sparks
  p2Sys.add(p2Atmo, p2Life.points);
  p2Sys.position.set(-8.5, -3, -4);
  planetsGroup.add(p2Sys);

  planetarySystems.push({
    id: 'omnigraph',
    alias: ['omnigraph', 'dag', 'graph'],
    name: 'PLANET OMNIGRAPH // DAG CLUSTER',
    sector: 'SECTOR 02: OMNIGRAPH CRYSTAL',
    desc: 'Crystalline Core • Real-Time Agent Satellites',
    lore: 'A hyper-dense crystalline planetoid with tectonic plates forged from topological DAG execution trees. Four synchronous agent satellites orbit the core, calculating Tarjan cycle detections and streaming LLM payloads in sub-millisecond execution loops.',
    atmosphere: 'Electric Cyan Vector Beams • High-Coherence Flux • Topological Grid',
    telemetry: { gravity: '0.8G', throughput: '5,000+ CONCURRENT NODES', encryption: 'CYCLE DETECT <1MS' },
    themeColor: 0x00f0ff,
    url: 'projects/omnigraph.html',
    group: p2Sys,
    body: p2Body,
    life: p2Life,
    orbitSpeed: 0.006,
    satellites: satellites,
    diveOffset: new THREE.Vector3(-2.6, 0.6, 5.0)
  });

  // --- PLANET 3: ONAMDELIVERY — Hyperlocal Flora World with Transit Orbitals ---
  const p3Sys = new THREE.Group();
  const p3Geo = new THREE.SphereGeometry(1.85, 32, 32);
  const p3Mat = new THREE.MeshStandardMaterial({
    map: TEX.earth,
    roughness: 0.6,
    metalness: 0.0
  });
  const p3Body = new THREE.Mesh(p3Geo, p3Mat);
  const p3Orbit1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.04, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0xcaff00, transparent: true, opacity: 0.85 })
  );
  p3Orbit1.rotation.x = Math.PI / 3;
  const p3Orbit2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.03, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.65 })
  );
  p3Orbit2.rotation.y = Math.PI / 2.8;
  const p3Atmo = createAtmosphere(1.85, 0x88b0ff, 0.18);
  const p3Life = createPlanetaryLife(95, 0xcaff00, 2.1, 4.4, 'spore'); // Emerald botanical delivery spores
  p3Sys.add(p3Body, p3Orbit1, p3Orbit2, p3Atmo, p3Life.points);
  p3Sys.position.set(7.5, -11, -10);
  planetsGroup.add(p3Sys);

  planetarySystems.push({
    id: 'onamdelivery',
    alias: ['onam', 'onamdelivery', 'delivery'],
    name: 'PLANET ONAM // HYPERLOCAL DISPATCH',
    sector: 'SECTOR 03: ONAM HYPERLOCAL',
    desc: 'Lush Terrestrial World • Real-Time Delivery Rings',
    lore: 'A verdant flora world protected by dual hyper-transit rings. Millions of festival deliveries are guided along sub-second Haversine routes, navigating volatile festival traffic with zero missed delivery SLAs.',
    atmosphere: 'Lush Emerald Spores • Ionized Courier Trails • High-Humidity Agrarian Winds',
    telemetry: { gravity: '1.0G', throughput: '12K ORDERS/HOUR', encryption: 'HAVERSINE 34MS' },
    themeColor: 0xcaff00,
    url: 'projects/onamdelivery.html',
    group: p3Sys,
    body: p3Body,
    life: p3Life,
    orbitSpeed: 0.007,
    orbits: [p3Orbit1, p3Orbit2],
    diveOffset: new THREE.Vector3(2.5, -0.5, 4.7)
  });

  // --- PLANET 4: ONAPOO — Magenta Floral Celestial with Dual Moons ---
  const p4Sys = new THREE.Group();
  const p4Geo = new THREE.SphereGeometry(1.75, 32, 32);
  const p4Mat = new THREE.MeshStandardMaterial({
    map: TEX.mars,
    roughness: 0.7,
    metalness: 0.0
  });
  const p4Body = new THREE.Mesh(p4Geo, p4Mat);
  const moon1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.6 })
  );
  const moon2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff80aa, roughness: 0.7 })
  );
  p4Sys.add(p4Body, moon1, moon2);
  const p4Atmo = createAtmosphere(1.75, 0xccaa88, 0.12);
  const p4Life = createPlanetaryLife(85, 0xff007f, 2.0, 4.5, 'spore'); // Magenta blossom spores
  p4Sys.add(p4Atmo, p4Life.points);
  p4Sys.position.set(-7, -19, -16);
  planetsGroup.add(p4Sys);

  planetarySystems.push({
    id: 'onapoo',
    alias: ['onapoo', 'ar', 'pookkalam'],
    name: 'PLANET ONAPOO // BILINGUAL BLOOM',
    sector: 'SECTOR 04: ONAPOO BIOLUMINESCENCE',
    desc: 'Bioluminescent Floral World • Twin Moon Ellipse',
    lore: 'A magenta floral celestial encircled by twin resonant moons. It preserves cultural heritage through edge-computed bilingual algorithms, generating procedural flower mandala patterns at 60 FPS on low-power devices.',
    atmosphere: 'Petal Dust Aurora • Twin-Moon Gravitational Waves • Vernacular Resonance',
    telemetry: { gravity: '0.9G', throughput: '60 FPS AR ENGINE', encryption: '100% OFFLINE DATA' },
    themeColor: 0xff007f,
    url: 'projects/onapoo.html',
    group: p4Sys,
    body: p4Body,
    life: p4Life,
    orbitSpeed: 0.005,
    moons: [
      { mesh: moon1, dist: 2.8, speed: 0.02, angle: 0 },
      { mesh: moon2, dist: 3.6, speed: -0.015, angle: Math.PI }
    ],
    diveOffset: new THREE.Vector3(-2.4, -0.4, 4.5)
  });

  // --- PLANET 5: AQUARIUM — Oceanic Water World with Caustic Currents ---
  const p5Sys = new THREE.Group();
  const p5Geo = new THREE.SphereGeometry(2.0, 36, 36);
  const p5Mat = new THREE.MeshStandardMaterial({
    map: TEX.neptune,
    roughness: 0.5,
    metalness: 0.0
  });
  const p5Body = new THREE.Mesh(p5Geo, p5Mat);
  const p5Ring = createPlanetaryRing(2.5, 3.4, 0x8899aa);
  const p5Atmo = createAtmosphere(2.0, 0x7fb0ff, 0.18);
  const p5Life = createPlanetaryLife(110, 0x00ffcc, 2.2, 4.6, 'buoyant'); // Deep-sea plankton & buoyancy bubbles
  p5Sys.add(p5Body, p5Ring, p5Atmo, p5Life.points);
  p5Sys.position.set(8, -27, -22);
  planetsGroup.add(p5Sys);

  planetarySystems.push({
    id: 'aquarium',
    alias: ['aquarium', 'abyss', 'fish'],
    name: 'PLANET ABYSS // HAPPY AQUARIUM',
    sector: 'SECTOR 05: ABYSS HYDRO-CORE',
    desc: 'Deep Oceanic Hydro-World • Edge Biotope Engine',
    lore: 'A deep oceanic aquatic sphere with an inner luminescent core and coral reefs. Home to autonomous schooling biotope algorithms where hundreds of marine entities interact in real-time, completely uncoupled from cloud network latency.',
    atmosphere: 'High-Pressure Hydro-Fluid • Bioluminescent Plankton • Edge Water Currents',
    telemetry: { gravity: '1.2G', throughput: '120 ENTITY FLOCKS', encryption: 'BLE SYNC 12MS' },
    themeColor: 0x00ffcc,
    url: 'projects/aquarium.html',
    group: p5Sys,
    body: p5Body,
    life: p5Life,
    orbitSpeed: 0.006,
    ring: p5Ring,
    diveOffset: new THREE.Vector3(2.6, 0.6, 5.2)
  });

  // --- PLANET 6: JAH MESS — Shielded Cyber-World (Token Nonce Grid) ---
  const p6Sys = new THREE.Group();
  const p6Geo = new THREE.SphereGeometry(1.85, 32, 32);
  const p6Mat = new THREE.MeshStandardMaterial({
    map: TEX.mercury,
    roughness: 0.85,
    metalness: 0.0
  });
  const p6Body = new THREE.Mesh(p6Geo, p6Mat);
  const p6Atmo = createAtmosphere(1.85, 0x999999, 0.08);
  const p6Life = createPlanetaryLife(75, 0xcaff00, 2.2, 4.0, 'orbit'); // Geodesic security token sparks
  p6Sys.add(p6Body, p6Atmo, p6Life.points);
  p6Sys.position.set(-8, -35, -26);
  planetsGroup.add(p6Sys);

  planetarySystems.push({
    id: 'jah-mess',
    alias: ['jah', 'jah-mess', 'mess'],
    name: 'PLANET JAH // DINING ERP TOKEN',
    sector: 'SECTOR 06: JAH CITADEL',
    desc: 'Encrypted Lattice Sphere • Automated Mess-Cut Rebates',
    lore: 'A heavily shielded cyber-sphere encased in a geodesic cryptographic grid. Thousands of dining residents authenticate across mess-cut schedules without internet access, defeating duplicate token fraud through mathematical nonces.',
    atmosphere: 'Geodesic Lattice Shimmer • Nonce Verification Sparks • Cryptographic Ozone',
    telemetry: { gravity: '1.6G', throughput: '12K TOKENS/DAY', encryption: 'FRAUD RATE 0.00%' },
    themeColor: 0xcaff00,
    url: 'projects/jah-mess.html',
    group: p6Sys,
    body: p6Body,
    life: p6Life,
    orbitSpeed: 0.007,
    diveOffset: new THREE.Vector3(-2.6, 0.4, 4.8)
  });

  // --- PLANET 7: CAFEMASTER — Copper Bistro World (Concentric WiFi Waves) ---
  const p7Sys = new THREE.Group();
  const p7Geo = new THREE.SphereGeometry(1.8, 32, 32);
  const p7Mat = new THREE.MeshStandardMaterial({
    map: TEX.jupiter,
    roughness: 0.85,
    metalness: 0.0
  });
  const p7Body = new THREE.Mesh(p7Geo, p7Mat);
  const radioWaves = [];
  for (let i = 0; i < 3; i++) {
    const wave = new THREE.Mesh(
      new THREE.TorusGeometry(2.3 + i * 0.6, 0.025, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.75 - i * 0.2 })
    );
    wave.rotation.x = Math.PI / 2;
    p7Sys.add(wave);
    radioWaves.push(wave);
  }
  const p7Atmo = createAtmosphere(1.8, 0xddccaa, 0.14);
  const p7Life = createPlanetaryLife(80, 0xffaa00, 2.1, 4.3, 'buoyant'); // Thermal amber steam & WiFi ripples
  p7Sys.add(p7Body, p7Atmo, p7Life.points);
  p7Sys.position.set(7, -43, -30);
  planetsGroup.add(p7Sys);

  planetarySystems.push({
    id: 'cafemaster',
    alias: ['cafemaster', 'cafe', 'pos'],
    name: 'PLANET CAFEMASTER // ZERO-CLOUD POS',
    sector: 'SECTOR 07: CAFEMASTER BISTRO',
    desc: 'Local WiFi Peer Mesh • Instant LAN KOT Dispatch',
    lore: 'A warm metallic bistro world that radiates concentric peer-to-peer radio waves. Restaurant captains, kitchen display units, and cash counters communicate across zero-internet ad-hoc WiFi sockets with instant receipt printing.',
    atmosphere: 'Amber Thermal Waves • Zero-Cloud Local Socket Ripples • Roasted Steam Vapors',
    telemetry: { gravity: '1.1G', throughput: 'PEER MESH <5MS', encryption: '100% LAN UPTIME' },
    themeColor: 0xffaa00,
    url: 'projects/cafemaster.html',
    group: p7Sys,
    body: p7Body,
    life: p7Life,
    orbitSpeed: 0.006,
    radioWaves: radioWaves,
    diveOffset: new THREE.Vector3(2.5, -0.4, 4.6)
  });

  // --- PLANET 8: SUDOKU — Monolithic Logic Planet with Orbiting Polyhedrons ---
  const p8Sys = new THREE.Group();
  const p8Geo = new THREE.DodecahedronGeometry(2.2, 0);
  const p8Mat = new THREE.MeshStandardMaterial({
    map: TEX.moon,
    roughness: 0.9,
    metalness: 0.0
  });
  const p8Body = new THREE.Mesh(p8Geo, p8Mat);
  const logicCubes = [];
  for (let i = 0; i < 6; i++) {
    const mc = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xcaff00, roughness: 0.3, metalness: 0.7 })
    );
    p8Sys.add(mc);
    logicCubes.push({ mesh: mc, dist: 3.3, speed: 0.025 * (i % 2 ? 1 : -1), angle: (i * Math.PI) / 3 });
  }
  const p8Atmo = createAtmosphere(2.2, 0x999999, 0.08);
  const p8Life = createPlanetaryLife(100, 0xcaff00, 2.3, 4.8, 'orbit'); // Matrix code rain & logic sparks
  p8Sys.add(p8Body, p8Atmo, p8Life.points);
  p8Sys.position.set(-7, -51, -34);
  planetsGroup.add(p8Sys);

  planetarySystems.push({
    id: 'sudoku',
    alias: ['sudoku', 'matrix', 'flutter-sudoku'],
    name: 'PLANET MATRIX // SUDOKU SOLVER',
    sector: 'SECTOR 08: MATRIX LOGIC CORE',
    desc: 'Constraint Monolith • 120 FPS Backtracking AI',
    lore: 'A monolithic geometric world flanked by orbiting logic polyhedrons. It continuously solves permutation grids through bitwise bitmasking and backtracking algorithms, cracking evil-tier constraint matrices in microseconds at 120 FPS.',
    atmosphere: 'Matrix Code Mist • Floating Constraint Polyhedrons • Pure Algorithmic Static',
    telemetry: { gravity: '2.1G', throughput: '4.2MS SOLVE TIME', encryption: '120 FPS BITMASK' },
    themeColor: 0xcaff00,
    url: 'projects/sudoku.html',
    group: p8Sys,
    body: p8Body,
    life: p8Life,
    orbitSpeed: 0.005,
    logicCubes: logicCubes,
    diveOffset: new THREE.Vector3(-2.6, 0.5, 5.0)
  });

  // -------------------------------------------------------------
  // 8. Asteroids, Reticle & Floating HUD Badge
  // -------------------------------------------------------------
  const dustCount = 280;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 26;
    dustPos[i * 3] = Math.cos(angle) * radius;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 14 - (i % 8) * 6;
    dustPos[i * 3 + 2] = Math.sin(angle) * radius - (i % 8) * 8;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xcaff00,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  const dustBelt = new THREE.Points(dustGeo, dustMat);
  scene.add(dustBelt);

  // Targeting Reticle
  const reticleGeo = new THREE.RingGeometry(2.6, 2.75, 64);
  const reticleMat = new THREE.MeshBasicMaterial({
    color: 0xcaff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const reticle = new THREE.Mesh(reticleGeo, reticleMat);
  scene.add(reticle);

  // Floating HUD Badge
  let hudBadge = document.getElementById('planet-hud-badge');
  if (!hudBadge) {
    hudBadge = document.createElement('div');
    hudBadge.id = 'planet-hud-badge';
    hudBadge.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 1000;
      background: rgba(7, 7, 10, 0.9);
      border: 1px solid var(--acid-lime, #caff00);
      padding: 0.65rem 1.1rem;
      border-radius: 8px;
      backdrop-filter: blur(14px);
      box-shadow: 0 0 25px rgba(202, 255, 0, 0.3);
      font-family: 'DM Mono', monospace;
      color: #fff;
      transform: translate(-50%, -130%);
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.15s ease;
    `;
    hudBadge.innerHTML = `
      <div id="hud-name" style="color: #caff00; font-weight: 700; font-size: 0.82rem; margin-bottom: 0.2rem; text-transform: uppercase;"></div>
      <div id="hud-desc" style="color: #bbb; font-size: 0.72rem;"></div>
      <div style="color: #00f0ff; font-size: 0.68rem; margin-top: 0.3rem;">[ CLICK PLANET TO DEEP DIVE ↗ ]</div>
    `;
    document.body.appendChild(hudBadge);
  }
  const hudName = document.getElementById('hud-name');
  const hudDesc = document.getElementById('hud-desc');

  // -------------------------------------------------------------
  // 9. Raycasting, Controls & Cinematic Deep Dive Camera Engine
  // -------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredPlanet = null;
  let focusedPlanet = null;
  let isDeepDiving = false;

  // Warp parameters
  let warpFactor = 0; // 0 (normal) to 1 (full warp hyperspace)
  let warpTargetFactor = 0;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let isFreeOrbitMode = false;
  let isPointerDown = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let orbitRotX = 0;
  let orbitRotY = 0;
  let targetOrbitRotX = 0;
  let targetOrbitRotY = 0;

  window.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    isPointerDown = false;
  });

  window.addEventListener('pointermove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isFreeOrbitMode && isPointerDown) {
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      targetOrbitRotY += deltaX * 0.005;
      targetOrbitRotX += deltaY * 0.005;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    }
  });

  // Click on planet directly to trigger smooth deep dive or project navigation
  window.addEventListener('click', (e) => {
    // If clicked on an interactive UI button, let button handle it
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;

    if (hoveredPlanet) {
      if (focusedPlanet !== hoveredPlanet) {
        diveToPlanet(hoveredPlanet.id);
      } else {
        // Second click enters the project page
        if (window.soundFX) window.soundFX.playSuccess();
        window.location.href = hoveredPlanet.url;
      }
    }
  });

  // Scroll Progress
  let scrollProgress = 0;
  function updateScroll() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      scrollProgress = window.scrollY / totalHeight;
    }
    // If user scrolls manually while deep diving, gently release to space travel
    if (focusedPlanet && !isDeepDiving && Math.abs(scrollProgress) > 0.02) {
      // Keep track of which sector we're near
    }
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // -------------------------------------------------------------
  // Real NASA textures (Solar System Scope - CC BY 4.0) + soft star sprites
  // -------------------------------------------------------------
  const textureLoader = new THREE.TextureLoader();
  const TEX = {
    earth:    textureLoader.load('assets/textures/earth_daymap.jpg'),
    jupiter:  textureLoader.load('assets/textures/jupiter.jpg'),
    saturn:   textureLoader.load('assets/textures/saturn.jpg'),
    mars:     textureLoader.load('assets/textures/mars.jpg'),
    neptune:  textureLoader.load('assets/textures/neptune.jpg'),
    mercury:  textureLoader.load('assets/textures/mercury.jpg'),
    moon:     textureLoader.load('assets/textures/moon.jpg'),
    uranus:   textureLoader.load('assets/textures/uranus.jpg'),
    milkyway: textureLoader.load('assets/textures/milky_way.jpg')
  };

  // Soft round star sprite (procedural radial glow) - replaces square points
  function createStarSprite() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const starSprite = createStarSprite();

  // Real Milky Way backdrop (slowly rotating skybox sphere)
  const milkyWaySphere = new THREE.Mesh(
    new THREE.SphereGeometry(900, 64, 64),
    new THREE.MeshBasicMaterial({ map: TEX.milkyway, side: THREE.BackSide, fog: false, depthWrite: false })
  );
  scene.add(milkyWaySphere);
  });

  // -------------------------------------------------------------
  // 10. Deep Dive & Storytelling Logic
  // -------------------------------------------------------------
  function diveToPlanet(id) {
    const p = planetarySystems.find((item) => item.id === id || (item.alias && item.alias.includes(id.toLowerCase())));
    if (!p) return;

    focusedPlanet = p;
    hoveredPlanet = p;
    isDeepDiving = true;
    warpTargetFactor = 0.5;

    if (window.soundFX) window.soundFX.playLaser();

    // Trigger HUD notification
    if (hudBadge) {
      hudBadge.style.opacity = '1';
      hudName.textContent = p.name;
      hudDesc.textContent = p.desc;
    }

    // Dispatch global event for the Odyssey Storytelling HUD in index.html
    window.dispatchEvent(
      new CustomEvent('planetOdysseyUpdate', {
        detail: {
          id: p.id,
          name: p.name,
          sector: p.sector,
          desc: p.desc,
          lore: p.lore,
          atmosphere: p.atmosphere,
          telemetry: p.telemetry,
          themeColor: p.themeColor,
          url: p.url
        }
      })
    );

    // After warp acceleration peaks (approx 1.2s), ease warp speed down to a stable close-up deep dive
    setTimeout(() => {
      warpTargetFactor = 0.0;
      isDeepDiving = false;
    }, 1400);
  }

  function returnToOrbit() {
    focusedPlanet = null;
    isDeepDiving = false;
    warpTargetFactor = 0;
    if (hudBadge) hudBadge.style.opacity = '0';

    window.dispatchEvent(
      new CustomEvent('planetOdysseyUpdate', {
        detail: {
          id: null,
          sector: 'DEEP SPACE FREE FLIGHT',
          name: 'SOLAR ARCHIPELAGO // DEEP ORBIT',
          desc: 'Cruising interplanetary space lanes',
          lore: 'Navigate the cosmic system to explore 8 distinct production architectures engineered by Aanand AB.',
          atmosphere: 'Cosmic Vacuum • Distant Solar Wind',
          telemetry: { gravity: '0.0G', throughput: 'STANDBY', encryption: 'INTER-STELLAR' },
          themeColor: 0xcaff00,
          url: '#'
        }
      })
    );
  }

  // -------------------------------------------------------------
  // 11. Master Animation & Render Loop
  // -------------------------------------------------------------
  const clock = new THREE.Clock();
  let shootingStarTimer = 0;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Mouse smoothing
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Free orbit rotation smoothing
    orbitRotX += (targetOrbitRotX - orbitRotX) * 0.08;
    orbitRotY += (targetOrbitRotY - orbitRotY) * 0.08;

    if (isFreeOrbitMode) {
      planetsGroup.rotation.y = orbitRotY;
      planetsGroup.rotation.x = orbitRotX;
    } else {
      planetsGroup.rotation.y = 0;
      planetsGroup.rotation.x = 0;
    }

    // Warp acceleration smoothing
    warpFactor += (warpTargetFactor - warpFactor) * 0.08;
    warpMat.opacity = warpFactor * 0.85;

    // Dynamic FOV Warp Punch: expands during warp acceleration, then settles into intimate orbit view
    const targetFov = baseFov + warpFactor * 7 - (focusedPlanet && !isDeepDiving ? 4 : 0);
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov += (targetFov - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }

    // Warp streaks follow camera position & rotate forward
    warpGroup.position.copy(camera.position);
    warpGroup.rotation.z += 0.04;

    // Fog & Atmosphere light color morphing
    if (focusedPlanet) {
      currentFogColor.lerp(baseFogColor, 0.04);
      scene.fog.color.copy(currentFogColor);
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, 0.012, 0.04);

      planetAtmosphereLight.position.copy(focusedPlanet.group.position);
      planetAtmosphereLight.color.set(0xffffff);
      planetAtmosphereLight.intensity = THREE.MathUtils.lerp(planetAtmosphereLight.intensity, 1.8, 0.06);
    } else {
      currentFogColor.lerp(baseFogColor, 0.03);
      scene.fog.color.copy(currentFogColor);
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, 0.012, 0.03);
      planetAtmosphereLight.intensity = THREE.MathUtils.lerp(planetAtmosphereLight.intensity, 0, 0.05);
    }

    // Camera Flight Calculations
    if (focusedPlanet) {
      const pPos = focusedPlanet.group.position;
      const offset = focusedPlanet.diveOffset || new THREE.Vector3(2.5, 0.8, 5.0);

            // Direct deep-dive close-up hold: fly straight in and linger with a gentle sway
      const dive = 0.6;
      const sway = Math.sin(elapsedTime * 0.5) * 0.12;
      const targetCamX = pPos.x + offset.x * dive;
      const targetCamY = pPos.y + offset.y * dive + sway;
      const targetCamZ = pPos.z + offset.z * dive;

      // Smooth cinematic ease-in during approach, gentle settle once landed
      const lerpSpeed = isDeepDiving ? 0.085 : 0.03;
      camera.position.x += (targetCamX - camera.position.x) * lerpSpeed;
      camera.position.y += (targetCamY - camera.position.y) * lerpSpeed;
      camera.position.z += (targetCamZ - camera.position.z) * lerpSpeed;

      // Look at the planet core
      camera.lookAt(pPos.x, pPos.y, pPos.z);
    } else {
      // Normal scroll swooping past planets in space
      const targetCamZ = 22 - scrollProgress * 54;
      const targetCamY = -scrollProgress * 50 + mouseY * 1.5;
      const targetCamX = Math.sin(scrollProgress * Math.PI * 2) * 5 + mouseX * 2.5;

      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.rotation.y = -mouseX * 0.12;
      camera.rotation.x = -mouseY * 0.12;
    }

    // Starfield twinkle and rotation
    starFieldA.rotation.y = elapsedTime * 0.008;
    starFieldB.rotation.y = -elapsedTime * 0.012;
    starFieldB.rotation.x = Math.sin(elapsedTime * 0.01) * 0.04;
    milkyWaySphere.rotation.y = elapsedTime * 0.004;
    starsMatA.size = 0.75 + Math.sin(elapsedTime * 2.5) * 0.08;
    starsMatB.size = 1.1 + Math.cos(elapsedTime * 3.0) * 0.15;

    dustBelt.rotation.y += 0.002;
    dustBelt.rotation.z += 0.001;

    // Shooting stars spawn & animate
    shootingStarTimer += delta;
    if (shootingStarTimer > 4.5) {
      shootingStarTimer = 0;
      if (Math.random() > 0.55) createShootingStar();
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.position.add(s.velocity);
      s.material.opacity -= 0.018;
      if (s.material.opacity <= 0) {
        scene.remove(s);
        shootingStars.splice(i, 1);
      }
    }

    // Planetary Rotations & Living Atmospheres
    planetarySystems.forEach((p) => {
      p.body.rotation.y += p.orbitSpeed;
      if (p.ring) p.ring.rotation.z += 0.004;

      // Update Planet's Living Atmospheric Particles
      if (p.life) {
        p.life.update(elapsedTime, p === focusedPlanet || p === hoveredPlanet);
      }

      // OmniGraph Satellites
      if (p.satellites) {
        p.satellites.forEach((sat, idx) => {
          sat.angle += 0.02 + idx * 0.005;
          sat.mesh.position.set(
            Math.cos(sat.angle) * sat.dist,
            Math.sin(sat.angle * 1.5) * 0.8,
            Math.sin(sat.angle) * sat.dist
          );
        });
      }

      // Onapoo Moons
      if (p.moons) {
        p.moons.forEach((m) => {
          m.angle += m.speed;
          m.mesh.position.set(
            Math.cos(m.angle) * m.dist,
            Math.sin(m.angle) * 0.9,
            Math.sin(m.angle) * m.dist
          );
        });
      }


      // CafeMaster Radio Waves
      if (p.radioWaves) {
        p.radioWaves.forEach((w, idx) => {
          const s = 1 + ((elapsedTime * 0.8 + idx * 0.4) % 1) * 0.5;
          w.scale.set(s, s, s);
        });
      }

      // Sudoku Logic Cubes
      if (p.logicCubes) {
        p.logicCubes.forEach((lc) => {
          lc.angle += lc.speed;
          lc.mesh.position.set(
            Math.cos(lc.angle) * lc.dist,
            Math.sin(lc.angle * 2) * 0.6,
            Math.sin(lc.angle) * lc.dist
          );
          lc.mesh.rotation.x += 0.03;
          lc.mesh.rotation.y += 0.02;
        });
      }

      // Hover scale lerp
      const targetScale = p === hoveredPlanet || p === focusedPlanet ? 1.25 : 1.0;
      p.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    // Animate Holographic Targeting Reticle
    const activeTarget = focusedPlanet || hoveredPlanet;
    if (activeTarget) {
      reticle.position.copy(activeTarget.group.position);
      reticle.lookAt(camera.position);
      reticle.rotation.z += 0.02;
      reticle.material.opacity = THREE.MathUtils.lerp(reticle.material.opacity, 0.85, 0.1);
      const pulse = 1 + Math.sin(elapsedTime * 6) * 0.06;
      reticle.scale.set(pulse, pulse, pulse);
    } else {
      reticle.material.opacity = THREE.MathUtils.lerp(reticle.material.opacity, 0, 0.1);
    }

    // Raycasting for Planet Hover
    raycaster.setFromCamera(mouse, camera);
    const interactiveBodies = planetarySystems.map((p) => p.body);
    const intersects = raycaster.intersectObjects(interactiveBodies);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const sys = planetarySystems.find((p) => p.body === hitMesh);

      if (sys && hoveredPlanet !== sys) {
        hoveredPlanet = sys;
        document.body.style.cursor = 'pointer';
        if (window.soundFX) window.soundFX.playLaser();
      }

      if (hoveredPlanet) {
        const proj = hoveredPlanet.group.position.clone();
        proj.project(camera);
        const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(proj.y * 0.5) + 0.5) * window.innerHeight;

        hudBadge.style.left = `${x}px`;
        hudBadge.style.top = `${y}px`;
        hudBadge.style.opacity = '1';
        hudName.textContent = hoveredPlanet.name;
        hudDesc.textContent = hoveredPlanet.desc;
      }
    } else {
      if (hoveredPlanet && !focusedPlanet) {
        hoveredPlanet = null;
        document.body.style.cursor = 'default';
        hudBadge.style.opacity = '0';
      }
    }

    renderer.render(scene, camera);
  }

  // -------------------------------------------------------------
  // 12. Public API for External Controls
  // -------------------------------------------------------------
  window.spaceUniverse = {
    highlightPlanet: function (id) {
      const p = planetarySystems.find((item) => item.id === id || (item.alias && item.alias.includes(id.toLowerCase())));
      if (p) {
        hoveredPlanet = p;
        p.group.scale.set(1.35, 1.35, 1.35);
        if (hudBadge) {
          const proj = p.group.position.clone();
          proj.project(camera);
          const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-(proj.y * 0.5) + 0.5) * window.innerHeight;
          hudBadge.style.left = `${x}px`;
          hudBadge.style.top = `${y}px`;
          hudBadge.style.opacity = '1';
          hudName.textContent = p.name;
          hudDesc.textContent = p.desc;
        }
      }
    },
    unhighlightPlanet: function () {
      if (!focusedPlanet) {
        hoveredPlanet = null;
        if (hudBadge) hudBadge.style.opacity = '0';
      }
    },
    focusPlanet: function (id) {
      diveToPlanet(id);
    },
    divePlanet: function (id) {
      diveToPlanet(id);
    },
    returnToOrbit: function () {
      returnToOrbit();
    },
    toggleFreeOrbit: function (enable) {
      isFreeOrbitMode = typeof enable === 'boolean' ? enable : !isFreeOrbitMode;
      return isFreeOrbitMode;
    },
    getPlanets: function () {
      return planetarySystems.map((p) => ({
        id: p.id,
        name: p.name,
        sector: p.sector,
        desc: p.desc,
        lore: p.lore,
        atmosphere: p.atmosphere,
        telemetry: p.telemetry,
        themeColor: p.themeColor,
        url: p.url
      }));
    }
  };

  animate();
})();
