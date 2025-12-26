'use client';

import { useEffect, useRef, useState } from 'react';

export default function GraphPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/ideas').then(r => r.json()),
      fetch('/api/links').then(r => r.json())
    ]).then(([ideasData, linksData]) => {
      setIdeas(ideasData);
      setLinks(linksData);
      
      const width = containerRef.current?.clientWidth || 1000;
      const height = 700;

      const initialNodes = ideasData.map((idea: any) => ({
        ...idea,
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
        vx: 0,
        vy: 0
      }));
      setNodes(initialNodes);
    });
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    
    let animationFrameId: number;
    const width = containerRef.current?.clientWidth || 1000;
    const height = 700;
    
    const tick = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(node => ({ ...node }));
        
        // Repulsion
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[i].x - newNodes[j].x;
            const dy = newNodes[i].y - newNodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 5000 / (distance * distance); 
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            newNodes[i].vx += fx;
            newNodes[i].vy += fy;
            newNodes[j].vx -= fx;
            newNodes[j].vy -= fy;
          }
        }

        // Attraction
        links.forEach(link => {
           const source = newNodes.find(n => n._id === link.fromIdeaId?._id || n._id === link.fromIdeaId);
           const target = newNodes.find(n => n._id === link.toIdeaId?._id || n._id === link.toIdeaId);
           if (source && target) {
             const dx = target.x - source.x;
             const dy = target.y - source.y;
             const distance = Math.sqrt(dx * dx + dy * dy) || 1;
             const force = (distance - 150) * 0.05; 
             const fx = (dx / distance) * force;
             const fy = (dy / distance) * force;
             
             source.vx += fx;
             source.vy += fy;
             target.vx -= fx;
             target.vy -= fy;
           }
        });

        // Center gravity
        newNodes.forEach(node => {
           const dx = width / 2 - node.x;
           const dy = height / 2 - node.y;
           node.vx += dx * 0.01;
           node.vy += dy * 0.01;
           
           node.vx *= 0.9;
           node.vy *= 0.9;
           
           node.x += node.vx;
           node.y += node.vy;
        });

        return newNodes;
      });
      
      animationFrameId = requestAnimationFrame(tick);
    };
    
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [links, ideas.length]); // Intentionally removed 'nodes' to avoid dependency loop

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gitlab-gray-900 mb-1">Idea Trellis</h1>
        <p className="text-gitlab-gray-500">Visualizing connections between your ideas.</p>
      </div>
      
      <div 
        ref={containerRef}
        className="bg-gitlab-gray-50 border border-gitlab-gray-200 rounded shadow-inner overflow-hidden relative"
        style={{ height: '700px' }}
      >
        <svg ref={svgRef} width="100%" height="100%" className="block">
           {/* Links */}
           {links.map((link, i) => {
              const source = nodes.find(n => n._id === link.fromIdeaId?._id || n._id === link.fromIdeaId);
              const target = nodes.find(n => n._id === link.toIdeaId?._id || n._id === link.toIdeaId);
              if (!source || !target) return null;
              
              return (
                <line 
                  key={i}
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              );
           })}

           {/* Nodes */}
           {nodes.map((node) => (
             <g key={node._id} transform={`translate(${node.x},${node.y})`}>
               <circle r="25" fill="#fff" stroke="#7b58cf" strokeWidth="2" cursor="pointer" className="hover:fill-gitlab-gray-50 transition-colors" />
               <text 
                 textAnchor="middle" 
                 dy="4" 
                 fill="#333" 
                 fontSize="10" 
                 fontWeight="500"
                 style={{ pointerEvents: 'none' }}
               >
                 {node.title.substring(0, 8)}..
               </text>
               <title>{node.title}</title>
             </g>
           ))}
        </svg>
      </div>
    </div>
  );
}
