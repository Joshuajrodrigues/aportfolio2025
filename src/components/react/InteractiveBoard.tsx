import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { navigate } from "astro:transitions/client";

export default function InteractiveBoard({ projects }) {
    const [positions, setPositions] = useState([]);
    const isDragging = useRef(false);

    useEffect(() => {
        // 1. Check if we already have positions saved in this browser session
        const savedPositions = sessionStorage.getItem("boardLayout");

        if (savedPositions) {
            setPositions(JSON.parse(savedPositions));
            return; // Stop here so we don't recalculate
        }

        // 2. Otherwise, calculate the radial positions
        const cardWidth = 180;
        const estimatedMaxHeight = 260;
        const padding = 20;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const baseRadius = window.innerWidth < 768 ? 160 : 380;

        const totalProjects = projects.length;

        const newPositions = projects.map((_, index) => {
            const angleSlice = (Math.PI * 2) / totalProjects;
            const randomAngleOffset = (Math.random() * 0.5) - 0.25;
            const angle = (index * angleSlice) + randomAngleOffset;

            const radius = baseRadius + (Math.random() * 80);

            let x = centerX + (Math.cos(angle) * radius) - (cardWidth / 2);
            let y = centerY + (Math.sin(angle) * radius) - (estimatedMaxHeight / 2);

            const maxX = window.innerWidth - cardWidth - padding;
            const maxY = window.innerHeight - estimatedMaxHeight - padding;

            x = Math.max(padding, Math.min(x, maxX));
            y = Math.max(padding, Math.min(y, maxY));

            const randomRotate = Math.floor(Math.random() * 40) - 20;

            return { x, y, rotate: randomRotate };
        });

        // Save the new calculation to session storage
        sessionStorage.setItem("boardLayout", JSON.stringify(newPositions));
        setPositions(newPositions);
    }, [projects]);

    const openProject = (project) => {
        if (isDragging.current) return;
        navigate(`/projects/${project.id}`);
    };

    // 3. Save the new position when the user drops a card
    const handleDragEnd = (index, info) => {
        setTimeout(() => {
            isDragging.current = false;
        }, 150);

        setPositions((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                x: updated[index].x + info.offset.x,
                y: updated[index].y + info.offset.y,
            };
            sessionStorage.setItem("boardLayout", JSON.stringify(updated));
            return updated;
        });
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
                    onDragEnd={(event, info) => handleDragEnd(index, info)}
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
                                width: "180px",
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
                            width: "160px",
                            height: "220px",
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
