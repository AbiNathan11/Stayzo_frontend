'use client';

import React from 'react';
import { VolumeX, Volume1, Volume2, Info } from 'lucide-react';

// ─── Types (match the backend NoisePredictionResult) ─────────────────────────

export interface NoiseFactor {
  name: string;
  contribution: number;
  description: string;
}

export interface NoisePrediction {
  noiseLevelScore: number;
  label: 'Low' | 'Medium' | 'High';
  color: 'green' | 'yellow' | 'red';
  explanation: string;
  factors: NoiseFactor[];
}

interface NoiseAnalysisCardProps {
  noisePrediction?: NoisePrediction | null;
}

// ─── Level config ─────────────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  Low: {
    levelColor:    'text-emerald-600 bg-emerald-50 border-emerald-200',
    progressColor: 'bg-emerald-500',
    dotColor:      'bg-emerald-500',
    Icon:          VolumeX,
  },
  Medium: {
    levelColor:    'text-amber-600 bg-amber-50 border-amber-200',
    progressColor: 'bg-amber-500',
    dotColor:      'bg-amber-500',
    Icon:          Volume1,
  },
  High: {
    levelColor:    'text-rose-600 bg-rose-50 border-rose-200',
    progressColor: 'bg-rose-500',
    dotColor:      'bg-rose-500',
    Icon:          Volume2,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NoiseAnalysisCard({ noisePrediction }: NoiseAnalysisCardProps) {
  if (!noisePrediction) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Noise Level Analysis</p>
        <p className="text-xs text-gray-400 mt-2">Noise level data is being calculated for this property.</p>
      </div>
    );
  }

  const score = noisePrediction.noiseLevelScore;
  const label = noisePrediction.label;
  const cfg   = LEVEL_CONFIG[label] ?? LEVEL_CONFIG.Medium;
  const { Icon, levelColor, progressColor } = cfg;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Real-Time Acoustic Assessment
          </span>
          <h3 className="text-lg font-black text-[#1A1A1A] uppercase tracking-wide">
            Noise Level Analysis
          </h3>
        </div>

        {/* Level Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${levelColor}`}>
          <Icon className="w-4 h-4 shrink-0" />
          <span>{label} Noise</span>
        </div>
      </div>

      {/* Score + Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score */}
        <div className="text-center md:text-left md:border-r md:border-gray-100 md:pr-6">
          <div className="text-4xl font-black text-[#1A1A1A] tracking-tight">
            {score}<span className="text-sm font-bold text-gray-400">/100</span>
          </div>
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-1 block">
            Acoustic Score
          </span>
        </div>

        {/* Progress Bar */}
        <div className="md:col-span-2 space-y-2">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Quiet (0)</span>
            <span>Moderate (33)</span>
            <span>High (66+)</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-gray-500 leading-relaxed">
          {noisePrediction.explanation}
        </p>
      </div>




    </div>
  );
}
