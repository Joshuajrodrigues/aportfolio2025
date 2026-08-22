import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { navigate } from "astro:transitions/client";

export default function InteractiveBoard({ projects }) {
    const [positions, setPositions] = useState([]);
    const isDragging = useRef(false);

    useEffect(() => {
        const cardWidth = 160;
        const cardHeight = 220;
        const padding = 40;

        const newPositions = projects.map(() => {
            const maxX = Math.max(padding, window.innerWidth - cardWidth - padding);
            const maxY = Math.max(padding, window.innerHeight - cardHeight - padding);

            const randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
            const randomY = Math.floor(Math.random() * (maxY - padding)) + padding;
            const randomRotate = Math.floor(Math.random() * 40) - 20;

            return { x: randomX, y: randomY, rotate: randomRotate };
        });

        setPositions(newPositions);
    }, [projects]);

    const openProject = (project) => {
        if (isDragging.current) return;

        // Adjust this path to match your actual project routing structure
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
                    whileHover={{ scale: 1.05 }}
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
                    <div style={{
                        width: "160px",
                        height: "220px",
                        background: "#fff",
                        border: "2px solid #111",
                        boxShadow: "4px 4px 0px #111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                    }}>
                        {project.title}
                    </div>
                </motion.div>
            ))}
        </>
    );
}
