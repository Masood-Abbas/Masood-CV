import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type PointerPosition = { x: number; y: number };
type SceneProps = { pointer: React.MutableRefObject<PointerPosition>; reduceMotion: boolean };

const PALETTE = {
  cyan: "#23e7d3",
  blue: "#38bdf8",
  mint: "#83fff1",
  violet: "#9d7cff",
  deep: "#061713",
};

const damp = (current: number, target: number, speed: number, delta: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));

const CoreStructure = ({ pointer, reduceMotion }: SceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const group = groupRef.current;
    const inner = innerRef.current;
    if (!group || !inner) return;

    const motionScale = reduceMotion ? 0.15 : 1;
    group.rotation.x = damp(group.rotation.x, pointer.current.y * 0.2 * motionScale, 3, delta);
    group.rotation.y = damp(
      group.rotation.y,
      pointer.current.x * 0.28 * motionScale + state.clock.elapsedTime * 0.06 * motionScale,
      3,
      delta,
    );
    group.position.x = damp(group.position.x, pointer.current.x * 0.22 * motionScale, 2.5, delta);
    group.position.y = damp(group.position.y, pointer.current.y * 0.14 * motionScale, 2.5, delta);
    inner.rotation.x += delta * 0.08 * motionScale;
    inner.rotation.z -= delta * 0.11 * motionScale;
  });

  return (
    <group ref={groupRef}>
      <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={0.12} floatIntensity={0.22}>
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.42, 2]} />
          <meshStandardMaterial
            color={PALETTE.deep}
            emissive={PALETTE.cyan}
            emissiveIntensity={0.12}
            metalness={0.82}
            roughness={0.18}
            transparent
            opacity={0.46}
          />
        </mesh>
        <mesh scale={1.035}>
          <icosahedronGeometry args={[1.42, 2]} />
          <meshBasicMaterial
            color={PALETTE.cyan}
            wireframe
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.8, 0.3, 0]}>
          <torusGeometry args={[2.05, 0.016, 8, 128]} />
          <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0.34} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[1.1, -0.48, 0.4]}>
          <torusGeometry args={[1.78, 0.011, 8, 128]} />
          <meshBasicMaterial color={PALETTE.blue} transparent opacity={0.24} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0.25, 1.18, 0.8]}>
          <torusGeometry args={[2.32, 0.008, 8, 128]} />
          <meshBasicMaterial color={PALETTE.violet} transparent opacity={0.14} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[1.54, 0.92, 0.58]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color={PALETTE.mint} />
        </mesh>
        <pointLight position={[1.3, 0.6, 1.8]} color={PALETTE.cyan} intensity={2.2} distance={7} />
      </Float>
    </group>
  );
};

const FloatingShard = ({
  position,
  scale,
  rotation,
  color,
  speed,
  reduceMotion,
}: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
  speed: number;
  reduceMotion: boolean;
}) => {
  const shardRef = useRef<THREE.Mesh>(null);

  useFrame((_, rawDelta) => {
    const shard = shardRef.current;
    if (!shard || reduceMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    shard.rotation.y += delta * speed;
    shard.rotation.x -= delta * speed * 0.35;
  });

  return (
    <Float speed={reduceMotion ? 0 : speed} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh ref={shardRef} position={position} scale={scale} rotation={rotation}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.22}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
};

const ParticleField = ({ pointer, reduceMotion }: SceneProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particlesCount = 130;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    let seed = 1487;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (random() - 0.5) * 13;
      pos[i * 3 + 1] = (random() - 0.5) * 9;
      pos[i * 3 + 2] = (random() - 0.5) * 7;
    }
    return pos;
  }, []);

  useFrame((state, rawDelta) => {
    const particles = particlesRef.current;
    if (!particles) return;
    const delta = Math.min(rawDelta, 0.05);
    const motionScale = reduceMotion ? 0.1 : 1;
    particles.rotation.x = damp(particles.rotation.x, pointer.current.y * 0.045 * motionScale, 2, delta);
    particles.rotation.y = damp(
      particles.rotation.y,
      pointer.current.x * 0.07 * motionScale + state.clock.elapsedTime * 0.012 * motionScale,
      2,
      delta,
    );
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={PALETTE.mint}
        transparent
        opacity={0.58}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Scene = ({ pointer, reduceMotion }: SceneProps) => {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={[PALETTE.blue, PALETTE.deep, 0.75]} />
      <directionalLight position={[4, 5, 5]} intensity={1.25} color={PALETTE.mint} />
      <pointLight position={[-4, -2, 2]} intensity={1.3} color={PALETTE.violet} distance={10} />
      <CoreStructure pointer={pointer} reduceMotion={reduceMotion} />
      <FloatingShard position={[-3.5, 1.9, -1.4]} scale={0.62} rotation={[0.2, 0.3, 0.5]} color={PALETTE.blue} speed={0.22} reduceMotion={reduceMotion} />
      <FloatingShard position={[3.65, -1.65, -1.8]} scale={0.5} rotation={[0.4, 0.8, 0.2]} color={PALETTE.violet} speed={-0.18} reduceMotion={reduceMotion} />
      <ParticleField pointer={pointer} reduceMotion={reduceMotion} />
    </>
  );
};

const Interactive3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "180px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  const resetPointer = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 opacity-70"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointer}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6.7], fov: 52 }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene pointer={pointerRef} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
};

export default Interactive3DBackground;
