export interface ProfessionalRole {
  id: string;
  title: string;
  category: string;
  description?: string;
}

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  // I. Creative & Design
  // Designers
  { id: 'graphic-designer', title: 'Graphic Designer', category: 'Creative & Design' },
  { id: 'ui-ux-designer', title: 'UI/UX Designer', category: 'Creative & Design' },
  { id: 'web-designer', title: 'Web Designer', category: 'Creative & Design' },
  { id: 'product-designer', title: 'Product Designer', category: 'Creative & Design' },
  { id: 'brand-designer', title: 'Brand Designer', category: 'Creative & Design' },
  { id: 'illustrator', title: 'Illustrator', category: 'Creative & Design' },
  { id: 'animator', title: 'Animator', category: 'Creative & Design' },
  { id: 'motion-graphics-designer', title: 'Motion Graphics Designer', category: 'Creative & Design' },
  { id: '3d-artist', title: '3D Artist/Designer', category: 'Creative & Design' },
  { id: 'interior-designer', title: 'Interior Designer', category: 'Creative & Design' },
  { id: 'fashion-designer', title: 'Fashion Designer', category: 'Creative & Design' },
  { id: 'game-designer', title: 'Game Designer', category: 'Creative & Design' },

  // Writers & Editors
  { id: 'content-writer', title: 'Content Writer', category: 'Creative & Design' },
  { id: 'copywriter', title: 'Copywriter', category: 'Creative & Design' },
  { id: 'editor', title: 'Editor', category: 'Creative & Design' },
  { id: 'proofreader', title: 'Proofreader', category: 'Creative & Design' },
  { id: 'technical-writer', title: 'Technical Writer', category: 'Creative & Design' },
  { id: 'ghostwriter', title: 'Ghostwriter', category: 'Creative & Design' },
  { id: 'blogger', title: 'Blogger', category: 'Creative & Design' },
  { id: 'journalist', title: 'Journalist', category: 'Creative & Design' },
  { id: 'scriptwriter', title: 'Scriptwriter', category: 'Creative & Design' },
  { id: 'seo-writer', title: 'SEO Writer', category: 'Creative & Design' },

  // Multimedia & Photography
  { id: 'photographer', title: 'Photographer', category: 'Creative & Design' },
  { id: 'videographer', title: 'Videographer', category: 'Creative & Design' },
  { id: 'video-editor', title: 'Video Editor', category: 'Creative & Design' },
  { id: 'filmmaker', title: 'Filmmaker', category: 'Creative & Design' },
  { id: 'sound-designer', title: 'Sound Designer', category: 'Creative & Design' },
  { id: 'podcast-producer', title: 'Podcast Producer', category: 'Creative & Design' },

  // Marketing & Branding
  { id: 'marketing-specialist', title: 'Marketing Specialist', category: 'Creative & Design' },
  { id: 'brand-strategist', title: 'Brand Strategist', category: 'Creative & Design' },
  { id: 'social-media-manager', title: 'Social Media Manager', category: 'Creative & Design' },
  { id: 'seo-specialist', title: 'SEO Specialist', category: 'Creative & Design' },
  { id: 'ppc-specialist', title: 'PPC Specialist', category: 'Creative & Design' },
  { id: 'content-strategist', title: 'Content Strategist', category: 'Creative & Design' },
  { id: 'email-marketing-specialist', title: 'Email Marketing Specialist', category: 'Creative & Design' },
  { id: 'pr-specialist', title: 'PR Specialist', category: 'Creative & Design' },

  // II. Tech & Development
  // Software Development
  { id: 'software-engineer', title: 'Software Engineer', category: 'Tech & Development' },
  { id: 'full-stack-developer', title: 'Full-Stack Developer', category: 'Tech & Development' },
  { id: 'front-end-developer', title: 'Front-End Developer', category: 'Tech & Development' },
  { id: 'back-end-developer', title: 'Back-End Developer', category: 'Tech & Development' },
  { id: 'mobile-app-developer', title: 'Mobile App Developer (iOS/Android)', category: 'Tech & Development' },
  { id: 'web-developer', title: 'Web Developer', category: 'Tech & Development' },
  { id: 'game-developer', title: 'Game Developer', category: 'Tech & Development' },
  { id: 'devops-engineer', title: 'DevOps Engineer', category: 'Tech & Development' },
  { id: 'qa-engineer', title: 'QA Engineer', category: 'Tech & Development' },
  { id: 'data-scientist', title: 'Data Scientist', category: 'Tech & Development' },
  { id: 'machine-learning-engineer', title: 'Machine Learning Engineer', category: 'Tech & Development' },
  { id: 'ai-developer', title: 'AI Developer', category: 'Tech & Development' },

  // IT & Systems
  { id: 'it-consultant', title: 'IT Consultant', category: 'Tech & Development' },
  { id: 'network-administrator', title: 'Network Administrator', category: 'Tech & Development' },
  { id: 'system-administrator', title: 'System Administrator', category: 'Tech & Development' },
  { id: 'cybersecurity-specialist', title: 'Cybersecurity Specialist', category: 'Tech & Development' },
  { id: 'cloud-architect', title: 'Cloud Architect', category: 'Tech & Development' },

  // Data & Analytics
  { id: 'data-analyst', title: 'Data Analyst', category: 'Tech & Development' },
  { id: 'business-intelligence-analyst', title: 'Business Intelligence Analyst', category: 'Tech & Development' },
  { id: 'database-administrator', title: 'Database Administrator', category: 'Tech & Development' },

  // III. Business & Consulting
  // Consultants
  { id: 'business-consultant', title: 'Business Consultant', category: 'Business & Consulting' },
  { id: 'management-consultant', title: 'Management Consultant', category: 'Business & Consulting' },
  { id: 'strategy-consultant', title: 'Strategy Consultant', category: 'Business & Consulting' },
  { id: 'hr-consultant', title: 'HR Consultant', category: 'Business & Consulting' },
  { id: 'financial-consultant', title: 'Financial Consultant', category: 'Business & Consulting' },
  { id: 'legal-consultant', title: 'Legal Consultant', category: 'Business & Consulting' },

  // Project Management
  { id: 'project-manager', title: 'Project Manager', category: 'Business & Consulting' },
  { id: 'program-manager', title: 'Program Manager', category: 'Business & Consulting' },
  { id: 'scrum-master', title: 'Scrum Master', category: 'Business & Consulting' },

  // Operations & Admin
  { id: 'virtual-assistant', title: 'Virtual Assistant', category: 'Business & Consulting' },
  { id: 'administrative-assistant', title: 'Administrative Assistant', category: 'Business & Consulting' },
  { id: 'operations-manager', title: 'Operations Manager', category: 'Business & Consulting' },
  { id: 'executive-assistant', title: 'Executive Assistant', category: 'Business & Consulting' },

  // Sales & Customer Service
  { id: 'sales-consultant', title: 'Sales Consultant', category: 'Business & Consulting' },
  { id: 'customer-service-representative', title: 'Customer Service Representative', category: 'Business & Consulting' },
  { id: 'account-manager', title: 'Account Manager', category: 'Business & Consulting' },

  // Finance & Accounting
  { id: 'accountant', title: 'Accountant', category: 'Business & Consulting' },
  { id: 'bookkeeper', title: 'Bookkeeper', category: 'Business & Consulting' },
  { id: 'financial-analyst', title: 'Financial Analyst', category: 'Business & Consulting' },
  { id: 'auditor', title: 'Auditor', category: 'Business & Consulting' },
  { id: 'tax-preparer', title: 'Tax Preparer', category: 'Business & Consulting' },

  // Legal
  { id: 'paralegal', title: 'Paralegal', category: 'Business & Consulting' },
  { id: 'legal-researcher', title: 'Legal Researcher', category: 'Business & Consulting' },

  // IV. Education & Training
  // Educators
  { id: 'tutor', title: 'Tutor', category: 'Education & Training' },
  { id: 'online-instructor', title: 'Online Instructor', category: 'Education & Training' },
  { id: 'curriculum-developer', title: 'Curriculum Developer', category: 'Education & Training' },
  { id: 'corporate-trainer', title: 'Corporate Trainer', category: 'Education & Training' },
  { id: 'instructional-designer', title: 'Instructional Designer', category: 'Education & Training' },

  // V. Specialized & Niche Roles
  // Research & Analysis
  { id: 'researcher', title: 'Researcher', category: 'Specialized & Niche' },
  { id: 'market-research-analyst', title: 'Market Research Analyst', category: 'Specialized & Niche' },
  { id: 'business-analyst', title: 'Business Analyst', category: 'Specialized & Niche' },

  // Coaching
  { id: 'life-coach', title: 'Life Coach', category: 'Specialized & Niche' },
  { id: 'business-coach', title: 'Business Coach', category: 'Specialized & Niche' },
  { id: 'career-coach', title: 'Career Coach', category: 'Specialized & Niche' },
  { id: 'fitness-coach', title: 'Fitness Coach', category: 'Specialized & Niche' },

  // Translation & Localization
  { id: 'translator', title: 'Translator', category: 'Specialized & Niche' },
  { id: 'localizer', title: 'Localizer', category: 'Specialized & Niche' },
  { id: 'interpreter', title: 'Interpreter', category: 'Specialized & Niche' },
];

export const ROLE_CATEGORIES = [
  'Creative & Design',
  'Tech & Development', 
  'Business & Consulting',
  'Education & Training',
  'Specialized & Niche'
];

export const getRolesByCategory = (category: string) => {
  return PROFESSIONAL_ROLES.filter(role => role.category === category);
};

export const getAllRoles = () => PROFESSIONAL_ROLES;
