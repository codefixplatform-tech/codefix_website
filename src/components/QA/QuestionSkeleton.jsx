import React from 'react';
import { motion } from 'framer-motion';

const QuestionSkeleton = () => {
  return (
    <div className="bg-surface/30 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden animate-pulse">
      <div className="flex gap-6 items-start">
        {/* Vote Skeleton */}
        <div className="hidden md:flex flex-col items-center gap-3 py-4 px-3 bg-white/5 rounded-2xl w-16">
          <div className="w-4 h-4 bg-white/10 rounded"></div>
          <div className="w-8 h-6 bg-white/10 rounded"></div>
          <div className="w-4 h-4 bg-white/10 rounded"></div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10"></div>
            <div className="space-y-2">
              <div className="w-32 h-3 bg-white/10 rounded"></div>
              <div className="w-20 h-2 bg-white/5 rounded"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-full h-6 bg-white/10 rounded-xl"></div>
            <div className="w-3/4 h-4 bg-white/5 rounded-lg"></div>
          </div>

          <div className="flex gap-3">
            <div className="w-16 h-6 bg-white/5 rounded-lg"></div>
            <div className="w-20 h-6 bg-white/5 rounded-lg"></div>
            <div className="w-14 h-6 bg-white/5 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSkeleton;
