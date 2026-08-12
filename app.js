import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


/* =========================================================
   UK RESPONSE RP
   Browser prototype
========================================================= */


/* =========================================================
   GAME DATA
========================================================= */

const OWNER_NAME = "OWNER";

const state = {

    job: "CIVILIAN",

    money: 500,

    xp: 0,

    level: 1,

    wanted: 0,

    infiniteMoney: false,

    xpBoost: 1,

    moneyBoost: 1,

    activeEvent: null,

    currentVehicle: null,

    radioOpen: false,

    chatOpen: false,

    phoneOpen: false,

    radialOpen: false,

    adminOpen: false,

    siren: false,

    lights: false,

    playerName: "Player",

    settings: {
        cameraSensitivity: 0.003,
        showControls: true
    }

};


/* =========================================================
   VEHICLES
========================================================= */

const VEHICLES = [

    {
        id: "civilian-car",
        name: "Civilian Car",
        icon: "🚗",
        job: "CIVILIAN",
        price: 250,
        emergency: false,
        siren: false
    },

    {
        id: "police-bmw",
        name: "UK Police BMW",
        icon: "🚔",
        job: "POLICE",
        price: 0,
        emergency: true,
        siren: true
    },

    {
        id: "police-volvo",
        name: "Police Volvo",
        icon: "🚓",
        job: "POLICE",
        price: 0,
        emergency: true,
        siren: true
    },

    {
        id: "fire-engine",
        name: "Fire Engine",
        icon: "🚒",
        job: "FIRE & RESCUE",
        price: 0,
        emergency: true,
        siren: true
    },

    {
        id: "ambulance",
        name: "UK Ambulance",
        icon: "🚑",
        job: "AMBULANCE",
        price: 0,
        emergency: true,
        siren: true
    },

    {
        id: "hems",
        name: "HEMS Helicopter",
        icon: "🚁",
        job: "HEMS",
        price: 0,
        emergency: true,
        siren: true
    }

];


/* =========================================================
   JOBS
========================================================= */

const JOBS = [

    {
        id: "CIVILIAN",
        name: "Civilian",
        icon: "👤",
        description: "Live your own life around the city."
    },

    {
        id: "POLICE",
        name: "Police",
        icon: "🚔",
        description: "Respond to incidents and arrest wanted players."
    },

    {
        id: "FIRE & RESCUE",
        name: "Fire & Rescue",
        icon: "🚒",
        description: "Respond to fires and rescue calls."
    },

    {
        id: "AMBULANCE",
        name: "Ambulance",
        icon: "🚑",
        description: "Treat injured people and attend emergencies."
    },

    {
        id: "HEMS",
        name: "HEMS",
        icon: "🚁",
        description: "Provide advanced medical response."
    }

];


/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x82c8ec);

scene.fog =
    new THREE.Fog(
        0x82c8ec,
        100,
        600
    );


const camera =
    new THREE.PerspectiveCamera(
        70,
        innerWidth / innerHeight,
        0.1,
        1500
    );


camera.position.set(
    0,
    9,
    15
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setPixelRatio(
    Math.min(
        devicePixelRatio,
        2
    )
);


renderer.setSize(
    innerWidth,
    innerHeight
);


renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


document
    .getElementById("game")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const skyLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x496879,
        2
    );

scene.add(skyLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sun.position.set(
    100,
    180,
    100
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);


/* =========================================================
   GROUND
========================================================= */

const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            1000,
            1000
        ),

        new THREE.MeshStandardMaterial({
            color: 0x4c8654
        })

    );


ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   ROADS
========================================================= */

function createRoad(
    x,
    z,
    width,
    depth
) {

    const road =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                width,
                .08,
                depth
            ),

            new THREE.MeshStandardMaterial({
                color: 0x30343a
            })

        );

    road.position.set(
        x,
        .04,
        z
    );

    road.receiveShadow = true;

    scene.add(road);


    /* road lines */

    const lineMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xf4df7a
        });


    if (width > depth) {

        for (
            let i = -width / 2;
            i < width / 2;
            i += 10
        ) {

            const line =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        5,
                        .09,
                        .12
                    ),

                    lineMaterial

                );

            line.position.set(
                x + i,
                .1,
                z
            );

            scene.add(line);
        }

    } else {

        for (
            let i = -depth / 2;
            i < depth / 2;
            i += 10
        ) {

            const line =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        .12,
                        .09,
                        5
                    ),

                    lineMaterial

                );

            line.position.set(
                x,
                .1,
                z + i
            );

            scene.add(line);
        }

    }

}


/* main roads */

createRoad(
    0,
    0,
    1000,
    30
);

createRoad(
    0,
    0,
    30,
    1000
);

createRoad(
    180,
    0,
    25,
    1000
);

createRoad(
    -180,
    0,
    25,
    1000
);

createRoad(
    0,
    180,
    1000,
    25
);

createRoad(
    0,
    -180,
    1000,
    25
);


/* =========================================================
   BUILDINGS
========================================================= */

function createBuilding(
    x,
    z,
    width,
    height,
    depth,
    color
) {

    const building =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),

            new THREE.MeshStandardMaterial({
                color
            })

        );


    building.position.set(
        x,
        height / 2,
        z
    );


    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);


    /* windows */

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x9fd7f5
        });


    const floors =
        Math.max(
            2,
            Math.floor(
                height / 6
            )
        );


    const columns =
        Math.max(
            2,
            Math.floor(
                width / 4
            )
        );


    for (
        let floor = 0;
        floor < floors;
        floor++
    ) {

        for (
            let column = 0;
            column < columns;
            column++
        ) {

            const wx =
                x -
                width / 2 +
                2 +
                column * 4;


            const wy =
                3 +
                floor * 6;


            const window =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        1.5,
                        1.8,
                        .12
                    ),

                    windowMaterial

                );


            window.position.set(
                wx,
                wy,
                z - depth / 2 - .08
            );


            scene.add(window);


            const window2 =
                window.clone();


            window2.position.z =
                z + depth / 2 + .08;


            scene.add(window2);

        }

    }

}


/* city blocks */

const buildingColors = [
    0xb5bcc3,
    0x9fa8b1,
    0xc6b89d,
    0x8f9aa4,
    0xa9a09a
];


for (
    let x = -360;
    x <= 360;
    x += 70
) {

    for (
        let z = -360;
        z <= 360;
        z += 70
    ) {

        if (
            Math.abs(x) < 45 ||
            Math.abs(z) < 45
        ) continue;


        const height =
            15 +
            Math.random() * 35;


        createBuilding(
            x,
            z,
            45,
            height,
            45,
            buildingColors[
                Math.floor(
                    Math.random() *
                    buildingColors.length
                )
            ]
        );

    }

}


/* =========================================================
   CHARACTER
========================================================= */

const player =
    new THREE.Group();


const body =
    new THREE.Mesh(

        new THREE.BoxGeometry(
            1.4,
            2.4,
            .8
        ),

        new THREE.MeshStandardMaterial({
            color: 0x2563eb
        })

    );


body.position.y =
    1.7;


body.castShadow = true;

player.add(body);


const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            .55,
            20,
            20
        ),

        new THREE.MeshStandardMaterial({
            color: 0xffc9a8
        })

    );


head.position.y =
    3.25;


head.castShadow = true;

player.add(head);


player.position.set(
    0,
    0,
    10
);


scene.add(player);


/* =========================================================
   CAMERA
========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.35;

let rightMouse =
    false;


renderer.domElement.addEventListener(
    "contextmenu",
    e => e.preventDefault()
);


renderer.domElement.addEventListener(
    "mousedown",
    e => {

        if (
            e.button === 2
        ) {

            rightMouse = true;

        }

    }
);


window.addEventListener(
    "mouseup",
    e => {

        if (
            e.button === 2
        ) {

            rightMouse = false;

        }

    }
);


window.addEventListener(
    "mousemove",
    e => {

        if (!rightMouse)
            return;


        cameraYaw -=
            e.movementX *
            state.settings.cameraSensitivity;


        cameraPitch -=
            e.movementY *
            state.settings.cameraSensitivity;


        cameraPitch =
            Math.max(
                -0.1,
                Math.min(
                    1.1,
                    cameraPitch
                )
            );

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;


        if (
            e.code === "Tab"
        ) {

            e.preventDefault();

            toggleRadial();

        }


        if (
            e.code === "KeyE"
        ) {

            interact();

        }


        if (
            e.code === "KeyP"
        ) {

            togglePhone();

        }


        if (
            e.code === "KeyT"
        ) {

            toggleRadio();

        }


        if (
            e.code === "Escape"
        ) {

            closeEverything();

        }

    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[e.code] = false;

    }
);


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(
    delta
) {

    let forward = 0;

    let strafe = 0;


    if (
        keys.KeyW
    ) forward += 1;


    if (
        keys.KeyS
    ) forward -= 1;


    /*
       A = LEFT
       D = RIGHT
    */

    if (
        keys.KeyA
    ) strafe -= 1;


    if (
        keys.KeyD
    ) strafe += 1;


    const moving =
        forward !== 0 ||
        strafe !== 0;


    if (!moving)
        return;


    const speed =
        keys.ShiftLeft ||
        keys.ShiftRight
            ? 14
            : 7;


    const direction =
        new THREE.Vector3();


    direction.set(
        strafe,
        0,
        -forward
    );


    direction.normalize();


    const rotated =
        direction.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            cameraYaw
        );


    player.position.add(
        rotated.multiplyScalar(
            speed * delta
        )
    );


    player.rotation.y =
        Math.atan2(
            rotated.x,
            rotated.z
        );

}


/* =========================================================
   VEHICLE CREATION
========================================================= */

function createVehicle(
    data,
    admin = false
) {

    const vehicle =
        new THREE.Group();


    const colour =
        data.emergency
            ? (
                data.job === "POLICE"
                    ? 0x111827
                    : data.job === "FIRE & RESCUE"
                        ? 0xc52b2b
                        : 0xffffff
            )
            : 0x343a40;


    const bodyMesh =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                3.2,
                1.25,
                6
            ),

            new THREE.MeshStandardMaterial({
                color: colour
            })

        );


    bodyMesh.position.y =
        1;


    bodyMesh.castShadow = true;

    vehicle.add(bodyMesh);


    /* roof */

    const roof =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.6,
                .7,
                2.8
            ),

            new THREE.MeshStandardMaterial({
                color:
                    data.emergency
                        ? colour
                        : 0x555b63
            })

        );


    roof.position.y =
        1.75;

    roof.position.z =
        -.2;

    roof.castShadow = true;

    vehicle.add(roof);


    /* wheels */

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x101010
        });


    for (
        const x of [-1.65,1.65]
    ) {

        for (
            const z of [-2,2]
        ) {

            const wheel =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        .58,
                        .58,
                        .35,
                        18
                    ),

                    wheelMaterial

                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                x,
                .65,
                z
            );


            vehicle.add(wheel);

        }

    }


    /* emergency lightbar */

    if (
        data.emergency
    ) {

        const bar =
            new THREE.Group();


        const blue =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    .22,
                    .35
                ),

                new THREE.MeshBasicMaterial({
                    color: 0x145cff
                })

            );


        blue.position.x =
            -.55;


        const red =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    .22,
                    .35
                ),

                new THREE.MeshBasicMaterial({
                    color: 0xff2020
                })

            );


        red.position.x =
            .55;


        bar.add(
            blue,
            red
        );


        bar.position.y =
            2.25;


        vehicle.add(bar);


        vehicle.userData.lightbar =
            bar;

    }


    vehicle.userData.vehicleData =
        data;


    vehicle.userData.admin =
        admin;


    return vehicle;

}


/* =========================================================
   SPAWN VEHICLE
========================================================= */

function spawnVehicle(
    vehicleId,
    admin = false
) {

    const data =
        VEHICLES.find(
            v => v.id === vehicleId
        );


    if (!data)
        return;


    if (
        !admin &&
        data.job !== "CIVILIAN" &&
        data.job !== state.job
    ) {

        notify(
            `You need the ${data.job} job.`
        );

        return;

    }


    if (
        !admin &&
        data.price > 0
    ) {

        if (
            state.money <
            data.price
        ) {

            notify(
                "Not enough money."
            );

            return;

        }


        spendMoney(
            data.price
        );

    }


    if (
        state.currentVehicle
    ) {

        scene.remove(
            state.currentVehicle
        );

    }


    const vehicle =
        createVehicle(
            data,
            admin
        );


    vehicle.position.copy(
        player.position
    );


    vehicle.position.z -= 8;


    vehicle.position.y =
        0;


    scene.add(vehicle);


    state.currentVehicle =
        vehicle;


    notify(
        admin
            ? `ADMIN ${data.name} spawned.`
            : `${data.name} spawned.`
    );


    closeModal();

}


/* =========================================================
   VEHICLE UPDATE
========================================================= */

function updateVehicle(
    delta
) {

    const vehicle =
        state.currentVehicle;


    if (!vehicle)
        return;


    if (
        !keys.KeyW &&
        !keys.KeyS &&
        !keys.KeyA &&
        !keys.KeyD
    ) return;


    const speed =
        keys.ShiftLeft ||
        keys.ShiftRight
            ? 30
            : 18;


    if (
        keys.KeyW
    ) {

        vehicle.translateZ(
            -speed * delta
        );

    }


    if (
        keys.KeyS
    ) {

        vehicle.translateZ(
            speed * delta
        );

    }


    if (
        keys.KeyA
    ) {

        vehicle.rotation.y +=
            1.6 * delta;

    }


    if (
        keys.KeyD
    ) {

        vehicle.rotation.y -=
            1.6 * delta;

    }


    player.position.copy(
        vehicle.position
    );

}


/* =========================================================
   MONEY
========================================================= */

function addMoney(
    amount
) {

    const finalAmount =
        Math.round(
            amount *
            state.moneyBoost
        );


    if (
        !state.infiniteMoney
    ) {

        state.money +=
            finalAmount;

    }


    updateHUD();

}


function spendMoney(
    amount
) {

    if (
        state.infiniteMoney
    )
        return;


    state.money -=
        amount;


    updateHUD();

}


/* =========================================================
   XP
========================================================= */

function addXP(
    amount,
    reason
) {

    const finalXP =
        Math.round(
            amount *
            state.xpBoost
        );


    state.xp +=
        finalXP;


    while (
        state.xp >=
        state.level * 1000
    ) {

        state.xp -=
            state.level * 1000;

        state.level++;

        notify(
            `LEVEL UP! You are now Level ${state.level}.`
        );

    }


    state.xpReason =
        reason;


    updateHUD();


    showXPNotification(
        finalXP,
        reason
    );

}


function showXPNotification(
    amount,
    reason
) {

    const box =
        document.getElementById(
            "xpNotification"
        );


    box.textContent =
        `+${amount} XP · ${reason}`;


    box.style.display =
        "block";


    clearTimeout(
        window.xpTimer
    );


    window.xpTimer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            2500
        );

}


/* =========================================================
   WANTED
========================================================= */

function setWanted(
    amount
) {

    state.wanted =
        Math.max(
            0,
            Math.min(
                5,
                amount
            )
        );


    updateHUD();

}


function addWanted(
    amount = 1
) {

    setWanted(
        state.wanted + amount
    );


    if (
        state.wanted > 0
    ) {

        notify(
            `Wanted level increased to ${state.wanted}/5.`
        );

    }

}


/* =========================================================
   JOB
========================================================= */

function selectJob(
    job
) {

    state.job =
        job;


    updateHUD();


    addXP(
        100,
        `Joined ${job}`
    );


    notify(
        `You are now working as ${job}.`
    );


    closeModal();

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document
        .getElementById("jobName")
        .textContent =
        state.job === "FIRE & RESCUE"
            ? "🚒 FIRE & RESCUE"
            : state.job === "AMBULANCE"
                ? "🚑 AMBULANCE"
                : state.job === "HEMS"
                    ? "🚁 HEMS"
                    : state.job === "POLICE"
                        ? "🚔 POLICE"
                        : "👤 CIVILIAN";


    document
        .getElementById("levelText")
        .textContent =
        `LEVEL ${state.level}`;


    document
        .getElementById("xpText")
        .textContent =
        `${state.xp} / ${state.level * 1000} XP`;


    document
        .getElementById("xpBar")
        .style.width =
        `${
            (
                state.xp /
                (state.level * 1000)
            ) * 100
        }%`;


    document
        .getElementById("money")
        .textContent =
        state.infiniteMoney
            ? "∞"
            : state.money.toLocaleString();


    const wanted =
        document.getElementById(
            "wantedPanel"
        );


    document
        .getElementById(
            "wantedStars"
        )
        .textContent =
        state.wanted;


    wanted.classList.toggle(
        "visible",
        state.wanted > 0
    );


    const eventBadge =
        document.getElementById(
            "eventBadge"
        );


    eventBadge.classList.toggle(
        "hidden",
        !state.activeEvent
    );


    if (
        state.activeEvent
    ) {

        document
            .getElementById(
                "eventName"
            )
            .textContent =
            state.activeEvent;

    }

}


/* =========================================================
   NOTIFICATION
========================================================= */

function notify(
    message
) {

    const box =
        document.getElementById(
            "notification"
        );


    box.textContent =
        message;


    box.style.display =
        "block";


    clearTimeout(
        window.notifyTimer
    );


    window.notifyTimer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            3000
        );

}


/* =========================================================
   MODALS
========================================================= */

const modal =
    document.getElementById(
        "modal"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalBody =
    document.getElementById(
        "modalBody"
    );


function openModal(
    title,
    html
) {

    modalTitle.textContent =
        title;

    modalBody.innerHTML =
        html;

    modal.classList.remove(
        "hidden"
    );


    attachDynamicButtons();

}


function closeModal() {

    modal.classList.add(
        "hidden"
    );

}


/* =========================================================
   JOB MENU
========================================================= */

function showJobs() {

    const html = `

        <div class="jobGrid">

            ${JOBS.map(job => `

                <button
                    class="jobCard"
                    data-job="${job.id}"
                >

                    <div class="jobIcon">
                        ${job.icon}
                    </div>

                    <div class="jobTitle">
                        ${job.name}
                    </div>

                    <div class="jobDescription">
                        ${job.description}
                    </div>

                </button>

            `).join("")}

        </div>

    `;


    openModal(
        "👔 JOBS",
        html
    );

}


/* =========================================================
   VEHICLE MENU
========================================================= */

function showVehicles() {

    const html = `

        <div class="vehicleGrid">

            ${VEHICLES.map(vehicle => `

                <div class="vehicleCard">

                    <div class="vehicleIcon">
                        ${vehicle.icon}
                    </div>

                    <div class="vehicleName">
                        ${vehicle.name}
                    </div>

                    <div class="vehicleInfo">

                        ${
                            vehicle.emergency
                                ? "UK Emergency Vehicle · Siren"
                                : `Civilian · £${vehicle.price}`
                        }

                    </div>

                    <button
                        class="vehicleSpawn"
                        data-spawn="${vehicle.id}"
                    >

                        SPAWN

                    </button>

                </div>

            `).join("")}

        </div>

    `;


    openModal(
        "🚗 VEHICLE DEALERSHIP",
        html
    );

}


/* =========================================================
   EVENTS
========================================================= */

function showEvents() {

    const events = [

        {
            id: "galaxy",
            icon: "🌌",
            name: "Galaxy Event",
            description:
                "Earn 20% more XP and 25% more money."
        },

        {
            id: "xp",
            icon: "⭐",
            name: "XP Boost",
            description:
                "Double XP for everyone."
        },

        {
            id: "money",
            icon: "💷",
            name: "Money Boost",
            description:
                "Earn 50% more money."
        }

    ];


    openModal(
        "🌌 EVENTS",

        `

        <div class="eventGrid">

            ${events.map(event => `

                <div class="eventCard">

                    <div class="eventIcon">
                        ${event.icon}
                    </div>

                    <div class="eventTitle">
                        ${event.name}
                    </div>

                    <div class="eventDescription">
                        ${event.description}
                    </div>

                    <button
                        class="eventButton"
                        data-event="${event.id}"
                    >
                        ACTIVATE
                    </button>

                </div>

            `).join("")}

        </div>

        `

    );

}


/* =========================================================
   ACTIVATE EVENT
========================================================= */

function activateEvent(
    id
) {

    if (
        id === "galaxy"
    ) {

        state.activeEvent =
            "GALAXY EVENT";

        state.xpBoost =
            1.2;

        state.moneyBoost =
            1.25;

    }


    if (
        id === "xp"
    ) {

        state.activeEvent =
            "XP BOOST";

        state.xpBoost =
            2;

        state.moneyBoost =
            1;

    }


    if (
        id === "money"
    ) {

        state.activeEvent =
            "MONEY BOOST";

        state.xpBoost =
            1;

        state.moneyBoost =
            1.5;

    }


    updateHUD();

    notify(
        `${state.activeEvent} activated.`
    );

}


/* =========================================================
   WANTED MENU
========================================================= */

function showWanted() {

    openModal(
        "🚨 WANTED SYSTEM",

        `

        <div class="card">

            <div class="cardTitle">
                Current Wanted Level
            </div>

            <div style="
                font-size:28px;
                margin:10px 0;
            ">
                🚨 ${state.wanted}/5
            </div>

            <button
                class="option"
                id="increaseWanted"
            >
                🚨 Increase Wanted Level
            </button>

            <button
                class="option"
                id="clearWanted"
            >
                ✅ Clear Wanted Level
            </button>

        </div>

        `

    );

}


/* =========================================================
   SETTINGS
========================================================= */

function showSettings() {

    openModal(
        "⚙️ SETTINGS",

        `

        <div class="card">

            <div class="cardTitle">
                Camera Sensitivity
            </div>

            <input
                id="cameraSensitivity"
                type="range"
                min="0.001"
                max="0.01"
                step="0.001"
                value="${state.settings.cameraSensitivity}"
                style="width:100%"
            >

        </div>

        <button
            class="option"
            id="toggleControls"
        >
            🎮 Toggle Controls HUD
        </button>

        `

    );

}


/* =========================================================
   PLAYER LIST
========================================================= */

function showPlayers() {

    openModal(
        "👥 PLAYERS",

        `

        <div class="card">

            <div class="cardTitle">
                Player
            </div>

            <div>
                👤 ${state.playerName}
            </div>

            <div style="opacity:.6;margin-top:5px;">
                ${state.job}
            </div>

        </div>

        `

    );

}


/* =========================================================
   PHONE
========================================================= */

function togglePhone() {

    const phone =
        document.getElementById(
            "phone"
        );


    phone.classList.toggle(
        "hidden"
    );


    state.phoneOpen =
        !phone.classList.contains(
            "hidden"
        );

}


function phonePage(
    page
) {

    if (
        page === "jobs"
    ) showJobs();

    if (
        page === "vehicles"
    ) showVehicles();

    if (
        page === "radio"
    ) toggleRadio();

    if (
        page === "events"
    ) showEvents();

    if (
        page === "wanted"
    ) showWanted();

    if (
        page === "players"
    ) showPlayers();

    if (
        page === "settings"
    ) showSettings();

    if (
        page === "chat"
    ) toggleChat();

}


/* =========================================================
   RADIO
========================================================= */

function toggleRadio() {

    const radio =
        document.getElementById(
            "radioPanel"
        );


    radio.classList.toggle(
        "hidden"
    );


    state.radioOpen =
        !radio.classList.contains(
            "hidden"
        );

}


function radioMessage(
    message
) {

    const box =
        document.getElementById(
            "radioMessages"
        );


    const row =
        document.createElement(
            "div"
        );


    row.textContent =
        `DISPATCH: ${message}`;


    box.appendChild(row);

    box.scrollTop =
        box.scrollHeight;

    addXP(
        15,
        "Radio communication"
    );

}


/* =========================================================
   CHAT
========================================================= */

function toggleChat() {

    const chat =
        document.getElementById(
            "chat"
        );


    chat.classList.toggle(
        "hidden"
    );


    state.chatOpen =
        !chat.classList.contains(
            "hidden"
        );


    if (
        state.chatOpen
    ) {

        setTimeout(
            () => {

                document
                    .getElementById(
                        "chatInput"
                    )
                    .focus();

            },
            50
        );

    }

}


function sendChat() {

    const input =
        document.getElementById(
            "chatInput"
        );


    const message =
        input.value.trim();


    if (!message)
        return;


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "chatMsg";


    row.innerHTML =
        `<b>${escapeHTML(state.playerName)}</b>${escapeHTML(message)}`;


    document
        .getElementById(
            "chatMessages"
        )
        .appendChild(row);


    input.value =
        "";


    addXP(
        5,
        "Chat activity"
    );

}


function escapeHTML(
    value
) {

    return value
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   RADIAL
========================================================= */

function toggleRadial() {

    const overlay =
        document.getElementById(
            "radialOverlay"
        );


    overlay.classList.toggle(
        "hidden"
    );


    state.radialOpen =
        !overlay.classList.contains(
            "hidden"
        );

}


function closeRadial() {

    document
        .getElementById(
            "radialOverlay"
        )
        .classList.add(
            "hidden"
        );


    state.radialOpen =
        false;

}


/* =========================================================
   INTERACTION
========================================================= */

function interact() {

    if (
        state.radialOpen
    ) {

        return;

    }


    const nearby =
        getNearbyInteraction();


    if (
        nearby
    ) {

        nearby();

        return;

    }


    notify(
        "Nothing nearby to interact with."
    );

}


function getNearbyInteraction() {

    if (
        state.currentVehicle
    ) {

        const distance =
            player.position.distanceTo(
                state.currentVehicle.position
            );


        if (
            distance < 8
        ) {

            return () => {

                notify(
                    "Vehicle interaction: press WASD to drive."
                );

            };

        }

    }


    return null;

}


/* =========================================================
   SIREN
========================================================= */

function toggleSiren() {

    if (
        !state.currentVehicle ||
        !state.currentVehicle
            .userData
            .vehicleData
            .emergency
    ) {

        notify(
            "You are not in an emergency vehicle."
        );

        return;

    }


    state.siren =
        !state.siren;


    state.lights =
        state.siren;


    notify(
        state.siren
            ? "🚨 Siren and lights ON."
            : "Siren and lights OFF."
    );

}


/* =========================================================
   ADMIN PANEL
========================================================= */

function isOwner() {

    /*
       Local prototype owner check.

       In a real multiplayer game this MUST
       be verified by a server.
    */

    return true;

}


function openAdmin() {

    if (!isOwner()) {

        notify(
            "You do not have permission."
        );

        return;

    }


    document
        .getElementById(
            "adminPanel"
        )
        .classList.remove(
            "hidden"
        );


    state.adminOpen =
        true;


    adminTab(
        "players"
    );

}


function closeAdmin() {

    document
        .getElementById(
            "adminPanel"
        )
        .classList.add(
            "hidden"
        );


    state.adminOpen =
        false;

}


function adminTab(
    tab
) {

    const body =
        document.getElementById(
            "adminBody"
        );


    if (
        tab === "players"
    ) {

        body.innerHTML = `

            <div class="card">

                <div class="cardTitle">
                    Player Controls
                </div>

                <div class="adminRow">

                    <input
                        id="adminPlayer"
                        placeholder="Player name"
                        value="Player"
                    >

                    <input
                        id="adminAmount"
                        type="number"
                        placeholder="Amount"
                        value="1000"
                    >

                </div>

                <div class="adminRow">

                    <button
                        class="primary"
                        id="giveXP"
                    >
                        ⭐ GIVE XP
                    </button>

                    <button
                        class="primary"
                        id="giveMoney"
                    >
                        💷 GIVE MONEY
                    </button>

                </div>

                <button
                    class="option"
                    id="infiniteMoney"
                >
                    💰 TOGGLE INFINITE MONEY
                </button>

                <button
                    class="option"
                    id="adminWanted"
                >
                    🚨 SET WANTED
                </button>

            </div>

        `;

    }


    if (
        tab === "vehicles"
    ) {

        body.innerHTML = `

            <div class="card">

                <div class="cardTitle">
                    ADMIN VEHICLE SPAWNER
                </div>

                <p style="opacity:.6;font-size:11px;">
                    Admin vehicles are marked ADMIN.
                </p>

                ${VEHICLES.map(vehicle => `

                    <button
                        class="option"
                        data-admin-spawn="${vehicle.id}"
                    >

                        ${vehicle.icon}
                        ${vehicle.name}
                        · ADMIN

                    </button>

                `).join("")}

            </div>

        `;

    }


    if (
        tab === "events"
    ) {

        body.innerHTML = `

            <div class="card">

                <div class="cardTitle">
                    EVENT CONTROLS
                </div>

                <button
                    class="option"
                    data-admin-event="galaxy"
                >
                    🌌 Galaxy Event
                    · +20% XP · +25% Money
                </button>

                <button
                    class="option"
                    data-admin-event="xp"
                >
                    ⭐ XP Boost
                </button>

                <button
                    class="option"
                    data-admin-event="money"
                >
                    💷 Money Boost
                </button>

                <button
                    class="option"
                    id="stopEvent"
                >
                    🛑 Stop Event
                </button>

            </div>

        `;

    }


    if (
        tab === "world"
    ) {

        body.innerHTML = `

            <div class="card">

                <div class="cardTitle">
                    WORLD CONTROLS
                </div>

                <button
                    class="option"
                    id="clearWantedWorld"
                >
                    🚨 Clear All Wanted
                </button>

                <button
                    class="option"
                    id="worldXP"
                >
                    ⭐ Give 5,000 XP
                </button>

                <button
                    class="option"
                    id="worldMoney"
                >
                    💷 Give £50,000
                </button>

                <button
                    class="option"
                    id="worldNight"
                >
                    🌙 Toggle Night
                </button>

            </div>

        `;

    }


    attachAdminButtons();

}


function attachAdminButtons() {

    document
        .querySelectorAll(
            "[data-admin-spawn]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        spawnVehicle(
                            button
                                .dataset
                                .adminSpawn,
                            true
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            "[data-admin-event]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        activateEvent(
                            button
                                .dataset
                                .adminEvent
                        );

                    };

            }
        );


    const giveXP =
        document.getElementById(
            "giveXP"
        );


    if (giveXP) {

        giveXP.onclick =
            () => {

                const amount =
                    Number(
                        document
                            .getElementById(
                                "adminAmount"
                            )
                            .value
                    ) || 0;


                addXP(
                    amount,
                    "Owner admin command"
                );


                notify(
                    `Gave ${amount} XP.`
                );

            };

    }


    const giveMoney =
        document.getElementById(
            "giveMoney"
        );


    if (giveMoney) {

        giveMoney.onclick =
            () => {

                const amount =
                    Number(
                        document
                            .getElementById(
                                "adminAmount"
                            )
                            .value
                    ) || 0;


                state.money +=
                    amount;


                updateHUD();


                notify(
                    `Gave £${amount.toLocaleString()}.`
                );

            };

    }


    const infinite =
        document.getElementById(
            "infiniteMoney"
        );


    if (infinite) {

        infinite.onclick =
            () => {

                state.infiniteMoney =
                    !state.infiniteMoney;


                updateHUD();


                notify(
                    state.infiniteMoney
                        ? "Infinite money ENABLED."
                        : "Infinite money DISABLED."
                );

            };

    }


    const wanted =
        document.getElementById(
            "adminWanted"
        );


    if (wanted) {

        wanted.onclick =
            () => {

                setWanted(
                    5
                );


                notify(
                    "Wanted level set to 5."
                );

            };

    }


    const stopEvent =
        document.getElementById(
            "stopEvent"
        );


    if (stopEvent) {

        stopEvent.onclick =
            () => {

                state.activeEvent =
                    null;

                state.xpBoost =
                    1;

                state.moneyBoost =
                    1;

                updateHUD();

                notify(
                    "Event stopped."
                );

            };

    }


    const clearWanted =
        document.getElementById(
            "clearWantedWorld"
        );


    if (clearWanted) {

        clearWanted.onclick =
            () => {

                setWanted(
                    0
                );

                notify(
                    "Wanted levels cleared."
                );

            };

    }


    const worldXP =
        document.getElementById(
            "worldXP"
        );


    if (worldXP) {

        worldXP.onclick =
            () => {

                addXP(
                    5000,
                    "Owner world command"
                );

            };

    }


    const worldMoney =
        document.getElementById(
            "worldMoney"
        );


    if (worldMoney) {

        worldMoney.onclick =
            () => {

                state.money +=
                    50000;

                updateHUD();

                notify(
                    "£50,000 added."
                );

            };

    }


    const worldNight =
        document.getElementById(
            "worldNight"
        );


    if (worldNight) {

        worldNight.onclick =
            () => {

                if (
                    scene.background
                        .getHex() ===
                    0x82c8ec
                ) {

                    scene.background =
                        new THREE.Color(
                            0x08152b
                        );

                    scene.fog =
                        new THREE.Fog(
                            0x08152b,
                            100,
                            600
                        );

                    sun.intensity =
                        .25;

                    skyLight.intensity =
                        .5;

                    notify(
                        "Night mode enabled."
                    );

                } else {

                    scene.background =
                        new THREE.Color(
                            0x82c8ec
                        );

                    scene.fog =
                        new THREE.Fog(
                            0x82c8ec,
                            100,
                            600
                        );

                    sun.intensity =
                        2;

                    skyLight.intensity =
                        2;

                    notify(
                        "Day mode enabled."
                    );

                }

            };

    }

}


/* =========================================================
   DYNAMIC BUTTONS
========================================================= */

function attachDynamicButtons() {

    document
        .querySelectorAll(
            "[data-job]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        selectJob(
                            button
                                .dataset
                                .job
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            "[data-spawn]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        spawnVehicle(
                            button
                                .dataset
                                .spawn
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            "[data-event]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        activateEvent(
                            button
                                .dataset
                                .event
                        );

                    };

            }
        );


    const increaseWanted =
        document.getElementById(
            "increaseWanted"
        );


    if (increaseWanted) {

        increaseWanted.onclick =
            () => {

                addWanted();

            };

    }


    const clearWanted =
        document.getElementById(
            "clearWanted"
        );


    if (clearWanted) {

        clearWanted.onclick =
            () => {

                setWanted(
                    0
                );

                notify(
                    "Wanted level cleared."
                );

            };

    }


    const sensitivity =
        document.getElementById(
            "cameraSensitivity"
        );


    if (sensitivity) {

        sensitivity.oninput =
            () => {

                state.settings.cameraSensitivity =
                    Number(
                        sensitivity.value
                    );

            };

    }


    const controls =
        document.getElementById(
            "toggleControls"
        );


    if (controls) {

        controls.onclick =
            () => {

                state.settings.showControls =
                    !state.settings.showControls;


                document
                    .getElementById(
                        "controls"
                    )
                    .style.display =
                    state.settings.showControls
                        ? "block"
                        : "none";

            };

    }

}


/* =========================================================
   RADIAL ACTIONS
========================================================= */

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
                        action === "jobs"
                    ) showJobs();

                    if (
                        action === "vehicles"
                    ) showVehicles();

                    if (
                        action === "phone"
                    ) togglePhone();

                    if (
                        action === "wanted"
                    ) showWanted();

                    if (
                        action === "events"
                    ) showEvents();

                    if (
                        action === "radio"
                    ) toggleRadio();

                    if (
                        action === "chat"
                    ) toggleChat();

                    if (
                        action === "settings"
                    ) showSettings();

                };

        }
    );


/* =========================================================
   CLOSE BUTTONS
========================================================= */

document
    .getElementById(
        "modalClose"
    )
    .onclick =
    closeModal;


document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    const target =
                        button
                            .dataset
                            .close;


                    document
                        .getElementById(
                            target
                        )
                        .classList
                        .add(
                            "hidden"
                        );

                };

        }
    );


document
    .querySelectorAll(
        "[data-admin-tab]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    adminTab(
                        button
                            .dataset
                            .adminTab
                    );

                };

        }
    );


/* =========================================================
   PHONE BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-phone]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    phonePage(
                        button
                            .dataset
                            .phone
                    );

                };

        }
    );


/* =========================================================
   RADIO BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-radio]"
    )
    .forEach(
        button => {

            button.onclick =
                () => {

                    const type =
                        button
                            .dataset
                            .radio;


                    const messages = {

                        transmit:
                            "Unit transmitting.",

                        pursuit:
                            "Unit is now IN PURSUIT.",

                        backup:
                            "BACKUP REQUESTED.",

                        enroute:
                            "Unit EN ROUTE.",

                        scene:
                            "Unit ON SCENE."

                    };


                    radioMessage(
                        messages[type]
                    );

                };

        }
    );


/* =========================================================
   CHAT
========================================================= */

document
    .getElementById(
        "chatSend"
    )
    .onclick =
    sendChat;


document
    .getElementById(
        "chatInput"
    )
    .addEventListener(
        "keydown",
        e => {

            if (
                e.key === "Enter"
            ) {

                sendChat();

            }

        }
    );


/* =========================================================
   SIREN KEY
========================================================= */

window.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "KeyL"
        ) {

            toggleSiren();

        }

    }
);


/* =========================================================
   ADMIN HOTKEY
========================================================= */

window.addEventListener(
    "keydown",
    e => {

        /*
           O = OWNER ADMIN PANEL
        */

        if (
            e.code === "KeyO"
        ) {

            openAdmin();

        }

    }
);


/* =========================================================
   CLOSE EVERYTHING
========================================================= */

function closeEverything() {

    closeModal();

    closeRadial();

    closeAdmin();


    document
        .querySelectorAll(
            ".glassPanel"
        )
        .forEach(
            panel => {

                panel.classList.add(
                    "hidden"
                );

            }
        );


    document
        .getElementById(
            "phone"
        )
        .classList.add(
            "hidden"
        );


    state.phoneOpen =
        false;

    state.radioOpen =
        false;

    state.chatOpen =
        false;

}


/* =========================================================
   PHONE CLOCK
========================================================= */

setInterval(
    () => {

        const now =
            new Date();


        document
            .getElementById(
                "phoneTime"
            )
            .textContent =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    },
    1000
);


/* =========================================================
   ANIMATION
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            .05
        );


    if (
        state.currentVehicle
    ) {

        updateVehicle(
            delta
        );

    } else {

        updatePlayer(
            delta
        );

    }


    /* camera */

    const target =
        state.currentVehicle
            ? state.currentVehicle
            : player;


    const distance =
        state.currentVehicle
            ? 18
            : 12;


    const cameraTarget =
        new THREE.Vector3(
            target.position.x,
            target.position.y +
                3,
            target.position.z
        );


    const cameraOffset =
        new THREE.Vector3(
            Math.sin(cameraYaw) *
                distance,
            5 +
                cameraPitch * 5,
            Math.cos(cameraYaw) *
                distance
        );


    camera.position.lerp(
        cameraTarget
            .clone()
            .add(
                cameraOffset
            ),
        .12
    );


    camera.lookAt(
        cameraTarget
    );


    /* emergency lights */

    if (
        state.currentVehicle &&
        state.currentVehicle.userData
            .lightbar
    ) {

        const bar =
            state.currentVehicle
                .userData
                .lightbar;


        bar.children.forEach(
            (light, index) => {

                light.visible =
                    state.lights
                        ? (
                            Math.floor(
                                performance.now() /
                                150
                            ) % 2 ===
                            index
                        )
                        : true;

            }
        );

    }


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   RESIZE
========================================================= */

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


/* =========================================================
   STARTUP
========================================================= */

updateHUD();


notify(
    "Welcome to UK Response RP."
);
