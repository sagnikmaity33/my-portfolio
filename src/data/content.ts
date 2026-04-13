export const profile = {
  name: "Sagnik Maity",
  title: "Full Stack Developer & AI Engineer",
  tagline: "Specializing in High-Concurrency Systems, Agentic AI, and Cloud-Native Architectures.",
  summary:
    "Expertise in building distributed systems and AI-driven automation. Specialized in Java Spring Boot, MERN, and integrating Agentic AI workflows using LangChain and Spring AI to drive business efficiency.",
  availableForWork: true,
  availabilityBadge: "Open to New Opportunities",
  location: "Kolkata, West Bengal",
  email: "sagnikmaity.dev@gmail.com",
  referralEmail: "sagnikmaity.dev@gmail.com",
  referralSubjectTemplate: "Referral Request: {Name} | Job IDs: {JobIds}",
  referralBodyTemplate: `Hi {Name},

Thanks for reaching out. I’ve received your referral request.

"Why you are a good fit for the role?"
Your response: "{candidate_response}"

I’ll review it and try to submit the referral within the next 2 days. Once done, you’ll receive a confirmation email from the portal.

If you have any questions, feel free to append the email thread.

Wishing you the very best for the opportunity — hope you make it big!

Warm regards,
Sagnik Maity`,
  messageSubjectTemplate: "Thanks for Reaching Out",
  messageBodyTemplate: `Hi {Name},

Thanks for reaching out — I’ve received your message.

Your Message: "{UserMessage}"

I’ll review it and get back to you shortly. Looking forward to connecting with you!

Warm regards,
Sagnik Maity`,
  github: "https://github.com/sagnikmaity33",
  linkedin: "https://www.linkedin.com/in/sagnik-maity-9b07a6283/",
  /** Hosted under public/ — used for hero + contact resume download */
  resumePublicPath: "/sagnik-resume_oct.pdf",
  roles: ["AI Engineer", "Backend Developer", "Full Stack Developer"],
};

export const skills = [
  {
    category: "Programming Languages",
    items: [
      { name: "Java", isPrimary: true },
      { name: "C", isPrimary: true },
      { name: "SQL", isPrimary: true },
      { name: "Python", isPrimary: false },
      { name: "Flutter", isPrimary: false },
      { name: "React Native", isPrimary: false },
      { name: "React JS", isPrimary: false },
      { name: "Next.js", isPrimary: false },
      { name: "Tailwind CSS", isPrimary: false },
      { name: "Express.js", isPrimary: false }
    ],
  },
  {
    category: "AI & Generative Intelligence",
    items: [
      { name: "LangChain & LangGraph", isPrimary: true },
      { name: "Spring AI", isPrimary: true },
      { name: "LLMs (GPT-4, Claude 3.5, Gemini 1.5 Pro)", isPrimary: true },
      { name: "LlamaIndex", isPrimary: true },
      { name: "Vector DBs (Pinecone, Milvus)", isPrimary: true },
      { name: "Agentic AI Workflows", isPrimary: true }
    ],
  },
  {
    category: "Cloud, DevOps & Testing",
    items: [
      { name: "AWS (S3, EC2)", isPrimary: true },
      { name: "Azure Cloud Services", isPrimary: true },
      { name: "Docker & Kubernetes", isPrimary: true },
      { name: "Prometheus & Grafana", isPrimary: true },
      { name: "JUnit & Mockito", isPrimary: true },
      { name: "CI/CD (GitHub Actions)", isPrimary: true }
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL", isPrimary: true },
      { name: "MongoDB", isPrimary: true },
      { name: "MySQL", isPrimary: true },
      { name: "SQLite", isPrimary: false },
      { name: "Redis", isPrimary: true }
    ],
  },
   {

    category: "Computer Science Fundamentals",

    items: [

      { name: "Data Structures & Algorigthms", isPrimary: true },

      { name: "Object Oriented Programmig", isPrimary: true },

      { name: "Database Management Systems", isPrimary: true },

      { name: "Operating Systems", isPrimary: false },

    ],

  },

    {

    category: "ML/NLP",

    items: [

      { name: "Named Entity Recognition Model (NER)", isPrimary: false },

      { name: "Model Evaluation", isPrimary: false },

      { name: "GPU Inference", isPrimary: false },

    ],

  },
];

export const experiences = [
  {
    role: "Full Stack Web & App Developer",
    company: "Valantech",
    period: "Sep 2025 – Dec 2025",
    location: "Remote",
    bullets: [
      "Engineered AI automation and observation layers using LangChain and Spring AI, improving task processing speed by 45%.",
      "Developed a Smart Society Management system with React Native, reducing manual service request processing time by 60%.",
      "Optimized production infrastructure using Docker and load balancing, achieving 99.9% system uptime during peak traffic.",
      "Implemented automated resident notification modules, increasing user engagement by 35% through targeted targeted push notifications."
    ],
    tags: ["Java Spring Boot", "Spring AI", "React Native", "Docker", "CI/CD", "AWS S3"],
  },
  {
    role: "Backend Engineering Intern",
    company: "Tellis Technologies Pvt. Ltd.",
    period: "Jun 2025 – Aug 2025",
    location: "Remote",
    bullets: [
      "Built a desktop employee monitoring tool that improved attendance tracking accuracy by 95% and automated real-time alert systems.",
      "Developed high-concurrency REST APIs using Node.js and Prisma, reducing data retrieval latency by 40% through NeonDB optimization.",
      "Architected real-time communication modules via WebRTC and Socket.io, supporting 500+ concurrent video/chat sessions with Redis state management.",
      "Authored technical documentation for public release, streamlining onboarding for 10+ new engineering hires."
    ],
    tags: ["Node.js", "Redis", "WebRTC", "Prisma", "PostgreSQL", "Socket.io"],
  }
];

export const projects = [
  {
    name: "Enterprise API Rate Limiter",
    period: "2026",
    description: "Industrial-grade traffic control system designed for high-availability environments.",
    bullets: [
      "Engineered to handle 10,000+ requests per second (RPS) using Redis-backed sliding window and token bucket algorithms.",
      "Implemented exceptional resilience features including dynamic thresholding and circuit breakers to prevent cascading failures.",
      "Optimized middleware latency to <2ms, ensuring zero impact on downstream microservice performance."
    ],
    tags: ["Java", "Spring Boot", "Redis", "Resilience4j", "System Design"],
    codeUrl: "https://github.com/sagnikmaity33/api-rate-limiter"
  },
  {
    name: "IPAM - IP Address Management",
    period: "2026",
    description: "Distributed system for automated IP allocation in enterprise networks.",
    bullets: [
      "Achieved 100% collision-free IP allocation using Redisson-based distributed locking across multiple clusters.",
      "Reduced network management overhead by 70% through automated scanning and real-time inventory updates.",
      "Supports subnetting for 1M+ address spaces with sub-millisecond lookup times."
    ],
    tags: ["Java", "Spring Boot", "Redis", "Redisson", "Microservices"],
    codeUrl: "https://github.com/sagnikmaity33/IPAM"
  },
  {
    name: "Patient Management Microservices",
    period: "2026",
    description: "Scalable healthcare ecosystem designed for high data integrity and security.",
    bullets: [
      "Designed a decoupled architecture of 5+ microservices, improving deployment frequency by 50% via independent scaling.",
      "Integrated secure patient data handling with 100% compliance on RESTful security standards.",
      "Utilized Eureka and Spring Cloud Gateway for seamless service discovery and routing."
    ],
    tags: ["Spring Boot", "Spring Cloud", "Microservices", "Eureka", "MySQL"],
    codeUrl: "https://github.com/sagnikmaity33/Patient-Mangement-spring-micro"
  }
];

export const awards = [];