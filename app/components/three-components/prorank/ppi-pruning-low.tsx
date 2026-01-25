'use client';
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line } from "@react-three/drei";

export default function PPIPruningLow() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Network structure:
    // Node 0 and Node 1 are the focus nodes (proteins being compared)
    // They share only 1 neighbor (node 2) - indicating low similarity
    // Node 0 has unique neighbors: 3, 4, 5
    // Node 1 has unique neighbors: 6, 7, 8

    const nodes: Record<number, { position: [number, number, number] }> = {
        0: { position: [-8, 0, -20] },   // Focus protein A
        1: { position: [8, 0, -20] },    // Focus protein B
        2: { position: [0, 8, -20] },    // Shared neighbor
        3: { position: [-12, 6, -20] },  // Unique to node 0
        4: { position: [-14, -2, -20] }, // Unique to node 0
        5: { position: [-8, -6, -20] },  // Unique to node 0
        6: { position: [12, 6, -20] },   // Unique to node 1
        7: { position: [14, -2, -20] },  // Unique to node 1
        8: { position: [8, -6, -20] },   // Unique to node 1
    };

    const edges = [
        // Focus edge (would be pruned - low shared neighbors)
        [0, 1],
        // Node 0 connections
        [0, 2], [0, 3], [0, 4], [0, 5],
        // Node 1 connections
        [1, 2], [1, 6], [1, 7], [1, 8],
    ];

    const color = isDarkMode ? 'white' : 'black';
    const weakColor = isDarkMode ? '#666666' : '#cccccc';

    return (
        <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
            <div style={{ position: 'absolute', top: '10px', left: '0px', color: color }}>
                Low Scoring Pair
            </div>
            <Canvas style={{ height: '300px', display: 'block' }}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[40, 40, 410]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-40, -40, -40]} decay={0} intensity={Math.PI} />

                {edges.map((edge) => {
                    const start = nodes[edge[0]].position;
                    const end = nodes[edge[1]].position;
                    const isWeakLink = (edge[0] === 0 && edge[1] === 1) || (edge[0] === 1 && edge[1] === 0);

                    return (
                        <Line
                            key={`edge-${edge[0]}-${edge[1]}`}
                            points={[start, end]}
                            color={isWeakLink ? weakColor : color}
                            lineWidth={isWeakLink ? 0.5 : 0.8}
                        />
                    );
                })}

                {Object.entries(nodes).map(([id, node]) => {
                    const nodeId = parseInt(id);
                    const isFocusNode = nodeId === 0 || nodeId === 1;

                    return (
                        <mesh key={id} position={node.position}>
                            <sphereGeometry args={[isFocusNode ? 0.45 : 0.3, 16, 16]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    );
                })}
            </Canvas>
        </div>
    );
}
