import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const MovingStars = () => {
    const group = useRef();
    
    useFrame((state) => {
        if (!group.current) return;
        // Slowly rotate the stars based on time and mouse pointer displacement
        const t = state.clock.getElapsedTime();
        group.current.rotation.x = Math.sin(t / 20) / 10 + (state.pointer.y * 0.05);
        group.current.rotation.y = Math.cos(t / 20) / 10 + (state.pointer.x * 0.05);
    });

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

const FloatingOrbs = () => {
    return (
        <>
            {/* Purple glowing orb */}
            <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[-5, 2, -15]}>
                <Sphere args={[2, 32, 32]}>
                    <MeshDistortMaterial
                        color="#8b5cf6"
                        attach="material"
                        distort={0.4}
                        speed={1.5}
                        roughness={0.2}
                        metalness={0.8}
                        emissive="#4c1d95"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </Sphere>
            </Float>

            {/* Cyan glowing orb */}
            <Float speed={2} rotationIntensity={2} floatIntensity={1.5} position={[6, -2, -10]}>
                <Sphere args={[1.5, 32, 32]}>
                    <MeshDistortMaterial
                        color="#06b6d4"
                        attach="material"
                        distort={0.3}
                        speed={2}
                        roughness={0.1}
                        metalness={0.5}
                        emissive="#164e63"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </Sphere>
            </Float>
            
            {/* Indigo glowing orb */}
            <Float speed={1} rotationIntensity={1} floatIntensity={2.5} position={[-2, -4, -20]}>
                <Sphere args={[3, 32, 32]}>
                    <MeshDistortMaterial
                        color="#6366f1"
                        attach="material"
                        distort={0.5}
                        speed={1}
                        roughness={0.4}
                        metalness={0.6}
                        emissive="#312e81"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </Sphere>
            </Float>
        </>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-transparent opacity-30 dark:opacity-100 transition-opacity duration-500">
            {/* Base dark gradient layer so space isn't purely black */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 dark:from-blue-900/20 via-transparent to-transparent z-0"></div>
            
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    
                    <MovingStars />
                    <FloatingOrbs />
                </Canvas>
            </div>
            
            {/* Subtle noise grain for Glassmorphism realism */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10" style={{backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')"}}></div>
        </div>
    );
};

export default ThreeBackground;
