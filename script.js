// === ARC Raiders Skill Tree - DOM/SVG Implementation ===
// Optimized for Mobile Performance (No Canvas Lag)

// === DATA & CONFIG ===
const COLORS = {
    conditioning: '#12FF70',
    mobility: '#F7CF09',
    survival: '#F3040E',
    disabled: '#606576',
    skillBg: '#0A0B19',
    lineDark: '#606576'
};

// Mobile detection (needs to be defined early)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const SKILL_DATA = {
    Conditioning: {
        skills: [
            { id: 'used-to-the-weight', name: 'Used To The Weight', description: "Wearing a shield doesn't slow you down as much.", maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 550, y: 545, level: 0 },
            { id: 'blast-born', name: 'Blast-Born', description: 'Your hearing is less affected by nearby explosions.', maxPoints: 5, requiredSkill: 'used-to-the-weight', requiredPoints: null, x: 424, y: 539, level: 1 },
            { id: 'gentle-pressure', name: 'Gentle Pressure', description: 'You make less noise when breaching.', maxPoints: 5, requiredSkill: 'used-to-the-weight', requiredPoints: null, x: 431.5, y: 457, level: 1 },
            { id: 'fight-or-flight', name: 'Fight Or Flight', description: "When you're hurt in combat, regain a fixed amount of stamina.", maxPoints: 5, requiredSkill: 'blast-born', requiredPoints: null, x: 373, y: 510, level: 2 },
            { id: 'proficient-pryer', name: 'Proficient Pryer', description: 'Breaching doors and containers takes less time.', maxPoints: 5, requiredSkill: 'gentle-pressure', requiredPoints: null, x: 431.5, y: 398, level: 2 },
            { id: 'survivors-stamina', name: "Survivor's Stamina", description: "When you're critically hurt, your stamina regenerates faster.", maxPoints: 1, requiredSkill: 'fight-or-flight', requiredPoints: 15, x: 282, y: 450, level: 3 },
            { id: 'unburdened-roll', name: 'Unburdened Roll', description: 'If your shield breaks, your first Dodge Roll does not cost stamina.', maxPoints: 1, requiredSkill: 'proficient-pryer', requiredPoints: 15, x: 360, y: 316, level: 3 },
            { id: 'downed-but-determined', name: 'Downed But Determined', description: "When you're downed, it takes longer before you collapse.", maxPoints: 5, requiredSkill: 'survivors-stamina', requiredPoints: null, x: 184, y: 399, level: 4 },
            { id: 'a-little-extra', name: 'A Little Extra', description: 'Breaching an object generates resources.', maxPoints: 1, requiredSkill: ['survivors-stamina', 'unburdened-roll'], requiredPoints: null, x: 221, y: 332, level: 4 },
            { id: 'effortless-swing', name: 'Effortless Swing', description: 'Melee abilities cost less stamina.', maxPoints: 5, requiredSkill: 'unburdened-roll', requiredPoints: null, x: 261, y: 264, level: 4 },
            { id: 'turtle-crawl', name: 'Turtle Crawl', description: 'While downed, you take less damage.', maxPoints: 5, requiredSkill: 'downed-but-determined', requiredPoints: null, x: 133, y: 369, level: 5 },
            { id: 'loaded-arms', name: 'Loaded Arms', description: 'Your equipped weapon has less impact on encumbrance.', maxPoints: 1, requiredSkill: 'a-little-extra', requiredPoints: null, x: 170, y: 302, level: 5 },
            { id: 'sky-clearing-swing', name: 'Sky-Clearing Swing', description: 'You deal more melee damage to drones.', maxPoints: 5, requiredSkill: 'effortless-swing', requiredPoints: null, x: 210, y: 233, level: 5 },
            { id: 'back-on-your-feet', name: 'Back On Your Feet', description: "When you're critically hurt, your health regenerates.", maxPoints: 1, requiredSkill: ['turtle-crawl', 'loaded-arms'], requiredPoints: 36, x: 1, y: 290, level: 6 },
            { id: 'flyswatter', name: 'Flyswatter', description: 'Wasps and Turrets can be destroyed with a single melee attack.', maxPoints: 1, requiredSkill: ['loaded-arms', 'sky-clearing-swing'], requiredPoints: 36, x: 80, y: 154, level: 6 }
        ],
        edges: [
            { from: 'used-to-the-weight', to: 'blast-born', path: 'M141.632 34.3231C23.8993 -42.2394 54.2352 43.7125 0.786133 9.04307', x: 444.54, y: 550.9 },
            { from: 'blast-born', to: 'fight-or-flight', path: 'M53.4473 31.5881L0.720459 1.25212', x: 391.81, y: 528.88 },
            { from: 'fight-or-flight', to: 'survivors-stamina', path: 'M76.9944 44.3693L0.494385 0.869293', x: 317, y: 486.5 },
            { from: 'survivors-stamina', to: 'downed-but-determined', path: 'M114.003 66.8645L0.502686 0.864471', x: 202.5, y: 420 },
            { from: 'downed-but-determined', to: 'turtle-crawl', path: 'M50.7585 30.928L0.258545 0.427994', x: 152.5, y: 390 },
            { from: 'turtle-crawl', to: 'back-on-your-feet', path: 'M112.995 64.8692L0.494507 0.869186', x: 39, y: 325.5 },
            { from: 'survivors-stamina', to: 'a-little-extra', path: 'M75.3638 134.432C-4.13623 102.432 73.3638 29.4315 0.36377 0.931519', x: 240.5, y: 353 },
            { from: 'used-to-the-weight', to: 'gentle-pressure', path: 'M131 98C48.5 50 1 36.5 1 0', x: 454.5, y: 482 },
            { from: 'gentle-pressure', to: 'proficient-pryer', path: 'M1 58V0', x: 458, y: 420 },
            { from: 'proficient-pryer', to: 'unburdened-roll', path: 'M64.8877 66.4218C69.8877 31.9218 63.3877 27.4218 0.387695 0.921768', x: 394, y: 353.5 },
            { from: 'unburdened-roll', to: 'a-little-extra', path: 'M155.533 21.4485C85.5334 -42.5511 75.0334 68.4489 0.533447 21.4485', x: 239.5, y: 332.55 },
            { from: 'a-little-extra', to: 'loaded-arms', path: 'M51.5007 30.3656L0.500732 0.865616', x: 190.5, y: 323.5 },
            { from: 'loaded-arms', to: 'back-on-your-feet', path: 'M155.545 12.7653C102.545 -33.7347 93.5453 76.7653 0.545288 16.2653', x: 34.5, y: 311.23 },
            { from: 'loaded-arms', to: 'flyswatter', path: 'M75.9366 136.4C8.43665 104.4 102.437 50.3997 0.436646 0.899658', x: 115, y: 188.5 },
            { from: 'unburdened-roll', to: 'effortless-swing', path: 'M113.014 68.3575L0.514404 0.857483', x: 281, y: 286 },
            { from: 'effortless-swing', to: 'sky-clearing-swing', path: 'M50.5144 30.8575L0.514404 0.857483', x: 230.5, y: 256 },
            { from: 'sky-clearing-swing', to: 'flyswatter', path: 'M112.49 63.8716L0.490234 0.871582', x: 116.5, y: 191.5 }
        ]
    },
    Mobility: {
        skills: [
            { id: 'nimble-climber', name: 'Nimble Climber', description: 'You can climb and vault more quickly.', maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 646, y: 499, level: 0 },
            { id: 'marathon-runner', name: 'Marathon Runner', description: 'Moving around costs less stamina.', maxPoints: 5, requiredSkill: 'nimble-climber', requiredPoints: null, x: 550, y: 403, level: 1 },
            { id: 'slip-and-slide', name: 'Slip and Slide', description: 'You can slide further and faster.', maxPoints: 5, requiredSkill: 'nimble-climber', requiredPoints: null, x: 756, y: 403, level: 1 },
            { id: 'youthful-lungs', name: 'Youthful Lungs', description: 'Increase your max stamina.', maxPoints: 5, requiredSkill: 'marathon-runner', requiredPoints: null, x: 550, y: 348, level: 2 },
            { id: 'sturdy-ankles', name: 'Sturdy Ankles', description: 'You take less fall damage.', maxPoints: 5, requiredSkill: 'slip-and-slide', requiredPoints: null, x: 757, y: 348, level: 2 },
            { id: 'carry-the-momentum', name: 'Carry The Momentum', description: 'After a Sprint Dodge Roll, sprinting costs no stamina briefly.', maxPoints: 1, requiredSkill: 'youthful-lungs', requiredPoints: 15, x: 594, y: 277, level: 3 },
            { id: 'calming-stroll', name: 'Calming Stroll', description: 'While walking, stamina regenerates as if standing still.', maxPoints: 1, requiredSkill: 'sturdy-ankles', requiredPoints: 15, x: 697, y: 277, level: 3 },
            { id: 'effortless-roll', name: 'Effortless Roll', description: 'Dodge Rolls cost less stamina.', maxPoints: 5, requiredSkill: 'carry-the-momentum', requiredPoints: null, x: 549, y: 182, level: 4 },
            { id: 'crawl-before-you-walk', name: 'Crawl Before You Walk', description: "When you're downed, you crawl faster.", maxPoints: 5, requiredSkill: ['carry-the-momentum', 'calming-stroll'], requiredPoints: null, x: 654, y: 182, level: 4 },
            { id: 'off-the-wall', name: 'Off The Wall', description: 'You can Wall Leap further.', maxPoints: 5, requiredSkill: 'calming-stroll', requiredPoints: null, x: 756.5, y: 182, level: 4 },
            { id: 'heroic-leap', name: 'Heroic Leap', description: 'You can Sprint Dodge Roll further.', maxPoints: 5, requiredSkill: 'effortless-roll', requiredPoints: null, x: 549, y: 125, level: 5 },
            { id: 'vigorous-vaulter', name: 'Vigorous Vaulter', description: 'Vaulting is no longer slowed while exhausted.', maxPoints: 1, requiredSkill: 'crawl-before-you-walk', requiredPoints: null, x: 652, y: 125, level: 5 },
            { id: 'ready-to-roll', name: 'Ready To Roll', description: 'When falling, your Recovery Roll window is increased.', maxPoints: 5, requiredSkill: 'off-the-wall', requiredPoints: null, x: 757, y: 125, level: 5 },
            { id: 'vaults-on-vaults-on-vaults', name: 'Vaults on Vaults on Vaults', description: 'Vaulting no longer costs stamina.', maxPoints: 1, requiredSkill: ['heroic-leap', 'vigorous-vaulter'], requiredPoints: 36, x: 598, y: 3, level: 6 },
            { id: 'vault-spring', name: 'Vault Spring', description: 'Lets you jump at the end of a vault.', maxPoints: 1, requiredSkill: ['vigorous-vaulter', 'ready-to-roll'], requiredPoints: 36, x: 703, y: 3, level: 6 }
        ],
        edges: [
            { from: 'nimble-climber', to: 'marathon-runner', path: 'M105 112.534C105 4.53429 4.49951 102.034 0.999512 0.0342865', x: 577, y: 424 },
            { from: 'marathon-runner', to: 'youthful-lungs', path: 'M1 56V0', x: 576.5, y: 368 },
            { from: 'youthful-lungs', to: 'carry-the-momentum', path: 'M1.44458 57.7828C1.44458 1.44456 10.112 1.44456 54.8937 1.44456', x: 576.83, y: 312 },
            { from: 'carry-the-momentum', to: 'effortless-roll', path: 'M57.614 113.215C54.0026 -18.2408 6.49862 98.305 1.44263 0.0742493', x: 575, y: 203.5 },
            { from: 'effortless-roll', to: 'heroic-leap', path: 'M1 57V0', x: 577, y: 145 },
            { from: 'heroic-leap', to: 'vaults-on-vaults-on-vaults', path: 'M1.44458 113.536C1.44458 14.0358 51.4446 121.036 54.4446 0.0358276', x: 578, y: 35 },
            { from: 'carry-the-momentum', to: 'crawl-before-you-walk', path: 'M1.44409 113.473C5.05552 -17.9829 50.5595 98.305 55.6155 0.0742493', x: 627.39, y: 202.52 },
            { from: 'crawl-before-you-walk', to: 'vigorous-vaulter', path: 'M1 57V0', x: 680.5, y: 146 },
            { from: 'vigorous-vaulter', to: 'vaults-on-vaults-on-vaults', path: 'M54.4441 113.536C54.4441 14.0358 4.44409 121.036 1.44409 0.0358276', x: 627, y: 35 },
            { from: 'vigorous-vaulter', to: 'vault-spring', path: 'M1.44458 113.536C1.44458 14.0358 51.4446 121.036 54.4446 0.0358276', x: 681, y: 35 },
            { from: 'nimble-climber', to: 'slip-and-slide', path: 'M1 112.534C1 4.53429 101.5 102.034 105 0.0342865', x: 680, y: 423 },
            { from: 'slip-and-slide', to: 'sturdy-ankles', path: 'M1 56V0', x: 785, y: 370 },
            { from: 'sturdy-ankles', to: 'calming-stroll', path: 'M51.6255 54.9391C51.6255 -1.06091 51.6255 5.93909 0.125851 1.43909', x: 733, y: 312 },
            { from: 'calming-stroll', to: 'crawl-before-you-walk', path: 'M55.614 113.473C52.0026 -17.9829 6.49863 98.305 1.44263 0.0742493', x: 680.84, y: 203.24 },
            { from: 'calming-stroll', to: 'off-the-wall', path: 'M1.44409 113.215C5.05552 -18.2408 52.5595 98.305 57.6155 0.0742493', x: 730, y: 204 },
            { from: 'off-the-wall', to: 'ready-to-roll', path: 'M1 57V0', x: 784, y: 145 },
            { from: 'ready-to-roll', to: 'vault-spring', path: 'M54.4441 113.536C54.4441 14.0358 4.44409 121.036 1.44409 0.0358276', x: 731.5, y: 35.5 }
        ]
    },
    Survival: {
        skills: [
            { id: 'agile-croucher', name: 'Agile Croucher', description: 'Your movement speed while crouching is increased.', maxPoints: 5, requiredSkill: null, requiredPoints: null, x: 774, y: 570, level: 0 },
            { id: 'looters-instincts', name: "Looter's Instincts", description: 'When searching a container, loot is revealed faster.', maxPoints: 5, requiredSkill: 'agile-croucher', requiredPoints: null, x: 908, y: 475, level: 1 },
            { id: 'revitalizing-squat', name: 'Revitalizing Squat', description: 'Stamina regeneration while crouched is increased.', maxPoints: 5, requiredSkill: 'agile-croucher', requiredPoints: null, x: 927, y: 555, level: 1 },
            { id: 'silent-scavenger', name: 'Silent Scavenger', description: 'You make less noise when looting.', maxPoints: 5, requiredSkill: 'looters-instincts', requiredPoints: null, x: 908, y: 415, level: 2 },
            { id: 'in-round-crafting', name: 'In-round Crafting', description: 'Unlocks field-craft items while topside.', maxPoints: 1, requiredSkill: 'revitalizing-squat', requiredPoints: null, x: 981, y: 526, level: 2 },
            { id: 'suffer-in-silence', name: 'Suffer In Silence', description: 'While critically hurt, your movement makes less noise.', maxPoints: 1, requiredSkill: 'silent-scavenger', requiredPoints: 15, x: 964, y: 341, level: 3 },
            { id: 'good-as-new', name: 'Good As New', description: 'While healing, stamina regeneration is increased.', maxPoints: 1, requiredSkill: 'in-round-crafting', requiredPoints: 15, x: 1043, y: 475, level: 3 },
            { id: 'broad-shoulders', name: 'Broad Shoulders', description: 'Increases the maximum weight you can carry.', maxPoints: 5, requiredSkill: 'suffer-in-silence', requiredPoints: null, x: 1088.5, y: 280, level: 4 },
            { id: 'traveling-tinkerer', name: 'Traveling Tinkerer', description: 'Unlocks additional items to field craft.', maxPoints: 1, requiredSkill: ['suffer-in-silence', 'good-as-new'], requiredPoints: null, x: 1131, y: 346, level: 4 },
            { id: 'stubborn-mule', name: 'Stubborn Mule', description: 'Stamina regeneration is less affected by over-encumbrance.', maxPoints: 5, requiredSkill: 'good-as-new', requiredPoints: null, x: 1168, y: 416, level: 4 },
            { id: 'looters-luck', name: "Looter's Luck", description: 'Chance to reveal twice as many items at once.', maxPoints: 5, requiredSkill: 'broad-shoulders', requiredPoints: null, x: 1138.5, y: 251, level: 5 },
            { id: 'one-raiders-scraps', name: "One Raider's Scraps", description: 'Chance of finding additional field-crafted items in Raider containers.', maxPoints: 5, requiredSkill: 'traveling-tinkerer', requiredPoints: null, x: 1180, y: 321, level: 5 },
            { id: 'three-deep-breaths', name: 'Three Deep Breaths', description: 'After an ability drains stamina, you recover more quickly.', maxPoints: 5, requiredSkill: 'stubborn-mule', requiredPoints: null, x: 1218.33, y: 386.33, level: 5 },
            { id: 'security-breach', name: 'Security Breach', description: 'Lets you breach Security Lockers.', maxPoints: 1, requiredSkill: ['looters-luck', 'one-raiders-scraps'], requiredPoints: 36, x: 1245, y: 178, level: 6 },
            { id: 'minesweeper', name: 'Minesweeper', description: 'Mines and explosive deployables can be defused.', maxPoints: 1, requiredSkill: ['one-raiders-scraps', 'three-deep-breaths'], requiredPoints: 36, x: 1322, y: 314, level: 6 }
        ],
        edges: [
            { from: 'agile-croucher', to: 'looters-instincts', path: 'M0.537842 103.564C87.5378 48.0637 123.538 47.0637 126.538 0.0637016', x: 810, y: 501.5 },
            { from: 'looters-instincts', to: 'silent-scavenger', path: 'M1.99976 58.5171L0.999756 0.0170898', x: 935, y: 443.5 },
            { from: 'silent-scavenger', to: 'suffer-in-silence', path: 'M2.11598 59.4781C-3.4391 25.5226 10.7854 12.7588 66.116 0.978073', x: 934.38, y: 383.5 },
            { from: 'suffer-in-silence', to: 'broad-shoulders', path: 'M0.505371 65.8629L111.505 0.86293', x: 1000.5, y: 309.5 },
            { from: 'broad-shoulders', to: 'looters-luck', path: 'M0.500732 30.3656L51.5007 0.865631', x: 1112.5, y: 280.5 },
            { from: 'looters-luck', to: 'security-breach', path: 'M0.497803 66.8673L115.498 0.86731', x: 1164.5, y: 213 },
            { from: 'suffer-in-silence', to: 'traveling-tinkerer', path: 'M0.360596 10.2544C81.8606 -21.2456 81.3606 40.2544 156.861 10.2544', x: 996, y: 367.25 },
            { from: 'traveling-tinkerer', to: 'one-raiders-scraps', path: 'M0.472412 26.8813L48.9724 0.881348', x: 1152.5, y: 349 },
            { from: 'one-raiders-scraps', to: 'security-breach', path: 'M59.0808 1.11517C3.65559 46.7542 48.5806 100.115 0.579001 121.114', x: 1208, y: 223.53 },
            { from: 'one-raiders-scraps', to: 'minesweeper', path: 'M0.581299 7.96924C66.3092 -20.9222 59.8087 58.5292 153.706 7.96924', x: 1203.66, y: 341.06 },
            { from: 'agile-croucher', to: 'revitalizing-squat', path: 'M0.50293 34.2624C128.503 -40.2377 84.0029 37.2623 142.003 12.7624', x: 808.5, y: 573.24 },
            { from: 'revitalizing-squat', to: 'in-round-crafting', path: 'M0.47876 27.8779L49.9788 0.877896', x: 949.5, y: 556 },
            { from: 'in-round-crafting', to: 'good-as-new', path: 'M0.508057 41.8613L70.0081 0.861298', x: 1000.5, y: 513.5 },
            { from: 'good-as-new', to: 'traveling-tinkerer', path: 'M0.641357 134.731C64.6414 81.2307 14.1414 57.7307 75.1414 0.730652', x: 1076.5, y: 375.5 },
            { from: 'good-as-new', to: 'stubborn-mule', path: 'M0.500244 67.8659L116.5 0.865936', x: 1075.5, y: 444 },
            { from: 'stubborn-mule', to: 'three-deep-breaths', path: 'M0.489502 28.3721L49.4895 0.872055', x: 1190.5, y: 416.5 },
            { from: 'three-deep-breaths', to: 'minesweeper', path: 'M0.491943 63.8706L111.992 0.870636', x: 1241.5, y: 351 }
        ]
    }
};

const TREE_WIDTH = 1392;
const TREE_HEIGHT = 613;
const NODE_OFFSET_X = 30;
const NODE_OFFSET_Y = 30;

// === STATE MANAGEMENT ===
let state = {
    skills: {},
    pointsSpent: { Conditioning: 0, Mobility: 0, Survival: 0 },
    maxTotalPoints: 76
};

// Viewport State
let viewState = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    isPinching: false,
    startDist: 0,
    startScale: 1,
    vx: 0,
    vy: 0,
    friction: 0.95,
    lastTime: 0,
    dragDistance: 0
};

// DOM Elements
const treeContainer = document.getElementById('treeContainer');
const edgesLayer = document.getElementById('edgesLayer');
const nodesLayer = document.getElementById('nodesLayer');
const labelsLayer = document.getElementById('labelsLayer');
const tooltip = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipDesc = document.getElementById('tooltipDesc');

// === INITIALIZATION ===
function init() {
    initializeState();
    initializeDOM();
    setupInteractions();
    loadBuildFromURL();
    updateVisuals();
    centerTree();
}

function initializeState() {
    state.skills = {};
    state.pointsSpent = { Conditioning: 0, Mobility: 0, Survival: 0 };

    for (const [category, data] of Object.entries(SKILL_DATA)) {
        for (const skill of data.skills) {
            state.skills[skill.id] = {
                ...skill,
                currentLevel: 0,
                category: category
            };
        }
    }
}

function initializeDOM() {
    // 1. Draw Root Lines
    drawRootLines();
    // 2. Create Nodes & Edges
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        const color = getCategoryColor(category);

        // Edges
        data.edges.forEach(edge => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", edge.path);
            path.setAttribute("transform", `translate(${edge.x}, ${edge.y})`);
            path.setAttribute("class", "edge inactive");
            path.setAttribute("id", `edge-${edge.from}-${edge.to}`);
            path.style.setProperty("--active-color", color);
            edgesLayer.appendChild(path);
        });

        // Nodes
        data.skills.forEach(skill => {
            const node = document.createElement('div');
            node.className = 'skill-node';
            node.id = `node-${skill.id}`;
            node.setAttribute("data-id", skill.id);
            node.style.left = `${skill.x + NODE_OFFSET_X}px`;
            node.style.top = `${skill.y + NODE_OFFSET_Y}px`;

            // Size
            const isLarge = skill.level === 0 || (skill.maxPoints === 1 && skill.requiredPoints !== null);
            node.classList.add(isLarge ? 'large' : 'small');
            node.style.color = color; // For inheritance

            // Icon - use background-image (works without server)
            const icon = document.createElement('div');
            icon.className = 'skill-icon';
            icon.style.backgroundImage = `url('assets/skill-icons/${skill.id}.png')`;
            node.appendChild(icon);

            // Badge
            const badge = document.createElement('div');
            badge.className = 'node-badge';
            badge.style.borderColor = color;
            badge.id = `badge-${skill.id}`;
            node.appendChild(badge);

            // Lock Icon Container (Added dyanmically later if needed, but easier to just have it and toggle visibility)
            const lock = document.createElement('div');
            lock.className = 'lock-icon';
            lock.id = `lock-${skill.id}`;
            lock.style.display = 'none';
            node.appendChild(lock);

            // Interactivity
            node.addEventListener('click', (e) => handleNodeClick(e, skill));
            node.addEventListener('contextmenu', (e) => handleNodeRightClick(e, skill));

            // Tooltips
            node.addEventListener('mouseenter', () => showTooltip(skill, node));
            node.addEventListener('mouseleave', hideTooltip);

            nodesLayer.appendChild(node);
        });
    }

    // 3. Branch Labels (moved down 20px)
    createBranchLabel('CONDITIONING', 454, 643, COLORS.conditioning, state.pointsSpent.Conditioning, 'Conditioning');
    createBranchLabel('MOBILITY', 681, 406, COLORS.mobility, state.pointsSpent.Mobility, 'Mobility');
    createBranchLabel('SURVIVAL', 908, 663, COLORS.survival, state.pointsSpent.Survival, 'Survival');
}

function drawRootLines() {
    // Conditioning (Green) - Smooth curve toward center vertical path
    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute("d", "M580 575 C 660 575, 660 630, 660 685 L660 2000");
    p1.setAttribute("class", "root-line");
    p1.style.stroke = COLORS.conditioning;
    edgesLayer.appendChild(p1);

    // Mobility (Yellow) - straight down
    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute("d", "M676 529 L676 2000");
    p2.setAttribute("class", "root-line");
    p2.style.stroke = COLORS.mobility;
    edgesLayer.appendChild(p2);
    // Survival (Red) - Smooth curve toward center vertical path
    const p3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p3.setAttribute("d", "M804 600 C 695 600, 695 650, 695 715 L695 2000");
    p3.setAttribute("class", "root-line");
    p3.style.stroke = COLORS.survival;
    edgesLayer.appendChild(p3);
}

function createBranchLabel(nameText, x, y, color, count, category) {
    const group = document.createElement('div');
    group.className = 'branch-label-group';
    group.style.left = `${x}px`;
    group.style.top = `${y}px`;
    group.style.color = color;

    const name = document.createElement('div');
    name.className = 'label-name';
    name.textContent = nameText;
    group.appendChild(name);

    const counter = document.createElement('div');
    counter.className = 'label-count';
    counter.id = `label-count-${category}`;
    counter.textContent = count;
    group.appendChild(counter);

    labelsLayer.appendChild(group);
}

// === LOGIC ===
function getCategoryColor(category) {
    return COLORS[category.toLowerCase()] || COLORS.disabled;
}

function getNodeState(skill) {
    const s = state.skills[skill.id];
    if (s.currentLevel >= s.maxPoints) return 'maxed';
    if (s.currentLevel > 0) return 'active';
    if (canUpgrade(skill)) return 'unlocked';
    return 'locked';
}

function getPointsBeforeLevel(category, level) {
    let points = 0;
    for (const skill of Object.values(state.skills)) {
        if (skill.category === category && skill.level < level) {
            points += skill.currentLevel;
        }
    }
    return points;
}

function canUpgrade(skill) {
    const s = state.skills[skill.id];
    if (s.currentLevel >= s.maxPoints) return false;

    const totalSpent = state.pointsSpent.Conditioning + state.pointsSpent.Mobility + state.pointsSpent.Survival;
    if (totalSpent >= state.maxTotalPoints) return false;

    if (s.requiredPoints !== null) {
        const categoryPoints = getPointsBeforeLevel(s.category, s.level);
        if (categoryPoints < s.requiredPoints) return false;
    }

    if (!s.requiredSkill) return true;

    const requiredSkills = Array.isArray(s.requiredSkill) ? s.requiredSkill : [s.requiredSkill];
    return requiredSkills.some(reqId => {
        const req = state.skills[reqId];
        return req && req.currentLevel > 0;
    });
}

function canDowngrade(skill, ignoreId = null) {
    const s = state.skills[skill.id];
    if (s.currentLevel === 0) return false;

    // Check dependencies
    for (const other of Object.values(state.skills)) {
        if (other.currentLevel === 0) continue;
        if (!other.requiredSkill) continue;
        const reqs = Array.isArray(other.requiredSkill) ? other.requiredSkill : [other.requiredSkill];

        if (reqs.includes(skill.id)) {
            // If there's another path to this skill, it's fine
            const otherPaths = reqs.filter(r => r !== skill.id && state.skills[r].currentLevel > 0);
            if (otherPaths.length === 0 && s.currentLevel <= 1) return false;
        }
    }

    // Check points threshold
    if (s.currentLevel === 1) {
        for (const other of Object.values(state.skills)) {
            if (other.category !== s.category) continue;
            if (other.currentLevel === 0) continue;
            if (other.requiredPoints === null) continue;
            if (other.level <= s.level) continue;

            const wouldHave = getPointsBeforeLevel(s.category, other.level) - 1;
            if (wouldHave < other.requiredPoints) return false;
        }
    }
    return true;
}

function handleNodeClick(e, skill) {
    if (viewState.dragDistance > 10) return; // Ignore if user was panning
    e.preventDefault();

    // On mobile, show the mobile tooltip instead of directly adding points
    if (isMobile) {
        showMobileTooltip(skill);
        return;
    }

    if (canUpgrade(skill)) {
        const s = state.skills[skill.id];
        s.currentLevel++;
        state.pointsSpent[s.category]++;
        updateVisuals();
        updateURL();
        showTooltip(skill, document.getElementById(`node-${skill.id}`)); // Update tooltip
    }
}

function handleNodeRightClick(e, skill) {
    if (viewState.dragDistance > 10) return; // Ignore if user was panning
    e.preventDefault();

    // On mobile, right-click doesn't happen, but we handle it anyway
    if (isMobile) {
        showMobileTooltip(skill);
        return;
    }

    if (canDowngrade(skill)) {
        const s = state.skills[skill.id];
        s.currentLevel--;
        state.pointsSpent[s.category]--;
        updateVisuals();
        updateURL();
        showTooltip(skill, document.getElementById(`node-${skill.id}`));
    }
}


// === VISUAL UPDATES ===
function updateVisuals() {
    // 1. Update Nodes
    for (const skill of Object.values(state.skills)) {
        const node = document.getElementById(`node-${skill.id}`);
        const badge = document.getElementById(`badge-${skill.id}`);
        const lock = document.getElementById(`lock-${skill.id}`);

        const nodeState = getNodeState(skill);
        const s = state.skills[skill.id];
        const branchColor = getCategoryColor(s.category);

        // Reset classes
        node.classList.remove('locked', 'unlocked', 'active', 'maxed');
        node.classList.add(nodeState);

        // Set border color based on state
        if (nodeState === 'locked') {
            node.style.borderColor = COLORS.disabled;
        } else {
            // unlocked, active, maxed all use branch color
            node.style.borderColor = branchColor;
        }

        // Update Badge
        const isMaxed = nodeState === 'maxed';
        const isLocked = nodeState === 'locked';

        if (!isLocked && !isMaxed) {
            badge.style.display = 'block';
            badge.textContent = `${s.currentLevel}/${s.maxPoints}`;
        } else {
            badge.style.display = 'none';
        }

        // Update Lock
        if (isLocked && s.requiredPoints !== null) {
            const categoryPoints = getPointsBeforeLevel(s.category, s.level);
            if (categoryPoints < s.requiredPoints) {
                lock.style.display = 'flex';
            } else {
                lock.style.display = 'none';
            }
        } else {
            lock.style.display = 'none';
        }
    }

    // 2. Update Edges
    for (const [category, data] of Object.entries(SKILL_DATA)) {
        data.edges.forEach(edge => {
            const el = document.getElementById(`edge-${edge.from}-${edge.to}`);
            const fromSkill = state.skills[edge.from];
            const toSkill = state.skills[edge.to];

            const fromHasPoints = fromSkill.currentLevel > 0;
            const toIsActiveOrMaxed = toSkill.currentLevel > 0;

            const toRequiresFrom = toSkill.requiredSkill &&
                (Array.isArray(toSkill.requiredSkill)
                    ? toSkill.requiredSkill.includes(edge.from)
                    : toSkill.requiredSkill === edge.from);

            const toSkillObj = state.skills[edge.to];
            const toIsUnlocked = toSkillObj ? canUpgrade(toSkillObj) : false;

            const isActive = fromHasPoints && (toIsActiveOrMaxed || (toRequiresFrom && toIsUnlocked));

            if (isActive) {
                el.classList.add('active');
                el.classList.remove('inactive');
                el.style.stroke = el.style.getPropertyValue('--active-color');
            } else {
                el.classList.add('inactive');
                el.classList.remove('active');
                el.style.stroke = ''; // Reverts to CSS default
            }
        });
    }

    // 3. Update Counters
    document.getElementById('pointsRemaining').textContent = state.maxTotalPoints - (state.pointsSpent.Conditioning + state.pointsSpent.Mobility + state.pointsSpent.Survival);
    document.getElementById('label-count-Conditioning').textContent = state.pointsSpent.Conditioning;
    document.getElementById('label-count-Mobility').textContent = state.pointsSpent.Mobility;
    document.getElementById('label-count-Survival').textContent = state.pointsSpent.Survival;
}


// === PAN & ZOOM ===
const viewport = document.getElementById('treeViewport');

function setTransform() {
    // On mobile: use 2D translate to avoid GPU layer issues that cause disappearing
    // On desktop: use translate3d for smoother performance
    if (isMobile) {
        treeContainer.style.transform = `translate(${viewState.offsetX.toFixed(1)}px, ${viewState.offsetY.toFixed(1)}px) scale(${viewState.scale.toFixed(3)})`;
    } else {
        treeContainer.style.transform = `translate3d(${viewState.offsetX.toFixed(2)}px, ${viewState.offsetY.toFixed(2)}px, 0) scale(${viewState.scale.toFixed(4)})`;
    }
}

// Force browser to repaint the tree container - fixes mobile rendering issues
function forceRepaint() {
    // Method 1: Toggle a property that forces reflow
    treeContainer.style.opacity = '0.999';

    // Use requestAnimationFrame to ensure the change is rendered
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            treeContainer.style.opacity = '1';
        });
    });
}

function centerTree() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Calculate scale to fit tree in viewport with some padding
    const scaleX = (w - 50) / TREE_WIDTH;
    const scaleY = (h - 100) / TREE_HEIGHT;
    viewState.scale = Math.min(scaleX, scaleY, 1.0); // Don't scale above 1
    if (isMobile) viewState.scale = Math.min(viewState.scale, 0.6);

    // Ensure minimum scale
    viewState.scale = Math.max(viewState.scale, 0.3);

    // Center the tree - account for transform-origin being at 0,0
    // After scaling, the tree takes up TREE_WIDTH * scale and TREE_HEIGHT * scale
    viewState.offsetX = (w - TREE_WIDTH * viewState.scale) / 2;
    viewState.offsetY = (h - TREE_HEIGHT * viewState.scale) / 2;

    setTransform();
}

function setupInteractions() {
    // Desktop Pan
    viewport.addEventListener('pointerdown', (e) => {
        viewState.isDragging = true;
        viewState.lastX = e.clientX;
        viewState.lastY = e.clientY;
        viewState.lastTime = performance.now();
        viewState.vx = 0;
        viewState.vy = 0;
        viewState.dragDistance = 0; // Reset distance
        viewport.style.cursor = 'grabbing';
        cancelAnimationFrame(viewState.inertiaFrame);
    });

    window.addEventListener('pointermove', (e) => {
        if (!viewState.isDragging) return;
        e.preventDefault();
        const now = performance.now();
        const dt = now - viewState.lastTime;
        if (dt === 0) return;

        const dx = e.clientX - viewState.lastX;
        const dy = e.clientY - viewState.lastY;

        viewState.offsetX += dx;
        viewState.offsetY += dy;
        viewState.dragDistance += Math.hypot(dx, dy); // Track movement

        // Calculate velocity (pixels per millisecond)
        viewState.vx = dx / dt;
        viewState.vy = dy / dt;

        viewState.lastX = e.clientX;
        viewState.lastY = e.clientY;
        viewState.lastTime = now;

        setTransform();
    });

    window.addEventListener('pointerup', () => {
        if (!viewState.isDragging) return;
        viewState.isDragging = false;
        viewport.style.cursor = 'grab';
        startInertia();
    });

    function startInertia() {
        const step = (now) => {
            if (viewState.isDragging || viewState.isPinching) return;

            // Apply displacement
            viewState.offsetX += viewState.vx * 16; // Approx 16ms per frame
            viewState.offsetY += viewState.vy * 16;

            // Apply friction
            viewState.vx *= viewState.friction;
            viewState.vy *= viewState.friction;

            setTransform();

            // Continue if velocity is high enough
            if (Math.abs(viewState.vx) > 0.01 || Math.abs(viewState.vy) > 0.01) {
                viewState.inertiaFrame = requestAnimationFrame(step);
            }
        };
        viewState.inertiaFrame = requestAnimationFrame(step);
    }

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        cancelAnimationFrame(viewState.inertiaFrame);
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

        const maxScale = isMobile ? 1.6 : 2.5;
        const newScale = Math.min(Math.max(0.3, viewState.scale * zoomFactor), maxScale);

        // Get mouse position relative to viewport
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the point on the tree that's under the mouse
        const treeX = (mouseX - viewState.offsetX) / viewState.scale;
        const treeY = (mouseY - viewState.offsetY) / viewState.scale;

        // Update scale
        viewState.scale = newScale;

        // Adjust offset so the same tree point stays under the mouse
        viewState.offsetX = mouseX - treeX * viewState.scale;
        viewState.offsetY = mouseY - treeY * viewState.scale;

        setTransform();
    }, { passive: false });

    // Windows resizing
    window.addEventListener('resize', () => {
        // Optional: re-center or adjust constraints
    });

    // Mobile Pinch Zoom - zoom towards center of pinch
    let pinchCenterX = 0, pinchCenterY = 0;

    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            viewState.isPinching = true;
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            viewState.startDist = Math.max(dist, 10); // Prevent divide by zero
            viewState.startScale = viewState.scale;

            // Store the center point of the pinch
            const rect = viewport.getBoundingClientRect();
            pinchCenterX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
            pinchCenterY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;

            // Store initial offset
            viewState.startOffsetX = viewState.offsetX;
            viewState.startOffsetY = viewState.offsetY;
        }
    });

    viewport.addEventListener('touchmove', (e) => {
        if (viewState.isPinching && e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const zoomFactor = dist / viewState.startDist;
            const maxScale = isMobile ? 1.6 : 2.5;
            const newScale = Math.min(Math.max(0.3, viewState.startScale * zoomFactor), maxScale);

            // Calculate the point on the tree that was at pinch center
            const treeX = (pinchCenterX - viewState.startOffsetX) / viewState.startScale;
            const treeY = (pinchCenterY - viewState.startOffsetY) / viewState.startScale;

            // Update scale and offset to keep that point at pinch center
            viewState.scale = newScale;
            viewState.offsetX = pinchCenterX - treeX * viewState.scale;
            viewState.offsetY = pinchCenterY - treeY * viewState.scale;

            setTransform();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
        // If we were pinching, force a repaint to fix mobile GPU rendering issues
        const wasPinching = viewState.isPinching;
        viewState.isPinching = false;

        if (wasPinching) {
            // Small delay to let browser finish its internal updates
            setTimeout(() => {
                forceRepaint();
            }, 50);
        }
    });

    // Also handle touchcancel - triggered when touch is interrupted by OS
    viewport.addEventListener('touchcancel', () => {
        if (viewState.isPinching) {
            viewState.isPinching = false;
            setTimeout(forceRepaint, 50);
        }
    });
}

// === TOOLTIP ===
// Mobile tooltip DOM elements
const mobileTooltip = document.getElementById('mobileTooltip');
const mobileTooltipOverlay = document.getElementById('mobileTooltipOverlay');
const mobileTooltipName = document.getElementById('mobileTooltipName');
const mobileTooltipDesc = document.getElementById('mobileTooltipDesc');
const mobileTooltipLevel = document.getElementById('mobileTooltipLevel');
const mobileTooltipClose = document.getElementById('mobileTooltipClose');
const mobileTooltipMinus = document.getElementById('mobileTooltipMinus');
const mobileTooltipPlus = document.getElementById('mobileTooltipPlus');

let currentMobileSkill = null;

function showTooltip(skill, element) {
    // On mobile, don't show hover tooltip (handled by tap -> showMobileTooltip)
    if (isMobile) return;

    const s = state.skills[skill.id];
    tooltipName.textContent = skill.name;

    let description = skill.description;
    const nodeState = getNodeState(skill);

    if (nodeState === 'locked' && s.requiredPoints !== null) {
        const categoryPoints = getPointsBeforeLevel(s.category, s.level);
        if (categoryPoints < s.requiredPoints) {
            description += `\n\nRequires ${s.requiredPoints} points in ${s.category} (${categoryPoints}/${s.requiredPoints})`;
        }
    }

    tooltipDesc.textContent = description;

    // Position
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top}px`;
    tooltip.style.transform = 'translate(-50%, -100%) translateY(-10px)';
    tooltip.classList.add('visible');
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

// === MOBILE TOOLTIP ===
function showMobileTooltip(skill) {
    currentMobileSkill = skill;
    const s = state.skills[skill.id];

    mobileTooltipName.textContent = skill.name;
    mobileTooltipDesc.textContent = skill.description;
    updateMobileTooltipLevel();

    mobileTooltipOverlay.classList.add('visible');
    mobileTooltip.classList.add('visible');
}

function hideMobileTooltip() {
    mobileTooltipOverlay.classList.remove('visible');
    mobileTooltip.classList.remove('visible');
    currentMobileSkill = null;
}

function updateMobileTooltipLevel() {
    if (!currentMobileSkill) return;
    const s = state.skills[currentMobileSkill.id];
    mobileTooltipLevel.textContent = `${s.currentLevel}/${s.maxPoints}`;

    // Update button states
    mobileTooltipMinus.disabled = !canDowngrade(currentMobileSkill);
    mobileTooltipPlus.disabled = !canUpgrade(currentMobileSkill);
}

// Mobile tooltip event listeners
mobileTooltipClose.addEventListener('click', hideMobileTooltip);
mobileTooltipOverlay.addEventListener('click', hideMobileTooltip);

mobileTooltipMinus.addEventListener('click', () => {
    if (!currentMobileSkill) return;
    if (canDowngrade(currentMobileSkill)) {
        const s = state.skills[currentMobileSkill.id];
        s.currentLevel--;
        state.pointsSpent[s.category]--;
        updateVisuals();
        updateURL();
        updateMobileTooltipLevel();
    }
});

mobileTooltipPlus.addEventListener('click', () => {
    if (!currentMobileSkill) return;
    if (canUpgrade(currentMobileSkill)) {
        const s = state.skills[currentMobileSkill.id];
        s.currentLevel++;
        state.pointsSpent[s.category]++;
        updateVisuals();
        updateURL();
        updateMobileTooltipLevel();
    }
});

// === URL SHARING (Ported) ===
const SKILL_IDS = [];
for (const [category, data] of Object.entries(SKILL_DATA)) {
    for (const skill of data.skills) {
        SKILL_IDS.push(skill.id);
    }
}
SKILL_IDS.sort();

function getSkillLetter(skillId) {
    const index = SKILL_IDS.indexOf(skillId);
    if (index < 26) return String.fromCharCode(97 + index);
    const first = String.fromCharCode(97 + Math.floor((index - 26) / 26));
    const second = String.fromCharCode(97 + (index - 26) % 26);
    return first + second;
}

function getSkillFromLetter(letter) {
    let index;
    if (letter.length === 1) index = letter.charCodeAt(0) - 97;
    else index = 26 + (letter.charCodeAt(0) - 97) * 26 + (letter.charCodeAt(1) - 97);
    return SKILL_IDS[index] || null;
}

function encodeSkillState() {
    const parts = [];
    const skillsWithPoints = Object.values(state.skills)
        .filter(s => s.currentLevel > 0)
        .sort((a, b) => getSkillLetter(a.id).localeCompare(getSkillLetter(b.id)));

    for (const skill of skillsWithPoints) {
        parts.push(getSkillLetter(skill.id) + skill.currentLevel);
    }

    let buildStr = parts.join('');
    if (state.maxTotalPoints !== 76) buildStr += '_m' + state.maxTotalPoints;
    return buildStr;
}

function decodeSkillState(buildStr) {
    if (!buildStr || buildStr.trim() === '') return false;
    const maxMatch = buildStr.match(/_m(\d+)$/);
    if (maxMatch) {
        state.maxTotalPoints = parseInt(maxMatch[1], 10);
        buildStr = buildStr.replace(/_m\d+$/, '');
    }
    document.getElementById('maxPointsInput').value = state.maxTotalPoints;
    document.getElementById('maxPoints').textContent = state.maxTotalPoints;

    const regex = /([a-z]{1,2})(\d+)/g;
    let match;
    while ((match = regex.exec(buildStr)) !== null) {
        const letter = match[1];
        const level = parseInt(match[2], 10);
        const skillId = getSkillFromLetter(letter);
        if (skillId && state.skills[skillId]) {
            const skill = state.skills[skillId];
            skill.currentLevel = Math.min(level, skill.maxPoints);
            state.pointsSpent[skill.category] += skill.currentLevel;
        }
    }
    return true;
}

function updateURL() {
    const buildStr = encodeSkillState();
    const newURL = buildStr ? window.location.pathname + '?build=' + buildStr : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

function loadBuildFromURL() {
    const params = new URLSearchParams(window.location.search);
    const build = params.get('build');
    if (build) decodeSkillState(build);
}

// === UI CONTROLS ===
document.getElementById('resetBtn').addEventListener('click', () => {
    Object.values(state.skills).forEach(s => s.currentLevel = 0);
    state.pointsSpent = { Conditioning: 0, Mobility: 0, Survival: 0 };
    updateVisuals();
    updateURL();
});

document.getElementById('shareBtn').addEventListener('click', async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        const btn = document.getElementById('shareBtn');
        btn.textContent = 'COPIED!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'SHARE';
            btn.classList.remove('copied');
        }, 2000);
    } catch (e) { alert("Copy this URL: " + url); }
});

// Points Popup Logic
const popup = document.getElementById('pointsPopup');
document.getElementById('pointsCounter').addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.toggle('visible');
});
popup.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => popup.classList.remove('visible'));

document.getElementById('increaseMaxBtn').addEventListener('click', () => {
    state.maxTotalPoints++;
    document.getElementById('maxPointsInput').value = state.maxTotalPoints;
    document.getElementById('maxPoints').textContent = state.maxTotalPoints;
    updateVisuals();
    updateURL();
});
document.getElementById('decreaseMaxBtn').addEventListener('click', () => {
    if (state.maxTotalPoints > 1) {
        state.maxTotalPoints--;
        document.getElementById('maxPointsInput').value = state.maxTotalPoints;
        document.getElementById('maxPoints').textContent = state.maxTotalPoints;
        updateVisuals();
        updateURL();
    }
});
document.getElementById('maxPointsInput').addEventListener('change', (e) => {
    state.maxTotalPoints = parseInt(e.target.value) || 76;
    document.getElementById('maxPoints').textContent = state.maxTotalPoints;
    updateVisuals();
    updateURL();
});


// Start
init();
