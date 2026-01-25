'use client';
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line } from "@react-three/drei";

export default function PPIBridge() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Network structure demonstrating a bridge protein:
    // Node 0 is the bridge protein connecting two separate complexes
    // Nodes 1, 2, 3 form Complex A (well connected internally)
    // Nodes 4, 5, 6 form Complex B (well connected internally)
    // The two complexes are only connected through the bridge node

    const nodes: Record<number, { position: [number, number, number] }> = {
        0: { position: [0, 0, -20] },      // Bridge protein (center)
        // Complex A (left cluster)
        1: { position: [-8, 6, -20] },
        2: { position: [-10, 0, -20] },
        3: { position: [-8, -6, -20] },
        // Complex B (right cluster)
        4: { position: [8, 6, -20] },
        5: { position: [10, 0, -20] },
        6: { position: [8, -6, -20] },
    };

    const edges = [
        // Bridge connections to Complex A
        [0, 1], [0, 2], [0, 3],
        // Bridge connections to Complex B
        [0, 4], [0, 5], [0, 6],
        // Internal connections within Complex A
        [1, 2], [2, 3], [3, 1],
        // Internal connections within Complex B
        [4, 5], [5, 6], [6, 4],
    ];

    const bridgeNode = 0;
    const weakColor = isDarkMode ? '#666666' : '#cccccc';
    const color = isDarkMode ? 'white' : 'black';

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', top: '30px', left: '0px', color: color }}>
                Bridge Protein
            </div>
            <Canvas style={{ height: '300px' }}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[40, 40, 410]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-40, -40, -40]} decay={0} intensity={Math.PI} />

                {edges.map((edge) => {
                    const start = nodes[edge[0]].position;
                    const end = nodes[edge[1]].position;

                    return (
                        <Line
                            key={`edge-${edge[0]}-${edge[1]}`}
                            points={[start, end]}
                            color={color}
                            lineWidth={0.8}
                        />
                    );
                })}

                {Object.entries(nodes).map(([id, node]) => {
                    const nodeId = parseInt(id);
                    const isBridge = nodeId === bridgeNode;

                    return (
                        <mesh key={id} position={node.position}>
                            <sphereGeometry args={[isBridge ? 0.45 : 0.3, 16, 16]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    );
                })}
            </Canvas>
        </div>
    );
}
