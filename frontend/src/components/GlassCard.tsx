
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const GlassCard = ({ 
  children, 
  className = '', 
  hoverable = false, 
  intensity = 'medium' 
}: GlassCardProps) => {
  const intensityClasses = {
    low: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    high: 'bg-white/20 backdrop-blur-lg border-white/30'
  };

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-2xl transition-all duration-300',
        intensityClasses[intensity],
        hoverable && 'hover:bg-white/15 hover:scale-[1.02] hover:shadow-3xl',
        className
      )}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
