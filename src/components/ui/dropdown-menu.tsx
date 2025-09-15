'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  if (asChild && React.isValidElement(children)) {
    if (typeof children.type === 'string') {
      type NativeElement = React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      const nativeChild = children as NativeElement;
      const existingOnClick = nativeChild.props.onClick;
      const mergedOnClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (typeof existingOnClick === 'function') {
          existingOnClick(e as React.MouseEvent<HTMLElement, MouseEvent>);
        }
        context.onOpenChange(!context.open);
      };
      return React.cloneElement(nativeChild, {
        onClick: mergedOnClick
      });
    }
    return children;
  }

  return (
    <button onClick={() => context.onOpenChange(!context.open)}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

export function DropdownMenuContent({ className, align = 'end', children }: DropdownMenuContentProps) {
  const context = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement>(null);

  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (context) {
          context.onOpenChange(false);
        }
      }
    }

    if (context.open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [context]);

  if (!context.open) return null;

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
        alignClasses[align],
        className
      )}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DropdownMenuItem({ className, children, onClick, ...props }: DropdownMenuItemProps) {

  const context = useContext(DropdownContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (context) {
      context.onOpenChange(false);
    }
  };

  return (
    <button
      className={cn(
        'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('h-px bg-gray-200 my-1', className)} />;
}
