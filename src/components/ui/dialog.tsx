'use client';

import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');


  if (asChild && React.isValidElement(children)) {
    // Only add onClick if the child is a native DOM element (e.g., 'button', 'a', etc.)
    if (typeof children.type === 'string') {
      type NativeElement = React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      const nativeChild = children as NativeElement;
      const existingOnClick = nativeChild.props.onClick;
      const mergedOnClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (typeof existingOnClick === 'function') {
          existingOnClick(e as React.MouseEvent<HTMLElement, MouseEvent>);
        }
        context.onOpenChange(true);
      };
      return React.cloneElement(nativeChild, {
        onClick: mergedOnClick
      });
    }
    // Otherwise, just return the child as is
    return children;
  }

  return (
    <button onClick={() => context.onOpenChange(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  if (!context.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => context.onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
          <div className="relative">
            <button
              onClick={() => context.onOpenChange(false)}
              className="absolute right-4 top-4 p-1 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
