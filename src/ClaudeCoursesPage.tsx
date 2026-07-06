import {
  ArrowLeft,
  BookOpen,
  Code2,
  Terminal,
  Brain,
  Users,
  GraduationCap,
  HeartHandshake,
  Cpu,
  Cloud,
  Layers,
  Bot,
  Network,
  ChevronRight,
  ExternalLink,
  Star,
} from 'lucide-react';

interface Course {
  title: string;
  description: string;
  audience: string;
  coding: string | null;
  url: string;
  icon: React.ReactNode;
  category: 'everyone' | 'developer';
  featured?: boolean;
}

const courses: Course[] = [
  {
    title: 'Claude 101',
    description: 'If you take only one course, take this one. Learn to use Claude for everyday work: writing emails, organizing data, analyzing documents, and drafting content. No technical background required.',
    audience: 'Everyone',
    coding: null,
    url: 'https://anthropic.skilljar.com/claude-101',
    icon: <BookOpen className="w-6 h-6" />,
    category: 'everyone',
    featured: true,
  },
  {
    title: 'AI Fluency: Framework & Foundations',
    description: 'Learn thinking frameworks for AI, not just button clicks. Understand AI capability boundaries, which tasks to delegate, and when human judgment cannot be replaced. Certificate on completion.',
    audience: 'Everyone',
    coding: null,
    url: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations',
    icon: <Brain className="w-6 h-6" />,
    category: 'everyone',
    featured: true,
  },
  {
    title: 'AI Fluency for Students',
    description: 'Tailored for academic life. Covers research assistance, career planning, learning strategies, and how to leverage Claude effectively throughout your studies.',
    audience: 'Students',
    coding: null,
    url: 'https://anthropic.skilljar.com/ai-fluency-for-students',
    icon: <GraduationCap className="w-6 h-6" />,
    category: 'everyone',
  },
  {
    title: 'AI Fluency for Educators',
    description: 'Designed for teachers integrating AI into instruction. Covers curriculum design, assessment strategies, and classroom AI workflows that enhance student outcomes.',
    audience: 'Educators',
    coding: null,
    url: 'https://anthropic.skilljar.com/ai-fluency-for-educators',
    icon: <Users className="w-6 h-6" />,
    category: 'everyone',
  },
  {
    title: 'Teaching AI Fluency',
    description: 'For instructional designers who want to teach others to use AI. Covers scenario design, learning outcome evaluation, and building effective AI literacy curricula.',
    audience: 'Instructional Designers',
    coding: null,
    url: 'https://anthropic.skilljar.com/teaching-ai-fluency',
    icon: <Layers className="w-6 h-6" />,
    category: 'everyone',
  },
  {
    title: 'AI Fluency for Nonprofits',
    description: 'Co-developed with GivingTuesday. Tailored for resource-constrained organizations to leverage AI for greater impact across communications, operations, and fundraising.',
    audience: 'Nonprofits',
    coding: null,
    url: 'https://anthropic.skilljar.com/ai-fluency-for-nonprofits',
    icon: <HeartHandshake className="w-6 h-6" />,
    category: 'everyone',
  },
  {
    title: 'Building with the Claude API',
    description: 'The essential course for developers. From your first API call to agent systems: authentication, multi-turn conversations, tool use, RAG, extended thinking, prompt caching, and agent architecture.',
    audience: 'Developers',
    coding: 'Python',
    url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api',
    icon: <Code2 className="w-6 h-6" />,
    category: 'developer',
    featured: true,
  },
  {
    title: 'Claude Code in Action',
    description: 'Master Anthropic\'s agentic coding tool. Learn context management, custom commands, MCP server integration, GitHub workflow automation, and when to use thinking vs. planning mode.',
    audience: 'Developers',
    coding: 'CLI',
    url: 'https://anthropic.skilljar.com/claude-code-in-action',
    icon: <Terminal className="w-6 h-6" />,
    category: 'developer',
    featured: true,
  },
  {
    title: 'Introduction to Agent Skills',
    description: 'Extend Claude Code through SKILL.md files. Learn how Skills differ from CLAUDE.md and hooks, write skills from scratch, manage directory structure, and deploy enterprise-wide.',
    audience: 'Developers',
    coding: 'Markdown',
    url: 'https://anthropic.skilljar.com/introduction-to-agent-skills',
    icon: <Bot className="w-6 h-6" />,
    category: 'developer',
  },
  {
    title: 'Introduction to MCP',
    description: 'Build MCP servers and clients from scratch in Python. Covers the three core primitives — Tools, Resources, and Prompts — plus testing and debugging with the MCP Server Inspector.',
    audience: 'Developers',
    coding: 'Python',
    url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol',
    icon: <Network className="w-6 h-6" />,
    category: 'developer',
  },
  {
    title: 'MCP: Advanced Topics',
    description: 'Production-grade MCP: sampling, stdio vs. Streamable HTTP transport, roots-based file access permissions, horizontal scaling, and load balancer deployment.',
    audience: 'Developers',
    coding: 'Python',
    url: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics',
    icon: <Cpu className="w-6 h-6" />,
    category: 'developer',
  },
  {
    title: 'Claude with Amazon Bedrock',
    description: 'Deploy Claude on AWS Bedrock. Covers tool use, RAG pipelines, and agent architecture within the AWS ecosystem with proper authentication and IAM configuration.',
    audience: 'Developers',
    coding: 'Python',
    url: 'https://anthropic.skilljar.com/claude-in-amazon-bedrock',
    icon: <Cloud className="w-6 h-6" />,
    category: 'developer',
  },
  {
    title: 'Claude with Google Vertex AI',
    description: 'Run Claude on GCP Vertex AI with full developer workflows: vision capabilities, PDF processing, citation extraction, and production deployment patterns on Google Cloud.',
    audience: 'Developers',
    coding: 'Python',
    url: 'https://anthropic.skilljar.com/claude-with-google-vertex',
    icon: <Cloud className="w-6 h-6" />,
    category: 'developer',
  },
];

const codingBadge = (coding: string | null) => {
  if (!coding) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-navy-50 text-navy-700 border border-navy-200">
        No Coding
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
      <Code2 className="w-3 h-3" />
      {coding}
    </span>
  );
};

const CourseCard = ({ course }: { course: Course }) => (
  <a
    href={course.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-navy-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    {/* Top accent bar */}
    <div className={`h-1 w-full ${course.category === 'developer' ? 'bg-accent-600' : 'bg-navy-700'} transition-all duration-300 group-hover:h-1.5`} />

    {course.featured && (
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
          <Star className="w-3 h-3 fill-accent-600 text-accent-600" />
          Featured
        </span>
      </div>
    )}

    <div className="p-6 flex flex-col flex-1">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
        course.category === 'developer'
          ? 'bg-accent-50 text-accent-700 group-hover:bg-accent-100'
          : 'bg-navy-50 text-navy-700 group-hover:bg-navy-100'
      }`}>
        {course.icon}
      </div>

      {/* Title */}
      <h3 className="font-bold text-navy-900 text-lg leading-tight mb-2 group-hover:text-navy-700 transition-colors">
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">
        {course.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
          <Users className="w-3 h-3" />
          {course.audience}
        </span>
        {codingBadge(course.coding)}
      </div>

      {/* CTA */}
      <div className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
        course.category === 'developer' ? 'text-accent-700 group-hover:text-accent-800' : 'text-navy-700 group-hover:text-navy-900'
      }`}>
        Start Course
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
      </div>
    </div>
  </a>
);

const SectionHeader = ({
  title,
  subtitle,
  count,
  category,
}: {
  title: string;
  subtitle: string;
  count: number;
  category: 'everyone' | 'developer';
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className={`h-1 w-8 rounded-full ${category === 'developer' ? 'bg-accent-600' : 'bg-navy-700'}`} />
      <span className={`text-xs font-bold uppercase tracking-widest ${category === 'developer' ? 'text-accent-700' : 'text-navy-600'}`}>
        {count} courses
      </span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-2xl">{subtitle}</p>
  </div>
);

export const ClaudeCoursesPage = ({ onBack }: { onBack: () => void }) => {
  const everyoneCourses = courses.filter((c) => c.category === 'everyone');
  const devCourses = courses.filter((c) => c.category === 'developer');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-accent-400 text-sm font-semibold uppercase tracking-widest">Anthropic Academy</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                Claude Courses
              </h1>
              <p className="text-white/60 max-w-xl text-lg">
                13 free, self-paced courses from Anthropic — from AI basics to production-grade agent systems.
                Official certificates on completion.
              </p>
            </div>

            <div className="flex gap-4 shrink-0">
              <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold text-white">13</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Courses</p>
              </div>
              <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold text-white">Free</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">All courses</p>
              </div>
              <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold text-accent-400">Cert</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">On Completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* For Everyone */}
        <section>
          <SectionHeader
            title="For Everyone"
            subtitle="No coding required. Practical AI literacy and Claude fluency for professionals, students, educators, and nonprofits."
            count={everyoneCourses.length}
            category="everyone"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {everyoneCourses.map((course) => (
              <CourseCard key={course.url} course={course} />
            ))}
          </div>
        </section>

        {/* For Developers */}
        <section>
          <SectionHeader
            title="For Developers"
            subtitle="From your first API call to deploying production-grade agent systems. Hands-on courses requiring Python or CLI experience."
            count={devCourses.length}
            category="developer"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devCourses.map((course) => (
              <CourseCard key={course.url} course={course} />
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-navy-950 text-white p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Ready to get started?</h3>
            <p className="text-white/60">Browse all 13 courses on the Anthropic Academy platform.</p>
          </div>
          <a
            href="https://anthropic.skilljar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-3.5 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent-700/30 hover:-translate-y-0.5"
          >
            Visit Anthropic Academy
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
