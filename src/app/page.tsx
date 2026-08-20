"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Code, Link as LinkIcon, Mail, Code2, Cloud, Database, Activity, ExternalLink, GraduationCap, Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useTheme } from "@/components/ThemeProvider";
import Typewriter from "@/components/Typewriter";

export default function Home() {
  const theme = useTheme();
  const enableParallax = theme?.enableParallax ?? true;
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const shapesY = useTransform(scrollY, [0, 1000], [0, -200]);

  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Contact Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [themeSettings, setThemeSettings] = useState<any>(null);
  const [customSections, setCustomSections] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/theme').then(res => res.json()).then(data => setThemeSettings(data));
    fetch('/api/custom-section').then(res => res.json()).then(data => setCustomSections(data));
  }, []);


  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => setProfile(data));
    fetch('/api/skills').then(res => res.json()).then(data => { if(Array.isArray(data)) setSkills(data); });
    fetch('/api/experience').then(res => res.json()).then(data => { if(Array.isArray(data)) setExperience(data); });
    fetch('/api/education').then(res => res.json()).then(data => { if(Array.isArray(data)) setEducation(data); });
    fetch('/api/projects').then(res => res.json()).then(data => { if(Array.isArray(data)) setProjects(data); });
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        setName(""); setEmail(""); setMessage("");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setSending(false);
    }
  };

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  

  const sectionOrder = themeSettings?.sectionOrder 
    ? themeSettings.sectionOrder.split(',')
    : ['hero', 'skills', 'experience', 'education', 'projects', 'contact'];

  const renderSection = (sectionId: string) => {
    if (sectionId.startsWith('custom-')) {
      const customData = customSections.find(s => s.sectionId === sectionId);
      if (!customData || !customData.isVisible) return null;
      
      let blocks = [];
      try { blocks = JSON.parse(customData.content).blocks || []; } catch(e) {}
      
      return (
        <section key={sectionId} id={sectionId} className="py-24 relative">
          <div className="container mx-auto px-4 z-10 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{customData.title}</h2>
              {customData.subtitle && <p className="text-xl text-text-muted">{customData.subtitle}</p>}
            </div>
            
            {customData.layout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blocks.map((b: any, i: number) => (
                  <div key={i} className="glass-card p-6">
                    {b.type === 'image' && <img src={b.url} alt="" className="w-full h-48 object-cover rounded-lg mb-4"/>}
                    {b.type === 'heading' && <h3 className="text-xl font-bold mb-2">{b.value}</h3>}
                    {b.type === 'paragraph' && <p className="text-text-muted">{b.value}</p>}
                    {b.type === 'html' && <div dangerouslySetInnerHTML={{__html: b.value}} />}
                  </div>
                ))}
              </div>
            ) : customData.layout === 'split-view' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {blocks.filter((b: any) => b.type !== 'image').map((b: any, i: number) => (
                    <div key={i}>
                      {b.type === 'heading' && <h3 className="text-2xl font-bold">{b.value}</h3>}
                      {b.type === 'paragraph' && <p className="text-text-muted text-lg">{b.value}</p>}
                      {b.type === 'html' && <div dangerouslySetInnerHTML={{__html: b.value}} />}
                    </div>
                  ))}
                </div>
                <div>
                  {blocks.filter((b: any) => b.type === 'image').map((b: any, i: number) => (
                    <img key={i} src={b.url} alt="" className="w-full rounded-2xl shadow-2xl" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6 text-center">
                {blocks.map((b: any, i: number) => (
                  <div key={i}>
                    {b.type === 'image' && <img src={b.url} alt="" className="w-full rounded-2xl mb-6 shadow-2xl"/>}
                    {b.type === 'heading' && <h3 className="text-2xl font-bold">{b.value}</h3>}
                    {b.type === 'paragraph' && <p className="text-text-muted text-lg leading-relaxed">{b.value}</p>}
                    {b.type === 'html' && <div dangerouslySetInnerHTML={{__html: b.value}} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }
    
    switch (sectionId) {
      case 'hero': return <div key="hero">{/* ----------------- HERO SECTION ----------------- */}
      <section id="home" className="pt-24 lg:pt-28 pb-12 min-h-screen flex items-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ y: enableParallax ? heroY : 0, opacity: enableParallax ? heroOpacity : 1 }}
              className="flex flex-col items-start z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success text-sm font-medium mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                AVAILABLE FOR NEW OPPORTUNITIES
              </div>

              <p className="text-xl text-text-muted mb-2">Hi, I'm</p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">{profile.name}</h1>
              
              <div className="min-h-[4rem] mb-4">
                <motion.h2 
                  key={profile.primaryTitle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-bold gradient-text"
                >
                  {profile.primaryTitle}
                </motion.h2>
              </div>
              
                            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl md:text-2xl text-primary font-medium mb-6 min-h-[2.5rem]"
              >
                {(() => {
                  if (!profile.secondaryTitle) return null;
                  let parsed = null;
                  try {
                    // Try to fix quotes if they are broken
                    const cleanStr = profile.secondaryTitle.replace(/&quot;/g, '"');
                    parsed = JSON.parse(cleanStr);
                  } catch(e) {
                    // Try parsing as object string if it's malformed
                    try {
                      // fallback for some weird strings
                      const str = profile.secondaryTitle.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
                      parsed = JSON.parse(str);
                    } catch(err) {}
                  }
                  
                  if (parsed && parsed.roles && Array.isArray(parsed.roles)) {
                    return (
                      <Typewriter 
                        words={parsed.roles} 
                        className={parsed.fontStyle || "font-sans"} 
                        typingSpeed={80}
                        deletingSpeed={50}
                        delayBetweenWords={2500}
                      />
                    );
                  }
                  
                  return <span>{profile.secondaryTitle}</span>;
                })()}
              </motion.div>
              
              <p className="text-text-muted text-lg max-w-xl leading-relaxed mb-10">
                {profile.introduction}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="#projects" className="btn-primary">
                  View My Work <ArrowRight size={18} className="ml-2" />
                </a>
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    Download Resume <Download size={18} className="ml-2" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-border w-full max-w-2xl">
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">{profile.yearsOfExp}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Experience</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">{profile.technologies}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Technologies</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">{profile.issuesResolved}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Resolved</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">{profile.supportLevel}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Support</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ y: enableParallax ? shapesY : 0 }}
              className="relative flex justify-center items-center h-[350px] lg:h-[500px] z-10 w-full mt-10 lg:mt-0"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full max-w-md mx-auto"></div>
              
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full p-2 bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-3xl border border-white/10 shadow-2xl shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/5 bg-surface-elevated relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-8xl font-black text-text-muted/30 relative z-10">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
                    </span>
                  )}
                </div>
              </div>

              {(() => {
                let badges = [];
                try { if (profile?.heroBadges) badges = JSON.parse(profile.heroBadges); } catch(e) {}
                badges = badges.filter((b: any) => b.type !== 'hidden');
                
                return badges.map((badge: any, index: number) => {
                  const total = badges.length;
                  const angleRad = (index / total) * 2 * Math.PI - Math.PI / 2;
                  
                  // Use larger radius for desktop, smaller for mobile
                  const rx = 45; // X radius
                  const ry = 48; // Y radius
                  
                  const x = 50 + rx * Math.cos(angleRad);
                  const y = 50 + ry * Math.sin(angleRad);
                  
                  const delays = [0, 1, 2, 1.5, 0.5, 2.5, 1.2, 0.8, 0.2, 1.8];
                  const durations = [4, 5, 6, 4.5, 5.5, 4.8, 5.2, 4.2, 5.8, 4.0];
                  const delay = delays[index % delays.length];
                  const duration = durations[index % durations.length];
                  const badgeValue = (badge.value || "").trim();

                  return (
                    <div key={index} className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                      <motion.div animate={{ y: [-12, 12, -12] }} transition={{ repeat: Infinity, duration: duration, ease: "easeInOut", delay: delay }} className="bg-surface-elevated/60 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-full px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden hover:bg-surface-elevated/80 hover:scale-105 transition-all cursor-default">
                        {badge.type === 'image' && badgeValue ? (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-full p-1.5 flex items-center justify-center">
                            <img src={badgeValue} alt="Badge" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                          </div>
                        ) : (
                          <>
                            <div className="p-1.5 sm:p-2 bg-primary/20 rounded-full flex items-center justify-center"><Code2 size={16} className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] sm:w-[18px] sm:h-[18px]" /></div>
                            <span className="font-bold text-xs sm:text-sm tracking-wide text-white drop-shadow-md pr-1">{badgeValue || "Skill"}</span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  );
                });
              })()}</motion.div>
            
          </div>
        </div>
      </section>

      </div>;
      case 'skills': return <div key="skills">{/* ----------------- SKILLS SECTION ----------------- */}
      <section id="skills" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Technical Expertise</h2>
            <h1 className="text-4xl md:text-5xl font-bold">My <span className="gradient-text">Skills</span></h1>
          </motion.div>
          
          {themeSettings?.skillLayout === 'design2' ? (
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  const cat = skill.category?.name || "Uncategorized";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(skill);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([groupName, groupSkills]: [string, any], groupIndex) => (
                <motion.div 
                  key={groupName}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
                  className="flex-grow max-w-[500px] w-full p-8 border rounded-3xl border-white/5 bg-surface-elevated/20 hover:bg-surface-elevated/40 backdrop-blur-xl transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(var(--primary-rgb, 59,130,246),0.1)] group"
                >
                  <div className="flex flex-col items-center mb-8">
                    <h3 className="text-2xl font-bold text-white tracking-wide uppercase text-center group-hover:text-primary transition-colors duration-300">{groupName}</h3>
                    <div className="w-12 h-1 bg-primary/30 mt-3 rounded-full group-hover:bg-primary group-hover:w-24 transition-all duration-500"></div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {groupSkills.map((skill: any) => (
                      <div key={skill.id} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-surface-elevated/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary-rgb, 59,130,246),0.2)] hover:-translate-y-0.5">
                        {skill.icon ? (
                          <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain drop-shadow-md" />
                        ) : (
                          <Code2 size={16} className="text-primary/70" />
                        )}
                        <span className="text-[15px] font-semibold tracking-wide text-white/90">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {Object.entries(
              skills.reduce((acc, skill) => {
                const cat = skill.category?.name || (skill.name.toLowerCase().includes('design') || skill.name.toLowerCase().includes('figma') ? "Design & UI" : "Core Technologies");
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(skill);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([categoryName, catSkills]: [string, any], catIndex: number) => (
              <motion.div 
                key={categoryName} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: catIndex * 0.1 }}
                className="p-8 md:p-10 rounded-3xl bg-surface-elevated/30 border border-white/5 hover:bg-surface-elevated/50 transition-colors duration-500 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {categoryName.toLowerCase().includes('design') ? <Activity size={20} /> : <Code2 size={20} />}
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{categoryName}</h3>
                </div>
                
                <div className="space-y-6">
                  {(catSkills as any[]).map((skill: any, index: number) => {
                    const skillName = skill.name.toLowerCase();
                    let IconComponent = Code2;
                    if (skillName.includes('cloud') || skillName.includes('aws')) IconComponent = Cloud;
                    else if (skillName.includes('sql') || skillName.includes('data')) IconComponent = Database;
                    else if (skillName.includes('api') || skillName.includes('support') || skillName.includes('network')) IconComponent = Activity;

                    return (
                      <div key={skill.id} className="group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            {skill.icon ? (
                              <div className="w-[18px] h-[18px] flex items-center justify-center grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300">
                                <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                              </div>
                            ) : (
                              <span className="text-text-muted group-hover:text-primary transition-colors duration-300">
                                <IconComponent size={18} strokeWidth={2} />
                              </span>
                            )}
                            <span className="text-[15px] font-semibold text-white/90 tracking-wide">{skill.name}</span>
                          </div>
                          <span className="text-sm font-bold text-text-muted group-hover:text-white transition-colors duration-300">{skill.level}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }} 
                            whileInView={{ width: `${skill.level}%` }} 
                            viewport={{ once: true }} 
                            transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }} 
                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      </div>;
      case 'experience': return <div key="experience">{/* ----------------- EXPERIENCE SECTION ----------------- */}
      <section id="experience" className="py-24 relative bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Career Journey</h2>
            <h1 className="text-4xl md:text-5xl font-bold">My <span className="gradient-text">Experience</span></h1>
          </motion.div>
          
          <div className="relative border-l-2 border-primary/30 pl-8 space-y-12 ml-4">
            {experience.map((exp, index) => (
              <motion.div key={exp.id} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative glass-card p-8 group">
                <div className="absolute -left-[43px] top-8 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:scale-125 transition-transform" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{exp.position}</h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <h4 className="text-lg text-secondary font-medium mb-4">{exp.company}</h4>
                <p className="text-text-muted leading-relaxed whitespace-pre-line mb-6">
                  {exp.description}
                </p>
                {exp.technologies && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                    {exp.technologies.split(',').map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-surface-elevated rounded text-xs text-text-muted border border-border">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>;
      case 'education': return <div key="education">{/* ----------------- EDUCATION SECTION ----------------- */}
      <section id="education" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Academic Background</h2>
            <h1 className="text-4xl md:text-5xl font-bold">My <span className="gradient-text">Education</span></h1>
          </motion.div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div key={edu.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-8 flex flex-col md:flex-row gap-6 items-start group hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <GraduationCap size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{edu.degree}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 w-fit">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-lg text-secondary font-medium mb-4">{edu.institution}</h4>
                  {edu.description && <p className="text-text-muted leading-relaxed">{edu.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>;
      case 'projects': return <div key="projects">{/* ----------------- PROJECTS SECTION ----------------- */}
      <section id="projects" className="py-24 relative bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">My Portfolio</h2>
            <h1 className="text-4xl md:text-5xl font-bold">Featured <span className="gradient-text">Projects</span></h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card group overflow-hidden border border-border flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden bg-surface-elevated">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code2 size={48} className="text-border group-hover:text-primary transition-colors duration-500" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-border text-xs font-semibold text-primary">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-text-muted text-sm mb-6 flex-grow leading-relaxed">{project.shortDesc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.split(',').slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">{tech.trim()}</span>
                    ))}
                    {project.technologies.split(',').length > 3 && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-surface border border-border text-text-muted">+{project.technologies.split(',').length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
                        <Code size={16} /> Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors ml-auto">
                        Live Demo <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      </div>;
      case 'contact': return <div key="contact">{/* ----------------- CONTACT SECTION ----------------- */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Get In Touch</h2>
            <h1 className="text-4xl md:text-5xl font-bold">Contact <span className="gradient-text">Me</span></h1>
          </motion.div>

          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <form onSubmit={handleContactSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-text-muted">Your Name</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-surface-elevated/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-muted">Email Address</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-surface-elevated/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-text-muted">Your Message</label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="w-full bg-surface-elevated/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="How can I help you?"></textarea>
              </div>

              <button type="submit" disabled={sending} className="btn-primary w-full md:w-auto px-8 py-4 flex items-center justify-center gap-2">
                {sending ? "Sending..." : "Send Message"} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {sectionOrder.map((sectionId: string) => renderSection(sectionId))}
    </main>
  );
}
