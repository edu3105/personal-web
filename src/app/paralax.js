"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxSection = ({ children, speed = 200, id }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"], // Trigger at section entry & exit
    });

    const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]); // Parallax Effect

    return (
        <section ref={ref} id={id} className="relative w-full min-h-screen flex items-center justify-center">
            <motion.div style={{ y }} className="w-full h-full flex items-center justify-center">
                {children}
            </motion.div>
        </section>
    );
};


export default ParallaxSection;