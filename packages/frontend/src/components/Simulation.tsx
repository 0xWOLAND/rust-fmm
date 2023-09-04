import { useContext, useState, useEffect, useRef } from "react";
import { WASMContext } from "../context/wasm";
import { fragmentShaderSrc, vertexShaderSrc } from "@/webgl/shaders";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import React from "react";

const initShader = (
  gl: any,
  type: "VERTEX_SHADER" | "FRAGMENT_SHADER",
  source: string
) => {
  const shader = gl.createShader(gl[type]);

  if (!shader) {
    throw new Error("Unable to create a shader.");
  }

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
  }

  return shader;
};

export const RustFFM = () => {
  const ctx = useContext(WASMContext);
  const wasm = ctx.wasm!;
  if (!wasm) return <></>;

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    let clock = new THREE.Clock();

    const fov = 75;
    const aspect = canvas.height / canvas.width; // the canvas default
    const near = 0.1;
    const far = 5;
    const astronomical_unit = wasm.get_scale_length();
    // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    let camera = new THREE.PerspectiveCamera(
      35,
      aspect,
      0.01 * astronomical_unit,
      10000 * astronomical_unit
    );
    camera.position.set(astronomical_unit, 0, astronomical_unit);
    camera.position.z = 2;

    const N = 10000;
    const ffm = new wasm.CosmoSim(
      N,
      10 * astronomical_unit,
      N * 1e24,
      canvas.width,
      canvas.height
    );

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const particleGeometry = new THREE.BufferGeometry();
    let velocities = ffm.get_velocity();
    let positions = ffm.get_position();
    let mass = new Float32Array(1 * N);
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 3)
    );
    particleGeometry.setAttribute("mass", new THREE.BufferAttribute(mass, 1));

    const particleShader = new THREE.ShaderMaterial({
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc,
      uniforms: {},
    });

    scene.add(camera);
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.noPan = false;
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    const particleSystem = new THREE.Points(particleGeometry, particleShader);
    scene.add(particleSystem);

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function render() {
      renderer.render(scene, camera);
      var seconds = clock.getDelta();
      if (seconds > 1) {
        seconds = 1;
      }
      const timestep = seconds * 60 * 60 * 24 * 15;

      ffm.simulate(timestep);
      positions = ffm.get_position();
      velocities = ffm.get_velocity();
      // TODO do gpu based update
      particleGeometry.attributes.position.array = positions;
      particleGeometry.attributes.velocity.array = velocities;
      particleGeometry.attributes.position.needsUpdate = true;

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold">rust-ffm</h1>
      <canvas width="600" height="600" ref={canvasRef} />
    </div>
  );
};
