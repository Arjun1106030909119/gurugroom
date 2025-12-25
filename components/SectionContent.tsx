import React from 'react';
import { SectionId, BlueprintSection, MatchingFactor } from '../types';
import { MATCHING_FACTORS } from '../constants';
import MatchingChart from './MatchingChart';
import ArchitectureDiagram from './ArchitectureDiagram';
import { CheckCircle2, Terminal } from 'lucide-react';

interface Props {
  section: BlueprintSection;
}

const CodeBlock = ({ code, label }: { code: string; label?: string }) => (
  <div className="my-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
    {label && <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-300 border-b border-slate-700">{label}</div>}
    <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-300 leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

const SectionContent: React.FC<Props> = ({ section }) => {
  const { id, content } = section;

  switch (id) {
    case SectionId.FEATURES:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.categories.map((cat: any, idx: number) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case SectionId.ROLES:
      return (
        <div className="grid gap-4">
          {content.map((role: any, idx: number) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${role.color}`}>
              <h3 className="font-bold text-lg">{role.role}</h3>
              <p className="mt-1 text-sm opacity-90">{role.desc}</p>
            </div>
          ))}
        </div>
      );

    case SectionId.MATCHING:
      return (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Scoring Logic</h3>
              <CodeBlock code={content.code} label="match_algorithm.js" />
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-2">Key Factors</h4>
              <ul className="space-y-2">
                {MATCHING_FACTORS.map((f: MatchingFactor) => (
                  <li key={f.name} className="flex justify-between text-sm">
                    <span className="text-indigo-800">{f.name}</span>
                    <span className="font-mono font-bold text-indigo-600">{f.weight}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <MatchingChart />
        </div>
      );

    case SectionId.ARCHITECTURE:
      return <ArchitectureDiagram />;

    case SectionId.DATABASE:
      return (
        <div className="grid lg:grid-cols-2 gap-6">
          {content.map((schema: any, idx: number) => (
            <div key={idx}>
              <h3 className="text-md font-semibold text-slate-700 mb-2 ml-1">{schema.name}</h3>
              <CodeBlock code={schema.code} label="schema.json" />
            </div>
          ))}
        </div>
      );

    case SectionId.API:
      return (
        <div className="space-y-6">
          {content.map((group: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-700">{group.group}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {group.endpoints.map((ep: any, i: number) => (
                  <div key={i} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-2 py-1 rounded text-xs font-bold w-16 text-center
                        ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 
                          ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700' : 
                          ep.method === 'PUT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}
                      `}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-sm text-slate-700">{ep.url}</span>
                    </div>
                    <span className="text-sm text-slate-500">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case SectionId.VIDEO:
      return (
        <div className="space-y-6">
           <div className="grid md:grid-cols-2 gap-4">
             {content.strategies.map((strat: any, idx: number) => (
               <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-semibold text-slate-800">{strat.title}</h3>
                 <p className="text-sm text-slate-600 mt-2 mb-4">{strat.desc}</p>
                 <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-700 flex items-center gap-2">
                    <Terminal size={14} />
                    {strat.code}
                 </div>
               </div>
             ))}
           </div>
           <div className="bg-slate-900 text-slate-300 p-6 rounded-xl">
             <h3 className="text-white font-semibold mb-4">Required Capabilities</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {content.features.map((feat: string, i: number) => (
                 <div key={i} className="flex items-center gap-2 text-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   {feat}
                 </div>
               ))}
             </div>
           </div>
        </div>
      );

    case SectionId.IMPLEMENTATION:
      return (
        <div className="relative border-l-2 border-indigo-200 ml-3 space-y-8 py-4">
          {content.map((phase: any, idx: number) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800">{phase.phase}</h3>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full w-fit">
                  {phase.time}
                </span>
              </div>
              <p className="text-slate-600 text-sm">{phase.desc}</p>
            </div>
          ))}
        </div>
      );
      
    default:
      // Fallback for sections with simple structure like Scaling, Deployment, Auth
      return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );
  }
};

export default SectionContent;
