const blueprints = {
  fullstack: [
    {
      title: "HTML Foundations",
      description: "Learn semantic HTML, forms, accessibility, and page structure.",
      phase: "Foundations",
      estimatedHours: 6,
      difficulty: "beginner",
      practiceProject: "Build a semantic portfolio landing page.",
      resources: [
        { title: "MDN HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        { title: "freeCodeCamp Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }
      ],
      aiNotes: "Focus on semantic tags and accessible form controls."
    },
    {
      title: "CSS Layouts and Responsive Design",
      description: "Master the box model, Flexbox, Grid, responsive breakpoints, and design systems.",
      phase: "Foundations",
      estimatedHours: 8,
      difficulty: "beginner",
      practiceProject: "Recreate a responsive SaaS landing page.",
      resources: [
        { title: "MDN CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
        { title: "CSS Tricks Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
      ],
      aiNotes: "Ship one polished responsive layout before moving on."
    },
    {
      title: "JavaScript Fundamentals",
      description: "Cover variables, functions, arrays, objects, DOM manipulation, and async basics.",
      phase: "Core Skills",
      estimatedHours: 12,
      difficulty: "beginner",
      practiceProject: "Build a task tracker with local storage.",
      resources: [
        { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        { title: "JavaScript.info", url: "https://javascript.info/" }
      ],
      aiNotes: "Make sure you can explain array methods and promises in your own words."
    },
    {
      title: "Git and Collaboration",
      description: "Learn commits, branches, pull requests, and clean version control habits.",
      phase: "Core Skills",
      estimatedHours: 4,
      difficulty: "beginner",
      practiceProject: "Set up a multi-branch workflow for a small app.",
      resources: [
        { title: "Git Book", url: "https://git-scm.com/book/en/v2" },
        { title: "GitHub Skills", url: "https://skills.github.com/" }
      ],
      aiNotes: "Practice using feature branches and meaningful commit messages."
    },
    {
      title: "React Fundamentals",
      description: "Build component thinking, hooks, routing, forms, and state-driven UIs.",
      phase: "Frontend Development",
      estimatedHours: 14,
      difficulty: "intermediate",
      practiceProject: "Create a learning planner dashboard in React.",
      resources: [
        { title: "React Docs", url: "https://react.dev/" },
        { title: "Vite React Guide", url: "https://vitejs.dev/guide/" }
      ],
      aiNotes: "Be comfortable lifting state up and modeling reusable components."
    },
    {
      title: "Node.js and Express APIs",
      description: "Learn REST APIs, middleware, routing, validation, and structured server design.",
      phase: "Backend Development",
      estimatedHours: 12,
      difficulty: "intermediate",
      practiceProject: "Build an API for a notes or habit tracker app.",
      resources: [
        { title: "Express Docs", url: "https://expressjs.com/" },
        { title: "Node.js Learn", url: "https://nodejs.org/en/learn" }
      ],
      aiNotes: "Practice separating routing, controllers, and services."
    },
    {
      title: "PostgreSQL and Data Modeling",
      description: "Understand relational design, SQL joins, indexing, and migrations.",
      phase: "Backend Development",
      estimatedHours: 10,
      difficulty: "intermediate",
      practiceProject: "Design a schema for users, progress, and recommendations.",
      resources: [
        { title: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
        { title: "SQLBolt", url: "https://sqlbolt.com/" }
      ],
      aiNotes: "Spend time on joins, aggregate queries, and indexing decisions."
    },
    {
      title: "Authentication and Security",
      description: "Implement JWT auth, password hashing, protected routes, and API hardening.",
      phase: "Production Readiness",
      estimatedHours: 6,
      difficulty: "intermediate",
      practiceProject: "Secure a full stack app with login, signup, and protected actions.",
      resources: [
        { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
        { title: "JWT Introduction", url: "https://jwt.io/introduction" }
      ],
      aiNotes: "Understand why hashing and token expiration matter."
    },
    {
      title: "Deployment and Monitoring",
      description: "Deploy frontend and backend, manage environment variables, and monitor errors.",
      phase: "Production Readiness",
      estimatedHours: 6,
      difficulty: "intermediate",
      practiceProject: "Deploy your portfolio app with a production database.",
      resources: [
        { title: "Render Docs", url: "https://render.com/docs" },
        { title: "Vercel Docs", url: "https://vercel.com/docs" }
      ],
      aiNotes: "Document your deployment process so you can repeat it later."
    }
  ],
  ai: [
    {
      title: "Python Programming Foundations",
      description: "Learn Python syntax, functions, classes, and file handling.",
      phase: "Foundations",
      estimatedHours: 10,
      difficulty: "beginner",
      practiceProject: "Build a command-line study tracker.",
      resources: [
        { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
        { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/" }
      ],
      aiNotes: "Write small utilities to make the syntax stick."
    },
    {
      title: "Math for Machine Learning",
      description: "Strengthen linear algebra, probability, and core statistics.",
      phase: "Foundations",
      estimatedHours: 12,
      difficulty: "intermediate",
      practiceProject: "Explain gradient descent and regression in a study note.",
      resources: [
        { title: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" },
        { title: "Essence of Linear Algebra", url: "https://www.3blue1brown.com/topics/linear-algebra" }
      ],
      aiNotes: "Use visual explanations and simple experiments to keep the math practical."
    },
    {
      title: "Data Analysis with NumPy and Pandas",
      description: "Manipulate data, clean datasets, and explore trends.",
      phase: "Core Skills",
      estimatedHours: 8,
      difficulty: "beginner",
      practiceProject: "Analyze a public dataset and summarize insights.",
      resources: [
        { title: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
        { title: "NumPy Docs", url: "https://numpy.org/doc/" }
      ],
      aiNotes: "Focus on understanding data cleaning workflows."
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Learn supervised learning, evaluation metrics, bias, and validation.",
      phase: "Machine Learning",
      estimatedHours: 12,
      difficulty: "intermediate",
      practiceProject: "Train and evaluate a classification model on a clean dataset.",
      resources: [
        { title: "Scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
        { title: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }
      ],
      aiNotes: "Understand model evaluation before jumping into deep learning."
    },
    {
      title: "Neural Networks and Deep Learning",
      description: "Study neural nets, backpropagation, training loops, and embeddings.",
      phase: "Machine Learning",
      estimatedHours: 14,
      difficulty: "intermediate",
      practiceProject: "Build a simple image or text classifier.",
      resources: [
        { title: "DeepLearning.AI", url: "https://www.deeplearning.ai/" },
        { title: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" }
      ],
      aiNotes: "Keep experiments small and focus on intuition over scale."
    },
    {
      title: "Large Language Model Applications",
      description: "Work with prompts, embeddings, retrieval, evaluation, and AI product design.",
      phase: "Applied AI",
      estimatedHours: 10,
      difficulty: "advanced",
      practiceProject: "Create an AI assistant for a specific use case.",
      resources: [
        { title: "OpenAI Platform Docs", url: "https://platform.openai.com/docs" },
        { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/" }
      ],
      aiNotes: "Practice creating measurable evaluation criteria for prompts."
    }
  ],
  dataScience: [
    {
      title: "Python and SQL Foundations",
      description: "Build comfort with Python and SQL for real-world data work.",
      phase: "Foundations",
      estimatedHours: 12,
      difficulty: "beginner",
      practiceProject: "Combine SQL extraction with a small Python analysis notebook.",
      resources: [
        { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
        { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" }
      ],
      aiNotes: "Treat SQL and Python as a pair rather than separate skills."
    },
    {
      title: "Data Cleaning and Wrangling",
      description: "Handle missing values, reshape tables, and standardize messy datasets.",
      phase: "Core Skills",
      estimatedHours: 8,
      difficulty: "beginner",
      practiceProject: "Clean a dataset and document every transformation.",
      resources: [
        { title: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
        { title: "Kaggle Learn Pandas", url: "https://www.kaggle.com/learn/pandas" }
      ],
      aiNotes: "Good data science work starts with careful cleaning."
    },
    {
      title: "Statistics and Experimentation",
      description: "Cover distributions, hypothesis testing, confidence intervals, and A/B testing.",
      phase: "Core Skills",
      estimatedHours: 10,
      difficulty: "intermediate",
      practiceProject: "Design an experiment and explain which metric you would trust.",
      resources: [
        { title: "Think Stats", url: "https://greenteapress.com/wp/think-stats-2e/" },
        { title: "StatQuest", url: "https://www.youtube.com/c/joshstarmer" }
      ],
      aiNotes: "Translate statistics into decision-making, not memorization."
    },
    {
      title: "Visualization and Storytelling",
      description: "Communicate insights through charts, dashboards, and structured narratives.",
      phase: "Data Communication",
      estimatedHours: 6,
      difficulty: "beginner",
      practiceProject: "Create a visual report for a stakeholder audience.",
      resources: [
        { title: "Storytelling with Data", url: "https://www.storytellingwithdata.com/" },
        { title: "Seaborn Tutorial", url: "https://seaborn.pydata.org/tutorial.html" }
      ],
      aiNotes: "Your goal is clarity, not chart complexity."
    },
    {
      title: "Applied Machine Learning",
      description: "Move from exploratory analysis into predictive modeling and evaluation.",
      phase: "Advanced Skills",
      estimatedHours: 12,
      difficulty: "intermediate",
      practiceProject: "Build a predictive model with a performance review document.",
      resources: [
        { title: "Scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" },
        { title: "Hands-On Machine Learning", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/" }
      ],
      aiNotes: "Explain model tradeoffs in plain language."
    }
  ]
};

module.exports = {
  blueprints
};

