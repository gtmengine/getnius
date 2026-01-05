"use client";

import { X } from 'lucide-react';

interface SlideSidebarProps {
  item: any;
  onClose: () => void;
  children?: React.ReactNode;
}

export function SlideSidebar({ item, onClose, children }: SlideSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-[998] transition-opacity duration-200 ${
          item ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white border-l-4 border-purple-500 shadow-2xl z-[999] transition-all duration-200 ${
          item ? 'w-[380px]' : 'w-0 overflow-hidden'
        }`}
      >
        {item && (
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Details</h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {children}
          </div>
        )}
      </aside>
    </>
  );
}
