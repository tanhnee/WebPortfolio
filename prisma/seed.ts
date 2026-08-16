import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "buutanh10032005@gmail.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "buutanh10032005@gmail.com",
      password: hashedPassword,
      name: "Tran Le Buu Tanh",
    },
  });
  console.log("✅ Admin user created");

  // Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: "Tran Le Buu Tanh",
        title: "Business Analyst | Data Analyst | AI Solution Builder",
        bio: "Year 3 E-commerce student (Talented Program) at UEL with a cumulative GPA of 8.73/10, majoring in Information Systems with a strong foundation in both Business Analysis and Data Analytics. Experienced in requirements analysis, process design, and data-driven problem solving through 02 scientific publications, top-tier competitions, and hands-on research at BI Lab - UEL. Proficient in Power BI, Python, and Econometric Modeling, with additional hands-on experience in Figma and frontend development for business system design and prototyping. Possess strong analytical thinking, stakeholder communication, and the ability to bridge business needs with technical solutions through both data insights and UI/UX wireframing. Adaptable, self-driven, and eager to contribute to fast-paced, international environments.",
        email: "buutanh10032005@gmail.com",
        phone: "+84 35 579 2919",
        location: "Ho Chi Minh City, Vietnam",
        linkedinUrl: "https://linkedin.com/in/buutanhtranle",
      },
    });
  } else {
    await prisma.profile.updateMany({
      data: {
        name: "Tran Le Buu Tanh",
        title: "Business Analyst | Data Analyst | AI Solution Builder",
        bio: "Year 3 E-commerce student (Talented Program) at UEL with a cumulative GPA of 8.73/10, majoring in Information Systems with a strong foundation in both Business Analysis and Data Analytics. Experienced in requirements analysis, process design, and data-driven problem solving through 02 scientific publications, top-tier competitions, and hands-on research at BI Lab - UEL. Proficient in Power BI, Python, and Econometric Modeling, with additional hands-on experience in Figma and frontend development for business system design and prototyping. Possess strong analytical thinking, stakeholder communication, and the ability to bridge business needs with technical solutions through both data insights and UI/UX wireframing. Adaptable, self-driven, and eager to contribute to fast-paced, international environments.",
        email: "buutanh10032005@gmail.com",
        phone: "+84 35 579 2919",
        location: "Ho Chi Minh City, Vietnam",
        linkedinUrl: "https://linkedin.com/in/buutanhtranle",
      },
    });
  }
  console.log("✅ Profile created/updated");

  // Skills — based on actual CV
  const skills = [
    // Business & Analysis
    { name: "Business Intelligence (BI)", category: "Business", level: 95, order: 0 },
    { name: "Business Analysis", category: "Business", level: 90, order: 1 },
    { name: "Information Systems Analysis & Design", category: "Business", level: 95, order: 2 },
    { name: "Requirements Gathering", category: "Business", level: 88, order: 3 },
    { name: "Process Optimization", category: "Business", level: 82, order: 4 },
    { name: "Stakeholder Management", category: "Business", level: 85, order: 5 },
    // Data & Analytics
    { name: "Power BI", category: "Data", level: 92, order: 0 },
    { name: "Econometric Modeling", category: "Data", level: 90, order: 1 },
    { name: "Data Analytics", category: "Data", level: 88, order: 2 },
    { name: "Advanced Excel (Pivot/VBA)", category: "Data", level: 85, order: 3 },
    { name: "Digital Marketing Analytics", category: "Data", level: 85, order: 4 },
    { name: "AI-driven Analytics", category: "Data", level: 82, order: 5 },
    // Technology & Tools
    { name: "Python (Pandas/NumPy)", category: "Technology", level: 85, order: 0 },
    { name: "SQL", category: "Technology", level: 78, order: 1 },
    { name: "Figma / UI/UX Wireframing", category: "Technology", level: 80, order: 2 },
    { name: "Web Development (Frontend)", category: "Technology", level: 72, order: 3 },
    { name: "Microsoft Office", category: "Technology", level: 90, order: 4 },
    // AI & Research
    { name: "AI Solutions in Business", category: "AI", level: 85, order: 0 },
    { name: "Quantitative Research", category: "AI", level: 88, order: 1 },
    { name: "Research & Report Writing", category: "AI", level: 90, order: 2 },
    // Soft Skills
    { name: "Analytical Thinking", category: "Soft Skills", level: 92, order: 0 },
    { name: "Complex Problem Solving", category: "Soft Skills", level: 88, order: 1 },
    { name: "Strategic Business Presentation", category: "Soft Skills", level: 85, order: 2 },
    { name: "International Team Collaboration", category: "Soft Skills", level: 82, order: 3 },
  ];

  for (const skill of skills) {
    const id = `seed-${skill.name.toLowerCase().replace(/[\s/()&]+/g, "-")}`;
    await prisma.skill.upsert({
      where: { id },
      update: { level: skill.level, category: skill.category, order: skill.order },
      create: { id, ...skill },
    });
  }
  console.log("✅ Skills seeded");

  // Education
  await prisma.education.upsert({
    where: { id: "seed-uel-ecommerce" },
    update: {
      gpa: "8.73/10",
      description:
        "Specializing in Information Systems, Business Analysis, and Data Analytics. Teaching Assistant for IS Analysis & Design course (50+ students). Active in 02 national research publications, top-tier competitions (Top 15 Future Business Analyst 2026), and hands-on research at BI Lab - UEL.",
    },
    create: {
      id: "seed-uel-ecommerce",
      school: "University of Economics and Law (UEL)",
      degree: "Bachelor",
      major: "E-commerce — Talented Program (Information Systems)",
      gpa: "8.73/10",
      startDate: new Date("2023-09-01"),
      current: true,
      description:
        "Specializing in Information Systems, Business Analysis, and Data Analytics. Teaching Assistant for IS Analysis & Design course (50+ students). Active in 02 national research publications, top-tier competitions (Top 15 Future Business Analyst 2026), and hands-on research at BI Lab - UEL.",
      order: 0,
    },
  });
  console.log("✅ Education seeded");

  // Experience / Extracurricular
  const experiences = [
    {
      id: "seed-bi-lab",
      company: "BI Research Lab & SAP Next-Gen Lab (FIS UEL)",
      position: "Collaborator",
      type: "research",
      description:
        "Conducted quantitative analysis and data cleaning for academic research projects under the guidance of industry experts to support high-quality research deliverables. Mastered data-driven methodologies and specialized analytical tools to execute in-depth technical reports, ensuring accuracy and academic rigor. Co-authored 01 scientific paper published at a National Conference, demonstrating strong analytical thinking and mastery of research-based data solutions.",
      startDate: new Date("2023-11-01"),
      current: true,
      location: "Ho Chi Minh City, Vietnam",
      order: 0,
    },
    {
      id: "seed-is-times",
      company: "IS Times — Faculty of Information Systems, UEL",
      position: "Head of Media Department",
      type: "leadership",
      description:
        "Managed the faculty's primary communication channel of 26,000+ followers by monitoring weekly engagement and reach metrics to optimize digital content planning. Led a multi-functional media team to execute communication campaigns for major academic events, ensuring consistent brand growth and high student interaction levels. Streamlined content production processes to adapt to the fast-paced information flow, maintaining a steady increase in community engagement by 22.5%.",
      startDate: new Date("2024-06-01"),
      current: true,
      location: "Ho Chi Minh City, Vietnam",
      order: 1,
    },
    {
      id: "seed-apmc-2025",
      company: "26th Asia Pacific Management Conference (APMC 2025)",
      position: "Volunteer Team Leader",
      type: "volunteer",
      description:
        "International conference on Digital Transformation co-hosted by National Cheng Kung University (Taiwan) and UEL. Led a diverse volunteer team to manage logistical operations and support services for international researchers and industry professionals across the Asia-Pacific region. Facilitated Stakeholder Management by acting as the primary liaison between the Organizing Committee and global delegates, resolving operational bottlenecks in a high-pressure, fast-paced environment. Ensured the seamless execution of the 3-day international event, contributing to a high delegate satisfaction rate through proactive problem-solving and efficient team coordination.",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-31"),
      current: false,
      location: "Ho Chi Minh City, Vietnam",
      order: 2,
    },
    {
      id: "seed-student-ambassador",
      company: "Student Ambassador — AIESEC & RMIT Business Analytics Champion",
      position: "Student Ambassador",
      type: "volunteer",
      description:
        "Designed and executed outreach campaigns for AIESEC's Fall 2024 Member Recruitment Campaign and RMIT Business Analytics Champion 2026 to drive brand awareness and program registrations. Optimized multi-channel content to engage candidates, effectively converting potential applicants into active participants through data-informed communication strategies. Achieved significant growth in registration rates by proactively managing inquiries and fostering relationships with the student community on digital platforms.",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-12-31"),
      current: false,
      location: "Ho Chi Minh City, Vietnam",
      order: 3,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: { description: exp.description },
      create: exp,
    });
  }
  console.log("✅ Experiences seeded");

  // Awards
  const awards = [
    {
      id: "seed-vn-korea-pitching",
      title: "Second Prize — Vietnam–Korea E-Commerce Pitching Festival",
      issuer: "Vietnam–Korea E-Commerce Pitching Festival",
      description:
        "Developed a Vietnam market entry strategy for the Korean brand 'Jungsung Guitden' by leveraging AI-driven insights and behavioral analysis to optimize cross-border E-commerce conversion. Collaborated with international teammates to build data-backed pitching materials. Secured Second Prize (Runner-up) after pitching directly to corporate representatives from domestic and foreign companies.",
      date: new Date("2026-01-01"),
      order: 0,
    },
    {
      id: "seed-future-ba-2026",
      title: "Top 15 Finalist — Future Business Analyst 2026",
      issuer: "Future Business Analyst 2026 (Nationwide Competition)",
      description:
        "A nationwide competition focusing on data-driven strategy and business intelligence solutions for corporations. Reached Top 15 out of hundreds of candidates across Vietnam.",
      date: new Date("2026-01-01"),
      order: 1,
    },
    {
      id: "seed-ecommerce-video-2024",
      title: "Second Prize — E-commerce Video Competition 2024",
      issuer: "E-commerce Video Competition 2024",
      description:
        "Outperformed participants from 21 universities in digital marketing and cross-border E-commerce content strategy.",
      date: new Date("2024-12-01"),
      order: 2,
    },
    {
      id: "seed-5-good-student-2025",
      title: 'HCM City-level "5-Good Student" Award (2025)',
      issuer: "Ho Chi Minh City Youth Union",
      description:
        "Recognized for outstanding academic performance and extracurricular excellence at the HCM City level.",
      date: new Date("2025-06-01"),
      order: 3,
    },
    {
      id: "seed-advanced-youth",
      title: '"Advanced Youth following Uncle Ho\'s words" (2021–2025)',
      issuer: "Vietnam Youth Union",
      description:
        "Awarded consecutively from 2021 to 2025 for outstanding academic and extracurricular excellence.",
      date: new Date("2025-06-01"),
      order: 4,
    },
    {
      id: "seed-uel-scholarship",
      title: "UEL Merit-based Scholarship — 02 Consecutive Semesters",
      issuer: "University of Economics and Law (UEL)",
      description:
        "Recipient of UEL Merit-based Scholarship for 02 consecutive semesters, recognized for maintaining a top-tier academic standing.",
      date: new Date("2024-06-01"),
      order: 5,
    },
  ];

  for (const award of awards) {
    await prisma.award.upsert({
      where: { id: award.id },
      update: { description: award.description },
      create: award,
    });
  }
  console.log("✅ Awards seeded");

  // Research Papers — actual publications from CV
  const researchPapers = [
    {
      title: "Blockchain for ESG: Applications and Implications in the Vietnamese Business Context",
      conference: "National Conference on Blockchain and ESG",
      authors: ["Tran Le Buu Tanh"],
      abstract:
        "This paper explores the application of blockchain technology in Environmental, Social, and Governance (ESG) reporting within the Vietnamese business context. Using quantitative research methodology, the study analyzes the potential for blockchain to enhance ESG data transparency, auditability, and stakeholder trust for Vietnamese enterprises transitioning toward sustainable business practices.",
      publishedAt: new Date("2025-05-01"),
      status: "published",
      tags: ["Blockchain", "ESG", "Sustainability", "Business", "Vietnam"],
    },
    {
      title: "Quantitative Analysis of Economic and Social Issues in the Digital Environment",
      conference: "National Scientific Conference on Quantitative Analysis of Economic and Social Issues in the Digital Environment",
      authors: ["Tran Le Buu Tanh"],
      abstract:
        "This paper presents a quantitative analysis of key economic and social phenomena emerging from the rapid digitalization of Vietnam's economy. Applying econometric modeling and statistical analysis, the research identifies significant correlations between digital adoption rates and economic performance indicators, providing data-driven insights for policy recommendations.",
      publishedAt: new Date("2024-03-01"),
      status: "published",
      tags: ["Econometrics", "Digital Economy", "Quantitative Research", "Vietnam", "Social Issues"],
    },
  ];

  for (const paper of researchPapers) {
    const exists = await prisma.research.findFirst({ where: { title: paper.title } });
    if (!exists) {
      await prisma.research.create({ data: paper });
    }
  }
  console.log("✅ Research papers seeded");

  // Sample Projects (kept from original — update when real projects are added via admin)
  const projects = [
    {
      slug: "qr-attendance-system",
      title: "QR Code Attendance System",
      subtitle: "Smart attendance management with real-time analytics",
      category: "AI",
      status: "completed",
      featured: true,
      description:
        "An intelligent attendance management system utilizing QR code technology integrated with real-time analytics dashboard. Eliminates manual attendance tracking and provides instant insights for educators and administrators.",
      abstract:
        "<p>This project presents the design and implementation of an intelligent attendance management system utilizing QR code technology integrated with real-time analytics. The system leverages machine learning algorithms for anomaly detection and Power BI for business intelligence reporting.</p>",
      problem:
        "<p>Traditional attendance systems are prone to manual errors, buddy punching, and lack real-time visibility. Educational institutions need an automated, reliable solution that provides instant insights.</p>",
      objectives:
        "<ul><li>Automate attendance tracking via QR codes</li><li>Provide real-time analytics dashboard</li><li>Detect anomalies using ML algorithms</li><li>Generate comprehensive reports</li></ul>",
      results:
        "<p><strong>99.2% accuracy</strong> in attendance tracking. <strong>85% reduction</strong> in administrative time. Real-time dashboard serving 500+ students.</p>",
      role: "Full Stack Developer & Data Analyst",
      team: "Solo Project",
      tags: ["QR Code", "AI", "Analytics", "Education", "Power BI"],
      technologies: ["Python", "FastAPI", "Next.js", "Power BI", "PostgreSQL", "OpenCV"],
      startDate: new Date("2023-10-01"),
      endDate: new Date("2024-02-01"),
    },
    {
      slug: "ai-face-recognition-attendance",
      title: "AI Face Recognition Attendance",
      subtitle: "Deep learning-based facial recognition for smart classrooms",
      category: "AI",
      status: "completed",
      featured: true,
      description:
        "A deep learning face recognition system for automated attendance in educational institutions. Uses ResNet architecture fine-tuned on Vietnamese student datasets for high accuracy in varied lighting conditions.",
      abstract:
        "<p>We propose a novel face recognition system for automated attendance in educational institutions using deep learning techniques. The system employs ResNet architecture fine-tuned on Vietnamese student datasets.</p>",
      methodology:
        "<p>The system uses a three-stage pipeline: <strong>face detection</strong> using MTCNN, <strong>feature extraction</strong> using ResNet-50, and <strong>classification</strong> using cosine similarity with a trained embedding database.</p>",
      architecture:
        "<p>Frontend (React) → FastAPI Backend → OpenCV preprocessing → TensorFlow model → PostgreSQL database → Real-time WebSocket updates.</p>",
      results:
        "<p><strong>97.8% recognition accuracy</strong> under varied lighting. <strong>Processing time: 0.3s</strong> per face. Tested on 200+ student dataset.</p>",
      role: "AI Developer",
      team: "2-person team",
      tags: ["Computer Vision", "Deep Learning", "Face Recognition", "Python", "TensorFlow"],
      technologies: ["Python", "TensorFlow", "OpenCV", "FastAPI", "React", "PostgreSQL"],
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-05-01"),
    },
    {
      slug: "business-dashboard-analytics",
      title: "Business Intelligence Dashboard",
      subtitle: "Comprehensive BI solution for retail analytics",
      category: "Business Intelligence",
      status: "completed",
      featured: false,
      description:
        "A comprehensive Business Intelligence dashboard for retail analytics, providing executive-level insights on sales performance, customer behavior, and inventory optimization using Power BI and Python.",
      problem:
        "<p>Retail businesses struggle with fragmented data across multiple systems, making it difficult to get a unified view of business performance and make data-driven decisions.</p>",
      results:
        "<p><strong>40% improvement</strong> in reporting efficiency. Real-time insights across 5 departments. Reduced manual reporting from 8 hours to 30 minutes weekly.</p>",
      role: "Business Analyst & BI Developer",
      team: "3-person team",
      tags: ["Power BI", "Business Intelligence", "Data Analytics", "Retail", "SQL"],
      technologies: ["Power BI", "Python", "SQL", "Excel", "DAX", "ETL"],
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-06-01"),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }
  console.log("✅ Sample projects seeded");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
