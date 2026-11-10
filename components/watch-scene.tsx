"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function AtelierWatch({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const hour = useRef<Group>(null);
  const minute = useRef<Group>(null);
  const second = useRef<Group>(null);
  const markers = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = reduced ? 0.4 : Math.sin(state.clock.elapsedTime * 0.35) * 0.55;
      group.current.rotation.x = -0.32;
    }
    const now = reduced ? new Date(2026, 0, 1, 10, 10, 0) : new Date();
    const seconds = now.getSeconds() + (reduced ? 0 : now.getMilliseconds() / 1000);
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;
    if (hour.current) hour.current.rotation.z = -(hours * Math.PI) / 6;
    if (minute.current) minute.current.rotation.z = -(minutes * Math.PI) / 30;
    if (second.current) second.current.rotation.z = -(seconds * Math.PI) / 30;
  });

  return (
    <group ref={group} scale={0.86} rotation={[-0.32, 0.4, 0]}>
      {[-1, 1].map((side) => (
        <group key={side}>
          {Array.from({ length: 4 }, (_, index) => (
            <mesh key={index} position={[0, side * (1.18 + index * 0.32), -0.02]}>
              <boxGeometry args={[0.84, 0.24, 0.12]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? "#d9d3c7" : "#8f8a82"}
                metalness={1}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.24, 64]} />
        <meshStandardMaterial color="#f3eee4" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <torusGeometry args={[0.98, 0.055, 16, 80]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.125]}>
        <circleGeometry args={[0.86, 64]} />
        <meshStandardMaterial color="#17130e" roughness={0.62} metalness={0.15} />
      </mesh>
      {markers.map((index) => {
        const angle = (index / 12) * Math.PI * 2;
        const major = index % 3 === 0;
        return (
          <mesh
            key={index}
            position={[Math.sin(angle) * 0.68, Math.cos(angle) * 0.68, 0.15]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[major ? 0.04 : 0.022, major ? 0.16 : 0.09, 0.02]} />
            <meshStandardMaterial
              color={major ? "#f0d78c" : "#f6f1e7"}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      <group ref={hour} position={[0, 0, 0.17]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.05, 0.42, 0.02]} />
          <meshStandardMaterial color="#f6f1e7" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.19]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.03, 0.62, 0.02]} />
          <meshStandardMaterial color="#f0d78c" metalness={0.8} roughness={0.22} />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.21]}>
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[0.012, 0.72, 0.015]} />
          <meshStandardMaterial color="#d4af37" metalness={0.45} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[1.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.09, 0.18, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function WatchScene() {
  const reduced = useReducedMotion() ?? false;

  return (
    <Canvas
      className="!absolute inset-0 !h-full !w-full"
      camera={{ position: [0, 0.15, 5.2], fov: 32 }}
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} color="#fff6df" />
      <directionalLight position={[-4, -1, 2]} intensity={0.45} color="#9eb0cc" />
      <AtelierWatch reduced={reduced} />
    </Canvas>
  );
}
