import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ModernTemplate } from './ModernTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { AtsTemplate } from './AtsTemplate';
import { Button } from '../ui/Button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function ResumePreview() {
  const { data, template } = useResumeStore();
  const [zoom, setZoom] = useState(0.85); // Default zoom to fit better in most screens
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
  const handleReset = () => setZoom(0.85);

  // Add interactive zoom via Mouse Wheel + Ctrl
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => container?.removeEventListener('wheel', handleWheel);
  }, []);

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'ats':
        return <AtsTemplate data={data} />;
      default:
        return <AtsTemplate data={data} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-100/50 relative overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-6 z-20 flex flex-col gap-2 print:hidden group">
        <div className="bg-white/90 backdrop-blur-md border border-zinc-200 rounded-2xl p-1.5 shadow-xl flex flex-col gap-1 ring-1 ring-black/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-600"
            title="Zoom In (Ctrl + Scroll Up)"
          >
            <ZoomIn size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-600"
            title="Zoom Out (Ctrl + Scroll Down)"
          >
            <ZoomOut size={20} />
          </Button>
          <div className="h-px bg-zinc-200 mx-2 my-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-600"
            title="Reset Zoom"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-2 py-1 shadow-lg text-[10px] font-bold text-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-12 flex justify-center items-start custom-scrollbar bg-zinc-200/30"
      >
        <div 
          className="transition-all duration-200 origin-top flex flex-col items-center"
          style={{ width: `${210 * zoom}mm`, minWidth: `${210 * zoom}mm` }}
        >
          <div 
            id="resume-preview-container" 
            className="bg-white shadow-2xl print:shadow-none print:m-0 relative overflow-hidden transition-all duration-200 origin-top"
            style={{ 
              width: '210mm', 
              height: '297mm',
              transform: `scale(${zoom})`,
              marginBottom: `calc(297mm * (${zoom} - 1) + 2rem)`
            }}
          >
            <div className="absolute inset-0 p-[15mm] print:p-0 overflow-visible text-left">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

