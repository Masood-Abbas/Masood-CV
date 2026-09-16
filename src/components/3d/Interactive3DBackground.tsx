import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus, Octahedron } from "@react-three/drei";
import * as THREE from "three";

const InteractiveSphere = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && mouse.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.5 + state.clock.elapsedTime * 0.1,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.x * 0.5 + state.clock.elapsedTime * 0.15,
        0.05
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} args={[1.5, 4]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#14b8a6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </Icosahedron>
    </Float>
  );
};

const FloatingRing = ({ mouse, position, scale }: { mouse: React.MutableRefObject<{ x: number; y: number }>; position: [number, number, number]; scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && mouse.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.current.y * 0.3 + state.clock.elapsedTime * 0.2,
        0.03
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.x * 0.3 + state.clock.elapsedTime * 0.1,
        0.03
      );
    }
  });

  return (
    <Torus ref={meshRef} args={[1, 0.1, 16, 50]} position={position} scale={scale}>
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} metalness={0.8} roughness={0.2} />
    </Torus>
  );
};

const FloatingOctahedron = ({ mouse, position, scale }: { mouse: React.MutableRefObject<{ x: number; y: number }>; position: [number, number, number]; scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && mouse.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.4 + state.clock.elapsedTime * 0.15,
        0.04
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.current.x * 0.4 + state.clock.elapsedTime * 0.1,
        0.04
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Octahedron ref={meshRef} args={[0.8]} position={position} scale={scale}>
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.5} metalness={0.7} roughness={0.3} />
      </Octahedron>
    </Float>
  );
};

const Particles = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const particlesCount = 150;

  // Store resting positions so particles always drift back home.
  const basePositions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current || !mouse.current) return;

    // Slow parallax rotation of the whole star field following the cursor.
    particlesRef.current.rotation.x = THREE.MathUtils.lerp(
      particlesRef.current.rotation.x,
      mouse.current.y * 0.1,
      0.02
    );
    particlesRef.current.rotation.y = THREE.MathUtils.lerp(
      particlesRef.current.rotation.y,
      mouse.current.x * 0.1 + state.clock.elapsedTime * 0.02,
      0.02
    );

    // Per-particle repulsion: dots near the cursor get pushed away,
    // then ease back to their resting spot.
    const geometry = geometryRef.current;
    if (!geometry) return;
    const positions = geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    // Approximate cursor position in world space (camera sits at z = 6, fov 60).
    const mouseWorldX = mouse.current.x * 4.5;
    const mouseWorldY = mouse.current.y * 3.2;
    const radius = 2.2;
    const radiusSq = radius * radius;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      // Gentle idle wobble so the field always feels alive.
      const wobX = Math.sin(time * 0.5 + i) * 0.08;
      const wobY = Math.cos(time * 0.4 + i * 0.7) * 0.08;

      const dx = bx + wobX - mouseWorldX;
      const dy = by + wobY - mouseWorldY;
      const distSq = dx * dx + dy * dy;

      if (distSq < radiusSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const push = ((radius - dist) / radius) * 1.4;
        positions[i3] = THREE.MathUtils.lerp(
          positions[i3],
          bx + (dx / dist) * push + wobX,
          0.12
        );
        positions[i3 + 1] = THREE.MathUtils.lerp(
          positions[i3 + 1],
          by + (dy / dist) * push + wobY,
          0.12
        );
      } else {
        positions[i3] = THREE.MathUtils.lerp(positions[i3], bx + wobX, 0.04);
        positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], by + wobY, 0.04);
      }
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], bz, 0.04);
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={basePositions.slice()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#14b8a6" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
};

const Scene = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#14b8a6" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#8b5cf6" />

      <InteractiveSphere mouse={mouse} />
      <FloatingRing mouse={mouse} position={[-3, 1, -2]} scale={0.8} />
      <FloatingRing mouse={mouse} position={[3, -1, -3]} scale={0.6} />
      <FloatingOctahedron mouse={mouse} position={[2.5, 2, -1]} scale={0.7} />
      <FloatingOctahedron mouse={mouse} position={[-2.5, -1.5, -2]} scale={0.5} />
      <Particles mouse={mouse} />
    </>
  );
};

const Interactive3DBackground = () => {
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track the cursor on the window (not the background element), because the
  // background sits behind the page content and never receives hover events.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene mouse={mouseRef} />
      </Canvas>
    </div>
  );
};

export default Interactive3DBackground;
