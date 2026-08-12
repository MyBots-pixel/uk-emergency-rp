import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createPlayer() {

  const player = new THREE.Group();

  player.name = "Player";


  // =========================
  // MATERIALS
  // =========================

  const skin =
    new THREE.MeshStandardMaterial({
      color: 0xffc9a5
    });

  const shirt =
    new THREE.MeshStandardMaterial({
      color: 0x2563eb
    });

  const trousers =
    new THREE.MeshStandardMaterial({
      color: 0x222222
    });

  const shoes =
    new THREE.MeshStandardMaterial({
      color: 0x111111
    });


  // =========================
  // BODY
  // =========================

  const torso =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.8,
        1.1,
        0.45
      ),
      shirt
    );

  torso.position.y = 1.65;

  torso.castShadow = true;

  player.add(torso);


  // =========================
  // HEAD
  // =========================

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.38,
        24,
        24
      ),
      skin
    );

  head.position.y = 2.5;

  head.castShadow = true;

  player.add(head);


  // =========================
  // LEFT ARM
  // =========================

  const leftArm =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.25,
        1,
        0.25
      ),
      skin
    );

  leftArm.position.set(
    -0.58,
    1.65,
    0
  );

  leftArm.castShadow = true;

  player.add(leftArm);


  // =========================
  // RIGHT ARM
  // =========================

  const rightArm =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.25,
        1,
        0.25
      ),
      skin
    );

  rightArm.position.set(
    0.58,
    1.65,
    0
  );

  rightArm.castShadow = true;

  player.add(rightArm);


  // =========================
  // LEFT LEG
  // =========================

  const leftLeg =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.3,
        1.1,
        0.3
      ),
      trousers
    );

  leftLeg.position.set(
    -0.2,
    0.55,
    0
  );

  leftLeg.castShadow = true;

  player.add(leftLeg);


  // =========================
  // RIGHT LEG
  // =========================

  const rightLeg =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.3,
        1.1,
        0.3
      ),
      trousers
    );

  rightLeg.position.set(
    0.2,
    0.55,
    0
  );

  rightLeg.castShadow = true;

  player.add(rightLeg);


  // =========================
  // SHOES
  // =========================

  const leftShoe =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.35,
        0.2,
        0.55
      ),
      shoes
    );

  leftShoe.position.set(
    -0.2,
    0.08,
    -0.08
  );

  player.add(leftShoe);


  const rightShoe =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.35,
        0.2,
        0.55
      ),
      shoes
    );

  rightShoe.position.set(
    0.2,
    0.08,
    -0.08
  );

  player.add(rightShoe);


  // =========================
  // PLAYER DATA
  // =========================

  player.userData = {

    job: "Civilian",

    money: 500,

    xp: 0,

    wantedLevel: 0,

    sprinting: false,

    inVehicle: false,

    vehicle: null

  };


  return player;

}
