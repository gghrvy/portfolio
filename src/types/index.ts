export interface NavbarLink {
  label: string;
  href: string;
}

export interface ServiceCard {
  id: string;
  icon: React.ComponentType<{ size: number }>;
  title: string;
  description: string;
  badge: {
    text: string;
    color: 'green' | 'amber' | 'blue';
  };
}

export interface ProjectCard {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: 'Live Demo' | 'In Development' | 'In Progress' | 'Concept UI';
  button: {
    label: string;
    href: string;
  };
}

export interface WaitlistEntry {
  email: string;
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Stat {
  value: string | number;
  label: string;
  isCounter?: boolean;
}
