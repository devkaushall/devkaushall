import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function Emblem() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      const targetX = state.pointer.y * 0.25;
      const targetY = state.pointer.x * 0.4 + t * 0.15;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    }
    if (inner.current) {
      inner.current.rotation.x = t * 0.5;
      inner.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={group}>
      {/* Crystal outer shell */}
      <mesh>
        <octahedronGeometry args={[1.6, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.6}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          roughness={0.05}
          ior={1.4}
          color="#e9f1ff"
        />
      </mesh>
      {/* Gold core */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#d4a43a" metalness={1} roughness={0.15} emissive="#8a5f12" emissiveIntensity={0.4} />
      </mesh>
      {/* Wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.OctahedronGeometry(1.62, 0)]} />
        <lineBasicMaterial color="#f3d589" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

function Rings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (r1.current) {
      r1.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1;
      r1.current.rotation.z = t * 0.25;
    }
    if (r2.current) {
      r2.current.rotation.x = Math.PI / 1.8;
      r2.current.rotation.y = t * 0.2;
    }
    if (r3.current) {
      r3.current.rotation.x = -Math.PI / 3;
      r3.current.rotation.z = -t * 0.18;
    }
  });
  const mat = (
    <meshStandardMaterial color="#e6bd5c" metalness={1} roughness={0.2} emissive="#6b4a0c" emissiveIntensity={0.3} />
  );
  return (
    <group>
      <mesh ref={r1}>
        <torusGeometry args={[2.4, 0.025, 16, 128]} />
        {mat}
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.9, 0.018, 16, 128]} />
        {mat}
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[3.4, 0.012, 16, 128]} />
        {mat}
      </mesh>
    </group>
  );
}

function Orbiters() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 2.4 + (i % 3) * 0.5,
        speed: 0.3 + (i % 4) * 0.08,
        y: ((i % 3) - 1) * 0.4,
        scale: 0.08 + (i % 3) * 0.04,
      })),
    []
  );
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current?.children.forEach((child, i) => {
      const it = items[i];
      const a = it.angle + t * it.speed;
      child.position.set(Math.cos(a) * it.radius, it.y + Math.sin(t + i) * 0.2, Math.sin(a) * it.radius);
      child.rotation.x = t * 0.8;
      child.rotation.y = t * 0.6;
    });
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} scale={it.scale}>
          {i % 2 === 0 ? <boxGeometry args={[1, 1, 1]} /> : <dodecahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial color={i % 2 === 0 ? "#f3d589" : "#9bb7ff"} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <spotLight position={[6, 8, 6]} intensity={60} angle={0.4} penumbra={1} color="#fff2d0" />
        <pointLight position={[-6, -4, -4]} intensity={30} color="#5b7dff" />
        <pointLight position={[0, -5, 3]} intensity={15} color="#d4a43a" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
          <Emblem />
          <Rings />
        </Float>
        <Orbiters />
        <Sparkles count={120} scale={[12, 8, 6]} size={2} speed={0.4} color="#f3d589" opacity={0.6} />
        <ContactShadows position={[0, -3.2, 0]} opacity={0.4} scale={12} blur={2.5} far={4} color="#000" />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
