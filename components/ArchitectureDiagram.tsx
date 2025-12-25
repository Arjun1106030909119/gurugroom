import React from 'react';
import { Laptop, Database, Server, Globe, Box, Key, Layers } from 'lucide-react';

const Node = ({ title, icon: Icon, color, sub }: { title: string, icon: any, color: string, sub?: string }) => (
  <div className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border-b-4 ${color} w-32 h-32 text-center`}>
    <div className="mb-2 p-2 bg-slate-50 rounded-full">
      <Icon className="text-slate-600" size={20} />
    </div>
    <span className="text-sm font-bold text-slate-800 leading-tight">{title}</span>
    {sub && <span className="text-xs text-slate-500 mt-1">{sub}</span>}
  </div>
);

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-8 p-6 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
      
      {/* Client Layer */}
      <div className="flex gap-4">
        <Node title="React Client" icon={Laptop} color="border-indigo-500" sub="SPA" />
      </div>

      <div className="h-8 w-0.5 bg-slate-300"></div>

      {/* Gateway */}
      <div className="flex gap-4">
        <Node title="API Gateway" icon={Globe} color="border-blue-500" sub="Express / Nginx" />
      </div>

      <div className="h-8 w-0.5 bg-slate-300"></div>

      {/* Services Layer */}
      <div className="p-6 bg-slate-100 rounded-xl border border-dashed border-slate-300 w-full max-w-4xl">
        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider text-center">Microservices Layer</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Node title="Auth Service" icon={Key} color="border-emerald-500" />
          <Node title="User Service" icon={Box} color="border-emerald-500" />
          <Node title="Matching" icon={Layers} color="border-emerald-500" />
          <Node title="Session" icon={Box} color="border-emerald-500" />
          <Node title="Video" icon={Server} color="border-emerald-500" />
        </div>
      </div>

      <div className="h-8 w-0.5 bg-slate-300"></div>

      {/* Data Layer */}
      <div className="flex gap-6">
        <Node title="MongoDB" icon={Database} color="border-amber-500" sub="Primary DB" />
        <Node title="Redis" icon={Database} color="border-red-500" sub="Cache / Queue" />
        <Node title="S3 Bucket" icon={Database} color="border-cyan-500" sub="Media Storage" />
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
