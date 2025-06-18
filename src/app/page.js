"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import ChurchIcon from "@mui/icons-material/Church";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import emailjs from "emailjs-com";
import ParallaxSection from "./paralax.js";
import dynamic from "next/dynamic";

const Tilt = dynamic(() => import("react-parallax-tilt"), { ssr: false });

const menuItems = [
    { scrollIndex: 1, name: "ABOUT" },
    { scrollIndex: 2, name: "WORK" },
    { scrollIndex: 3, name: "PROJECTS" },
    { scrollIndex: 4, name: "CONTACT" },
    { scrollIndex: 5, name: "RESUME" },
];

const PROJECT_ID = "umqvyywd";
const DATASET = "production";
const QUERY = encodeURIComponent(
    `*[_type == "post"]|order(date desc){_id, date, iconName, iconBg, content}`
);
const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${QUERY}`;

const PROJECTS_QUERY = `*[_type == "project"] | order(title asc){_id,title,"imageUrl": image.asset->url,description,link}`;
const PROJECT_API_URL = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(PROJECTS_QUERY)}`;

const PERSONAL_IMAGE_QUERY = `*[_type == "personalImage"] | order(title asc){
    _id,
    title,
    "imageUrl": image.asset->url,
  }`;
const PERSONAL_IMAGE_API_URL = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(PERSONAL_IMAGE_QUERY)}`;

export default function Home() {
    // State declarations
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [personalImage, setPersonalImage] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectIndex, setProjectIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Loading effect
    useEffect(() => {
        const handleLoad = () => {
            setTimeout(() => setLoading(false), 1000);
        };
        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }
        return () => window.removeEventListener("load", handleLoad);
    }, []);

    // Section scroll effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        sectionsRef.current = Array.from(
            container.querySelectorAll(".section")
        );
        if (!sectionsRef.current.length) return;
        const handleScroll = (event) => {
            event.preventDefault();
            if (isScrolling) return;
            const deltaY = event.deltaY;
            let newIndex = currentIndex;
            if (deltaY > 0) {
                newIndex = Math.min(
                    currentIndex + 1,
                    sectionsRef.current.length - 1
                );
            } else if (deltaY < 0) {
                newIndex = Math.max(currentIndex - 1, 0);
            }
            if (newIndex !== currentIndex) {
                setIsScrolling(true);
                setCurrentIndex(newIndex);
                sectionsRef.current[newIndex]?.scrollIntoView({
                    behavior: "smooth",
                });
                setTimeout(() => setIsScrolling(false), 800);
            }
        };
        container.addEventListener("wheel", handleScroll, { passive: false });
        return () => container.removeEventListener("wheel", handleScroll);
    }, [currentIndex, isScrolling]);

    // Fetch timeline data
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch(API_URL, { cache: "no-store" });
                if (!response.ok)
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                const { result } = await response.json();
                const sortedData = result.sort(
                    (b, a) => new Date(b.date) - new Date(a.date)
                );
                setTimelineData(sortedData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
        fetchPosts();
    }, []);

    // Fetch projects data
    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(PROJECT_API_URL, {
                    cache: "no-store",
                });
                if (!response.ok)
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                const { result } = await response.json();
                setProjects(result);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
        fetchProjects();
    }, []);

    // Fetch personal Image
    useEffect(() => {
        async function fetchPersonalImage() {
            try {
                const response = await fetch(PERSONAL_IMAGE_API_URL, {
                    cache: "no-store",
                });
                if (!response.ok)
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                const { result } = await response.json();
                setPersonalImage(result);
            } catch (error) {
                console.error("Error fetching personal image:", error);
            }
        }
        fetchPersonalImage();
    }, []);

    // Project navigation handlers
    const handleNext = () => {
        setDirection(1);
        setProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    };
    const handlePrev = () => {
        setDirection(-1);
        setProjectIndex(
            (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
        );
    };
    const visibleProjects = projects.length > 0 ? [projects[projectIndex]] : [];

    // Animation variants
    const variants = {
        initial: (direction) => ({ x: direction > 0 ? 2000 : -2000 }),
        animate: { x: 0, transition: { duration: 0.5 } },
        exit: (direction) => ({
            x: direction > 0 ? -2000 : 2000,
            transition: { duration: 0.5 },
        }),
    };

    // Email form handler
    const handleSubmitEmail = (e) => {
        e.preventDefault();
        if (!email || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        const serviceID = "service_x1ladbw";
        const templateID = "template_cl6ri6y";
        const publicKey = "M00p93T2sKWg_m73N";
        const templateParams = {
            from_email: email,
            subject: subject,
            message: message,
        };
        emailjs.send(serviceID, templateID, templateParams, publicKey).then(
            (result) => {
                alert("Email sent successfully!");
                setEmail("");
                setSubject("");
                setMessage("");
            },
            (error) => {
                alert("Failed to send email. Please try again later.");
            }
        );
    };

    // Mouse tilt effect
    const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 10;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        setTilt({ x, y });
    };

    return (
        <div>
            {/* Loading Overlay */}
            <div>
                {loading && (
                    <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-black z-50">
                        <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
                        <div className="text-4xl font-josefin text-white/90 animate-bounce">
                            LOADING . . .
                        </div>
                    </div>
                )}
            </div>
            {/* Main Content */}
            <div
                ref={containerRef}
                className={`relative flex flex-col items-center ${loading ? "hidden" : "block"}`}
            >
                {/* Navigation Bar */}
                <div className="fixed flex w-full justify-center h-1/6 px-36 z-50 ">
                    <div className="md:w-1/4 w-full h-full flex flex-row items-center justify-center gap-5">
                        {menuItems.map((item, index) => {
                            const isResume = item.name === "RESUME";
                            const linkProps = isResume
                                ? {
                                      href: "/pdf/CV_EDU_one.pdf",
                                      download: true,
                                      className:
                                          "animate-bounce font-bold font-poppins md:text-xl text-xs text-white/90 cursor-pointer duration-300 hover:drop-shadow-custom-light hover:scale-110 hover:text-white",
                                  }
                                : {
                                      href: `#${item.name.toLowerCase()}`,
                                      className:
                                          "font-semibold font-poppins md:text-xl text-xs text-white/90 duration-300 hover:drop-shadow-custom-light hover:scale-110 hover:text-white",
                                      onClick: (e) => {
                                          e.preventDefault();
                                          setCurrentIndex(item.scrollIndex);
                                          sectionsRef.current[
                                              item.scrollIndex
                                          ]?.scrollIntoView({
                                              behavior: "smooth",
                                          });
                                      },
                                  };
                            return (
                                <React.Fragment key={item.name}>
                                    <a {...linkProps}>{item.name}</a>
                                    {index < menuItems.length - 1 && (
                                        <div className="font-bold md:text-xl text-xs text-slate-300">
                                            |
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                {/* Hero Section */}
                <div
                    className="section h-screen w-full overflow-hidden  z-0 relative"
                    onMouseMove={handleMouseMove}
                >
                    <img
                        // ref={videoRef}
                        className="absolute top-0 left-0 w-full h-full object-cover floating-bg"
                        // src="/assets/video2.mp4"
                        src="/assets/bg_alternate_2.jpg"
                        // style={{ transform: `translate(${tilt.x * 3}px, ${tilt.y * 2.5}px)` }}
                        // autoPlay
                        // loop
                        // muted
                    />
                    {/* </div> */}
                    {/* bg-[# 212A31] */}
                    <div className="absolute inset-0 bg-center opacity-80 mix-blend-multiply backdrop-blur-lg"></div>
                    <div className="relative z-10 flex flex-col h-full w-full bg-[#0a0f1d] bg-opacity-25">
                        <div className="flex items-center justify-center h-full text-white">
                            <div
                                className="w-full h-full flex flex-col items-center transition-transform duration-300 ease-out"
                                style={{
                                    transform: `translate(${tilt.x}px, ${tilt.y}px)`,
                                }}
                            >
                                <div className="flex flex-row justify-self-center items-center h-full w-full gap-2">
                                    <div className="w-full flex flex-col items-center justify-center gap-8 pt-12">
                                        <motion.div
                                            initial={{ y: -50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 1,
                                                ease: "easeOut",
                                            }}
                                            className="w-3/4 inset-0 z-0 text-center font-poppins font-semibold lg:text-9xl md:text-7xl text-5xl text-white drop-shadow-custom-light opacity-100 tracking-wide"
                                        >
                                            {"EUGENIUS EDWARD"
                                                .split(" ")
                                                .map(
                                                    (
                                                        word,
                                                        nameIndex,
                                                        nameArray
                                                    ) => (
                                                        <span
                                                            key={nameIndex}
                                                            className="inline-block hover:scale-110 transition-transform duration-200"
                                                        >
                                                            {/* {word === " " ? "\u00A0" : word} */}
                                                            {word}
                                                            {nameIndex !==
                                                                nameArray.length -
                                                                    1 && (
                                                                <span className="inline-block">
                                                                    &nbsp;
                                                                </span>
                                                            )}
                                                        </span>
                                                    )
                                                )}
                                        </motion.div>

                                        <div className="text-center text-[#D3D9D4] font-josefin text-lg">
                                            Enthusiastic | Developer |
                                            Unforgettable
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section z-10 h-screen w-full bg-center bg-[#0a0f1d] flex justify-center items-center pt-28 top-full">
                    <div className="flex justify-center items-center h-4/5 w-10/12 gap-12 outline outline-2 bg-[#2e3944] backdrop-blur-lg bg-opacity-50 outline-white rounded-xl shadow-custom-light">
                        <div className="h-full lg:w-3/4 w-5/6 flex lg:flex-row flex-col gap-12 items-center justify-center">
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="xl:w-1/2 w-3/4 flex flex-col gap-8 text-left lg:text-left text-center"
                            >
                                <div className="xl:text-left text-center font-josefin xl:text-7xl lg:text-6xl md:text-5xl sm:text-3xl text-xl text-white/90">
                                    ABOUT Me.
                                </div>
                                <div className="text-justify font-poppins font-normal xl:text-xl md:text-base text-xs">
                                    A tech enthusiast who fell in love with
                                    software development back in high school and
                                    never looked back. Once I pick a path, I
                                    stick to it..... changing careers? Not my
                                    thing. I’m also an amateur stock market
                                    investor, learning the art of building my
                                    capital (or so I hope). Passionate,
                                    persistent, and always up for good challenge
                                </div>
                                <div className="text-left font-josefin font-normal xl:text-xl md:text-base text-xs md:block hidden">
                                    just don’t ask me to quit, because I don’t
                                    know how!{" "}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="font-josefin font-semibold text-lg text-white/90 xl:block hidden">
                                        My Skills :
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {[
                                            "React",
                                            "Python",
                                            "Javascript",
                                            "Java",
                                            "C / C++ / C#",
                                            "Tailwind CSS",
                                            "R",
                                            "TypeScript",
                                            "SQL",
                                        ].map((skill) => (
                                            <span
                                                key={skill}
                                                className="bg-[#212a31] text-white/90 font-poppins text-xs md:text-sm px-3 py-1 rounded-lg shadow-custom-light border border-[#748D92] hover:bg-[#124E66] transition"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.3,
                                    ease: "easeOut",
                                }}
                                className="h-full flex flex-col gap-8 p-8 xl:block hidden"
                            >
                                {personalImage.map((image) => (
                                    <div
                                        key={image._id}
                                        className="h-full w-full flex items-center"
                                    >
                                        <img
                                            src={image.imageUrl}
                                            className="object-fill h-3/5 rounded-xl hover:scale-110 transition-transform rotate-[10deg] hover:rotate-[-5deg] duration-300"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* Work Experience Section */}
                <div
                    id="work"
                    className="section z-10 h-screen w-full bg-center bg-[#0a0f1d] pt-28 pb-24 outline-1"
                >
                    <div className="flex flex-col gap-12 justify-center items-center h-full w-full mx-auto mt-12 mb-24">
                        <div className="md:w-3/4 w-full flex justify-center items-center">
                            <div className="text-center font-josefin xl:text-8xl lg:text-6xl md:text-5xl sm:text-3xl text-xl text-white/90">
                                I do have some WORK experiences...
                            </div>
                        </div>
                        <div className="xl:w-1/2 w-5/6 flex bg-[#748D92] shadow-custom-light bg-opacity-25 p-12 overflow-x-auto rounded-xl">
                            <Timeline position="alternate">
                                {timelineData.map((item) => (
                                    <TimelineItem
                                        key={item._id}
                                        className="hover:drop-shadow-custom-light"
                                    >
                                        <TimelineOppositeContent>
                                            <div className="xl:text-lg md:text-sm text-xs font-poppins md:font-bold text-[#D3D9D4]">
                                                {item.date}
                                            </div>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            {/* !${item.iconBg} */}
                                            <TimelineDot
                                                className={`w-8 h-8 flex items-center justify-center !bg-[#124E66] outline outline-2`}
                                            >
                                                {item.icon}
                                            </TimelineDot>
                                            <TimelineConnector className="h-8" />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <div className="xl:text-lg md:text-sm text-xs font-poppins md:font-bold text-[#D3D9D4]">
                                                {item.content}
                                            </div>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                                <div className="w-full text-center font-mono font-bold text-xl my-4">
                                    ...
                                </div>
                            </Timeline>
                        </div>
                    </div>
                </div>
                {/* Projects Section */}
                <div
                    id="projects"
                    className="section z-10 h-screen w-full bg-[#0a0f1d] p-24"
                >
                    <div className="flex flex-col gap-12 justify-center items-center h-full w-full mx-auto">
                        <div className="font-josefin text-white/90 font-bold text-left w-full text-3xl">
                            Past Projects :
                        </div>
                        <div className="w-full xl:h-[600px] h-3/4 flex md:flex-row flex-col justify-center items-center gap-12">
                            <motion.div
                                whileHover={{
                                    scale: 1.25,
                                    rotate: [0, 8, -8, 0],
                                }}
                                whileTap={{ scale: 0.9 }}
                                transition={{
                                    scale: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                    },
                                    rotate: {
                                        type: "tween",
                                        duration: 0.6,
                                        ease: "easeInOut",
                                    },
                                }}
                                className="rounded-full"
                            >
                                <ArrowCircleLeftIcon
                                    sx={{ fontSize: "4rem" }}
                                    className="text-[#D3D9D4]"
                                    onClick={handlePrev}
                                />
                            </motion.div>
                            <div className="lg:w-4/5 w-full h-full overflow-hidden relative">
                                <AnimatePresence custom={direction} mode="sync">
                                    <motion.div
                                        key={projectIndex} // Changing the key forces a re-render of the container
                                        // grid xl:grid-cols-1 grid-rows-2
                                        className="absolute h-full inset-0 gap-12 p-8 flex justify-center items-center"
                                        custom={direction}
                                        variants={variants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.5 }}
                                    >
                                        {visibleProjects.map(
                                            (project, index) =>
                                                project ? ( // Ensure project is defined
                                                    <a
                                                        key={
                                                            project._id || index
                                                        } // Use index as fallback key
                                                        className="lg:w-11/12 w-full xl:h-[500px] flex flex-col"
                                                        href={project.link}
                                                        target="_blank"
                                                    >
                                                        <div className="h-full w-full flex lg:flex-row flex-col items-center justify-left">
                                                            <Tilt
                                                                className="lg:w-2/3 w-full h-full"
                                                                tiltMaxAngleX={
                                                                    35
                                                                }
                                                                tiltMaxAngleY={
                                                                    35
                                                                }
                                                                perspective={
                                                                    900
                                                                }
                                                                // scale={1.1}
                                                                transitionSpeed={
                                                                    2000
                                                                }
                                                                // gyroscope={true}
                                                                // trackOnWindow={true}
                                                            >
                                                                {/* <div > */}
                                                                {project?.imageUrl ? (
                                                                    <img
                                                                        src={
                                                                            project.imageUrl
                                                                        }
                                                                        className="object-contain h-full w-full hover:scale-110 transition-transform duration-300"
                                                                        alt={
                                                                            project?.title ||
                                                                            "Project Image"
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full bg-gray-400 flex items-center justify-center rounded-t-xl">
                                                                        <span className="text-[#D3D9D4]">
                                                                            No
                                                                            Image
                                                                            Available
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {/* </div> */}
                                                            </Tilt>
                                                            <div className="lg:absolute lg:right-2 lg:w-1/2 w-full lg:px-5 lg:py-12 p-2 flex flex-col gap-2 items-center justify-center bg-[#2e3944] backdrop-blur-lg bg-opacity-50 outline-white rounded-xl hover:shadow-custom-light hover:scale-110 hover:bg-opacity-100 hover:right-12 transition-discrete ease-in-out duration-300">
                                                                <div className="font-josefin lg:font-bold font-semibold lg:text-6xl md:text-4xl text-lg flex flex-wrap whitespace-normal break-words gap-1 w-full">
                                                                    {project.title
                                                                        .split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                word,
                                                                                wordIndex
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        wordIndex
                                                                                    }
                                                                                    className="inline-block"
                                                                                >
                                                                                    {word
                                                                                        .split(
                                                                                            ""
                                                                                        )
                                                                                        .map(
                                                                                            (
                                                                                                letter,
                                                                                                letterIndex
                                                                                            ) => (
                                                                                                <span
                                                                                                    key={
                                                                                                        letterIndex
                                                                                                    }
                                                                                                    className={`inline-block transition-transform ${
                                                                                                        hoveredIndex ==
                                                                                                        `${wordIndex}-${letterIndex}`
                                                                                                            ? "drop-shadow-custom-light scale-150 rotate-12"
                                                                                                            : "text-white/90"
                                                                                                    }`}
                                                                                                    onMouseEnter={() =>
                                                                                                        setHoveredIndex(
                                                                                                            `${wordIndex}-${letterIndex}`
                                                                                                        )
                                                                                                    }
                                                                                                    onMouseLeave={() =>
                                                                                                        setHoveredIndex(
                                                                                                            null
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        letter
                                                                                                    }
                                                                                                </span>
                                                                                            )
                                                                                        )}
                                                                                    <span className="inline-block">
                                                                                        &nbsp;
                                                                                    </span>
                                                                                </span>
                                                                            )
                                                                        )}
                                                                </div>
                                                                <div className="hidden lg:block font-poppins text-sm text-justify">
                                                                    {
                                                                        project.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="h-2/3 w-full rounded-t-xl ">
                                                    {project?.imageUrl ? (
                                                    <img
                                                        src={project.imageUrl}
                                                        className="object-fill h-full w-full rounded-t-xl"
                                                        alt={project?.title || "Project Image"}
                                                    />
                                                    ) : (
                                                    <div className="h-full w-full bg-gray-400 flex items-center justify-center rounded-t-xl">
                                                        <span className="text-[#D3D9D4]">No Image Available</span>
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="bg-[#748D92] shadow-custom-light bg-opacity-25 w-full h-1/3 flex gap-1 px-12 py-3 rounded-b-xl ">
                                                    <div className="h-full w-full flex flex-col items-center justify-center">
                                                        <div className="xl:h-2/3 h-full font-josefin font-semibold xl:text-3xl md:text-base text-xs text-white/90 hover:text-white text-center flex items-center justify-center">
                                                            {project?.title || "Untitled Project"}
                                                        </div>
                                                        <div className="xl:h-1/2 font-josefin font-light text-xs text-[#D3D9D4] text-center hidden xl:block">
                                                            {project?.description || "No description available"}
                                                        </div>
                                                    </div>
                                                </div> */}
                                                    </a>
                                                ) : null // Don't render anything if project is undefined
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <motion.div
                                whileHover={{
                                    scale: 1.25,
                                    rotate: [0, -8, 8, 0],
                                }}
                                whileTap={{ scale: 0.9 }}
                                transition={{
                                    scale: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                    },
                                    rotate: {
                                        type: "tween",
                                        duration: 0.6,
                                        ease: "easeInOut",
                                    },
                                }}
                                className="rounded-full"
                            >
                                <ArrowCircleRightIcon
                                    sx={{ fontSize: "4rem" }}
                                    className="text-[#D3D9D4]"
                                    onClick={handleNext}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* Contact Section */}
                <div
                    id="contact"
                    className="section z-10 w-full h-screen flex flex-col"
                >
                    <div className="w-full h-full bg-[#0a0f1d] flex lg:flex-row flex-col lg:items-baseline lg:pt-24 items-center justify-center">
                        <div className="lg:w-2/5 w-full flex flex-col gap-12 justify-center items-center pt-16">
                            <div className="w-3/4 h-3/4 rounded-xl flex flex-col justify-start items-center lg:gap-12 gap-4 p-4">
                                <div className="w-full font-josefin xl:text-8xl lg:text-6xl md:text-5xl sm:text-3xl text-xl text-white/90 lg:text-right text-center">
                                    Contact
                                </div>
                                <div className="flex lg:flex-col flex-row px-5">
                                    <a
                                        href="mailto:eugeniusadmission@gmail.com"
                                        className="font-poppins text-xl text-white/90 text-justify flex flex-row gap-1 items-center duration-300 hover:font-black hover:drop-shadow-custom-light hover:scale-125"
                                    >
                                        <EmailIcon
                                            sx={{ fontSize: "2.5rem" }}
                                            className="text-white"
                                        />
                                        <div className="hidden lg:block">
                                            eugeniusadmission@gmail.com
                                        </div>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/eugenius-edward-9063781b3/"
                                        target="_blank"
                                        className="font-poppins text-xl text-white/90 text-justify flex flex-row gap-1 items-center  duration-300 hover:font-black hover:drop-shadow-custom-light hover:scale-125"
                                    >
                                        <LinkedInIcon
                                            sx={{ fontSize: "2.5rem" }}
                                            className="text-white"
                                        />
                                        <div className="hidden lg:block">
                                            Eugenius Edward
                                        </div>
                                    </a>
                                    <a
                                        href="https://www.instagram.com/eugeniusedu/"
                                        target="_blank"
                                        className="font-poppins text-xl text-white/90 text-justify flex flex-row gap-1 items-center duration-300 hover:font-black hover:drop-shadow-custom-light hover:scale-125"
                                    >
                                        <InstagramIcon
                                            sx={{ fontSize: "2.5rem" }}
                                            className="text-white"
                                        />
                                        <div className="hidden lg:block">
                                            eugeniusedu
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-3/5 w-full flex flex-col justify-center items-center p-4">
                            <ThemeProvider theme={theme}>
                                <form
                                    onSubmit={handleSubmitEmail}
                                    className="w-3/4 h-3/4 bg-opacity-25 rounded-xl flex flex-col justify-center items-center gap-8 "
                                >
                                    <FormControl className="w-4/5">
                                        <div className="font-poppins text-xl text-white focus:drop-shadow-custom-light">
                                            Email
                                        </div>
                                        <TextField
                                            id="email"
                                            name="from_email"
                                            placeholder="your@email.com"
                                            variant="outlined"
                                            className="bg-[#212a31] rounded-xl bg-opacity-50"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl className="w-4/5">
                                        <div className="font-poppins text-xl text-white">
                                            Subject
                                        </div>
                                        <TextField
                                            id="subject"
                                            name="subject"
                                            variant="outlined"
                                            className="bg-[#212a31] rounded-xl bg-opacity-50"
                                            value={subject}
                                            onChange={(e) =>
                                                setSubject(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl className="w-4/5">
                                        <div className="font-poppins text-xl text-white">
                                            Message
                                        </div>
                                        <TextField
                                            id="message"
                                            name="message"
                                            variant="outlined"
                                            multiline
                                            rows={5}
                                            placeholder="your message here"
                                            className="bg-[#212a31] rounded-xl bg-opacity-50"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <motion.button
                                        type="submit"
                                        whileTap={{ scale: 0.95 }}
                                        className="w-4/5 h-12 rounded-xl bg-[#212a31] bg-opacity-50 flex items-center justify-center hover:shadow-custom-light outline  outline-1 hover:outline-2 outline-slate-200 duration-300"
                                    >
                                        <div className="font-poppins text-white text-xl">
                                            Submit
                                        </div>
                                    </motion.button>
                                </form>
                            </ThemeProvider>
                        </div>
                    </div>
                    {/* <div className="w-full h-1/5 bg-emerald-900"></div>  */}
                </div>
                {/* Footer Section */}
                <div className="section w-full h-52 bg-[#2e3944] backdrop-blur-md bg-opacity-100 flex flex-col items-center justify-center relative">
                    {/* Soft Top Divider */}
                    <div className="absolute top-0 w-4/5 border-t border-gray-600 opacity-30"></div>

                    <div className="w-4/5 flex flex-col items-center gap-3 text-center">
                        {/* Name */}
                        <div className="font-josefin text-white/90 text-3xl tracking-wide">
                            Eugenius ED(U)ward Setiadi
                        </div>

                        {/* Social Icons */}
                        <div className="flex flex-row gap-4">
                            <a
                                href="https://github.com/edu3105"
                                target="_blank"
                                className="rounded-full duration-300 hover:scale-110 hover:drop-shadow-custom-light  transition"
                            >
                                <GitHubIcon
                                    sx={{ fontSize: "2.5rem" }}
                                    className="text-white"
                                />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/eugenius-edward-9063781b3/"
                                target="_blank"
                                className="rounded-full duration-300 hover:scale-110 hover:drop-shadow-custom-light transition"
                            >
                                <LinkedInIcon
                                    sx={{ fontSize: "2.5rem" }}
                                    className="text-white"
                                />
                            </a>
                            <a
                                href="/pdf/CV_EDU_one.pdf"
                                download
                                className="rounded-full duration-300 hover:scale-110 hover:drop-shadow-custom-light transition"
                            >
                                <ContactPageIcon
                                    sx={{ fontSize: "2.5rem" }}
                                    className="text-white"
                                />
                            </a>
                        </div>

                        {/* Small Text */}
                        <div className="font-mono text-slate-500 text-sm tracking-wide drop-shadow-custom-light">
                            Designed by myself ✨
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    );
}
