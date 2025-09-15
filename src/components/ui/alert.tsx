import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const icons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertCircle
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-medium', className)} {...props}>
      {children}
    </h3>
  );
}

export function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn('mt-2 text-sm', className)} {...props}>
      {children}
    </div>
  );
}
