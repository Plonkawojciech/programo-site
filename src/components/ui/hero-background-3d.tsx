"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 2500 }) {
  const mesh = useRef<THREE.Points>(null);

  // Generate particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 400; // Płynny, spokojny ruch
      temp.push({ t, factor, speed });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    // Update particles
    const posAttr = mesh.current.geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      positions[i * 3] = (a * factor) + (Math.cos(t * 2) * factor) / 10;
      positions[i * 3 + 1] = (b * factor) + (Math.sin(t * 3) * factor) / 10;
      positions[i * 3 + 2] = (s * factor) + (Math.cos(t * 5) * factor) / 10;
    });

    posAttr.needsUpdate = true;
    mesh.current.rotation.y += 0.0005;
    mesh.current.rotation.x += 0.0002;
  });

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#A48650" /* Złoto/Mosiądz */
        transparent
        opacity={0.4} /* Znacznie lepsza widoczność na jasnym tle */
        sizeAttenuation
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function HeroBackground3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-surface overflow-hidden pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 120], fov: 75 }}
        dpr={[1, 1.5]} /* Ogranicza rozdzielczość canvas dla wyższej wydajności na urządzeniach Apple */
        performance={{ min: 0.5 }}
      >
        <fog attach="fog" args={["#FCFCFA", 50, 150]} /> /* Mgła w kolorze Alabaster */
        <Particles />
      </Canvas>
    </div>
  );
}
