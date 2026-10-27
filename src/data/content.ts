import { features } from "node:process";

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
  resumePublicPath: "/AI+java-sagnik.pdf",
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
  "name": "PayFlow",
  "period": "2025",
  "description": "Distributed payment orchestration platform implementing a resilient microservices-based transaction workflow for real-world financial processing.",
  "bullets": [
    "Architected and implemented a multi-service payment pipeline with API Gateway, Orchestrator, Wallet, Fraud, Ledger, and Notification services using Java 21 and Spring Boot 3.",
    "Built an event-driven architecture with Kafka for asynchronous processing, PostgreSQL for transactional persistence, and Redis for idempotency and fast state checks.",
    "Implemented core reliability mechanisms including Outbox pattern, optimistic locking, deduplication, retries, timeouts, and circuit breakers via Resilience4j.",
    "Modeled distributed transaction orchestration with saga-style coordination, integrating fraud checks and wallet updates while preserving system consistency under failure scenarios.",
    "Added observability features using Micrometer, Prometheus, Zipkin, and actuator endpoints for metrics, tracing, and health monitoring.",
    "Containerized the platform with Docker Compose and structured the project as a Maven multi-module system for modular service development and deployment."
  ],
  "tags": ["Java", "Spring Boot", "Microservices", "Kafka", "Redis", "PostgreSQL", "Resilience4j", "Distributed Systems", "System Design"],
  "codeUrl": "https://github.com/sagnikmaity33/Payflow",
  "preview": "/Payflow-image.png",
  "type": "Backend",
  "demoUrl": "#"
  },

  {
  "name": "Livyfy",
  "period": "2025",
  "description": "AI-powered campus housing marketplace that connects renters and owners through smart listing discovery, semantic search, and modular backend architecture for scalable property matching.",
  "summary": "Livyfy is a smart housing platform designed for campus communities, helping students and renters discover suitable accommodations faster through intelligent search and AI-powered ranking. The project combines a Spring Boot backend, PostgreSQL database, and a FastAPI + ChromaDB AI service to build a hybrid search ecosystem where property listings are stored, filtered, semantically understood, and ranked for relevance. The system follows a multi-stage AI orchestration model—not a full autonomous agent swarm, but an agent-like workflow in which the database layer filters listings, the AI layer embeds and ranks them, and the application layer delivers the final best-fit results. This makes the platform more than a basic listing app; it becomes an AI-assisted decision engine for housing discovery.",
  "workingPrinciple": "Livyfy works through a modular, feature-based architecture where each domain is isolated into dedicated layers: listing management, search, and AI integration. A listing is created through the backend, persisted in PostgreSQL, and also sent to the AI service to generate embeddings for semantic search. During search, the system applies DB filters such as price, location, and verification status, shortlists relevant listings, and then passes them to the AI ranking service for semantic similarity scoring. This hybrid workflow—DB filtering + AI ranking—ensures both precision and contextual relevance. The platform is built with 3 core services in Docker: the Spring Boot backend, PostgreSQL database, and FastAPI AI service, and supports 2 primary user roles: renters and owners. The project includes 4 core listing endpoints and 2 AI endpoints, enabling efficient listing CRUD operations and real-time semantic querying.",
  "bullets": [
    "Built an AI-powered campus housing marketplace connecting 2 primary user groups: renters and owners.",
    "Developed a hybrid search system combining structured database filtering with semantic AI-based ranking for better listing relevance.",
    "Designed a modular backend architecture with feature-based organization and 3 core Docker services: backend, database, and AI service.",
    "Implemented listing CRUD operations with 4 core listing endpoints and AI integration through 2 dedicated AI endpoints.",
    "Integrated FastAPI + ChromaDB + SentenceTransformers to store embeddings and perform semantic matching for property discovery.",
    "Created a multi-stage AI orchestration pipeline where filtering, embedding, and ranking occur in sequence to improve search quality and user experience.",
    "Built the platform with scalability in mind using a service-oriented setup intended for future booking, authentication, and monetization features.",
    "Positioned the project as a strong MVP for a marketplace SaaS product, with clear next steps in JWT auth, booking flow, pagination, and geospatial search."
  ],
  "tags": [
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "FastAPI",
    "ChromaDB",
    "Semantic Ranking",
    "Hybrid Search",
    "Docker",
  ],
  "codeUrl": "https://github.com/sagnikmaity33/Livyfy",
  "featured": "#",
  "preview": "/Livify-image.png",
  "demoUrl": "#"
},
  
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
    codeUrl: "https://github.com/sagnikmaity33/api-rate-limiter",
    preview:"/api-rate-limiter.png",
    type:"Backend",
    demoUrl:"#"
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
    codeUrl: "https://github.com/sagnikmaity33/IPAM",
    preview:"/IP-ADREESS-image.png",
    type:"Backend",
    demoUrl:"#"
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
    codeUrl: "https://github.com/sagnikmaity33/Patient-Mangement-spring-micro",
    preview:"#",
    type:"Backend",
    demoUrl:"#"
  },
  {
  name: "Uber Clone - Real-time Ride-Sharing Platform",
  period: "2025",
  description: "Enterprise-grade ride-sharing backend with real-time location tracking, JWT-based authentication, and dynamic fare calculation—supporting 100+ concurrent rides.",
  bullets: [
    "Engineered a scalable Node.js/Express REST API handling 1000+ requests/minute with JWT token-based authentication and password encryption via bcrypt, achieving 99.5% uptime.",
    "Implemented real-time location tracking using Socket.IO with live captain position updates to 95%+ availability, reducing rider wait times by 40% through optimized spatial queries.",
    "Built comprehensive ride management system with dynamic fare calculation, OTP verification, and multi-vehicle type support (car, moto, auto) across 3+ ride categories.",
    "Integrated Google Maps API for address geocoding, distance-time calculation, and autocomplete suggestions with 98% accuracy, enabling precise fare estimation.",
    "Designed dual-role authentication system for Users & Captains with profile management, logout blacklisting, and role-based access control (RBAC) across 8+ protected endpoints.",
    "Optimized MongoDB queries with indexed geospatial lookups, reducing location search latency by 60% for captain discovery."
  ],
  tags: ["Node.js", "Express.js", "Socket.IO", "MongoDB", "JWT", "Real-time", "REST API", "Bcrypt", "Google Maps API", "Geospatial", "CORS", "Validation"],
  codeUrl: "https://github.com/sagnikmaity33/UBER_CLONE",
    preview:"/UBER-clone-image.png",
    demoUrl:"#"
},
{
  name: "Car-Showcase",
  period: "2025-2026",
  description: "Modern, responsive automotive showcase platform delivering immersive user experiences with dynamic filtering and real-time data visualization.",
  bullets: [
    "Built responsive web interface with 95%+ CSS styling efficiency, ensuring pixel-perfect design across 12+ device breakpoints.",
    "Implemented advanced JavaScript functionality for real-time car filtering, search optimization achieving 40% faster query performance.",
    "Leveraged modern web technologies to create interactive UI components with 98%+ performance score on Lighthouse audits.",
    "Engineered scalable front-end architecture supporting 1000+ concurrent users with zero latency degradation."
  ],
  tags: ["JavaScript", "CSS", "React", "Responsive Design", "UI/UX", "Modern Web Development"],
  codeUrl: "https://github.com/sagnikmaity33/Car-Showcase",
    preview:"#",
    demoUrl:"#"
}
];

export const awards = [];