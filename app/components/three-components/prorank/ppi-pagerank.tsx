'use client';
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, Text } from "@react-three/drei";

export default function PPIPagerank() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Network demonstrating PageRank:
    // Node sizes represent PageRank scores (importance)
    // Central, well-connected nodes have higher PageRank
    // Peripheral nodes have lower PageRank

    interface NodeData {
        position: [number, number, number];
        pagerank: number;
    }

    const nodes: Record<number, NodeData> = {
        0: { position: [0, 0, -20], pagerank: 0.25 },      // Highest - central hub
        1: { position: [-6, 6, -20], pagerank: 0.15 },     // High - well connected
        2: { position: [6, 6, -20], pagerank: 0.15 },      // High - well connected
        3: { position: [-8, -2, -20], pagerank: 0.12 },    // Medium
        4: { position: [8, -2, -20], pagerank: 0.12 },     // Medium
        5: { position: [-4, -6, -20], pagerank: 0.08 },    // Lower
        6: { position: [4, -6, -20], pagerank: 0.08 },     // Lower
        7: { position: [0, 8, -20], pagerank: 0.05 },      // Lowest - peripheral
    };

    const edges = [
        // Central node connections
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
        // Secondary connections
        [1, 2], [1, 3], [1, 7],
        [2, 4], [2, 7],
        [3, 5],
        [4, 6],
        [5, 6],
    ];

    const color = isDarkMode ? 'white' : 'black';

    // Scale node size based on PageRank score
    const getNodeSize = (pagerank: number): number => {
        return 0.15 + (pagerank * 5); // Scale from 0.15 to ~1.4 for even greater visibility
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', top: '30px', left: '0px', color: color }}>
                Protein Ranking<br />Node size = PageRank score
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
                    const nodeSize = getNodeSize(node.pagerank);

                    return (
                        <mesh key={id} position={node.position}>
                            <sphereGeometry args={[nodeSize, 16, 16]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    );
                })}
            </Canvas>
        </div>
    );
}
