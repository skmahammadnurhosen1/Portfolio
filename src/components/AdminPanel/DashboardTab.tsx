import React, { useState } from 'react';
import {
  Folder,
  Layout,
  FileEdit,
  Eye,
  ChevronDown,
  ArrowUpRight,
  MoreVertical,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { DashboardStats, ProjectItem } from './types';

interface DashboardTabProps {
  stats: DashboardStats | null;
  projects: ProjectItem[];
  onNavigateToProjects: () => void;
  onEditProject: (project: ProjectItem) => void;
}

export function DashboardTab({
  stats,
  projects,
  onNavigateToProjects,
  onEditProject,
}: DashboardTabProps) {
  const [timeRange, setTimeRange] = useState('7 Days');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; views: number } | null>(null);

  const totalProjectsCount = stats?.totalProjects ?? projects.length;
  const publishedCount = stats?.publishedProjects ?? projects.filter((p) => p.status === 'Live' || p.status === 'Published').length;
  const draftCount = stats?.draftProjects ?? projects.filter((p) => p.status === 'Draft').length;
  const totalViews = stats?.totalViews ?? '12.4K';

  // 7-day chart coordinates calculation
  const chartPoints = stats?.viewsData || [
    { date: 'Apr 10', views: 1200, label: 'Apr 10' },
    { date: 'Apr 11', views: 2500, label: 'Apr 11' },
    { date: 'Apr 12', views: 1800, label: 'Apr 12' },
    { date: 'Apr 13', views: 3200, label: 'Apr 13' },
    { date: 'Apr 14', views: 3600, label: 'Apr 14' },
    { date: 'Apr 15', views: 2400, label: 'Apr 15' },
    { date: 'Apr 16', views: 3100, label: 'Apr 16' },
  ];

  const maxViews = 4000;
  const chartWidth = 580;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Compute SVG polyline / path coordinates
  const svgCoords = chartPoints.map((pt, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (chartPoints.length - 1);
    const y = chartHeight - paddingY - (pt.views / maxViews) * (chartHeight - paddingY * 2);
    return { x, y, pt };
  });

  const linePath = svgCoords.reduce((acc, coord, i) => {
    return i === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
  }, '');

  const areaPath = `${linePath} L ${svgCoords[svgCoords.length - 1].x} ${chartHeight} L ${svgCoords[0].x} ${chartHeight} Z`;

  const recentList = projects.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Welcome back, Noor! Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      {/* 4 KPI / Stat Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Projects */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Folder className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Total Projects
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {totalProjectsCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <span>↑</span> 2 new
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Published */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Layout className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Published
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {publishedCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <span>↑</span> 1 updated
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Draft */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
              <FileEdit className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Draft
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {draftCount}
              </span>
              <span className="text-xs font-semibold text-stone-400">
                — no change
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Views */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Total Views
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {totalViews}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <span>↑</span> 18%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Views Chart + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Card: Project Views Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Project Views</h2>
              <p className="text-xs text-stone-400 mt-0.5">Last 7 days</p>
            </div>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 bg-stone-50/50 hover:bg-stone-100 transition-colors"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Responsive SVG Line Chart */}
          <div className="relative w-full h-[220px] pt-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 1000, 2000, 3000, 4000].map((val) => {
                const y = chartHeight - paddingY - (val / maxViews) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#F3F4F6"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] fill-stone-400 font-medium"
                    >
                      {val === 0 ? '0' : `${val / 1000}K`}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Filled Area */}
              <path d={areaPath} fill="url(#yellowGradient)" />

              {/* Golden Stroke Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Interactive Circles */}
              {svgCoords.map((coord, idx) => (
                <g key={idx}>
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:scale-150 transition-transform duration-150"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        x: coord.x,
                        y: coord.y,
                        label: coord.pt.label,
                        views: coord.pt.views,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X Axis Label */}
                  <text
                    x={coord.x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    className="text-[10px] fill-stone-400 font-medium"
                  >
                    {coord.pt.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute pointer-events-none bg-stone-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md -translate-x-1/2 -translate-y-8"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                }}
              >
                {hoveredPoint.views.toLocaleString()} views
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Recent Projects */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">Recent Projects</h2>
            <button
              onClick={onNavigateToProjects}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentList.map((project, idx) => (
              <div
                key={project.id || idx}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-stone-50/80 transition-colors border border-transparent hover:border-stone-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                    <img
                      src={project.imageUrl || '/file_00000000704c8230a66055ead8603089.png'}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                        {project.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          project.status === 'Draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {project.status || 'Live'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {idx === 0
                        ? 'Updated 2 days ago'
                        : idx === 1
                        ? 'Updated 3 days ago'
                        : 'Updated 5 days ago'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onEditProject(project)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-stone-400 font-medium">
              Showing top 3 of {totalProjectsCount} projects
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Motivational Banner */}
      <div className="relative rounded-3xl bg-[#FEF9E7] border border-amber-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-stone-950 shrink-0 shadow-sm">
            <Flame className="w-6 h-6 fill-stone-950" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-950">
              Keep Creating, Keep Growing!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Your work speaks louder than words. Keep building amazing things.
            </p>
          </div>
        </div>

        {/* Hand-drawn doodle sketch arrow */}
        <div className="relative z-10 shrink-0 flex items-center text-amber-500 font-serif italic text-2xl select-none pr-2">
          <span>↗</span>
        </div>
      </div>
    </div>
  );
}
