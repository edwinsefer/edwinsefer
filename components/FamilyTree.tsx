import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Member } from '../types';

interface FamilyTreeProps {
  members: Member[];
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({ members }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(600, containerRef.current.clientHeight)
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!members.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Handle data structure. If multiple roots, we might need a dummy root.
    // For simplicity, we assume one primary root or we pick the first one with no parent.
    // Or we filter for the patriarch/matriarch.
    
    // Create a hierarchy
    try {
      const stratify = d3.stratify<Member>()
        .id(d => d.id)
        .parentId(d => d.parentId);

      // Handle missing parents gracefully by filtering or mocking root
      // Simple fix: find root.
      const rootMember = members.find(m => m.parentId === null);
      if (!rootMember) {
        svg.append("text").attr("x", 20).attr("y", 20).text("No root family member found (ParentId = null)");
        return;
      }

      const root = stratify(members);
      
      const treeLayout = d3.tree<Member>().size([innerWidth, innerHeight - 100]);
      treeLayout(root);

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
          .x(d => d.x!)
          .y(d => d.y!) as any
        )
        .attr('fill', 'none')
        .attr('stroke', '#a18072')
        .attr('stroke-width', 2);

      // Nodes
      const nodes = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

      // Node Circle (Image bg)
      nodes.append('circle')
        .attr('r', 30)
        .attr('fill', '#fdf8f6')
        .attr('stroke', '#8a6a5c')
        .attr('stroke-width', 3);
        
      // Images (using clip path or simpler pattern)
      // For simplicity in this demo, just text or simple color if image fails
      
      // Node Labels
      nodes.append('text')
        .attr('dy', 45)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .attr('class', 'text-xs font-bold fill-brand-900 bg-white/80 px-1 rounded');

      nodes.append('text')
        .attr('dy', 60)
        .attr('text-anchor', 'middle')
        .text(d => d.data.relation)
        .attr('class', 'text-[10px] fill-brand-600');

    } catch (e) {
      console.error("D3 Error:", e);
      svg.append("text").attr("x", 20).attr("y", 40).text("Could not render tree structure. Check parent/child links.");
    }

  }, [members, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] bg-brand-50 rounded-xl shadow-inner overflow-hidden border border-brand-200 relative">
       <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-lg shadow-sm border border-brand-100">
        <h3 className="text-brand-800 font-serif font-bold">Family Lineage</h3>
        <p className="text-xs text-brand-600">Zoom/Pan enabled</p>
      </div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="cursor-grab active:cursor-grabbing" />
    </div>
  );
};