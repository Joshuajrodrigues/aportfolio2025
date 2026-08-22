import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { navigate } from "astro:transitions/client";

export default function InteractiveBoard({ projects }) {
    const [positions, setPositions] = useState([]);
    const isDragging = useRef(false);

    useEffect(() => {
            const cardWidth = 180;
            const estimatedMaxHeight = 260;
            const padding = 20;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Set how far away from the center text the cards should sit
            // We make it smaller on mobile so they don't get pushed off screen
            const baseRadius = window.innerWidth < 768 ? 160 : 380;

            const totalProjects = projects.length;

            const newPositions = projects.map((_, index) => {
                // 1. Calculate an even angle for each card (in radians)
                const angleSlice = (Math.PI * 2) / totalProjects;

                // Add a little randomness to the angle so it looks scattered
                const randomAngleOffset = (Math.random() * 0.5) - 0.25;
                const angle = (index * angleSlice) + randomAngleOffset;

                // 2. Add randomness to the distance from the center
                const radius = baseRadius + (Math.random() * 80);

                // 3. Convert the angle and radius into X and Y coordinates on the screen
                let x = centerX + (Math.cos(angle) * radius) - (cardWidth / 2);
                let y = centerY + (Math.sin(angle) * radius) - (estimatedMaxHeight / 2);

                // 4. Clamp the values to strictly ensure they never cross the edges of the viewport
                const maxX = window.innerWidth - cardWidth - padding;
                const maxY = window.innerHeight - estimatedMaxHeight - padding;

                x = Math.max(padding, Math.min(x, maxX));
                y = Math.max(padding, Math.min(y, maxY));

                const randomRotate = Math.floor(Math.random() * 40) - 20;

                return { x, y, rotate: randomRotate };
            });

            setPositions(newPositions);
        }, [projects]);

  const openProject = (project) => {
        if (isDragging.current) return;
        navigate(`/projects/${project.id}`);
    };

    if (positions.length === 0) return null;

    return (
        <>
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    drag
                    dragMomentum={false}
                    onDragStart={() => {
                        isDragging.current = true;
                    }}
                    onDragEnd={() => {
                        setTimeout(() => {
                            isDragging.current = false;
                        }, 150);
                    }}
                    whileHover={{ scale: 1.05, zIndex: 50 }}
                    whileTap={{ scale: 0.95, cursor: "grabbing" }}
                    onClick={() => openProject(project)}
                    initial={{
                        x: positions[index]?.x,
                        y: positions[index]?.y,
                        rotate: positions[index]?.rotate
                    }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        cursor: "grab",
                        zIndex: 20
                    }}
                >
                    {project.src ? (
                        <img
                            src={project.src}
                            alt={project.title}
                            draggable="false"
                            style={{
                                width: "320px",
                                height: "auto",
                                background: "#fff",
                                border: "2px solid #111",
                                boxShadow: "4px 4px 0px #111",
                                display: "block",
                                pointerEvents: "none",
                                userSelect: "none"
                            }}
                        />
                    ) : (
                        <div style={{
                            width: "360px",
                            height: "320px",
                            background: "#fff",
                            border: "2px solid #111",
                            boxShadow: "4px 4px 0px #111",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            padding: "16px",
                            textAlign: "center"
                        }}>
                            {project.title}
                        </div>
                    )}
                </motion.div>
            ))}
        </>
    );
}
