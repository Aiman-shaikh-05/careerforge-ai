import type { RoadmapMilestone, InterviewQuestion } from "@workspace/db/schema";

export function generateResumeFeedback(fileName: string) {
  return {
    summary: `Your resume (${fileName}) presents a solid foundation with relevant technical experience. The structure is clear and the formatting is consistent. To maximize impact, focus on quantifying achievements and aligning keywords with target job descriptions.`,
    strengths: [
      "Clear project descriptions with technical details",
      "Good use of action verbs throughout",
      "Relevant technical skills listed prominently",
      "Education section is well-structured",
      "Projects demonstrate hands-on experience",
    ],
    missingSkills: [
      "Cloud platforms (AWS/GCP/Azure) experience",
      "Containerization (Docker/Kubernetes)",
      "CI/CD pipeline knowledge",
      "System design experience",
      "Open source contributions",
    ],
    improvements: [
      "Quantify achievements with metrics (e.g., 'Reduced load time by 40%')",
      "Add a professional summary section at the top",
      "Include links to GitHub profile and LinkedIn",
      "Tailor resume keywords to match job descriptions",
      "Add certifications section if applicable",
    ],
    atsScore: Math.floor(Math.random() * 20) + 65,
  };
}

export function generateProjectRecommendations(skills: string[], interests: string[], targetRole: string, count = 6) {
  const projectPool = [
    {
      title: "AI-Powered Resume Analyzer",
      description: "Build a tool that analyzes resumes using NLP, extracts key information, and provides improvement suggestions with ATS score calculation.",
      difficulty: "intermediate" as const,
      domain: "AI/ML",
      techStack: ["Python", "FastAPI", "spaCy", "React", "PostgreSQL"],
      whyItMatches: `Directly aligns with ${targetRole} role and demonstrates AI/ML skills`,
      estimatedHours: 60,
    },
    {
      title: "Real-time Collaborative Code Editor",
      description: "Create a web-based IDE with real-time collaboration, syntax highlighting, code execution, and integrated chat.",
      difficulty: "advanced" as const,
      domain: "Full Stack",
      techStack: ["React", "Node.js", "Socket.io", "Monaco Editor", "Docker"],
      whyItMatches: "Showcases full-stack capabilities and real-time system design",
      estimatedHours: 80,
    },
    {
      title: "Personal Finance Dashboard",
      description: "Build a dashboard to track income, expenses, investments, and financial goals with beautiful charts and insights.",
      difficulty: "intermediate" as const,
      domain: "Data Visualization",
      techStack: ["React", "TypeScript", "Recharts", "Express", "PostgreSQL"],
      whyItMatches: "Demonstrates data handling and visualization skills",
      estimatedHours: 45,
    },
    {
      title: "E-Commerce Microservices Backend",
      description: "Design and build a scalable e-commerce backend using microservices architecture with product, order, and payment services.",
      difficulty: "advanced" as const,
      domain: "Backend",
      techStack: ["Node.js", "Docker", "Kubernetes", "PostgreSQL", "Redis", "RabbitMQ"],
      whyItMatches: "Demonstrates scalable system design for backend roles",
      estimatedHours: 100,
    },
    {
      title: "ML Model Deployment Pipeline",
      description: "Build an end-to-end pipeline to train, evaluate, and deploy ML models with A/B testing and monitoring.",
      difficulty: "advanced" as const,
      domain: "MLOps",
      techStack: ["Python", "FastAPI", "Docker", "MLflow", "Grafana", "PostgreSQL"],
      whyItMatches: `Perfect for ${targetRole} - combines ML engineering with DevOps`,
      estimatedHours: 70,
    },
    {
      title: "Social Media Analytics Platform",
      description: "Create a platform that aggregates social media data, performs sentiment analysis, and visualizes trends.",
      difficulty: "intermediate" as const,
      domain: "Data Analytics",
      techStack: ["Python", "Pandas", "Streamlit", "PostgreSQL", "Twitter API"],
      whyItMatches: "Great for data analyst roles - showcases data pipeline and analytics",
      estimatedHours: 50,
    },
    {
      title: "Cloud Cost Optimizer",
      description: "Build a tool that monitors cloud resource usage, identifies optimization opportunities, and automates cost-saving actions.",
      difficulty: "intermediate" as const,
      domain: "Cloud Engineering",
      techStack: ["Python", "AWS SDK", "Terraform", "React", "PostgreSQL"],
      whyItMatches: "Directly relevant for cloud engineering roles",
      estimatedHours: 55,
    },
    {
      title: "Beginner Portfolio Website",
      description: "Create a responsive portfolio website with dark/light mode, project showcase, contact form, and smooth animations.",
      difficulty: "beginner" as const,
      domain: "Frontend",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      whyItMatches: "Essential first project to showcase your work",
      estimatedHours: 20,
    },
  ];

  return projectPool.slice(0, count).map((p, i) => ({ id: i + 1, ...p }));
}

export function generateRoadmap(targetRole: string, currentSkills: string[], experienceLevel = "beginner"): RoadmapMilestone[] {
  const roadmaps: Record<string, RoadmapMilestone[]> = {
    default: [
      {
        id: 1,
        title: "Foundations",
        description: "Build a solid programming and CS fundamentals base",
        level: "beginner",
        topics: ["Data Structures", "Algorithms", "Git & Version Control", "Linux Basics", "Problem Solving"],
        resources: ["LeetCode Easy problems", "CS50 on edX", "Pro Git Book", "The Linux Command Line"],
        estimatedWeeks: 6,
        order: 1,
      },
      {
        id: 2,
        title: "Core Skills for " + targetRole,
        description: `Learn the primary technical skills required for ${targetRole}`,
        level: "beginner",
        topics: ["Programming Language Proficiency", "OOP Principles", "REST APIs", "Databases (SQL/NoSQL)", "Testing Basics"],
        resources: ["Official language documentation", "freeCodeCamp", "SQLZoo", "Postman Learning Center"],
        estimatedWeeks: 8,
        order: 2,
      },
      {
        id: 3,
        title: "Intermediate Development",
        description: "Build real-world projects and deepen technical skills",
        level: "intermediate",
        topics: ["System Design Basics", "Cloud Fundamentals", "CI/CD Pipelines", "Docker & Containers", "Security Best Practices"],
        resources: ["System Design Primer (GitHub)", "AWS Free Tier", "Docker Documentation", "OWASP Top 10"],
        estimatedWeeks: 10,
        order: 3,
      },
      {
        id: 4,
        title: "Advanced & Specialization",
        description: `Specialize in ${targetRole}-specific advanced topics`,
        level: "advanced",
        topics: ["Distributed Systems", "Performance Optimization", "Architecture Patterns", "Leadership & Code Review", "Open Source Contribution"],
        resources: ["Designing Data-Intensive Applications", "Clean Architecture", "GitHub trending repos", "Tech blog reading"],
        estimatedWeeks: 12,
        order: 4,
      },
      {
        id: 5,
        title: "Job Readiness",
        description: "Prepare for interviews and job applications",
        level: "advanced",
        topics: ["Portfolio Building", "Technical Interview Prep", "System Design Interviews", "Behavioral Interviews", "Networking"],
        resources: ["Cracking the Coding Interview", "Pramp", "Blind 75 LeetCode list", "LinkedIn optimization"],
        estimatedWeeks: 4,
        order: 5,
      },
    ],
  };

  return roadmaps.default;
}

export function generateJobRecommendations(skills: string[], interests: string[], targetRole?: string | null) {
  const jobs = [
    {
      id: 1,
      title: "AI Engineer",
      description: "Design and build AI-powered systems and machine learning models for production environments.",
      requiredSkills: ["Python", "TensorFlow/PyTorch", "MLOps", "Docker", "Cloud Platforms"],
      matchPercentage: 85,
      salaryRange: "$95,000 - $150,000",
      growthOutlook: "high" as const,
      whyItMatches: "Your skills in Python and interest in AI align perfectly with this high-growth role",
      domain: "AI/ML",
    },
    {
      id: 2,
      title: "ML Engineer",
      description: "Build and deploy machine learning pipelines, data preprocessing systems, and model serving infrastructure.",
      requiredSkills: ["Python", "Scikit-learn", "SQL", "Spark", "Feature Engineering"],
      matchPercentage: 78,
      salaryRange: "$90,000 - $140,000",
      growthOutlook: "high" as const,
      whyItMatches: "Strong overlap with your technical background and interests",
      domain: "AI/ML",
    },
    {
      id: 3,
      title: "Backend Developer",
      description: "Build scalable server-side applications, APIs, and data storage solutions.",
      requiredSkills: ["Node.js/Python/Go", "REST/GraphQL", "PostgreSQL", "Redis", "Docker"],
      matchPercentage: 72,
      salaryRange: "$85,000 - $135,000",
      growthOutlook: "high" as const,
      whyItMatches: "Your programming fundamentals make you a strong backend candidate",
      domain: "Backend",
    },
    {
      id: 4,
      title: "Data Analyst",
      description: "Analyze datasets, create dashboards, and derive actionable insights for business decisions.",
      requiredSkills: ["SQL", "Python/R", "Tableau/Power BI", "Statistics", "Excel"],
      matchPercentage: 68,
      salaryRange: "$65,000 - $100,000",
      growthOutlook: "medium" as const,
      whyItMatches: "Good entry point into data-driven roles with your current skill set",
      domain: "Data",
    },
    {
      id: 5,
      title: "Cloud Engineer",
      description: "Design, implement, and maintain cloud infrastructure and DevOps pipelines.",
      requiredSkills: ["AWS/GCP/Azure", "Terraform", "Kubernetes", "CI/CD", "Linux"],
      matchPercentage: 62,
      salaryRange: "$90,000 - $145,000",
      growthOutlook: "high" as const,
      whyItMatches: "Cloud engineering is in high demand and pairs well with your background",
      domain: "Cloud",
    },
    {
      id: 6,
      title: "Full Stack Developer",
      description: "Build complete web applications from frontend UI to backend APIs and databases.",
      requiredSkills: ["React/Vue", "Node.js", "SQL", "REST APIs", "CSS/Tailwind"],
      matchPercentage: 75,
      salaryRange: "$80,000 - $130,000",
      growthOutlook: "medium" as const,
      whyItMatches: "Versatile role that leverages both frontend and backend skills",
      domain: "Full Stack",
    },
  ];

  return jobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function generateInterviewQuestions(targetRole: string, skills: string[], count = 10): InterviewQuestion[] {
  const questionBank: InterviewQuestion[] = [
    {
      id: 1,
      question: `What are the key responsibilities of a ${targetRole} and how do your skills align with them?`,
      category: "hr",
      difficulty: "easy",
      hint: "Focus on your technical skills and how they match the role requirements",
    },
    {
      id: 2,
      question: "Explain the difference between SQL and NoSQL databases and when you would use each.",
      category: "technical",
      difficulty: "medium",
      hint: "Consider ACID properties, scalability, and use cases like e-commerce vs social media",
    },
    {
      id: 3,
      question: "Walk me through a challenging project you worked on and how you overcame obstacles.",
      category: "project_based",
      difficulty: "medium",
      hint: "Use the STAR method: Situation, Task, Action, Result",
    },
    {
      id: 4,
      question: "What is the time and space complexity of common sorting algorithms?",
      category: "technical",
      difficulty: "medium",
      hint: "Cover bubble sort O(n²), merge sort O(n log n), quicksort average O(n log n)",
    },
    {
      id: 5,
      question: "How would you design a URL shortener system like bit.ly?",
      category: "technical",
      difficulty: "hard",
      hint: "Consider: hashing strategy, database design, caching with Redis, scaling to millions of requests",
    },
    {
      id: 6,
      question: "Tell me about yourself and your journey into tech.",
      category: "hr",
      difficulty: "easy",
      hint: "Keep it professional: education, key projects, what drives you, and your career goals",
    },
    {
      id: 7,
      question: "Describe a time you had to learn a new technology quickly. How did you approach it?",
      category: "hr",
      difficulty: "easy",
      hint: "Show your learning methodology, resourcefulness, and ability to work under pressure",
    },
    {
      id: 8,
      question: "What is REST and how does it differ from GraphQL?",
      category: "technical",
      difficulty: "medium",
      hint: "REST: multiple endpoints, fixed data; GraphQL: single endpoint, client-specified data",
    },
    {
      id: 9,
      question: "Tell me about a project where you used data analysis or machine learning.",
      category: "project_based",
      difficulty: "medium",
      hint: "Discuss the problem, dataset, methodology, and impact/results",
    },
    {
      id: 10,
      question: "How do you stay current with new technologies and industry trends?",
      category: "hr",
      difficulty: "easy",
      hint: "Mention blogs, GitHub, open source, communities, online courses",
    },
    {
      id: 11,
      question: "What is the difference between process and thread? When would you use each?",
      category: "technical",
      difficulty: "hard",
      hint: "Processes are isolated, threads share memory. Use threads for CPU-intensive tasks, processes for isolation",
    },
    {
      id: 12,
      question: "Describe a situation where you disagreed with a team decision. How did you handle it?",
      category: "hr",
      difficulty: "medium",
      hint: "Show professionalism, constructive communication, and ability to compromise",
    },
  ];

  return questionBank.slice(0, Math.min(count, questionBank.length));
}
