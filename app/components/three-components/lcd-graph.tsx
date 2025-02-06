'use client';
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, } from "@react-three/drei";

interface LCDGraphProps {
    local: Boolean;
}

export default function LCDGraph({ local = true }: LCDGraphProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches); // Set initial value based on user settings

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange); // Listen for changes

        return () => mediaQuery.removeEventListener('change', handleChange); // Cleanup
    }, []);




    const communityNodeIds = new Set<number>([16, 0, 4, 5, 6, 10]);

    var communities: Record<string, Set<number>>


    if (!local) {
        communities = {
            community1: new Set<number>([16, 0, 4, 5, 6, 10]),
            community2: new Set<number>([0, 11, 17, 19, 21]),
            community3: new Set<number>([0, 1, 3, 7, 12]),
        };
    } else {
        communities = {
            community1: new Set<number>([16, 0, 4, 5, 6, 10]),
        };
    }




    // Define dash patterns for each community
    const communityDashPatterns = {
        community1: [0.5, 0.3],  // Short dashes
        community2: [1, 0.3],  // Longer dashes
        community3: [0.1, 0.3], // Dotted line
    };



    function getSharedCommunity(start: number, end: number): string | null {
        // Loop through each community to check if both nodes are present
        for (const [communityName, nodes] of Object.entries(communities)) {
            if (nodes.has(start) && nodes.has(end)) {
                return communityName;  // Return the name of the shared community
            }
        }

        return null;  // No shared community found
    }

    function isInCommunity(nodeId: string): boolean {
        const node = parseInt(nodeId);  // Convert string to number

        if (isNaN(node)) return false;  // Return false if the input is not a valid number

        for (const nodes of Object.values(communities)) {
            if (nodes.has(node)) {
                return true;  // Node found in a community
            }
        }

        return false;  // Node not found in any community
    }


    const rawData = {
        0: [0.03684215, 0.00153656],
        1: [0.29243877, 0.39981037],
        3: [0.47859452, 0.36660082],
        4: [-0.34221492, 0.17850031],
        5: [-0.62044468, 0.03449326],
        6: [-0.54301113, -0.17063241],
        7: [0.2874089, 0.62277351],
        10: [-0.52044734, 0.37469401],
        11: [0.26629974, -0.35637579],
        12: [0.82816588, 0.40687098],
        16: [-1.0, -0.18568551],
        17: [0.61945342, -0.3627451],
        19: [-0.02489013, -0.64677952],
        21: [0.34180482, -0.66306151],
    };

    const SCALE_FACTOR = 20;

    const nodes = Object.entries(rawData).reduce((acc, [id, position]) => {
        acc[parseInt(id)] = {
            position: [
                position[0] * SCALE_FACTOR,  // Scale x-coordinate
                position[1] * SCALE_FACTOR,  // Scale y-coordinate
                -20,                         // z-coordinate
            ] as [number, number, number],
        };
        return acc;
    }, {} as Record<number, { position: [number, number, number] }>);

    const edges = [
        [0, 1], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 10], [0, 11], [0, 12], [0, 17], [0, 19], [0, 21],
        [1, 3], [1, 7],
        [3, 7], [3, 12],
        [4, 6], [4, 10],
        [5, 6], [5, 10], [5, 16],
        [6, 16],
        [11, 17], [11, 19],
        [17, 21], [19, 21]
    ];

    const color = isDarkMode ? 'white' : 'black';
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* Header positioned at the top right */}
            <div style={{ position: 'absolute', top: '30px', left: '0px', color: color }}>
                {local ? 'Local Community Detection' : 'Global Community Detection'}
            </div>
            <Canvas style={{ height: '300px' }}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[40, 40, 410]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-40, -40, -40]} decay={0} intensity={Math.PI} />
                {edges.map((edge, index) => {

                    const start = nodes[edge[0]].position;
                    const end = nodes[edge[1]].position;


                    const community = getSharedCommunity(edge[0], edge[1]);
                    const isSameCommunity = community !== null
                    return (
                        <Line
                            key={`edge-${edge[0]}-${edge[1]}`}
                            points={[
                                start,
                                end,
                            ]}
                            dashed={isSameCommunity}
                            dashSize={isSameCommunity ? communityDashPatterns[community!][0] : 0}
                            gapSize={isSameCommunity ? communityDashPatterns[community!][1] : 0}
                            color={color}
                            lineWidth={isSameCommunity ? 1 : 0.2}
                        />
                    )
                })}
                {Object.entries(nodes).map(([id, node]) => {

                    return (
                        <mesh key={id} position={node.position}>
                            <sphereGeometry args={[isInCommunity(id) ? 0.3 : 0.15, 16, 16]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    )
                })}

            </Canvas>
        </div>
    )
}