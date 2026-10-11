import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Crest() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 0.28;
    g.current.rotation.x = THREE.MathUtils.lerp(
      g.current.rotation.x,
      -state.pointer.y * 0.3,
      0.05
    );
    g.current.rotation.z = THREE.MathUtils.lerp(
      g.current.rotation.z,
      state.pointer.x * 0.2,
      0.05
    );
  });
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
      <group ref={g}>
        <mesh>
          <torusGeometry args={[1.5, 0.05, 24, 180]} />
          <meshStandardMaterial
            color="#e0b666"
            metalness={0.95}
            roughness={0.25}
            emissive="#3a2a10"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <torusGeometry args={[1.12, 0.022, 16, 160]} />
          <meshStandardMaterial
            color="#f0d18a"
            metalness={0.95}
            roughness={0.3}
            emissive="#3a2a10"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh>
          <dodecahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color="#15151a"
            metalness={0.85}
            roughness={0.3}
            flatShading
          />
        </mesh>
        <mesh>
          <dodecahedronGeometry args={[0.64, 0]} />
          <meshBasicMaterial color="#e0b666" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#ffd9a0"
            emissive="#ffae4a"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function CrestScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 3]} intensity={60} color="#ffd9a0" />
      <pointLight position={[-4, -3, -2]} intensity={30} color="#5d7ea6" />
      <Crest />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.4} luminanceSmoothing={0.2} />
      </EffectComposer>
    </Canvas>
  );
}
