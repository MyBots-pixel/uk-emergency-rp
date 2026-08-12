import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   UK RESPONSE RP
   Browser prototype
   ========================================================= */


/* ============================= */
/* OWNER */
/* ============================= */

const OWNER_USERNAME = "OWNER";


/* ============================= */
/* SHORTCUT */
/* ============================= */

const $ = id =>
    document.getElementById(id);


/* ============================= */
/* PLAYER DATA */
/* ============================= */

const state = {

    username: "Player",

    job: "Civilian",

    xp: 0,

    money: 500,

    level: 1,

    wanted: 0,

    xpMultiplier: 1,

    moneyMultiplier: 1,

    event: null,

    radioStatus: "AVAILABLE",

    siren: false,

    inVehicle: false,

    currentVehicle: null,

    currentVehicleData: null

};


/* ============================= */
/* CONTROLS */
/* ============================= */

const keys = {};

let yaw = 0;

let pitch = 0.24;

let rightMouse = false;


/* ============================= */
/* THREE.JS */
/* ============================= */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x82c8ec
    );


scene.fog =
    new THREE.Fog(
        0x82c8ec,
        100,
        360
    );


const camera =
    new THREE.PerspectiveCamera(
        68,
        innerWidth / innerHeight,
        .1,
        900
    );


const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setSize(
    innerWidth,
    innerHeight
);


renderer.setPixelRatio(
    Math.min(
        devicePixelRatio,
        2
    )
);


renderer.shadowMap.enabled = true;


$("game").appendChild(
    renderer.domElement
);


/* ============================= */
/* LIGHTING */
/* ============================= */

scene.add(
    new THREE.HemisphereLight(
        0xbfe8ff,
        0x4a5b38,
        1.3
    )
);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );


sun.position.set(
    80,
    130,
    50
);


sun.castShadow = true;

scene.add(sun);


/* ============================= */
/* MATERIAL */
/* ============================= */

function material(
    colour
) {

    return new THREE.MeshStandardMaterial({
        color: colour,
        roughness: .8
    });

}


/* ============================= */
/* OBJECT CREATOR */
/* ============================= */

function createBox(
    width,
    height,
    depth,
    colour,
    x,
    y,
    z
) {

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            material(colour)
        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow = true;

    mesh.receiveShadow = true;


    scene.add(mesh);


    return mesh;

}


/* ============================= */
/* CITY GROUND */
/* ============================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            700,
            700
        ),
        material(0x3d7d3e)
    );


ground.rotation.x =
    -Math.PI / 2;


ground.receiveShadow = true;


scene.add(ground);


/* ============================= */
/* ROADS */
/* ============================= */

createBox(
    26,
    .1,
    700,
    0x303030,
    0,
    .05,
    0
);


createBox(
    700,
    .1,
    26,
    0x303030,
    0,
    .05,
    0
);


/* ============================= */
/* ROAD MARKINGS */
/* ============================= */

for (
    let z = -340;
    z < 340;
    z += 10
) {

    createBox(
        .18,
        .03,
        5,
        0xffffff,
        0,
        .12,
        z
    );

}


for (
    let x = -340;
    x < 340;
    x += 10
) {

    createBox(
        5,
        .03,
        .18,
        0xffffff,
        x,
        .12,
        0
    );

}


/* ============================= */
/* BUILDINGS */
/* ============================= */

function createBuilding(
    x,
    z,
    width,
    depth,
    height,
    colour
) {

    createBox(
        width,
        height,
        depth,
        colour,
        x,
        height / 2,
        z
    );


    const glass =
        material(0x5ca6c7);


    /* FRONT WINDOWS */

    for (
        let xx =
            x - width / 2 + 1.1;

        xx <
            x + width / 2 - .5;

        xx += 2.1
    ) {

        for (
            let yy = 1.5;

            yy < height - .5;

            yy += 2
        ) {

            const window =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .85,
                        .8,
                        .07
                    ),
                    glass
                );


            window.position.set(
                xx,
                yy,
                z + depth / 2 + .04
            );


            scene.add(window);

        }

    }


    /* BACK WINDOWS */

    for (
        let xx =
            x - width / 2 + 1.1;

        xx <
            x + width / 2 - .5;

        xx += 2.1
    ) {

        for (
            let yy = 1.5;

            yy < height - .5;

            yy += 2
        ) {

            const window =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        .85,
                        .8,
                        .07
                    ),
                    glass
                );


            window.position.set(
                xx,
                yy,
                z - depth / 2 - .04
            );


            scene.add(window);

        }

    }

}


/* CITY */

createBuilding(
    -30,
    -25,
    18,
    15,
    11,
    0x777777
);


createBuilding(
    30,
    -28,
    21,
    16,
    13,
    0x806a55
);


createBuilding(
    -31,
    28,
    17,
    14,
    9,
    0x6b7278
);


createBuilding(
    29,
    25,
    20,
    15,
    12,
    0x6e625d
);


createBuilding(
    -58,
    0,
    17,
    20,
    10,
    0x737373
);


createBuilding(
    58,
    0,
    17,
    20,
    12,
    0x796e60
);


/* ============================= */
/* PLAYER CHARACTER */
/* ============================= */

function createCharacter() {

    const group =
        new THREE.Group();


    const skin =
        material(0xf0bd91);

    const shirt =
        material(0x2456a8);

    const trousers =
        material(0x22252b);


    const parts = [

        [
            new THREE.BoxGeometry(
                .35,
                1,
                .35
            ),
            trousers,
            -.22,
            .5
        ],

        [
            new THREE.BoxGeometry(
                .35,
                1,
                .35
            ),
            trousers,
            .22,
            .5
        ],

        [
            new THREE.BoxGeometry(
                .9,
                1.15,
                .5
            ),
            shirt,
            0,
            1.45
        ],

        [
            new THREE.SphereGeometry(
                .38,
                20,
                20
            ),
            skin,
            0,
            2.3
        ],

        [
            new THREE.BoxGeometry(
                .3,
                1,
                .3
            ),
            shirt,
            -.62,
            1.45
        ],

        [
            new THREE.BoxGeometry(
                .3,
                1,
                .3
            ),
            shirt,
            .62,
            1.45
        ]

    ];


    for (
        const part of parts
    ) {

        const mesh =
            new THREE.Mesh(
                part[0],
                part[1]
            );


        mesh.position.set(
            part[2],
            part[3],
            0
        );


        mesh.castShadow = true;


        group.add(mesh);

    }


    return group;

}


const player =
    createCharacter();


player.position.set(
    0,
    0,
    12
);


scene.add(player);


/* ============================= */
/* JOB ICONS */
/* ============================= */

function jobIcon(job) {

    const icons = {

        "Police": "🚔",

        "Fire & Rescue": "🚒",

        "Ambulance": "🚑",

        "HEMS": "🚁",

        "Civilian": "👤"

    };


    return icons[job] || "👤";

}


/* ============================= */
/* VEHICLES */
/* ============================= */

const vehicleDefinitions = [

    {
        name: "UK Hatchback",
        type: "Civilian",
        price: 0,
        colour: 0xe8e8e8,
        emergency: false
    },

    {
        name: "UK Saloon",
        type: "Civilian",
        price: 2500,
        colour: 0x20242a,
        emergency: false
    },

    {
        name: "UK SUV",
        type: "Civilian",
        price: 5000,
        colour: 0x565b62,
        emergency: false
    },

    {
        name: "Police Response",
        type: "Police",
        price: 0,
        colour: 0x10151b,
        emergency: true
    },

    {
        name: "Fire Appliance",
        type: "Fire & Rescue",
        price: 0,
        colour: 0xc51f28,
        emergency: true
    },

    {
        name: "Ambulance",
        type: "Ambulance",
        price: 0,
        colour: 0xf2f2f2,
        emergency: true
    },

    {
        name: "HEMS Response",
        type: "HEMS",
        price: 0,
        colour: 0xf2d200,
        emergency: true
    },

    {
        name: "ADMIN Response",
        type: "ADMIN",
        price: 0,
        colour: 0x4f2a88,
        emergency: true,
        admin: true
    }

];


/* ============================= */
/* VEHICLE CREATION */
/* ============================= */

function createVehicle(
    definition
) {

    const group =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.2,
                .7,
                4.2
            ),
            material(
                definition.colour
            )
        );


    body.position.y =
        .9;


    group.add(body);


    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.7,
                .7,
                2
            ),
            material(
                definition.colour
            )
        );


    cabin.position.y =
        1.5;


    group.add(cabin);


    /* WINDOWS */

    const glass =
        material(0x5a99b4);


    for (
        const z of [-1.04, 1.04]
    ) {

        const window =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.4,
                    .45,
                    .08
                ),
                glass
            );


        window.position.set(
            0,
            1.56,
            z
        );


        group.add(window);

    }


    /* WHEELS */

    for (
        const position of [

            [-1.12, 1.3],

            [1.12, 1.3],

            [-1.12, -1.3],

            [1.12, -1.3]

        ]
    ) {

        const wheel =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    .42,
                    .42,
                    .3,
                    18
                ),
                material(0x101010)
            );


        wheel.rotation.z =
            Math.PI / 2;


        wheel.position.set(
            position[0],
            .55,
            position[1]
        );


        group.add(wheel);

    }


    /* EMERGENCY LIGHTBAR */

    if (
        definition.emergency
    ) {

        const bar =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.3,
                    .16,
                    .35
                ),
                material(0x1c5cff)
            );


        bar.position.y =
            2;


        group.add(bar);

    }


    group.userData = {

        speed: 0,

        maxSpeed:
            definition.type ===
            "Fire & Rescue"
                ? 14
                : 22

    };


    return group;

}


/* ============================= */
/* HUD */
/* ============================= */

function updateHUD() {

    $("jobName").textContent =
        `${jobIcon(state.job)} ${state.job.toUpperCase()}`;


    $("levelText").textContent =
        `LEVEL ${state.level}`;


    $("xpText").textContent =
        `${state.xp % 1000} / 1000 XP`;


    $("xpBar").style.width =
        `${(state.xp % 1000) / 10}%`;


    $("money").textContent =
        state.money.toLocaleString();


    $("wantedStars").textContent =
        state.wanted;


    $("wantedPanel")
        .classList.toggle(
            "visible",
            state.wanted > 0
        );

}


/* ============================= */
/* NOTIFICATION */
/* ============================= */

function notify(
    text
) {

    const element =
        $("notification");


    element.textContent =
        text;


    element.style.display =
        "block";


    clearTimeout(
        notify.timer
    );


    notify.timer =
        setTimeout(
            () => {

                element.style.display =
                    "none";

            },
            2500
        );

}


/* ============================= */
/* XP / MONEY */
/* ============================= */

function reward(
    xp,
    reason,
    money = 0
) {

    const finalXP =
        Math.round(
            xp *
            state.xpMultiplier
        );


    const finalMoney =
        Math.round(
            money *
            state.moneyMultiplier
        );


    const previousLevel =
        state.level;


    state.xp +=
        finalXP;


    state.money +=
        finalMoney;


    state.level =
        Math.floor(
            state.xp / 1000
        ) + 1;


    $("xpReason").innerHTML =
        `<b>+${finalXP} XP</b> · ${reason}` +
        (
            finalMoney
                ? `<br><b>+£${finalMoney}</b>`
                : ""
        );


    $("xpNotification").innerHTML =
        `+${finalXP} XP · ${reason}` +
        (
            finalMoney
                ? ` · +£${finalMoney}`
                : ""
        );


    $("xpNotification").style.display =
        "block";


    clearTimeout(
        reward.timer
    );


    reward.timer =
        setTimeout(
            () => {

                $("xpNotification").style.display =
                    "none";

            },
            2800
        );


    if (
        state.level >
        previousLevel
    ) {

        notify(
            `⭐ LEVEL UP — LEVEL ${state.level}`
        );

    }


    updateHUD();

}


/* ============================= */
/* JOB SYSTEM */
/* ============================= */

function setJob(
    job
) {

    state.job =
        job;


    state.radioStatus =
        "AVAILABLE";


    state.wanted =
        0;


    updateHUD();


    notify(
        `${jobIcon(job)} Joined ${job}`
    );


    reward(
        25,
        `Joined ${job}`
    );

}


/* ============================= */
/* VEHICLE ACCESS */
/* ============================= */

function canUseVehicle(
    definition
) {

    if (
        !definition.emergency
    ) {

        return true;

    }


    if (
        definition.admin
    ) {

        return (
            state.username ===
            OWNER_USERNAME
        );

    }


    return (
        definition.type ===
        state.job
    );

}


/* ============================= */
/* SPAWN VEHICLE */
/* ============================= */

function spawnVehicle(
    definition
) {

    if (
        !canUseVehicle(
            definition
        )
    ) {

        notify(
            `You need the ${definition.type} job.`
        );

        return;

    }


    if (
        definition.price &&
        state.money <
        definition.price
    ) {

        notify(
            "You do not have enough money."
        );

        return;

    }


    if (
        definition.price
    ) {

        state.money -=
            definition.price;

    }


    if (
        state.currentVehicle
    ) {

        scene.remove(
            state.currentVehicle
        );

    }


    state.currentVehicleData =
        definition;


    state.currentVehicle =
        createVehicle(
            definition
        );


    state.currentVehicle.position.set(

        player.position.x + 4,

        0,

        player.position.z

    );


    state.currentVehicle.rotation.y =
        player.rotation.y;


    scene.add(
        state.currentVehicle
    );


    $("modal")
        .classList.add(
            "hidden"
        );


    notify(
        `${definition.name} spawned`
    );


    updateHUD();

}


/* ============================= */
/* VEHICLE PANEL */
/* ============================= */

function openVehicles(
    admin = false
) {

    $("modalTitle").textContent =
        admin
            ? "🚗 ADMIN VEHICLE SPAWNER"
            : "🚗 VEHICLE DEALERSHIP";


    $("modalBody").innerHTML =
        "";


    for (
        const definition
        of vehicleDefinitions
    ) {

        if (
            definition.admin &&
            !admin
        ) {

            continue;

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.innerHTML =
            `
            <div class="cardTitle">
                ${definition.name}
            </div>

            <div>
                ${definition.type}
                ·
                ${
                    definition.price
                        ? "£" +
                          definition.price.toLocaleString()
                        : "FREE"
                }
            </div>
            `;


        const button =
            document.createElement(
                "button"
            );


        button.className =
            "option";


        button.textContent =
            definition.admin
                ? "SPAWN ADMIN VEHICLE"
                : "SPAWN";


        button.onclick =
            () => {

                spawnVehicle(
                    definition
                );

            };


        card.appendChild(
            button
        );


        $("modalBody")
            .appendChild(
                card
            );

    }


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* RADIO */
/* ============================= */

function radioPanel() {

    if (
        state.job ===
        "Civilian"
    ) {

        notify(
            "Join an emergency job to use the radio."
        );

        return;

    }


    $("modalTitle").textContent =
        "📻 RADIO / TRANSMIT";


    $("modalBody").innerHTML =
        `
        <div class="card">
            Radio status:
            <b>
                ${state.radioStatus}
            </b>
        </div>
        `;


    const statuses = [

        "IN PURSUIT",

        "REQUEST BACKUP",

        "EN ROUTE",

        "ON SCENE",

        "AVAILABLE",

        "NEED AMBULANCE",

        "NEED FIRE"

    ];


    statuses.forEach(
        status => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.textContent =
                status;


            button.onclick =
                () => {

                    state.radioStatus =
                        status;


                    notify(
                        `Radio: ${status}`
                    );


                    $("modal")
                        .classList.add(
                            "hidden"
                        );

                };


            $("modalBody")
                .appendChild(
                    button
                );

        }
    );


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* WANTED */
/* ============================= */

function wantedPanel() {

    $("modalTitle").textContent =
        "🚨 WANTED SYSTEM";


    $("modalBody").innerHTML =
        `
        <div class="card">
            Wanted level:
            <b>
                ${state.wanted}/5
            </b>
        </div>
        `;


    for (
        let level = 0;
        level <= 5;
        level++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "option";


        button.textContent =
            `Set Wanted Level ${level}`;


        button.onclick =
            () => {

                state.wanted =
                    level;


                updateHUD();


                $("modal")
                    .classList.add(
                        "hidden"
                    );

            };


        $("modalBody")
            .appendChild(
                button
            );

    }


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* EVENTS */
/* ============================= */

function eventsPanel() {

    $("modalTitle").textContent =
        "🌌 EVENTS";


    $("modalBody").innerHTML =
        "";


    const events = [

        [
            "Galaxy Event",
            "2× XP + 2× Money",
            2,
            2
        ],

        [
            "20% XP Boost",
            "+20% XP",
            1.2,
            1
        ],

        [
            "25% Money Boost",
            "+25% Money",
            1,
            1.25
        ]

    ];


    events.forEach(
        event => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML =
                `
                <div class="cardTitle">
                    ${event[0]}
                </div>

                <div>
                    ${event[1]}
                </div>
                `;


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.textContent =
                "START EVENT";


            button.onclick =
                () => {

                    startEvent(
                        event[0],
                        event[2],
                        event[3]
                    );

                };


            card.appendChild(
                button
            );


            $("modalBody")
                .appendChild(
                    card
                );

        }
    );


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* START EVENT */
/* ============================= */

function startEvent(
    name,
    xpMultiplier,
    moneyMultiplier
) {

    state.event = {

        name,

        seconds: 300

    };


    state.xpMultiplier =
        xpMultiplier;


    state.moneyMultiplier =
        moneyMultiplier;


    notify(
        `${name} started!`
    );


    clearInterval(
        startEvent.timer
    );


    startEvent.timer =
        setInterval(
            () => {

                if (
                    !state.event
                ) {

                    return;

                }


                state.event.seconds--;


                if (
                    state.event.seconds <=
                    0
                ) {

                    state.event =
                        null;


                    state.xpMultiplier =
                        1;


                    state.moneyMultiplier =
                        1;


                    clearInterval(
                        startEvent.timer
                    );


                    notify(
                        "Event ended."
                    );

                }

            },
            1000
        );

}


/* ============================= */
/* PLAYER LIST */
/* ============================= */

function playersPanel() {

    $("modalTitle").textContent =
        "👥 PLAYERS";


    $("modalBody").innerHTML =
        `
        <div class="card">

            <b>
                ${state.username}
            </b>

            <br>

            Job:
            ${state.job}

            <br>

            Level:
            ${state.level}

            <br>

            XP:
            ${state.xp}

        </div>

        <div class="card">

            Multiplayer player slots will
            connect here when the server
            system is added.

        </div>
        `;


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* SETTINGS */
/* ============================= */

function settingsPanel() {

    $("modalTitle").textContent =
        "⚙️ SETTINGS";


    $("modalBody").innerHTML =
        "";


    const siren =
        document.createElement(
            "button"
        );


    siren.className =
        "option";


    siren.textContent =
        "🚨 Toggle Siren";


    siren.onclick =
        toggleSiren;


    $("modalBody")
        .appendChild(
            siren
        );


    const night =
        document.createElement(
            "button"
        );


    night.className =
        "option";


    night.textContent =
        "🌙 Toggle Night Mode";


    night.onclick =
        () => {

            const dark =
                scene.background.getHex()
                === 0x82c8ec;


            scene.background =
                new THREE.Color(
                    dark
                        ? 0x08111e
                        : 0x82c8ec
                );


            scene.fog.color =
                scene.background;

        };


    $("modalBody")
        .appendChild(
            night
        );


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* JOB PANEL */
/* ============================= */

function jobsPanel() {

    $("modalTitle").textContent =
        "👔 JOBS";


    $("modalBody").innerHTML =
        "";


    const jobs = [

        "Police",

        "Fire & Rescue",

        "Ambulance",

        "HEMS",

        "Civilian"

    ];


    jobs.forEach(
        job => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.textContent =
                `${jobIcon(job)} ${job}`;


            button.onclick =
                () => {

                    setJob(job);


                    $("modal")
                        .classList.add(
                            "hidden"
                        );

                };


            $("modalBody")
                .appendChild(
                    button
                );

        }
    );


    $("modal")
        .classList.remove(
            "hidden"
        );

}


/* ============================= */
/* SIREN */
/* ============================= */

let sirenInterval = null;

let audioContext = null;


function toggleSiren() {

    if (
        !state.currentVehicleData ||
        !state.currentVehicleData.emergency
    ) {

        notify(
            "You need an emergency vehicle."
        );

        return;

    }


    state.siren =
        !state.siren;


    notify(
        state.siren
            ? "🚨 SIREN ON"
            : "SIREN OFF"
    );


    if (
        state.siren
    ) {

        startSiren();

    } else {

        stopSiren();

    }

}


/* ============================= */
/* SIREN AUDIO */
/* ============================= */

function startSiren() {

    if (
        sirenInterval
    ) {

        return;

    }


    audioContext ||=
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    let high = false;


    sirenInterval =
        setInterval(
            () => {

                if (
                    !state.siren
                ) {

                    stopSiren();

                    return;

                }


                const oscillator =
                    audioContext.createOscillator();


                const gain =
                    audioContext.createGain();


                oscillator.type =
                    "square";


                oscillator.frequency.value =
                    high
                        ? 880
                        : 520;


                gain.gain.value =
                    .035;


                oscillator.connect(
                    gain
                );


                gain.connect(
                    audioContext.destination
                );


                oscillator.start();


                oscillator.stop(
                    audioContext.currentTime
                    + .18
                );


                high =
                    !high;

            },
            230
        );

}


function stopSiren() {

    clearInterval(
        sirenInterval
    );


    sirenInterval =
        null;

}


/* ============================= */
/* INTERACTION */
/* ============================= */

function interact() {

    /* EXIT */

    if (
        state.inVehicle
    ) {

        state.inVehicle =
            false;


        player.visible =
            true;


        player.position.copy(
            state.currentVehicle.position
        );


        player.position.x +=
            3;


        notify(
            "Exited vehicle."
        );


        return;

    }


    /* ENTER */

    if (
        state.currentVehicle &&
        player.position.distanceTo(
            state.currentVehicle.position
        ) < 5
    ) {

        state.inVehicle =
            true;


        player.visible =
            false;


        notify(
            `Entered ${state.currentVehicleData.name}`
        );


        return;

    }


    /* JOB ACTIVITY */

    if (
        state.job ===
        "Police"
    ) {

        reward(
            150,
            "Arrest",
            500
        );


        state.wanted =
            Math.max(
                0,
                state.wanted - 1
            );

    }


    else if (
        state.job ===
        "Fire & Rescue"
    ) {

        reward(
            100,
            "Fire call",
            250
        );

    }


    else if (
        state.job ===
        "Ambulance"
    ) {

        reward(
            125,
            "Patient treated",
            300
        );

    }


    else if (
        state.job ===
        "HEMS"
    ) {

        reward(
            200,
            "HEMS response",
            500
        );

    }


    else {

        reward(
            25,
            "Civilian activity",
            50
        );

    }

}


/* ============================= */
/* CHAT */
/* ============================= */

function toggleChat() {

    $("chat")
        .classList.toggle(
            "hidden"
        );


    if (
        !$("chat")
            .classList.contains(
                "hidden"
            )
    ) {

        $("chatInput").focus();

    }

}


function escapeHTML(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}


function addChat(
    name,
    message
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "chatMsg";


    element.innerHTML =
        `
        <b>
            ${escapeHTML(name)}
        </b>

        ${escapeHTML(message)}
        `;


    $("chatMessages")
        .appendChild(
            element
        );


    $("chatMessages")
        .scrollTop =
        $("chatMessages")
            .scrollHeight;

}


/* ============================= */
/* PHONE */
/* ============================= */

function togglePhone() {

    $("phone")
        .classList.toggle(
            "hidden"
        );

}


function phoneAction(
    action
) {

    if (
        action ===
        "radio"
    )
        radioPanel();


    if (
        action ===
        "vehicles"
    )
        openVehicles();


    if (
        action ===
        "events"
    )
        eventsPanel();


    if (
        action ===
        "wanted"
    )
        wantedPanel();


    if (
        action ===
        "players"
    )
        playersPanel();


    if (
        action ===
        "settings"
    )
        settingsPanel();


    if (
        action ===
        "chat"
    )
        toggleChat();


    if (
        action ===
        "jobs"
    )
        jobsPanel();

}


/* ============================= */
/* RADIAL MENU */
/* ============================= */

function openRadial() {

    $("radialOverlay")
        .classList.remove(
            "hidden"
        );

}


function closeRadial() {

    $("radialOverlay")
        .classList.add(
            "hidden"
        );

}


/* ============================= */
/* ADMIN PANEL */
/* ============================= */

function openAdmin() {

    if (
        state.username !==
        OWNER_USERNAME
    ) {

        notify(
            "❌ ADMIN ACCESS DENIED"
        );

        return;

    }


    $("adminPanel")
        .classList.remove(
            "hidden"
        );


    renderAdmin(
        "players"
    );

}


/* ============================= */
/* ADMIN TABS */
/* ============================= */

function renderAdmin(
    tab
) {

    const body =
        $("adminBody");


    body.innerHTML =
        "";


    /* PLAYERS */

    if (
        tab ===
        "players"
    ) {

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "card";


        title.innerHTML =
            `
            <b>Owner Controls</b>

            <br>

            Player:
            ${state.username}
            `;


        body.appendChild(
            title
        );


        const xpRow =
            document.createElement(
                "div"
            );


        xpRow.className =
            "adminRow";


        xpRow.innerHTML =
            `
            <input
                id="adminXP"
                type="number"
                value="500"
            >

            <button
                class="primary"
                id="giveXP"
            >
                GIVE XP
            </button>
            `;


        body.appendChild(
            xpRow
        );


        const moneyRow =
            document.createElement(
                "div"
            );


        moneyRow.className =
            "adminRow";


        moneyRow.innerHTML =
            `
            <input
                id="adminMoney"
                type="number"
                value="1000"
            >

            <button
                class="primary"
                id="giveMoney"
            >
                GIVE MONEY
            </button>
            `;


        body.appendChild(
            moneyRow
        );


        const infinite =
            document.createElement(
                "button"
            );


        infinite.className =
            "option";


        infinite.textContent =
            "💷 GIVE INFINITE MONEY";


        infinite.onclick =
            () => {

                state.money =
                    999999999;


                updateHUD();


                notify(
                    "Infinite money enabled."
                );

            };


        body.appendChild(
            infinite
        );


        const wanted =
            document.createElement(
                "button"
            );


        wanted.className =
            "option";


        wanted.textContent =
            "🚨 CLEAR WANTED";


        wanted.onclick =
            () => {

                state.wanted =
                    0;


                updateHUD();


                notify(
                    "Wanted level cleared."
                );

            };


        body.appendChild(
            wanted
        );


        $("giveXP").onclick =
            () => {

                reward(
                    Number(
                        $("adminXP").value
                    ) || 0,
                    "Admin XP grant"
                );

            };


        $("giveMoney").onclick =
            () => {

                state.money +=
                    Number(
                        $("adminMoney").value
                    ) || 0;


                updateHUD();


                notify(
                    "Money granted."
                );

            };

    }


    /* VEHICLES */

    if (
        tab ===
        "vehicles"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "primary";


        button.textContent =
            "🚗 OPEN ADMIN VEHICLE SPAWNER";


        button.onclick =
            () => {

                openVehicles(
                    true
                );

            };


        body.appendChild(
            button
        );

    }


    /* EVENTS */

    if (
        tab ===
        "events"
    ) {

        [
            [
                "🌌 Galaxy Event",
                2,
                2
            ],

            [
                "⭐ 20% XP Boost",
                1.2,
                1
            ],

            [
                "💷 25% Money Boost",
                1,
                1.25
            ]

        ].forEach(
            event => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "option";


                button.textContent =
                    `START ${event[0]}`;


                button.onclick =
                    () => {

                        startEvent(
                            event[0],
                            event[1],
                            event[2]
                        );

                    };


                body.appendChild(
                    button
                );

            }
        );

    }


    /* WORLD */

    if (
        tab ===
        "world"
    ) {

        const wanted =
            document.createElement(
                "button"
            );


        wanted.className =
            "option";


        wanted.textContent =
            "🚨 SET WANTED LEVEL 5";


        wanted.onclick =
            () => {

                state.wanted =
                    5;


                updateHUD();


                notify(
                    "Wanted level set to 5."
                );

            };


        body.appendChild(
            wanted
        );


        const xp =
            document.createElement(
                "button"
            );


        xp.className =
            "option";


        xp.textContent =
            "⭐ GIVE 500 XP";


        xp.onclick =
            () => {

                reward(
                    500,
                    "Admin grant"
                );

            };


        body.appendChild(
            xp
        );

    }

}


/* ============================= */
/* ADMIN TAB EVENTS */
/* ============================= */

document
    .querySelectorAll(
        "[data-admin-tab]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    renderAdmin(
                        button.dataset.adminTab
                    );

                };

        }
    );


/* ============================= */
/* CLOSE BUTTONS */
/* ============================= */

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    $(
                        button.dataset.close
                    )
                    .classList.add(
                        "hidden"
                    );

                };

        }
    );


$("modalClose").onclick =
    () => {

        $("modal")
            .classList.add(
                "hidden"
            );

    };


/* ============================= */
/* RADIAL BUTTONS */
/* ============================= */

document
    .querySelectorAll(
        ".radialItem"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    const action =
                        button.dataset.action;


                    closeRadial();


                    if (
                        action ===
                        "police"
                    )
                        setJob("Police");


                    if (
                        action ===
                        "fire"
                    )
                        setJob("Fire & Rescue");


                    if (
                        action ===
                        "ambulance"
                    )
                        setJob("Ambulance");


                    if (
                        action ===
                        "hems"
                    )
                        setJob("HEMS");


                    if (
                        action ===
                        "civilian"
                    )
                        setJob("Civilian");


                    if (
                        action ===
                        "vehicles"
                    )
                        openVehicles();


                    if (
                        action ===
                        "phone"
                    )
                        togglePhone();


                    if (
                        action ===
                        "settings"
                    )
                        settingsPanel();

                };

        }
    );


/* ============================= */
/* PHONE BUTTONS */
/* ============================= */

document
    .querySelectorAll(
        "[data-phone]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    phoneAction(
                        button.dataset.phone
                    );

                };

        }
    );


/* ============================= */
/* CHAT SEND */
/* ============================= */

$("chatSend").onclick =
    () => {

        const text =
            $("chatInput")
                .value
                .trim();


        if (
            !text
        )
            return;


        addChat(
            state.username,
            text
        );


        $("chatInput")
            .value = "";

    };


$("chatInput")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                $("chatSend")
                    .click();

            }

        }
    );


/* ============================= */
/* KEYBOARD */
/* ============================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        /* TAB */

        if (
            key ===
            "tab"
        ) {

            event.preventDefault();


            openRadial();


            return;

        }


        /* PHONE */

        if (
            key ===
            "p"
        ) {

            togglePhone();


            return;

        }


        /* RADIO */

        if (
            key ===
            "t"
        ) {

            radioPanel();


            return;

        }


        /* INTERACT */

        if (
            key ===
            "e"
        ) {

            interact();


            return;

        }


        /* CHAT */

        if (
            key ===
            "enter"
        ) {

            toggleChat();


            return;

        }


        /* ADMIN */

        if (
            key ===
            "f2"
        ) {

            openAdmin();


            return;

        }


        /* ESC */

        if (
            key ===
            "escape"
        ) {

            closeRadial();


            $("phone")
                .classList.add(
                    "hidden"
                );


            $("modal")
                .classList.add(
                    "hidden"
                );


            $("adminPanel")
                .classList.add(
                    "hidden"
                );

        }


        keys[key] = true;

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* ============================= */
/* RIGHT MOUSE CAMERA */
/* ============================= */

renderer.domElement
    .addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();

        }
    );


renderer.domElement
    .addEventListener(
        "mousedown",
        event => {

            if (
                event.button ===
                2
            ) {

                rightMouse =
                    true;

            }

        }
    );


window.addEventListener(
    "mouseup",
    event => {

        if (
            event.button ===
            2
        ) {

            rightMouse =
                false;

        }

    }
);


window.addEventListener(
    "mousemove",
    event => {

        if (
            !rightMouse
        )
            return;


        yaw -=
            event.movementX *
            .004;


        pitch -=
            event.movementY *
            .004;


        pitch =
            THREE.MathUtils.clamp(
                pitch,
                -.45,
                .75
            );

    }
);


/* ============================= */
/* WALKING */
/* ============================= */

function updateWalking(
    delta
) {

    let forward =
        (keys.w ? 1 : 0) -
        (keys.s ? 1 : 0);


    let sideways =
        (keys.d ? 1 : 0) -
        (keys.a ? 1 : 0);


    if (
        !forward &&
        !sideways
    )
        return;


    const length =
        Math.hypot(
            forward,
            sideways
        );


    forward /=
        length;


    sideways /=
        length;


    const speed =
        keys.shift
            ? 10
            : 5.5;


    const forwardX =
        Math.sin(yaw);


    const forwardZ =
        Math.cos(yaw);


    const rightX =
        Math.cos(yaw);


    const rightZ =
        -Math.sin(yaw);


    const moveX =
        forwardX * forward +
        rightX * sideways;


    const moveZ =
        forwardZ * forward +
        rightZ * sideways;


    player.position.x +=
        moveX *
        speed *
        delta;


    player.position.z +=
        moveZ *
        speed *
        delta;


    player.rotation.y =
        Math.atan2(
            moveX,
            moveZ
        );

}


/* ============================= */
/* DRIVING */
/* ============================= */

function updateDriving(
    delta
) {

    const vehicle =
        state.currentVehicle;


    if (
        !vehicle
    )
        return;


    const data =
        vehicle.userData;


    if (
        keys.w
    ) {

        data.speed +=
            12 *
            delta;

    }


    if (
        keys.s
    ) {

        data.speed -=
            15 *
            delta;

    }


    if (
        !keys.w &&
        !keys.s
    ) {

        data.speed *=
            .97;

    }


    const maxSpeed =
        keys.shift
            ? data.maxSpeed * 1.5
            : data.maxSpeed;


    data.speed =
        THREE.MathUtils.clamp(
            data.speed,
            -maxSpeed / 2,
            maxSpeed
        );


    /* A = LEFT */

    if (
        keys.a
    ) {

        vehicle.rotation.y +=
            2.2 *
            delta *
            (
                data.speed /
                maxSpeed
            );

    }


    /* D = RIGHT */

    if (
        keys.d
    ) {

        vehicle.rotation.y -=
            2.2 *
            delta *
            (
                data.speed /
                maxSpeed
            );

    }


    vehicle.translateZ(
        data.speed *
        delta
    );


    player.position.copy(
        vehicle.position
    );

}


/* ============================= */
/* CAMERA */
/* ============================= */

function updateCamera(
    delta
) {

    const target =
        state.inVehicle
            ? state.currentVehicle.position
            : player.position;


    const distance =
        state.inVehicle
            ? 12
            : 9;


    const horizontal =
        Math.cos(pitch) *
        distance;


    const desired =
        new THREE.Vector3(

            target.x -
            Math.sin(yaw) *
            horizontal,

            target.y +
            3 +
            Math.sin(pitch) *
            distance,

            target.z -
            Math.cos(yaw) *
            horizontal

        );


    camera.position.lerp(
        desired,
        1 -
        Math.pow(
            .001,
            delta
        )
    );


    camera.lookAt(
        target.x,
        target.y + 1,
        target.z
    );

}


/* ============================= */
/* INTERACTION UI */
/* ============================= */

function updateInteraction() {

    const nearby =
        state.currentVehicle &&
        player.position.distanceTo(
            state.currentVehicle.position
        ) < 5;


    if (
        state.inVehicle ||
        nearby
    ) {

        $("interaction")
            .style.display =
            "block";


        $("interactionText")
            .textContent =
            state.inVehicle
                ? "Exit Vehicle"
                : "Enter Vehicle";

    }

    else {

        $("interaction")
            .style.display =
            "none";

    }

}


/* ============================= */
/* GAME LOOP */
/* ============================= */

let previousTime =
    performance.now();


function gameLoop(
    currentTime
) {

    requestAnimationFrame(
        gameLoop
    );


    const delta =
        Math.min(
            (
                currentTime -
                previousTime
            ) / 1000,
            .05
        );


    previousTime =
        currentTime;


    if (
        state.inVehicle
    ) {

        updateDriving(
            delta
        );

    }

    else {

        updateWalking(
            delta
        );

    }


    updateCamera(
        delta
    );


    updateInteraction();


    renderer.render(
        scene,
        camera
    );

}


updateHUD();


addChat(
    "SYSTEM",
    "Welcome to UK Response RP."
);


gameLoop(
    performance.now()
);


/* ============================= */
/* WINDOW RESIZE */
/* ============================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            innerWidth /
            innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            innerWidth,
            innerHeight
        );

    }
);
