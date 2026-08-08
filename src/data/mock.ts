export const tracks = [
  { id: 1, name: 'Frontend Fundamentals', color: 'violet', days: 15, icon: 'layout' },
  { id: 2, name: 'Backend Basics', color: 'indigo', days: 15, icon: 'server' },
  { id: 3, name: 'Full Stack Integration', color: 'indigo', days: 15, icon: 'git-merge' },
  { id: 4, name: 'System Design & Scale', color: 'amber', days: 15, icon: 'database' },
];

export const days = Array.from({ length: 60 }, (_, i) => {
  const dayNum = i + 1;
  let trackId = 1;
  if (dayNum > 15) trackId = 2;
  if (dayNum > 30) trackId = 3;
  if (dayNum > 45) trackId = 4;

  const track = tracks.find(t => t.id === trackId)!;

  return {
    id: dayNum,
    title: `Day ${dayNum}: ${getDayTitle(dayNum, track.name)}`,
    track: track.name,
    trackColor: track.color,
    totalTime: `${Math.floor(Math.random() * 60 + 60)} min`,
    xp: Math.floor(Math.random() * 100 + 100),
    tasks: generateTasks(dayNum),
  };
});

function getDayTitle(day: number, trackName: string): string {
  const topics = {
    'Frontend Fundamentals': [
      'HTML & CSS Foundations',
      'CSS Flexbox & Grid',
      'JavaScript Basics',
      'DOM Manipulation',
      'ES6+ Features',
      'React Introduction',
      'Components & Props',
      'State & useState',
      'Effects & useEffect',
      'Hooks Deep Dive',
      'Forms & Validation',
      'React Router',
      'State Management',
      'Testing Basics',
      'Deployment',
    ],
    'Backend Basics': [
      'Node.js Fundamentals',
      'Express.js Setup',
      'REST API Design',
      'Middleware & Error Handling',
      'Database Basics (SQL)',
      'Prisma ORM',
      'Authentication (JWT)',
      'Authorization & Roles',
      'File Uploads',
      'Email & Notifications',
      'WebSockets',
      'Caching (Redis)',
      'Background Jobs',
      'API Documentation',
      'Testing APIs',
    ],
    'Full Stack Integration': [
      'Project Setup (Monorepo)',
      'Shared Types & Validation',
      'Auth Flow Integration',
      'Real-time Features',
      'State Sync (React Query)',
      'Optimistic Updates',
      'File Storage (S3)',
      'Image Optimization',
      'Search & Filtering',
      'Pagination & Infinite Scroll',
      'Webhooks',
      'CI/CD Pipeline',
      'Monitoring & Logs',
      'Performance Optimization',
      'Production Deploy',
    ],
    'System Design & Scale': [
      'System Design Fundamentals',
      'Database Design Patterns',
      'Caching Strategies',
      'Message Queues',
      'Microservices vs Monolith',
      'API Gateway & Rate Limiting',
      'Distributed Systems Basics',
      'Consistency & CAP Theorem',
      'Load Balancing',
      'Database Sharding',
      'Event-Driven Architecture',
      'Observability',
      'Disaster Recovery',
      'Security Best Practices',
      'Capstone Architecture Review',
    ],
  };

  const trackTopics = topics[trackName as keyof typeof topics] || topics['Frontend Fundamentals'];
  const topicIndex = (day - 1) % 15;
  return trackTopics[topicIndex];
}

function generateTasks(day: number) {
  const taskTypes = ['video', 'reading', 'coding', 'quiz', 'challenge'] as const;
  const taskTitles = {
    video: ['Watch: Concept Overview', 'Watch: Deep Dive', 'Watch: Best Practices'],
    reading: ['Reading: Official Docs', 'Reading: Blog Post', 'Reading: Case Study'],
    coding: ['Code: Build Feature', 'Code: Refactor', 'Code: Add Tests'],
    quiz: ['Quiz: Knowledge Check', 'Quiz: Scenario Based', 'Quiz: Code Review'],
    challenge: ['Challenge: Mini Project', 'Challenge: Debug Session', 'Challenge: Performance'],
  };

  return taskTypes.map((type, i) => ({
    id: `${day}-${i + 1}`,
    title: taskTitles[type][i % taskTitles[type].length],
    type,
    duration: `${Math.floor(Math.random() * 30 + 10)} min`,
    completed: Math.random() > 0.7 && day < 10,
  }));
}

export const userProgress = {
  currentDay: 12,
  currentStreak: 12,
  longestStreak: 18,
  totalDaysCompleted: 12,
  totalHours: 48.5,
  totalXP: 2840,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  badges: [
    { id: 'first-week', name: 'Week Warrior', description: 'Completed 7 days in a row', earned: true, date: '2024-01-07' },
    { id: 'first-month', name: 'Month Master', description: 'Completed 30 days', earned: false },
    { id: 'streak-10', name: 'Streak Starter', description: '10 day streak', earned: true, date: '2024-01-10' },
    { id: 'streak-30', name: 'Consistency King', description: '30 day streak', earned: false },
    { id: 'frontend-done', name: 'Frontend Finisher', description: 'Completed Track 1', earned: false },
    { id: 'backend-done', name: 'Backend Boss', description: 'Completed Track 2', earned: false },
    { id: 'fullstack-done', name: 'Full Stack Hero', description: 'Completed Track 3', earned: false },
    { id: 'system-design-done', name: 'Architecture Ace', description: 'Completed Track 4', earned: false },
    { id: 'challenge-complete', name: '60 Day Champion', description: 'Completed all 60 days', earned: false },
  ],
};