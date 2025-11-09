/* === PROJECT DATA === */
const PROJECTS_DATA = {
    1: {
        title: "Liquid OS",
        icon: "🎨",
        desc: "A high-performance web-based operating system portfolio. Features real-time weather, functional window management, and deeply integrated GSAP animations.",
        stack: ["JavaScript", "GSAP", "CSS3"],
        live: "#", git: "#"
    },
    2: {
        title: "Swift Notes",
        icon: "📱",
        desc: "A minimalist note-taking application focused on speed. Uses local storage for instant load times and markdown support.",
        stack: ["React", "Node.js", "LocalStorage"],
        live: "#", git: "#"
    },
    3: {
        title: "Neon DB",
        icon: "⚡",
        desc: "A lightweight database visualization tool designed for developer speed. Allows quick querying and visual relationship mapping.",
        stack: ["Vue.js", "D3.js", "PostgreSQL"],
        live: "#", git: "#"
    }
};

/* === SEARCHABLE DATA === */
const SEARCHABLE_DATA = [
    { id: 'app-about', type: 'app', target: 'about', icon: '👤', title: 'About Me', keywords: 'bio skills harry mofoka creative engineer' },
    { id: 'app-projects', type: 'app', target: 'projects', icon: '🚀', title: 'Projects', keywords: 'apps file manager liquid os swift notes neon db' },
    { id: 'app-contact', type: 'app', target: 'contact', icon: '✉️', title: 'Contact', keywords: 'email message send' },
    { id: 'app-settings', type: 'app', target: 'settings', icon: '⚙️', title: 'Settings', keywords: 'wallpaper theme dark mode blur' },
    { id: 'app-weather', type: 'app', target: 'weather', icon: '⛅', title: 'Weather', keywords: 'forecast temperature city' },
    { id: 'project-1', type: 'project', target: '1', icon: '🎨', title: 'Liquid OS', keywords: 'project javascript gsap css3' },
    { id: 'project-2', type: 'project', target: '2', icon: '📱', title: 'Swift Notes', keywords: 'project react node localstorage' },
    { id: 'project-3', type: 'project', target: '3', icon: '⚡', title: 'Neon DB', keywords: 'project vue d3 postgresql' },
    { id: 'setting-theme', type: 'setting', target: 'settings', icon: '🌗', title: 'Theme Toggle', keywords: 'dark light mode appearance' },
    { id: 'setting-blur', type: 'setting', target: 'settings', icon: '💧', title: 'Glass Transparency', keywords: 'blur appearance' },
    { id: 'setting-wallpaper', type: 'setting', target: 'settings', icon: '🖼️', title: 'Wallpaper', keywords: 'background gradient solid' }
];


document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    initClock();
    initMenuBar(); // <-- Initialize Menu Bar
    initDesktopWidgets();
    initLockScreen();
    initParallax();
    initWindowManager();
    initProjectManager();
    initFinder();
    initShutdown(); // <-- Add this
    initSettings();
    initIconTilt();
    initWeather();
});

/* AUDIO */
let clickSound, unlockSound, shutdownSound; // <-- Add shutdownSound
function initAudio() {
    clickSound = new Tone.Synth({ volume: -20, oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }).toDestination();
    unlockSound = new Tone.MembraneSynth({ volume: -15, pitchDecay: 0.01, octaves: 2 }).toDestination();
    
    // Use a noise synth for a classic "power off" sound
    shutdownSound = new Tone.NoiseSynth({
        volume: -10,
        noise: { type: 'pink' },
        envelope: { attack: 0.01, decay: 1.0, sustain: 0, release: 0.5 }
    }).toDestination();
    shutdownSound.envelope.attackCurve = 'linear';
    shutdownSound.envelope.decayCurve = 'exponential';

    document.addEventListener('mousedown', () => { if (Tone.context.state === 'running') clickSound.triggerAttackRelease('C4', '32n'); });
}

/* CLOCKS */
function initClock() {
    const update = () => {
        const now = new Date();
        document.getElementById('time').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
        document.getElementById('date').textContent = now.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'});
    };
    update(); setInterval(update, 1000);
}

/* === NEW: MENU BAR === */
function initMenuBar() {
    const dateEl = document.getElementById('menu-bar-date');
    const batteryLevelEl = document.getElementById('battery-level');
    const batteryFillEl = document.getElementById('battery-fill');
    const batteryIconEl = document.getElementById('battery-icon');

    // 1. Update Date & Time
    function updateDateTime() {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString([], {
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    }
    updateDateTime();
    setInterval(updateDateTime, 1000 * 30); // Update every 30 seconds

    // 2. Update Battery
    function updateBatteryStatus(battery) {
        let level = Math.floor(battery.level * 100);
        batteryLevelEl.textContent = `${level}%`;
        
        // Max fill width is 14px (from x=3 to x=17)
        const fillWidth = Math.max(0, Math.min(14, 14 * battery.level));
        batteryFillEl.style.width = `${fillWidth}px`;

        // Change color based on level
        if (level <= 20 && !battery.charging) {
            batteryIconEl.style.color = 'var(--danger-color)';
        } else if (battery.charging) {
            batteryIconEl.style.color = 'var(--success-color)';
        } else {
            batteryIconEl.style.color = 'var(--text-primary)';
        }
    }

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            // Initial update
            updateBatteryStatus(battery);

            // Add listeners
            battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
            battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
        });
    } else {
        // Fallback for browsers that don't support Battery API
        batteryLevelEl.textContent = '100%';
        batteryFillEl.style.width = '14px'; // Full
        batteryIconEl.style.color = 'var(--text-primary)';
    }
}


function initDesktopWidgets() {
    const t = document.getElementById('widget-time'), d = document.getElementById('widget-date');
    setInterval(() => {
        const n = new Date();
        t.textContent = n.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false});
        d.textContent = n.toLocaleDateString([], {weekday:'short', month:'long', day:'numeric'});
    }, 1000);
}

/* WEATHER APP */
function initWeather() {
    const w = document.getElementById('widget-clock');
    const win = document.getElementById('win-weather');
    const searchBtn = document.getElementById('weather-search-btn');
    const searchInput = document.getElementById('weather-search-input');
    
    w.addEventListener('click', () => {
        if (!win.style.top || win.classList.contains('center-window')) {
             win.style.top = '50%'; win.style.left = '50%'; win.style.transform = 'translate(-50%, -50%)';
        }
        openWindow(win);
        loadInitialWeather();
    });

    function loadInitialWeather() {
        const savedLoc = JSON.parse(localStorage.getItem('savedLocation'));
        if (savedLoc) {
            fetchWeather(savedLoc.lat, savedLoc.lon, savedLoc.name);
        } else {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "Current Location"),
                () => fetchWeather(51.5074, -0.1278, "London, UK")
            );
        }
    }

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSearch(); });

    function handleSearch() {
        const city = searchInput.value;
        if (city) {
            geocodeAndFetch(city);
            searchInput.value = "";
        }
    }

    async function geocodeAndFetch(city) {
        document.getElementById('weather-desc').textContent = "Searching...";
        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                const loc = data.results[0];
                fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country_code}`);
            } else {
                document.getElementById('weather-desc').textContent = "City not found";
            }
        } catch(e) {
            document.getElementById('weather-desc').textContent = "Offline";
        }
    }

    async function fetchWeather(lat, lon, name) {
        try {
            const res = await fetch(`httpsax://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await res.json();
            const codes = { 0:['☀️','Clear'], 1:['🌤️','Mainly Clear'], 2:['⛅','Partly Cloudy'], 3:['☁️','Overcast'], 45:['🌫️','Fog'], 51:['🌦️','Drizzle'], 61:['🌧️','Rain'], 71:['❄️','Snow'], 95:['⛈️','Thunderstorm'] };
            const code = data.current.weather_code;
            const info = codes[code] || (code > 60 ? ['🌧️','Rain'] : ['⛅','Cloudy']);

            document.getElementById('weather-icon-large').textContent = info[0];
            document.getElementById('weather-desc').textContent = info[1];
            document.getElementById('weather-temp').textContent = Math.round(data.current.temperature_2m) + '°';
            document.getElementById('weather-loc').textContent = name;
            document.getElementById('weather-high').textContent = Math.round(data.daily.temperature_2m_max[0]) + '°';
            document.getElementById('weather-low').textContent = Math.round(data.daily.temperature_2m_min[0]) + '°';
            document.getElementById('weather-wind').textContent = Math.round(data.current.wind_speed_10m) + ' km/h';

            localStorage.setItem('savedLocation', JSON.stringify({lat, lon, name}));
        } catch(e) {
            document.getElementById('weather-desc').textContent = "Offline";
        }
    }
}

/* LOCK SCREEN & PARALLAX */
function initLockScreen() {
    const lock = document.getElementById('lock-screen');
    const unlock = () => {
        if (Tone.context.state !== 'running') Tone.start();
        unlockSound.triggerAttackRelease('C2', '8n');
        lock.classList.add('hidden');
        document.getElementById('desktop').classList.add('visible');
    };
    document.getElementById('enter-btn').addEventListener('click', unlock);
    document.addEventListener('keydown', e => { if(e.code==='Space'||e.code==='Enter') unlock(); });
}
function initParallax() {
    const wp = document.getElementById('wallpaper');
    document.addEventListener('mousemove', e => {
        wp.style.transform = `scale(1.1) translate(${(window.innerWidth/2-e.pageX)/60}px, ${(window.innerHeight/2-e.pageY)/60}px)`;
    });
}

/* === REFACTORED WINDOW MANAGER === */
let maxZ = 100;
let draggedWindow = null;
let dragOffset = {x:0,y:0};

function initWindowManager() {
    // Bind dock items
    document.querySelectorAll('.dock-item').forEach(i => {
        i.addEventListener('click', () => openWindow(document.getElementById(`win-${i.dataset.target}`)));
    });

    // Bind initial static windows
    document.querySelectorAll('.window').forEach(w => bindWindowEvents(w));

    // Global drag events
    document.addEventListener('mousemove', e => {
        if(draggedWindow) {
            draggedWindow.style.left = `${e.clientX - dragOffset.x}px`;
            draggedWindow.style.top = `${e.clientY - dragOffset.y}px`;
        }
    });
    document.addEventListener('mouseup', () => draggedWindow = null);
}

function openWindow(w) {
    if(w) {
        w.style.zIndex = ++maxZ;
        w.style.display = 'flex';
        gsap.fromTo(w, {opacity:0, scale:0.95}, {opacity:1, scale:1, duration:0.3});
    }
}

function closeWindow(w) {
    gsap.to(w, {
        opacity:0, scale:0.95, duration:0.2,
        onComplete:() => {
            w.style.display='none';
            w.classList.remove('maximized');
            if(w.classList.contains('project-window')) w.remove();
        }
    });
}

function bindWindowEvents(w) {
    w.addEventListener('mousedown', () => w.style.zIndex = ++maxZ);
    w.querySelector('.close-btn').addEventListener('click', e => { e.stopPropagation(); closeWindow(w); });
    w.querySelector('.min-btn').addEventListener('click', e => { e.stopPropagation(); closeWindow(w); });
    w.querySelector('.max-btn').addEventListener('click', e => { e.stopPropagation(); w.classList.toggle('maximized'); });
    
    const header = w.querySelector('.window-header');
    header.addEventListener('mousedown', e => {
        if(!e.target.closest('.win-controls') && !w.classList.contains('maximized')) {
            draggedWindow = w;
            draggedWindow.style.zIndex = ++maxZ;
            const rect = w.getBoundingClientRect();
            dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            if(w.style.transform && w.style.transform.includes('translate')) {
                 w.style.transform = 'none';
                 w.style.left = rect.left + 'px';
                 w.style.top = rect.top + 'px';
            }
        }
    });
}

/* === PROJECT FILE MANAGER === */
function initProjectManager() {
    document.querySelectorAll('.app-icon-container[data-project]').forEach(icon => {
        icon.addEventListener('click', () => openProjectWindow(icon.dataset.project));
    });
}

function openProjectWindow(id) {
    const data = PROJECTS_DATA[id];
    if (!data) return;

    // Check if window already exists
    const existingWin = document.getElementById(`win-project-${id}`);
    if(existingWin) {
        openWindow(existingWin);
        return;
    }

    const template = document.getElementById('project-window-template');
    const win = template.content.firstElementChild.cloneNode(true);
    
    win.id = `win-project-${id}`;
    win.querySelector('.win-title').textContent = data.title;
    win.querySelector('.project-title').textContent = data.title;
    win.querySelector('.project-icon-large').textContent = data.icon;
    win.querySelector('.project-desc').textContent = data.desc;
    win.querySelector('.live-link').href = data.live;
    win.querySelector('.git-link').href = data.git;

    const stackContainer = win.querySelector('.project-tags');
    data.stack.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'skill-badge glass';
        badge.textContent = tech;
        stackContainer.appendChild(badge);
    });

    document.getElementById('desktop').appendChild(win);
    bindWindowEvents(win);
    win.style.top = `${15 + (maxZ % 5) * 3}vh`;
    win.style.left = `${20 + (maxZ % 5) * 3}vw`;
    openWindow(win);
}

/* === NEW: SHUTDOWN LOGIC === */
function initShutdown() {
    document.getElementById('power-button').addEventListener('click', shutDown);
}

function shutDown() {
    if (Tone.context.state === 'running') {
        shutdownSound.triggerAttack();
    }

    const desktop = document.getElementById('desktop');
    const shutdownOverlay = document.getElementById('shutdown-overlay');
    const lockScreen = document.getElementById('lock-screen');

    // 1. Close all open windows
    document.querySelectorAll('.window').forEach(w => {
        if (w.style.display !== 'none' && w.style.opacity > 0) {
            closeWindow(w);
        }
    });

    // 2. Fade out desktop
    desktop.classList.remove('visible');

    // 3. Fade in black shutdown screen
    shutdownOverlay.style.display = 'block';
    gsap.to(shutdownOverlay, { opacity: 1, duration: 1, delay: 0.5 });

    // 4. After delay, fade out black screen and fade in lock screen
    setTimeout(() => {
        // Fade out overlay
        gsap.to(shutdownOverlay, { 
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => shutdownOverlay.style.display = 'none' 
        });
        
        // Reset and fade in lock screen
        lockScreen.classList.remove('hidden');
        gsap.set(lockScreen, { opacity: 0, transform: 'scale(1.1)' }); // Start from 'hidden' state
        gsap.to(lockScreen, { 
            opacity: 1, 
            transform: 'scale(1)', 
            duration: 0.8, 
            ease: 'cubic-bezier(0.65, 0, 0.35, 1)' 
        });
    }, 1500); // Wait 1.5s for shutdown sound/animation
}

/* === FINDER === */
function initFinder() {
    const input = document.getElementById('finder-search-input');
    const resultsArea = document.getElementById('finder-results-area');

    input.addEventListener('keyup', (e) => {
        performSearch(e.target.value);
    });
    
    // Also init when window opens
    document.querySelector('.dock-item[data-target="finder"]').addEventListener('click', () => {
        input.focus();
    });

    function performSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            resultsArea.innerHTML = `<h3>Start searching...</h3><p>Search for apps, projects, or settings.</p>`;
            return;
        }

        const results = SEARCHABLE_DATA.filter(item => 
            item.title.toLowerCase().includes(query) || item.keywords.toLowerCase().includes(query)
        );

        displayResults(results);
    }

    function displayResults(results) {
        resultsArea.innerHTML = ""; // Clear
        if (results.length === 0) {
            resultsArea.innerHTML = `
                <h3>No results found</h3>
                <p>Looks like that file went on vacation. Maybe it's sipping a <code>null</code>-jito on a remote island?</p>
            `;
            return;
        }

        results.forEach(item => {
            const el = document.createElement('div');
            el.className = 'finder-result-item';
            el.dataset.type = item.type;
            el.dataset.target = item.target;
            
            let typeName = item.type.charAt(0).toUpperCase() + item.type.slice(1);
            
            el.innerHTML = `
                <span class="finder-result-icon">${item.icon}</span>
                <div>
                    <div class="finder-result-title">${item.title}</div>
                    <div class="finder-result-type">${typeName}</div>
                </div>
            `;
            
            // Add click event to open the correct window/app
            el.addEventListener('click', () => handleResultClick(item));
            
            resultsArea.appendChild(el);
        });
    }

    function handleResultClick(item) {
        switch (item.type) {
            case 'app':
            case 'setting':
                openWindow(document.getElementById(`win-${item.target}`));
                break;
            case 'project':
                openProjectWindow(item.target);
                break;
        }
        // Close finder after selection
        closeWindow(document.getElementById('win-finder'));
        input.value = "";
        resultsArea.innerHTML = `<h3>Start searching...</h3><p>Search for apps, projects, or settings.</p>`;
    }
}

/* SETTINGS & ICON TILT */
function initSettings() {
    const t = document.getElementById('theme-toggle'), b = document.getElementById('blur-slider'), wp = document.getElementById('wallpaper');
    if(localStorage.getItem('theme')==='dark') { document.body.classList.add('dark-mode'); t.checked=true; }
    if(localStorage.getItem('blur')) { document.documentElement.style.setProperty('--glass-blur', localStorage.getItem('blur')+'px'); b.value=localStorage.getItem('blur'); }
    if(localStorage.getItem('wallpaper')) { wp.style.background = localStorage.getItem('wallpaper'); }
    t.addEventListener('change', e => { document.body.classList.toggle('dark-mode', e.target.checked); localStorage.setItem('theme', e.target.checked?'dark':'light'); });
    b.addEventListener('input', e => { document.documentElement.style.setProperty('--glass-blur', e.target.value+'px'); localStorage.setItem('blur', e.target.value); });
    document.querySelectorAll('.wp-swatch').forEach(s => s.addEventListener('click', () => {
        document.querySelectorAll('.wp-swatch').forEach(i=>i.classList.remove('active')); s.classList.add('active');
        wp.style.background = s.dataset.bg; localStorage.setItem('wallpaper', s.dataset.bg);
    }));
}
function initIconTilt() {
    document.querySelectorAll('.dock-item').forEach(i => {
        const ic = i.querySelector('.dock-icon');
        i.addEventListener('mousemove', e => {
            const r = i.getBoundingClientRect();
            ic.style.transform = `perspective(300px) rotateX(${(e.clientY-r.top-r.height/2)/-4}deg) rotateY(${(e.clientX-r.left-r.width/2)/4}deg) scale(1.1)`;
        });
        i.addEventListener('mouseleave', () => ic.style.transform = 'none');
    });
}