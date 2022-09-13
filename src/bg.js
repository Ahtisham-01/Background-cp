import * as THREE from "three";
import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./App.css";

export const bg = () => {
    const WaveShaderMaterial = shaderMaterial(
        // Uniform
        {
          uFrequency: { value: new THREE.Vector2(3, 0) },
          uTime: 0,
          uColor: new THREE.Color(0.0, 0.0, 0.0),
          uTexture: new THREE.Texture(),
        },
        // Vertex Shader
        glsl`
          precision mediump float;
          uniform vec2 uFrequency;
          varying vec2 vUv;
          varying float vWave;
      
          uniform float uTime;
      
          #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
      
      
          void main() {
            vUv = uv;
      
            vec3 pos = position;
            float noiseFreq = 2.0;
            float noiseAmp = 0.4;
            vec3 noisePos = vec3(pos.x * noiseFreq - uTime, pos.y, pos.z)* 0.4;
            pos.z += snoise3(noisePos) * noiseAmp;
            vWave = pos.z;
          
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
          }
        `,
        // Fragment Shader
        glsl`
          precision mediump float;
      
          uniform vec3 uColor;
          uniform float uTime;
          uniform sampler2D uTexture;
      
          varying vec2 vUv;
          varying float vWave;
      
          void main() {
            float wave = vWave * 0.2;
            vec3 texture = texture2D(uTexture, vUv + wave).rgb;
            gl_FragColor = vec4(texture, 1.0); 
          }
        `
      );
      
      extend({ WaveShaderMaterial });
      
      const Wave = () => {
        const ref = useRef();
        useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));
      
        const [image] = useLoader(THREE.TextureLoader, [
          "https://tuk-cdn.s3.amazonaws.com/can-uploader/BG.png",
        ]);
      
        return (
          <mesh scale={[5.4,1.8,0]}>
            <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
            <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image} />
          </mesh>
        );
      };
      

  return (
    <Canvas camera={{ fov: 12, position: [0, 0, 5] }}>
    <Suspense fallback={null}>
      <Wave />
    </Suspense>
  </Canvas>
  )
}
export default bg
