/**
 * FlashAfterlife: Pre-loaded Classic 2000s Presets & Lore Codex
 * Inspired by the Plants vs. Zombies Almanac & Retro Flash Portals.
 */

export interface FlashPreset {
  id: string;
  title: string;
  year: number;
  author: string;
  genre: string;
  swfFilename: string;
  swfFileSize: string;
  avatarIcon: string; // Emoji / icon badge
  accentColor: string;
  as2Code: string;
  defaultJsCode: string;
  controls: string[];
  calaverita: {
    english: string;
    spanish: string;
  };
  almanac: {
    epitaph: string;
    historicalLore: string;
    earlyWebImpact: string;
    spiritStrength: string;
    difficulty: "EASY" | "MEDIUM" | "NIGHTMARE";
  };
}

export const FLASH_PRESETS: FlashPreset[] = [
  {
    id: "helicopter-2004",
    title: "The 2004 Copter Cave",
    year: 2004,
    author: "See-Saw Interactive / Robin Allen",
    genre: "Cave Tunnel Runner",
    swfFilename: "copter_2004.swf",
    swfFileSize: "14.2 KB",
    avatarIcon: "🚁",
    accentColor: "#10b981", // Eerie Ectoplasm Emerald
    controls: [
      "Hold Spacebar or Click: Ascend",
      "Release: Fall by Gravity",
      "Avoid green cavern walls & obstacles",
    ],
    calaverita: {
      english:
        "In two thousand four your keyframes flew,\nOn dial-up screens of green and blue.\nThough Adobe pulled the plug one night,\nYour code ascends in candlelight.",
      spanish:
        "En dos mil cuatro volaba tu motor,\nEntre cavernas de verde resplandor.\nAdobe apagó el enchufe final,\nPero en la ofrenda tu alma es inmortal.",
    },
    almanac: {
      epitaph: "Passed into the afterlife Dec 31, 2020. Survived by millions of sore index fingers.",
      historicalLore:
        "Originally published in 2004, the Flash Helicopter Game was the prototype for modern endless runners (predating Flappy Bird by a decade). Played in school computer labs worldwide when teachers turned their backs.",
      earlyWebImpact: "Over 500 million recorded plays across Miniclip, AddictingGames, and eBaum's World.",
      spiritStrength: "Ancient Guardian (High Resilience)",
      difficulty: "MEDIUM",
    },
    as2Code: `// -------------------------------------------------------------
// ORIGINAL MACROMEDIA FLASH MX ACTIONCRIPT 2.0 (COPTER.SWF 2004)
// Tag 12: DoAction - Frame 1
// -------------------------------------------------------------
_root.score = 0;
_root.gravity = 0.45;
_root.thrust = -0.75;
_root.vy = 0;
_root.isAlive = true;
_root.copter._x = 80;
_root.copter._y = 150;

_root.createEmptyMovieClip("smokeManager", 100);
_root.smokeCount = 0;

_root.onEnterFrame = function() {
    if (_root.isAlive) {
        if (Key.isDown(Key.SPACE) || _root.isMouseDown) {
            _root.vy += _root.thrust;
            // Spawn smoke puff
            var puff = _root.smokeManager.attachMovie("smokePuff", "p" + _root.smokeCount, _root.smokeCount);
            puff._x = _root.copter._x - 12;
            puff._y = _root.copter._y;
            _root.smokeCount = (_root.smokeCount + 1) % 50;
        } else {
            _root.vy += _root.gravity;
        }

        // Terminal velocity clamp
        if (_root.vy > 8) _root.vy = 8;
        if (_root.vy < -7) _root.vy = -7;

        _root.copter._y += _root.vy;
        _root.copter._rotation = _root.vy * 3.5;

        // Collision checking against dynamic cave bounds
        if (_root.copter._y <= _root.topCeiling || _root.copter._y >= _root.bottomFloor) {
            _root.isAlive = false;
            _root.gotoAndStop("GameOver");
        }
        _root.score++;
    }
};`,
    defaultJsCode: `function startReanimatedGame(canvas, ctx) {
  let animId = null;
  let score = 0;
  let isGameOver = false;
  let distance = 0;

  // Helicopter Physics
  let copter = {
    x: 80,
    y: canvas.height / 2,
    width: 28,
    height: 16,
    vy: 0,
    gravity: 0.28,
    thrust: -0.58,
    rotorAngle: 0
  };

  let isPressing = false;
  let particles = [];
  let obstacles = [];
  let cavePoints = [];

  // Initialize Cave Walls
  let caveSegments = Math.ceil(canvas.width / 20) + 4;
  let currentTop = 40;
  let currentBottom = canvas.height - 40;
  let caveHeight = 160;

  for (let i = 0; i < caveSegments; i++) {
    cavePoints.push({
      x: i * 20,
      top: currentTop,
      bottom: currentTop + caveHeight
    });
  }

  // Key & Mouse Listeners
  const onKeyDown = (e) => {
    if (e.code === "Space" || e.key === " ") {
      isPressing = true;
      e.preventDefault();
    }
    if (isGameOver && (e.code === "Space" || e.key === "Enter")) {
      resetGame();
    }
  };

  const onKeyUp = (e) => {
    if (e.code === "Space" || e.key === " ") {
      isPressing = false;
    }
  };

  const onMouseDown = () => {
    isPressing = true;
    if (isGameOver) resetGame();
  };

  const onMouseUp = () => { isPressing = false; };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); onMouseDown(); }, { passive: false });
  window.addEventListener("touchend", onMouseUp);

  function resetGame() {
    score = 0;
    distance = 0;
    copter.y = canvas.height / 2;
    copter.vy = 0;
    particles = [];
    obstacles = [];
    isGameOver = false;
  }

  function loop() {
    animId = requestAnimationFrame(loop);

    // Update
    if (!isGameOver) {
      if (isPressing) {
        copter.vy += copter.thrust;
        if (Math.random() < 0.6) {
          particles.push({
            x: copter.x - 10,
            y: copter.y + Math.random() * 4 - 2,
            vx: -2.5 - Math.random(),
            vy: Math.random() * 0.8 - 0.4,
            size: 4 + Math.random() * 4,
            alpha: 0.8
          });
        }
      } else {
        copter.vy += copter.gravity;
      }

      copter.vy = Math.max(-6, Math.min(6, copter.vy));
      copter.y += copter.vy;
      copter.rotorAngle += 0.8;
      distance += 3;
      score = Math.floor(distance / 5);

      // Scroll Cave
      for (let p of cavePoints) {
        p.x -= 3;
      }

      if (cavePoints[0].x < -20) {
        cavePoints.shift();
        let last = cavePoints[cavePoints.length - 1];
        let targetTop = Math.max(25, Math.min(canvas.height - 180, last.top + (Math.random() * 24 - 12)));
        cavePoints.push({
          x: last.x + 20,
          top: targetTop,
          bottom: targetTop + Math.max(130, caveHeight - Math.min(40, score * 0.05))
        });
      }

      // Spawn Pillars
      if (Math.random() < 0.015 && obstacles.length < 3) {
        let lastPt = cavePoints[cavePoints.length - 1];
        obstacles.push({
          x: canvas.width + 20,
          y: lastPt.top + 30 + Math.random() * (lastPt.bottom - lastPt.top - 60),
          width: 18,
          height: 40
        });
      }

      for (let obs of obstacles) {
        obs.x -= 3;
      }
      obstacles = obstacles.filter(o => o.x > -40);

      // Check Collision with Cave
      let copterCenter = copter.x + copter.width / 2;
      for (let i = 0; i < cavePoints.length - 1; i++) {
        if (cavePoints[i].x <= copterCenter && cavePoints[i+1].x >= copterCenter) {
          let t = (copterCenter - cavePoints[i].x) / 20;
          let topBound = cavePoints[i].top * (1 - t) + cavePoints[i+1].top * t;
          let bottomBound = cavePoints[i].bottom * (1 - t) + cavePoints[i+1].bottom * t;
          if (copter.y <= topBound || copter.y + copter.height >= bottomBound) {
            isGameOver = true;
          }
          break;
        }
      }

      // Check Collision with Obstacles
      for (let obs of obstacles) {
        if (
          copter.x + copter.width > obs.x &&
          copter.x < obs.x + obs.width &&
          copter.y + copter.height > obs.y &&
          copter.y < obs.y + obs.height
        ) {
          isGameOver = true;
        }
      }
    }

    // Render Stage
    ctx.fillStyle = "#07131d"; // Spooky Midnight Lagoon
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Cave Ceiling & Floor
    ctx.fillStyle = "#064e3b"; // Ectoplasm Forest Green
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cavePoints[0].x, cavePoints[0].top);
    for (let p of cavePoints) ctx.lineTo(p.x, p.top);
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(cavePoints[0].x, cavePoints[0].bottom);
    for (let p of cavePoints) ctx.lineTo(p.x, p.bottom);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Cave Borders
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < cavePoints.length; i++) {
      if (i === 0) ctx.moveTo(cavePoints[i].x, cavePoints[i].top);
      else ctx.lineTo(cavePoints[i].x, cavePoints[i].top);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < cavePoints.length; i++) {
      if (i === 0) ctx.moveTo(cavePoints[i].x, cavePoints[i].bottom);
      else ctx.lineTo(cavePoints[i].x, cavePoints[i].bottom);
    }
    ctx.stroke();

    // Draw Obstacles
    ctx.fillStyle = "#f59e0b"; // Ofrenda Amber
    for (let obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.strokeStyle = "#fbbf24";
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Draw Smoke
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.2;
      p.alpha -= 0.02;
      if (p.alpha > 0) {
        ctx.fillStyle = "rgba(148, 163, 184, " + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    particles = particles.filter(p => p.alpha > 0);

    // Draw Helicopter (Retro Flash Style)
    ctx.save();
    ctx.translate(copter.x + copter.width / 2, copter.y + copter.height / 2);
    ctx.rotate((copter.vy * 3.5 * Math.PI) / 180);

    // Body
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ecfdf5";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cockpit Window
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(6, -2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Tail & Skids
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-20, -3);
    ctx.lineTo(-20, -8);
    ctx.stroke();

    // Rotor Blades (Spinning)
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    let rotorSpan = Math.cos(copter.rotorAngle) * 20;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(rotorSpan, -9);
    ctx.moveTo(0, -9);
    ctx.lineTo(-rotorSpan, -9);
    ctx.stroke();

    ctx.restore();

    // HUD / Score
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.fillStyle = "#facc15";
    ctx.fillText("SCORE: " + score + " m", 20, 30);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px monospace";
    ctx.fillText("YEAR: 2004 | FLASH AFTERLIFE", canvas.width - 210, 30);

    if (isGameOver) {
      ctx.fillStyle = "rgba(7, 19, 29, 0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CRASH IN THE AFTERLIFE!", canvas.width / 2, canvas.height / 2 - 20);

      ctx.fillStyle = "#facc15";
      ctx.font = "18px monospace";
      ctx.fillText("FINAL DISTANCE: " + score + " METERS", canvas.width / 2, canvas.height / 2 + 15);

      ctx.fillStyle = "#34d399";
      ctx.font = "14px monospace";
      ctx.fillText("PRESS SPACEBAR OR CLICK TO RE-SUMMON", canvas.width / 2, canvas.height / 2 + 50);
      ctx.textAlign = "left";
    }
  }

  animId = requestAnimationFrame(loop);

  // Return cleanup hook
  return function cleanup() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    canvas.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
  };
}`,
  },
  {
    id: "tank-blaster-2006",
    title: "Zombie Defense Tank 2006",
    year: 2006,
    author: "Newgrounds Flash Portal",
    genre: "Arcade Arena Defense",
    swfFilename: "tank_zombies_2006.swf",
    swfFileSize: "28.7 KB",
    avatarIcon: "🧟",
    accentColor: "#ef4444", // Crimson Blood / Zombie Alert
    controls: [
      "W / A / S / D or Arrow Keys: Drive Tank",
      "Mouse Cursor: Aim Turret 360°",
      "Left Click: Fire Armor-Piercing Plasma",
    ],
    calaverita: {
      english:
        "Through pixel trenches and zombie horde,\nOn Newgrounds rankings you stood adored.\nNo browser plugin can dim your flame,\nThe altar echoes your sacred name.",
      spanish:
        "Entre zombis de pixel y barro infernal,\nEn Newgrounds brillabas como titán leal.\nNingún plugin muerto apagará tu fervor,\nEl altar revive tu cañón y honor.",
    },
    almanac: {
      epitaph: "Buried with full military honors in the Flash Vault. Over 10 million undead vanquished.",
      historicalLore:
        "During the 2006 Golden Era of Newgrounds and Armor Games, overhead zombie survival shooters defined late-night flash gaming. This engine pioneered trigonometric turret tracking in ActionScript 2.",
      earlyWebImpact: "Featured on Newgrounds Front Page August 14, 2006. Rated 4.6/5 stars with 12,000 reviews.",
      spiritStrength: "Battle-Hardened Veteran (Immense Power)",
      difficulty: "NIGHTMARE",
    },
    as2Code: `// -------------------------------------------------------------
// ORIGINAL ACTIONCRIPT 2.0 (ZOMBIE_TANK.SWF - 2006)
// Tag 12: DoAction - Main Arena Loop
// -------------------------------------------------------------
_root.tank._x = 275;
_root.tank._y = 200;
_root.tankSpeed = 3.5;
_root.bullets = [];
_root.zombies = [];
_root.score = 0;
_root.health = 100;

_root.onEnterFrame = function() {
    // 1. Tank Movement Controls
    if (Key.isDown(65) || Key.isDown(Key.LEFT)) _root.tank._x -= _root.tankSpeed;
    if (Key.isDown(68) || Key.isDown(Key.RIGHT)) _root.tank._x += _root.tankSpeed;
    if (Key.isDown(87) || Key.isDown(Key.UP)) _root.tank._y -= _root.tankSpeed;
    if (Key.isDown(83) || Key.isDown(Key.DOWN)) _root.tank._y += _root.tankSpeed;

    // 2. Turret Aiming via atan2
    var dx = _root._xmouse - _root.tank._x;
    var dy = _root._ymouse - _root.tank._y;
    _root.turret._rotation = Math.atan2(dy, dx) * 180 / Math.PI;

    // 3. Bullet Updates & Zombie Collision Checks
    for (var b = _root.bullets.length - 1; b >= 0; b--) {
        _root.bullets[b]._x += _root.bullets[b].vx;
        _root.bullets[b]._y += _root.bullets[b].vy;
        for (var z = _root.zombies.length - 1; z >= 0; z--) {
            if (_root.bullets[b].hitTest(_root.zombies[z])) {
                _root.zombies[z].removeMovieClip();
                _root.zombies.splice(z, 1);
                _root.score += 25;
            }
        }
    }
};`,
    defaultJsCode: `function startReanimatedGame(canvas, ctx) {
  let animId = null;
  let score = 0;
  let health = 100;
  let isGameOver = false;

  const tank = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 24,
    speed: 3.2,
    angle: 0,
    turretAngle: 0
  };

  let keys = {};
  let bullets = [];
  let zombies = [];
  let particles = [];
  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

  const onKeyDown = (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
    if (isGameOver && (e.code === "Space" || e.key === "Enter")) resetGame();
  };

  const onKeyUp = (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
  };

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  const onMouseDown = () => {
    if (isGameOver) {
      resetGame();
      return;
    }
    // Fire bullet from turret tip
    const speed = 9;
    bullets.push({
      x: tank.x + Math.cos(tank.turretAngle) * 22,
      y: tank.y + Math.sin(tank.turretAngle) * 22,
      vx: Math.cos(tank.turretAngle) * speed,
      vy: Math.sin(tank.turretAngle) * speed,
      life: 70
    });
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);

  function resetGame() {
    tank.x = canvas.width / 2;
    tank.y = canvas.height / 2;
    score = 0;
    health = 100;
    bullets = [];
    zombies = [];
    particles = [];
    isGameOver = false;
  }

  function spawnZombie() {
    if (zombies.length >= 15) return;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * canvas.width; y = -20; }
    else if (side === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
    else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
    else { x = -20; y = Math.random() * canvas.height; }

    zombies.push({
      x, y,
      speed: 1.1 + Math.random() * 0.9,
      size: 14,
      health: 2
    });
  }

  function loop() {
    animId = requestAnimationFrame(loop);

    if (!isGameOver) {
      // Tank Movement
      let dx = 0, dy = 0;
      if (keys["w"] || keys["arrowup"]) dy -= 1;
      if (keys["s"] || keys["arrowdown"]) dy += 1;
      if (keys["a"] || keys["arrowleft"]) dx -= 1;
      if (keys["d"] || keys["arrowright"]) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      tank.x += dx * tank.speed;
      tank.y += dy * tank.speed;

      // Bounds
      tank.x = Math.max(20, Math.min(canvas.width - 20, tank.x));
      tank.y = Math.max(20, Math.min(canvas.height - 20, tank.y));

      // Turret angle to mouse
      tank.turretAngle = Math.atan2(mouse.y - tank.y, mouse.x - tank.x);

      // Bullet logic
      for (let b of bullets) {
        b.x += b.vx;
        b.y += b.vy;
        b.life--;
      }
      bullets = bullets.filter(b => b.life > 0);

      // Spawn zombies
      if (Math.random() < 0.04) spawnZombie();

      // Zombie AI
      for (let z of zombies) {
        let zdx = tank.x - z.x;
        let zdy = tank.y - z.y;
        let dist = Math.hypot(zdx, zdy);
        if (dist > 0) {
          z.x += (zdx / dist) * z.speed;
          z.y += (zdy / dist) * z.speed;
        }

        // Hit tank
        if (dist < tank.size / 2 + z.size / 2) {
          health -= 0.35;
          if (health <= 0) {
            health = 0;
            isGameOver = true;
          }
        }
      }

      // Bullet hits zombie
      for (let b of bullets) {
        for (let z of zombies) {
          let dist = Math.hypot(b.x - z.x, b.y - z.y);
          if (dist < z.size + 4) {
            z.health--;
            b.life = 0;
            // Particles
            for (let i = 0; i < 5; i++) {
              particles.push({
                x: z.x, y: z.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                alpha: 1,
                color: "#10b981"
              });
            }
            if (z.health <= 0) {
              score += 50;
            }
          }
        }
      }
      zombies = zombies.filter(z => z.health > 0);
    }

    // Render Graveyard Arena
    ctx.fillStyle = "#091c28"; // Spooky Dark Teal Graveyard
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Floor
    ctx.strokeStyle = "rgba(34, 197, 94, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Particles
    for (let p of particles) {
      p.x += p.vx; p.y += p.vy; p.alpha -= 0.03;
      if (p.alpha > 0) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    particles = particles.filter(p => p.alpha > 0);

    // Bullets (Glowing Plasma)
    ctx.fillStyle = "#fbbf24";
    for (let b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Zombies (Cartoon Spooky)
    for (let z of zombies) {
      ctx.fillStyle = "#84cc16"; // Toxic Zombie Green
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#4d7c0f";
      ctx.stroke();

      // Glowing Red Eyes
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(z.x - 3, z.y - 2, 1.8, 0, Math.PI * 2);
      ctx.arc(z.x + 3, z.y - 2, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tank Body
    ctx.save();
    ctx.translate(tank.x, tank.y);

    // Treads
    ctx.fillStyle = "#334155";
    ctx.fillRect(-15, -14, 30, 6);
    ctx.fillRect(-15, 8, 30, 6);

    // Chassis
    ctx.fillStyle = "#0284c7"; // Retro Blue Tank
    ctx.fillRect(-12, -9, 24, 18);
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(-12, -9, 24, 18);

    // Turret Barrel (Rotated to mouse)
    ctx.rotate(tank.turretAngle);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(0, -3, 22, 6);
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // HUD
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#facc15";
    ctx.fillText("SCORE: " + score, 20, 30);

    // Health Bar
    ctx.fillStyle = "#334155";
    ctx.fillRect(20, 40, 120, 10);
    ctx.fillStyle = health > 30 ? "#22c55e" : "#ef4444";
    ctx.fillRect(20, 40, (health / 100) * 120, 10);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(20, 40, 120, 10);

    if (isGameOver) {
      ctx.fillStyle = "rgba(10, 15, 25, 0.88)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TANK OVERRUN BY THE UNDEAD!", canvas.width / 2, canvas.height / 2 - 20);

      ctx.fillStyle = "#facc15";
      ctx.font = "18px monospace";
      ctx.fillText("FINAL SCORE: " + score, canvas.width / 2, canvas.height / 2 + 15);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "14px monospace";
      ctx.fillText("CLICK OR PRESS SPACE TO RESURRECT TANK", canvas.width / 2, canvas.height / 2 + 50);
      ctx.textAlign = "left";
    }
  }

  animId = requestAnimationFrame(loop);

  return function cleanup() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", onMouseDown);
  };
}`,
  },
  {
    id: "elastic-ball-2003",
    title: "Squash & Stretch Elastic Ball (2003)",
    year: 2003,
    author: "Macromedia Flash MX Lab",
    genre: "Physics & Kinetic Animation",
    swfFilename: "elastic_ball_2003.swf",
    swfFileSize: "9.1 KB",
    avatarIcon: "🔮",
    accentColor: "#a855f7", // Mystical Ghost Purple
    controls: [
      "Move Mouse Horizontally: Position Altar Paddle",
      "Hit ball with paddle edges for angle deflection",
      "Left Click: Trigger Super Kinetic Blast",
    ],
    calaverita: {
      english:
        "Macromedia framed your joyous bounce,\nWith every physics tick and ounce.\nRest well, sweet vector of the past,\nIn Canvas lines reborn at last.",
      spanish:
        "Macromedia esculpió tu alegre rebotar,\nCon fórmulas que el tiempo no podrá borrar.\nDescansa en paz, esfera del pasado,\nQue en puro Canvas has resucitado.",
    },
    almanac: {
      epitaph: "Dedicated to the animators of Flash MX who spent hours tweaking tween easing.",
      historicalLore:
        "Showcasing Macromedia's groundbreaking vector transformations, this interactive demo taught thousands of early web developers how to combine math with physics simulation.",
      earlyWebImpact: "Included as an official Flash MX tutorial asset, downloaded over 2 million times in 2003.",
      spiritStrength: "Whimsical Trickster (Agile & Light)",
      difficulty: "EASY",
    },
    as2Code: `// -------------------------------------------------------------
// ORIGINAL MACROMEDIA FLASH MX ACTIONCRIPT 2.0 (ELASTIC.SWF 2003)
// Tag 12: DoAction - Frame 1 Kinetic Tweening
// -------------------------------------------------------------
_root.ball._x = 200;
_root.ball._y = 100;
_root.ball.vx = 5;
_root.ball.vy = 2;
_root.gravity = 0.5;
_root.elasticity = 0.88;
_root.squashFactor = 1.0;

_root.onEnterFrame = function() {
    this.ball.vy += _root.gravity;
    this.ball._x += this.ball.vx;
    this.ball._y += this.ball.vy;

    // Floor collision with squash & stretch deformation
    if (this.ball._y >= 350) {
        this.ball._y = 350;
        this.ball.vy = -this.ball.vy * _root.elasticity;
        this.ball._yscale = 65; // Squash
        this.ball._xscale = 135; // Stretch
    } else {
        // Smooth recovery tween
        this.ball._yscale += (100 - this.ball._yscale) * 0.2;
        this.ball._xscale += (100 - this.ball._xscale) * 0.2;
    }

    // Wall bounce
    if (this.ball._x <= 20 || this.ball._x >= 530) {
        this.ball.vx = -this.ball.vx * _root.elasticity;
    }
};`,
    defaultJsCode: `function startReanimatedGame(canvas, ctx) {
  let animId = null;
  let bounces = 0;
  let combo = 0;

  const ball = {
    x: canvas.width / 2,
    y: 80,
    radius: 18,
    vx: 4.2,
    vy: 1,
    gravity: 0.38,
    elasticity: 0.88,
    scaleX: 1,
    scaleY: 1
  };

  const paddle = {
    x: canvas.width / 2,
    y: canvas.height - 40,
    width: 100,
    height: 14
  };

  let trail = [];

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left;
  };

  const onMouseDown = () => {
    // Kinetic Super Jolt
    ball.vy = -12;
    ball.scaleY = 1.4;
    ball.scaleX = 0.7;
  };

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);

  function loop() {
    animId = requestAnimationFrame(loop);

    // Physics
    ball.vy += ball.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Tween recover scale
    ball.scaleX += (1 - ball.scaleX) * 0.15;
    ball.scaleY += (1 - ball.scaleY) * 0.15;

    // Trail
    trail.push({ x: ball.x, y: ball.y, alpha: 0.6, r: ball.radius });
    if (trail.length > 8) trail.shift();

    // Wall bounce
    if (ball.x - ball.radius <= 10) {
      ball.x = 10 + ball.radius;
      ball.vx = Math.abs(ball.vx) * ball.elasticity;
      ball.scaleX = 0.7;
      ball.scaleY = 1.3;
    } else if (ball.x + ball.radius >= canvas.width - 10) {
      ball.x = canvas.width - 10 - ball.radius;
      ball.vx = -Math.abs(ball.vx) * ball.elasticity;
      ball.scaleX = 0.7;
      ball.scaleY = 1.3;
    }

    // Ceiling bounce
    if (ball.y - ball.radius <= 10) {
      ball.y = 10 + ball.radius;
      ball.vy = Math.abs(ball.vy) * ball.elasticity;
    }

    // Paddle hit
    const paddleLeft = paddle.x - paddle.width / 2;
    const paddleRight = paddle.x + paddle.width / 2;
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddleLeft &&
      ball.x <= paddleRight &&
      ball.vy > 0
    ) {
      ball.y = paddle.y - ball.radius;
      ball.vy = -Math.abs(ball.vy) * ball.elasticity - 2;
      ball.scaleX = 1.45; // Squash
      ball.scaleY = 0.65;
      // Angle by paddle offset
      const offset = (ball.x - paddle.x) / (paddle.width / 2);
      ball.vx = offset * 7;
      bounces++;
      combo++;
    }

    // Floor Reset
    if (ball.y - ball.radius > canvas.height) {
      ball.x = canvas.width / 2;
      ball.y = 60;
      ball.vx = (Math.random() - 0.5) * 6;
      ball.vy = 2;
      combo = 0;
    }

    // Render Stage
    ctx.fillStyle = "#0c1824"; // Altar Chamber
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Trail
    for (let t of trail) {
      t.alpha -= 0.06;
      if (t.alpha > 0) {
        ctx.fillStyle = "rgba(168, 85, 247, " + t.alpha + ")";
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Paddle (Altar Stone Bar)
    ctx.fillStyle = "#f59e0b"; // Marigold Gold
    ctx.fillRect(paddleLeft, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 2;
    ctx.strokeRect(paddleLeft, paddle.y, paddle.width, paddle.height);

    // Draw Ball with Squash & Stretch
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.scale(ball.scaleX, ball.scaleY);

    const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, ball.radius);
    grad.addColorStop(0, "#e9d5ff");
    grad.addColorStop(0.5, "#a855f7");
    grad.addColorStop(1, "#581c87");
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f3e8ff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // HUD
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#facc15";
    ctx.fillText("BOUNCES: " + bounces, 20, 30);
    ctx.fillStyle = "#a855f7";
    ctx.fillText("COMBO: " + combo + "x", 160, 30);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("CLICK TO JOLT | MOUSE PADDLE", canvas.width - 210, 30);
  }

  animId = requestAnimationFrame(loop);

  return function cleanup() {
    if (animId) cancelAnimationFrame(animId);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", onMouseDown);
  };
}`,
  },
];
