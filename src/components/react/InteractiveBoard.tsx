import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { navigate } from "astro:transitions/client";

const ARC_SLOTS = [
    { xPct: 0.12, yPct: 0.35, rotate: -12 },
    { xPct: 0.22, yPct: 0.14, rotate: 6 },
    { xPct: 0.50, yPct: 0.10, rotate: -4 },
    { xPct: 0.74, yPct: 0.16, rotate: 8 },
    { xPct: 0.82, yPct: 0.42, rotate: -8 },
    { xPct: 0.72, yPct: 0.70, rotate: 12 },
];

export default function InteractiveBoard({ projects, siteTitle }: { projects: any[]; siteTitle: string }) {
    const [mode, setMode] = useState<"canvas" | "grid">("canvas");
    const [positions, setPositions] = useState<any[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [cursorMode, setCursorMode] = useState<"idle" | "hover" | "dragging">("idle");
    const isDragging = useRef(false);

    // Follower spring
    const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
    const cursorX = useSpring(-100, springConfig);
    const cursorY = useSpring(-100, springConfig);

    // Detect mobile viewport and default to grid mode
    useEffect(() => {
        if (window.innerWidth < 768) {
            setMode("grid");
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [cursorX, cursorY]);

    useEffect(() => {
        const maxCardDim = 250;
        const padding = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const newPositions = projects.map((_, index) => {
            const slot = ARC_SLOTS[index % ARC_SLOTS.length];
            const jitterX = Math.random() * 40 - 20;
            const jitterY = Math.random() * 40 - 20;
            const jitterRotate = Math.random() * 10 - 5;

            let x = viewportWidth * slot.xPct - maxCardDim / 2 + jitterX;
            let y = viewportHeight * slot.yPct - maxCardDim / 2 + jitterY;

            const maxX = viewportWidth - maxCardDim - padding;
            const maxY = viewportHeight - maxCardDim - padding;

            return {
                x: Math.max(padding, Math.min(x, maxX)),
                y: Math.max(padding, Math.min(y, maxY)),
                rotate: slot.rotate + jitterRotate,
            };
        });

        setPositions(newPositions);

        const imagePromises = projects
            .filter((p) => p.src)
            .map((p) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = p.src;
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            });

        Promise.all(imagePromises).then(() => {
            setIsReady(true);
        });
    }, [projects]);

    const openProject = (project: any) => {
        if (isDragging.current) return;
        navigate(`/projects/${project.id}`);
    };

    const handleDragStart = () => {
        isDragging.current = true;
        setCursorMode("dragging");
    };

    const handleDragEnd = (index: number, info: any) => {
        setTimeout(() => {
            isDragging.current = false;
            setCursorMode("hover");
        }, 150);

        setPositions((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                x: updated[index].x + info.offset.x,
                y: updated[index].y + info.offset.y,
            };
            return updated;
        });
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100svh", overflow: "hidden" }}>
            {/* Custom Mouse Follower (Active in canvas mode) */}
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    pointerEvents: "none",
                    zIndex: 1000,
                }}
            >
                <AnimatePresence>
                    {mode === "canvas" && cursorMode !== "idle" && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            style={{
                                background: "#000",
                                color: "#fff",
                                padding: "6px 12px",
                                borderRadius: "9999px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                border: "1.5px solid #fff",
                                boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <span style={{ color: cursorMode === "dragging" ? "#fff" : "#777" }}>
                                Drag
                            </span>
                            <span style={{ color: "#444" }}>•</span>
                            <span style={{ color: cursorMode === "dragging" ? "#777" : "#fff" }}>
                                Open ↗
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Gliding Intro Text Header */}
            <motion.div
                layout
                initial={false}
                animate={
                    mode === "canvas"
                        ? {
                              top: "50%",
                              left: "50%",
                              x: "-50%",
                              y: "-50%",
                          }
                        : {
                              top: "40px",
                              left: "50px",
                              x: "0%",
                              y: "0%",
                          }
                }
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                style={{
                    position: "absolute",
                    textAlign: mode === "canvas" ? "center" : "left",
                    pointerEvents: "none",
                    zIndex: 30,
                    userSelect: "none",
                }}
            >
                <h2
                    style={{
                        fontFamily: '"Pixelify Sans", sans-serif',
                        fontSize: mode === "canvas" ? "3.5rem" : "2.4rem",
                        margin: 0,
                        transition: "font-size 0.3s ease",
                        textShadow:
                            "2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff",
                    }}
                >
                    <span style={{ position: "relative", display: "inline-block" }}>
                        Hello,
                        <img
                            src="/site-icons/mouse.svg"
                            alt=""
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "-60px",
                                left: "80%",

                                pointerEvents: "none",
                            }}
                        />
                    </span>
                    <br />
                    I'm {siteTitle}
                </h2>
                <p style={{ fontSize: "1.05rem", margin: "8px 0 0 0", color: "#333" }}>
                    UIUX / Product Designer | 5 years
                </p>
            </motion.div>

            {/* Mode 1: Interactive Canvas */}
            <AnimatePresence>
                {mode === "canvas" && isReady && positions.length > 0 && (
                    <motion.div key="canvas-container">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                drag
                                dragMomentum={false}
                                onDragStart={handleDragStart}
                                onDragEnd={(event, info) => handleDragEnd(index, info)}
                                onClick={() => openProject(project)}
                                onMouseEnter={() => {
                                    if (!isDragging.current) setCursorMode("hover");
                                }}
                                onMouseLeave={() => {
                                    if (!isDragging.current) setCursorMode("idle");
                                }}
                                initial={{
                                    opacity: 0,
                                    scale: 0.6,
                                    x: window.innerWidth / 2 - 125,
                                    y: window.innerHeight / 2 - 125,
                                    rotate: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: positions[index]?.x,
                                    y: positions[index]?.y,
                                    rotate: positions[index]?.rotate,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.4,
                                    x: window.innerWidth / 2 - 125,
                                    y: window.innerHeight / 2 - 125,
                                    rotate: 0,
                                    transition: { duration: 0.35, ease: "easeInOut" },
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 14,
                                    delay: index * 0.08,
                                }}
                                whileHover={{ scale: 1.05, zIndex: 50 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    cursor: "none",
                                    zIndex: 20,
                                }}
                            >
                                {project.src ? (
                                    <img
                                        src={project.src}
                                        alt={project.title}
                                        draggable="false"
                                        style={{
                                            maxWidth: "250px",
                                            maxHeight: "250px",
                                            width: "auto",
                                            height: "auto",
                                            objectFit: "contain",
                                            background: "#fff",
                                            border: "2px solid #111",
                                            boxShadow: "4px 4px 0px #111",
                                            display: "block",
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "240px",
                                            maxWidth: "250px",
                                            maxHeight: "250px",
                                            background: "#fff",
                                            border: "2px solid #111",
                                            boxShadow: "4px 4px 0px #111",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            padding: "16px",
                                            textAlign: "center",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {project.title}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode 2: Card Grid Layout */}
            <AnimatePresence>
                {mode === "grid" && (
                    <motion.div
                        key="grid-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            overflowY: "auto",
                            /* 230px top padding clears the Hello text completely */
                            padding: "230px 48px 120px 48px",
                            boxSizing: "border-box",
                            zIndex: 15,
                            /* Fade cards as they scroll near the top header */
                            maskImage:
                                "linear-gradient(to bottom, transparent 0px, transparent 120px, black 220px, black 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, transparent 0px, transparent 120px, black 220px, black 100%)",
                        }}
                    >
                        <motion.div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                                gap: "24px",
                                maxWidth: "1280px",
                                margin: "0 auto",
                            }}
                        >
                            {projects.map((project, idx) => (
                                <motion.div
                                    key={`grid-${project.id}`}
                                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 220,
                                        damping: 20,
                                        delay: idx * 0.04,
                                    }}
                                    whileHover={{ y: -4 }}
                                    onClick={() => openProject(project)}
                                    style={{
                                        background: project.accentColor || "#d97757",
                                        border: "2px solid #111",
                                        borderRadius: "16px",
                                        boxShadow: "4px 4px 0px #111",
                                        aspectRatio: "1.1 / 1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "20px",
                                        cursor: "pointer",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {project.src ? (
                                        <img
                                            src={project.src}
                                            alt={project.title}
                                            style={{
                                                maxWidth: "85%",
                                                maxHeight: "85%",
                                                objectFit: "contain",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    ) : (
                                        <h3 style={{ color: "#fff", margin: 0, textAlign: "center" }}>
                                            {project.title}
                                        </h3>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Dock Control */}
            <nav
                style={{
                    position: "fixed",
                    bottom: "80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "2px solid #111",
                    borderRadius: "8px",
                    boxShadow: "3px 3px 0px #111",
                    zIndex: 100,
                    padding: "4px 6px",
                    gap: "2px",
                }}
            >
                <button
                    type="button"
                    aria-label="Previous view"
                    style={{
                        background: "none",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                    }}
                >
                    ᐊ
                </button>

                <button
                    type="button"
                    aria-label="Scatter canvas view"
                    onClick={() => setMode("canvas")}
                    style={{
                        background: mode === "canvas" ? "#f0f0f0" : "transparent",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                    }}
                >
                    ⚅
                </button>

                <button
                    type="button"
                    aria-label="Card grid view"
                    onClick={() => setMode("grid")}
                    style={{
                        background: mode === "grid" ? "#f0f0f0" : "transparent",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                    }}
                >
                    ⊞
                </button>

                <button
                    type="button"
                    aria-label="Next view"
                    style={{
                        background: "none",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                    }}
                >
                    ᐅ
                </button>
            </nav>
        </div>
    );
}
