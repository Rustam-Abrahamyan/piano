var basePath = "./src/",
    musicData = defaultMusicData;
function Player(e, a) {
    var n = e.slice(0),
        o = this,
        t = [];
    (this.play = !0),
        (this.playNote = function (e) {
            setTimeout(function () {
                o.play || (e = []),
                    t.forEach(function (e, a) {
                        (e.rotation.x = (0 * Math.PI) / 180), t.splice(a, 1);
                    }),
                    e.length > 0
                        ? ("__" != e[0] &&
                              e[0].forEach(function (e) {
                                  var n = a ? 0 : 3;
                                  e.indexOf("-") > -1 &&
                                      ((e = e.replace("-", "")),
                                      (n =
                                          n -
                                          (o = parseInt(e.match(/\d+/), 10)) -
                                          o));
                                  var o = parseInt(e.match(/\d+/), 10),
                                      s = e.toLowerCase().replace(o, o + n);
                                  (pianoNotes[s].rotation.x =
                                      (4 * Math.PI) / 180),
                                      t.push(pianoNotes[s]),
                                      playSound(sounds[s].buffer, !1);
                              }),
                          e.shift(),
                          o.playNote(e))
                        : ((pianoNotes.isPlaying = !1),
                          t.forEach(function (e, a) {
                              (e.rotation.x = (0 * Math.PI) / 180),
                                  t.splice(a, 1);
                          }));
            }, 250);
        }),
        (this.stopMusic = function () {
            (this.play = !1), document.body.classList.add("paused");
        }),
        this.playNote(n);
}
document.body.classList.add("loading");
var cubeCamera,
    white_material,
    black_material,
    spotLight,
    sounds = {
        c: { sound: "Piano.ff.C", shape: 2, buffer: null, color: "w" },
        bd: { sound: "Piano.ff.Db", shape: 3, buffer: null, color: "b" },
        d: { sound: "Piano.ff.D", shape: 1, buffer: null, color: "w" },
        be: { sound: "Piano.ff.Eb", shape: 3, buffer: null, color: "b" },
        e: { sound: "Piano.ff.E", shape: 0, buffer: null, color: "w" },
        f: { sound: "Piano.ff.F", shape: 2, buffer: null, color: "w" },
        bg: { sound: "Piano.ff.Gb", shape: 3, buffer: null, color: "b" },
        g: { sound: "Piano.ff.G", shape: 1, buffer: null, color: "w" },
        ba: { sound: "Piano.ff.Ab", shape: 3, buffer: null, color: "b" },
        a: { sound: "Piano.ff.A", shape: 1, buffer: null, color: "w" },
        bb: { sound: "Piano.ff.Bb", shape: 3, buffer: null, color: "b" },
        b: { sound: "Piano.ff.B", shape: 0, buffer: null, color: "w" },
    },
    main_color = 11184810,
    time = 0,
    canvas_height = window.innerHeight,
    canvas_width = window.innerWidth;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var scene,
    camera,
    renderer,
    controls,
    audioContext = new AudioContext(),
    bufferLoader = new AudioBufferLoader(audioContext),
    maxNotes = 84,
    manager = new THREE.LoadingManager();
manager.onProgress = function (e, a, n) {
    a == n && init();
};
var loader = new THREE.JSONLoader(manager),
    textureLoader = new THREE.TextureLoader(manager),
    pianoNotes = { ready: !1, isPlaying: !1, recording: !1 },
    playBoard = [],
    assets = { shapes: {}, texture: {}, geometry: {}, materials: {} },
    stage = { x: window.innerWidth, y: window.innerHeight },
    notenOptions = {
        violinPos: 50,
        bassPos: 100,
        violinOrigin: 83,
        violineBase: 5,
        bassBase: 2,
        lineHeight: 6,
    };
function over(e, a) {}
function out(e, a) {
    e.rotation.x = (0 * Math.PI) / 180;
}
function activeState(e, a) {
    (e.rotation.x = (3 * Math.PI) / 180),
        playSound(sounds[e._own.note].buffer, !1),
        pianoNotes.recording && playBoard.push([e._own.note]);
}
function createShape(e, a, n, o, t) {
    var s = null,
        r = null;
    switch (o.shape) {
        case 0:
            s = "w_l";
            break;
        case 1:
            s = "w_r_l";
            break;
        case 2:
            s = "w_r";
            break;
        case 3:
            s = "b";
    }
    switch (o.color) {
        case "w":
            r = white_material;
            break;
        case "b":
            r = black_material;
    }
    (pianoNotes[e + a] = pianoNotes[e + a] =
        new THREE.Mesh(assets.shapes[s], r)),
        (pianoNotes[e + a]._own = { note: e + a, oct: a, index: n }),
        (pianoNotes[e + a].receiveShadow = !0),
        (pianoNotes[e + a].castShadow = !0),
        pianoNotes[e + a].position.set(t.x, t.y, t.z),
        Adjust.addActiveObject(pianoNotes[e + a], over, out, activeState, !1),
        scene.add(pianoNotes[e + a]),
        Object.keys(pianoNotes).length == maxNotes &&
            ((pianoNotes.ready = !0),
            document.body.classList.remove("loading"));
}
function loadSingleBuffer(e, a, n, o, t) {
    bufferLoader.loadBuffer(
        n + e,
        basePath + "sounds/" + o.sound + e + ".mp3",
        function (s) {
            (sounds[n + e] = {}),
                (sounds[n + e].buffer = s),
                createShape(n, e, a, o, t);
        }
    );
}
function createSource(e) {
    var a = audioContext.createBufferSource();
    return (a.buffer = e), a.connect(audioContext.destination), { source: a };
}
function playSound(e, a) {
    var n = createSource(e);
    return (
        (n.source.loop = a),
        (n.playing = !0),
        n.source.start ? n.source.start() : n.source.noteOn(0),
        n
    );
}
function prepareTexture(e, a) {
    (e.wrapS = e.wrapT = THREE.RepeatWrapping), e.repeat.set(a, a);
}
function init() {
    (scene = new THREE.Scene()),
        (camera = new THREE.PerspectiveCamera(
            55,
            canvas_width / canvas_height,
            0.1,
            1e4
        )).position.set(25, 12, 16),
        scene.add(camera),
        (cubeCamera = new THREE.CubeCamera(1, 100, 128)).position.set(
            55,
            12,
            0
        ),
        scene.add(cubeCamera),
        (renderer = new THREE.WebGLRenderer({
            alpha: !0,
            antialias: !0,
        })).setSize(canvas_width, canvas_height),
        (renderer.shadowMap.enabled = !0),
        (renderer.shadowMap.type = THREE.PCFSoftShadowMap),
        renderer.setClearColor(main_color, 1),
        document.body.appendChild(renderer.domElement),
        Adjust.init({ camera: camera, scene: scene, renderer: renderer }),
        (controls = new THREE.OrbitControls(camera)).target.set(20, 5, -2),
        (controls.enabled = !0),
        (controls.damping = 0.2),
        (controls.maxPolarAngle = Math.PI / 2),
        (controls.minDistance = 10),
        (controls.maxDistance = 220);
    var e = new THREE.PointLight(16777215, 0.5);
    e.position.set(0, 80, 50), scene.add(e);
    var a = new THREE.AmbientLight(11184810);
    scene.add(a),
        (spotLight = new THREE.SpotLight(16777215)).position.set(
            -100,
            100,
            100
        ),
        (spotLight.castShadow = !0),
        (spotLight.intensity = 1),
        (spotLight.penumbra = 0.9),
        (spotLight.castShadow = !0);
    var n, o;
    (spotLight.shadow.mapSize.width = 1024),
        (spotLight.shadow.mapSize.height = 1024),
        (spotLight.shadow.camera.near = 1),
        (spotLight.shadow.camera.far = 800),
        (spotLight.shadow.camera.left = -50),
        (spotLight.shadow.camera.right = 50),
        (spotLight.shadow.camera.top = 50),
        (spotLight.shadow.camera.bottom = -50),
        scene.add(spotLight),
        (n = assets.geometry.piano),
        assets.materials.piano,
        ((o = new THREE.Mesh(
            n,
            new THREE.MeshStandardMaterial({
                color: 5847073,
                metalness: 0.75,
                roughness: 0.005,
                side: THREE.DoubleSide,
                envMap: cubeCamera.renderTarget.texture,
                envMapIntensity: 0.15,
            })
        )).castShadow = !0),
        (o.receiveShadow = !0),
        scene.add(o),
        (white_material = new THREE.MeshStandardMaterial({
            color: 16777215,
            envMap: cubeCamera.renderTarget.texture,
            envMapIntensity: 0.5,
            metalness: 0.1,
            roughness: 0.1,
        })),
        (black_material = new THREE.MeshStandardMaterial({
            color: 2236962,
            envMap: cubeCamera.renderTarget.texture,
            envMapIntensity: 0.5,
            metalness: 1,
            roughness: 0.1,
        }));
    for (var t = 0, s = "w", r = 1, i = 1; i <= 7; i++)
        for (sound in ((r = 1), sounds))
            "w" == sounds[sound].color && "b" != s ? (t += 0.65) : (t += 0.325),
                loadSingleBuffer(i, r, sound, sounds[sound], {
                    x: t,
                    y: 0,
                    z: 0,
                }),
                (s = sounds[sound].color),
                "w" == sounds[sound].color && r++;
    createRecordBar();
    var d = new THREE.Mesh(
        new THREE.PlaneGeometry(600, 600, 128, 128),
        new THREE.MeshStandardMaterial({
            color: 11184810,
            roughness: 0.9,
            metalness: 0,
        })
    );
    (d.rotation.x = (-90 * Math.PI) / 180),
        (d.position.y = -17),
        (d.receiveShadow = !0),
        scene.add(d),
        render(time);
}
function createRecordBar() {
    var e = null,
        a = document.createElement("nav");
    a.classList.add("recordBar"), document.body.appendChild(a);
    var n = document.createElement("button");
    n.classList.add("play-button"),
        (n.innerHTML = "play"),
        n.addEventListener("click", function () {
            pianoNotes.ready &&
                (a.classList.contains("isPlaying")
                    ? (n.innerHTML = "play")
                    : (n.innerHTML = "pause"),
                a.classList.toggle("isPlaying"),
                document.body.classList.remove("paused"),
                pianoNotes.isPlaying
                    ? e.stopMusic()
                    : ((e =
                          0 != playBoard.length
                              ? new Player(playBoard, !0)
                              : new Player(musicData, !1)),
                      (pianoNotes.isPlaying = !0)));
        }),
        a.appendChild(n);
    var o = document.createElement("button");
    o.classList.add("record-button"),
        (o.innerHTML = "record"),
        o.addEventListener("click", function () {
            a.classList.toggle("recording"),
                (pianoNotes.recording = !pianoNotes.recording);
        }),
        a.appendChild(o),
        (pianoNotes.playButton = n),
        (pianoNotes.nav = a);
}
loader.load(basePath + "json/w_l.json", function (e, a) {
    assets.shapes.w_l = e;
}),
    loader.load(basePath + "json/w_r_l.json", function (e, a) {
        assets.shapes.w_r_l = e;
    }),
    loader.load(basePath + "json/w_r.json", function (e, a) {
        assets.shapes.w_r = e;
    }),
    loader.load(basePath + "json/b.json", function (e, a) {
        assets.shapes.b = e;
    }),
    loader.load(basePath + "json/piano.json", function (e) {
        assets.geometry.piano = e;
    }),
    (window.onresize = function () {
        (canvas_height = window.innerHeight),
            (canvas_width = window.innerWidth),
            (camera.aspect = canvas_width / canvas_height),
            camera.updateProjectionMatrix(),
            Adjust.resize(),
            renderer.setSize(canvas_width, canvas_height);
    });
var render = function (e) {
    requestAnimationFrame(render),
        controls.update(),
        Adjust.update(),
        cubeCamera.updateCubeMap(renderer, scene),
        renderer.render(scene, camera);
};
