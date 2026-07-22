"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ── Skin colors ──────────────────────────────── */
const SKIN_COLORS: Record<string, string> = {
  "color-1": "#832a99",
  "color-2": "#ec1839",
  "color-3": "#fa5b0f",
  "color-4": "#34b588",
  "color-5": "#f021b2",
};

/* ── Navigation items ─────────────────────────── */
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "fa fa-home" },
  { id: "about", label: "About Me", icon: "fa fa-user" },
  { id: "services", label: "Services", icon: "fa fa-list" },
  { id: "portfolio", label: "Portfolio", icon: "fa fa-briefcase" },
  { id: "contact", label: "Contact", icon: "fa fa-comments" },
];

/* ── Portfolio projects ───────────────────────── */
const PROJECTS = [
  { img: "CleMoPi.png", title: "CleMoPi", desc: "Smart agriculture monitoring platform", url: "https://clemopi.vercel.app/" },
  { img: "VibeLink.png", title: "VibeLink", desc: "A real-time dating app like Tinder", url: "https://github.com/hamzazaouya/VibeLink" },
  { img: "LIMS.webp", title: "LIMS", desc: "Laboratory Information Management System", url: null },
  { img: "Hyperflix.png", title: "Hyperflix", desc: "A streaming platform for movies and TV shows", url: "https://github.com/Achraf-ahrach/Hyperflix" },
  { img: "Tetris.jpeg", title: "Tetris", desc: "A multiplayer Tetris game", url: "https://github.com/Achraf-ahrach/red-tetris" },
  { img: "U-Reserve.png", title: "U-Reserve", desc: "A platform for reserving university spaces", url: null },
  { img: "HSE.png", title: "HSE", desc: "Health, Safety, and Environment lab platform", url: "https://Lab-hse.um6p.ma" },
  { img: "SPIndustrielles.png", title: "SPIndustrielles", desc: "Industrial automation and electricity services", url: "https://www.spindustrielles.ma/" },
  { img: "PingPong.png", title: "PingPong", desc: "A multiplayer Ping Pong game", url: "https://github.com/JosepharDev/ft_transcendence" },
  { img: "iot.png", title: "IoT Kubernetes", desc: "Kubernetes cluster deployments for IoT", url: "https://github.com/Achraf-ahrach/to-kubernetes" },
  { img: "Cloud1.jpeg", title: "Cloud1", desc: "Cloud infrastructure project", url: "https://github.com/Achraf-ahrach/cloud-1" },
];

/* ── Skills ────────────────────────────────────── */
const SKILLS = [
  { name: "C & C++", width: 88 },
  { name: "TS & JS", width: 86 },
  { name: "React + Next.js", width: 90 },
  { name: "Node.js + Express.js", width: 90 },
  { name: "PSQl, MySQL", width: 80 },
  { name: "TailwindCSS", width: 90 },
  { name: "Python", width: 67 },
];

/* ── Services ──────────────────────────────────── */
const SERVICES = [
  { icon: "fa fa-mobile-alt", title: "Full-Stack Web Development", desc: "Build robust, scalable web applications from scratch using modern technologies. From responsive UI design to secure backend APIs, I handle the entire development cycle." },
  { icon: "fa fa-laptop-code", title: "Custom Web Design", desc: "Create a stunning online presence with our custom web design services. We will tailor a website that not only looks amazing but also performs brilliantly." },
  { icon: "fa fa-palette", title: "Frontend Development", desc: "Create interactive, responsive, and visually appealing web interfaces using React, Next.js, and Tailwind CSS. Focused on UX and performance optimization." },
  { icon: "fa fa-code", title: "Backend Development", desc: "Build secure and scalable server-side applications using Node.js, Express, MongoDB, and PostgreSQL. Focused on API development, database management, and integration with frontend technologies." },
  { icon: "fa fa-search", title: "SEO Optimization", desc: "Improve your website's visibility on search engines with our SEO optimization services. We focus on keyword research, on-page optimization, and high-quality content creation to drive organic traffic." },
  { icon: "fa fa-bullhorn", title: "Web Developer", desc: "As a web developer, I specialize in creating dynamic and responsive websites. My expertise includes HTML, CSS, JavaScript, and various frameworks to deliver high-quality web solutions." },
];

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [backSection, setBackSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [skinColor, setSkinColor] = useState("color-1");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const typingRef = useRef<HTMLSpanElement>(null);

  /* ── Typing Animation ───────────────────────── */
  useEffect(() => {
    const strings = ["Software Engineer", "Software Developer"];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    function type() {
      const current = strings[stringIndex];
      if (typingRef.current) {
        typingRef.current.textContent = isDeleting
          ? current.substring(0, charIndex--)
          : current.substring(0, charIndex++);
      }

      if (!isDeleting && charIndex > current.length) {
        isDeleting = true;
        timeout = setTimeout(type, 1500);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        timeout = setTimeout(type, 500);
      } else {
        timeout = setTimeout(type, isDeleting ? 50 : 100);
      }
    }

    type();
    return () => clearTimeout(timeout);
  }, []);

  /* ── Apply skin color CSS variable ──────────── */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--skin-color",
      SKIN_COLORS[skinColor]
    );
  }, [skinColor]);

  /* ── Dark mode toggle ───────────────────────── */
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  /* ── Section navigation ─────────────────────── */
  const navigateTo = useCallback(
    (sectionId: string) => {
      if (sectionId === activeSection) return;
      setBackSection(activeSection);
      setActiveSection(sectionId);
      if (window.innerWidth < 1200) {
        setSidebarOpen(false);
      }
    },
    [activeSection]
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handlePrivateProject = () => {
    alert("🤨 This project is a private repository and cannot be publicly accessed.");
  };

  return (
    <div className="portfolio-body">
      {/* ── Sidebar ─────────────────────────────── */}
      <div className={`aside ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <a href="https://github.com/Achraf-ahrach" target="_blank" rel="noopener noreferrer">
            <span>Achraf</span>
          </a>
        </div>
        <div
          className={`nav-toggler ${sidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
        >
          <span></span>
        </div>
        <ul className="nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                className={activeSection === item.id ? "active" : ""}
                onClick={() => navigateTo(item.id)}
              >
                <i className={item.icon}></i>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Main Content ──────────────────────── */}
      <div className="main-content">
        {/* ── HOME ──────────────────────────── */}
        <section
          className={`home section ${activeSection === "home" ? "active" : ""} ${backSection === "home" ? "back-section" : ""} ${sidebarOpen ? "open" : ""}`}
          id="home"
        >
          <div className="portfolio-container">
            <div className="row">
              <div className="home-info padd-15">
                <h3 className="hello">
                  Hello, my name&apos;s{" "}
                  <span className="name">Achraf Ahrach</span>
                </h3>
                <h3 className="my-profession">
                  I&apos;m a{" "}
                  <span className="typing" ref={typingRef}>
                    web developer
                  </span>
                </h3>
                <p>
                  A software developer with over a year of experience. My
                  expertise lies in web development, backend systems
                  administration, and much more...
                </p>
                <div className="horizontal-buttons">
                  <a
                    href="/portfolio/aahrach-CV.pdf"
                    className="btn"
                    download
                  >
                    Download a CV
                  </a>
                </div>
              </div>
              <div className="home-img padd-12">
                <Image
                  src="/portfolio/ahrach.jpeg"
                  alt="Achraf Ahrach"
                  width={350}
                  height={450}
                  style={{ height: "450px", objectFit: "cover", borderRadius: "5px" }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────── */}
        <section
          className={`about section ${activeSection === "about" ? "active" : ""} ${backSection === "about" ? "back-section" : ""} ${sidebarOpen ? "open" : ""}`}
          id="about"
        >
          <div className="portfolio-container">
            <div className="row">
              <div className="section-title padd-15">
                <h2>About Me</h2>
              </div>
            </div>
            <div className="row">
              <div className="about-content padd-15">
                <div className="row">
                  <div className="about-text padd-15">
                    <h3>
                      I am Achraf Ahrach a{" "}
                      <span>Software Developer</span>
                    </h3>
                    <p>
                      Hi! My name is Achraf Ahrach. I am a software developer,
                      and I&apos;m very passionate and dedicated to my work. With
                      over one year of experience in software development, I
                      have gained the skills and knowledge necessary to make
                      your project a success. I enjoy every step of the
                      development process — from discussion and collaboration to
                      implementation and delivery.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="personal-info padd-15">
                    <div className="row">
                      <div className="info-item padd-15">
                        <p>City: <span>Morocco - ben guerir</span></p>
                      </div>
                      <div className="info-item padd-15">
                        <p>Education: <span>1337 / 42Network</span></p>
                      </div>
                      <div className="info-item padd-15">
                        <p>
                          Phone:{" "}
                          <a href="tel:+212228224327"><span>+212 228 22 43 27</span></a>
                        </p>
                      </div>
                      <div className="info-item padd-15">
                        <p>
                          Email:{" "}
                          <a href="mailto:achrafahrach44@gmail.com">
                            <span>achrafahrach44@gmail.com</span>
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="buttons padd-15">
                        <a
                          className="btn hire-me"
                          onClick={() => navigateTo("contact")}
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                    <div className="row">
                      <div className="arrow-down padd-15"></div>
                      <div className="arrow-down padd-15">
                        <span></span><br />
                        <span></span><br />
                        <span></span><br />
                        <span></span>
                      </div>
                      <div className="arrow-down padd-15">
                        <span></span><br />
                        <span></span><br />
                        <span></span><br />
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div className="skills padd-15">
                    <div className="row">
                      {SKILLS.map((skill) => (
                        <div className="skill-item padd-15" key={skill.name}>
                          <h5>{skill.name}</h5>
                          <div className="progress">
                            <div
                              className="progress-in"
                              style={{ width: `${skill.width}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row">
                    <div className="education padd-15">
                      <h3 className="title">Education</h3>
                      <div className="row">
                        <div className="timeline-box padd-15">
                          <div className="timeline shadow-dark">
                            <div className="timeline-item">
                              <div className="circle-dot"></div>
                              <h3 className="timeline-date">
                                <i className="fa fa-calendar"></i> 2022 – 2025
                              </h3>
                              <h4 className="timeline-title">
                                <a href="https://1337.ma/en/" target="_blank" rel="noopener noreferrer">1337</a>
                                {" / "}
                                <a href="https://www.42network.org/" target="_blank" rel="noopener noreferrer">42 Network</a>
                              </h4>
                              <p className="timeline-text">
                                Software Engineering Student;<br />Currently
                                studying at 1337 School, part of the 42 Network,
                                specializing in software engineering through a
                                peer-to-peer, project-based learning model.
                              </p>
                            </div>
                            <div className="timeline-item">
                              <div className="circle-dot"></div>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://badge.mediaplus.ma/darkblue/aahrach"
                                alt="aahrach's 42 stats"
                                width="100%"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="experience padd-15">
                      <h3 className="title">Experience</h3>
                      <div className="row">
                        <div className="timeline-box padd-15">
                          <div className="timeline shadow-dark">
                            <div className="timeline-item">
                              <div className="circle-dot"></div>
                              <h3 className="timeline-date">
                                <i className="fa fa-calendar"></i> 2024-09-02 - 2025-11-15 (+1 year)
                              </h3>
                              <h4 className="timeline-title">
                                <a href="https://www.linkedin.com/in/sp-industrielles-ing%C3%A9nierie-en-automatisme-et-%C3%A9lectricit%C3%A9-257881187/" target="_blank" rel="noopener noreferrer">
                                  Freelance Software Developer
                                </a>
                              </h4>
                              <p className="timeline-text">
                                As a freelance developer, I built a full-featured
                                e-commerce website for selling industrial automation
                                equipment and offering related services online.
                              </p>
                            </div>
                            <div className="timeline-item">
                              <div className="circle-dot"></div>
                              <h3 className="timeline-date">
                                <i className="fa fa-calendar"></i> 2024-08-26 - 2025-02-23 (6 months)
                              </h3>
                              <h4 className="timeline-title">
                                <a href="https://um6p.ma/fr/laboratoires" target="_blank" rel="noopener noreferrer">
                                  Full-Stack Developer
                                </a>
                              </h4>
                              <p className="timeline-text">
                                2024, I&apos;ve been working as a full-stack developer
                                at CORELAB – UM6P, where I contributed to the
                                development of several internal systems.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────── */}
        <section
          className={`service section ${activeSection === "services" ? "active" : ""} ${backSection === "services" ? "back-section" : ""} ${sidebarOpen ? "open" : ""}`}
          id="services"
        >
          <div className="portfolio-container">
            <div className="row">
              <div className="section-title padd-15">
                <h2>Services</h2>
              </div>
            </div>
            <div className="row">
              {SERVICES.map((svc) => (
                <div className="service-item padd-15" key={svc.title}>
                  <div className="service-item-inner">
                    <div className="icon">
                      <i className={svc.icon}></i>
                    </div>
                    <h4>{svc.title}</h4>
                    <p>{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO ─────────────────────── */}
        <section
          className={`portfolio-section section ${activeSection === "portfolio" ? "active" : ""} ${backSection === "portfolio" ? "back-section" : ""} ${sidebarOpen ? "open" : ""}`}
          id="portfolio"
        >
          <div className="portfolio-container">
            <div className="row">
              <div className="section-title padd-15">
                <h2>My Portfolio</h2>
              </div>
            </div>
            <div className="row">
              <div className="portfolio-heading padd-15">
                <h2>My Projects:</h2>
              </div>
            </div>
            <div className="row">
              {PROJECTS.map((project) => (
                <div className="portfolio-item padd-15" key={project.title}>
                  <div className="portfolio-item-inner shadow-dark">
                    <div className="portfolio-img">
                      {project.url ? (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={`/portfolio/projects/${project.img}`}
                            alt={project.title}
                            width={400}
                            height={300}
                            style={{ width: "100%", height: "auto", display: "block" }}
                          />
                          <div className="portfolio-info">
                            <h4>{project.title}</h4>
                            <p>{project.desc}</p>
                          </div>
                        </a>
                      ) : (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePrivateProject();
                          }}
                        >
                          <Image
                            src={`/portfolio/projects/${project.img}`}
                            alt={project.title}
                            width={400}
                            height={300}
                            style={{ width: "100%", height: "auto", display: "block" }}
                          />
                          <div className="portfolio-info">
                            <h4>{project.title}</h4>
                            <p>{project.desc}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────── */}
        <section
          className={`contact section ${activeSection === "contact" ? "active" : ""} ${backSection === "contact" ? "back-section" : ""} ${sidebarOpen ? "open" : ""}`}
          id="contact"
        >
          <div className="portfolio-container">
            <div className="row">
              <div className="section-title padd-15">
                <h2>Contact Me</h2>
              </div>
            </div>
            <h3 className="contact-title padd-15">Do you have any questions?</h3>
            <br />
            <div className="row">
              <div className="contact-info-item padd-15">
                <div className="icon"><i className="fas fa-phone"></i></div>
                <h4>Call</h4>
                <a href="tel:+212228224327"><p>+212 228 22 43 27</p></a>
              </div>
              <div className="contact-info-item padd-15">
                <div className="icon"><i className="fas fa-map-marker-alt"></i></div>
                <h4>City</h4>
                <p>Ben Guerir</p>
              </div>
              <div className="contact-info-item padd-15">
                <div className="icon"><i className="fas fa-envelope"></i></div>
                <h4>Email</h4>
                <a href="mailto:achrafahrach44@gmail.com"><p>achrafahrach44@gmail.com</p></a>
              </div>
              <div className="contact-info-item padd-15">
                <div className="icon"><i className="fab fa-github"></i></div>
                <h4>GitHub</h4>
                <a href="https://github.com/Achraf-ahrach" target="_blank" rel="noopener noreferrer">
                  <p>github.com/Achraf-ahrach</p>
                </a>
              </div>
            </div>
            <h3 className="contact-title padd-15">Send an Email</h3>
            <h4 className="contact-sub-title padd-15">I will reply to you shortly</h4>
            <div className="row">
              <div className="contact-form padd-15">
                <form action="https://form.taxi/s/1g4g558d" method="POST">
                  <div className="row">
                    <div className="form-item col-6 padd-15">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-item col-6 padd-15">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-item col-12 padd-15">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          placeholder="Subject"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-item col-12 padd-15">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="message"
                          style={{ resize: "vertical", height: "140px" }}
                          placeholder="Message"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {/* Honeypot */}
                  <input type="text" name="_gotcha" style={{ display: "none" }} />
                  {/* Redirect after submit */}
                  <input type="hidden" name="_redirect" value="https://ahrach.me/thank-you" />
                  <div className="row">
                    <div className="form-item col-12 padd-15">
                      <button type="submit" className="btn">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Style Switcher ─────────────────── */}
      <div className={`style-switcher ${switcherOpen ? "open" : ""}`}>
        <div
          className="style-switcher-toggler s-icon"
          onClick={() => setSwitcherOpen(!switcherOpen)}
        >
          <i className="fas fa-cog fa-spin"></i>
        </div>
        <div className="day-night s-icon" onClick={() => setIsDark(!isDark)}>
          <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        </div>
        <h4>Theme Color</h4>
        <div className="colors">
          {Object.keys(SKIN_COLORS).map((color) => (
            <span
              key={color}
              className={color}
              onClick={() => setSkinColor(color)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
