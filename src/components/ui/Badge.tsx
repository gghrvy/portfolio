import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'default';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-medium',
        variant === 'primary' && 'bg-blue-500/20 text-blue-400',
        variant === 'default' && 'bg-slate-800 text-slate-300'
      )}
    >
      {children}
    </span>
  );
}
