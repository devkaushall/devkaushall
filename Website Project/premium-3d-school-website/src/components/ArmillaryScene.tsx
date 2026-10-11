import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const GOLD = "#e0b666";
const GOLD_LIGHT = "#f3d493";

function GoldMaterial({ roughness = 0.24 }: { roughness?: number }) {
  return (
    <meshStandardMaterial
      color={GOLD}
      metalness={0.95}
      roughness={roughness}
      emissive="#3a2a10"
      emissiveIntensity={0.35}
    />
  );
}

interface RingProps {
  radius: number;
  tube: number;
  tilt: [number, number, number];
  spinSpeed: number;
  satellites?: number;
}

function Ring({ radius, tube, tilt, spinSpeed, satellites = 1 }: RingProps) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.z += delta * spinSpeed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, tube, 24, 220]} />
        <GoldMaterial />
      </mesh>
      <group ref={spin}>
        {Array.from({ length: satellites }).map((_, i) => {
          const a = (i / satellites) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[tube * 2.6, 16, 16]} />
              <meshStandardMaterial
                color={GOLD_LIGHT}
                emissive="#ffb35c"
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function CoreOrb() {
  const glow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glow.current) {
      const m = glow.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2.6 + Math.sin(clock.elapsedTime * 1.6) * 1.1;
      glow.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.6) * 0.04);
    }
  });
  return (
    <group>
      {/* obsidian globe */}
      <mesh>
        <sphereGeometry args={[0.58, 48, 48]} />
        <meshStandardMaterial color="#101014" metalness={0.85} roughness={0.32} />
      </mesh>
      {/* latitudinal wireframe */}
      <mesh>
        <sphereGeometry args={[0.6, 22, 22]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.16} />
      </mesh>
      {/* inner star */}
      <mesh ref={glow}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color="#ffd9a0"
          emissive="#ffae4a"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Armillary() {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    g.rotation.y += delta * 0.1;
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.22, 0.045);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, px * 0.12, 0.045);
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.045;
      shell.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.75}>
      <group ref={root}>
        <CoreOrb />
        <Ring radius={1.05} tube={0.02} tilt={[Math.PI / 2.15, 0, 0]} spinSpeed={0.6} satellites={2} />
        <Ring radius={1.42} tube={0.024} tilt={[Math.PI / 1.6, 0.5, 0]} spinSpeed={-0.42} satellites={3} />
        <Ring radius={1.8} tube={0.028} tilt={[Math.PI / 2.6, -0.45, 0.2]} spinSpeed={0.3} satellites={2} />
        <Ring radius={2.25} tube={0.012} tilt={[Math.PI / 1.9, 0.2, -0.15]} spinSpeed={-0.22} satellites={4} />
        {/* faint structural shell */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[3.1, 1]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ArmillaryScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.35, 7.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.22} />
      <pointLight position={[6, 5, 4]} intensity={90} color="#ffd9a0" />
      <pointLight position={[-6, -2, -4]} intensity={55} color="#5d7ea6" />
      <pointLight position={[0, -5, 5]} intensity={34} color="#e0b666" />
      <pointLight position={[0, 0, 0]} intensity={18} color="#ffb35c" />

      <Armillary />

      <Sparkles
        count={230}
        scale={[15, 9.5, 15]}
        size={2.1}
        speed={0.32}
        opacity={0.5}
        color="#d8b46a"
      />

      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={0.85}
          luminanceThreshold={0.34}
          luminanceSmoothing={0.22}
        />
        <Vignette offset={0.22} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  );
}
