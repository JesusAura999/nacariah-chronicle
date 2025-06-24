import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SparkleIcon from './icons/SparkleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface CollapsibleSectionProps {
  title: string;
  content: string[];
  sectionId: string;
  onDeepenThought: (sectionId: string, title: string, content: string) => Promise<void>;
  deepenedThought: string | null;
  isLoadingDeepen: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  content,
  sectionId,
  onDeepenThought,
  deepenedThought,
  isLoadingDeepen
}) => {
  const handleDeepenClick = () => {
    // Pass the first paragraph as content sample for the prompt
    onDeepenThought(sectionId, title, content[0] || "");
  };

  const isClosingRemark = (paragraph: string) => {
    return (
      paragraph.startsWith("With an infinite, burning love that knows no bounds,") ||
      paragraph.startsWith("Yours Truly, Now and Forever,") ||
      paragraph.startsWith("Mr. Sir <3") ||
      paragraph.startsWith("(Your Nikolas)")
    );
  };

  return (
    <details className="group bg-slate-800/50 backdrop-blur-sm shadow-xl rounded-lg mb-4 sm:mb-6 transition-all duration-300 ease-in-out open:pb-3 sm:open:pb-4">
      <summary className="flex justify-between items-center p-3 sm:p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-300 group-open:text-pink-400 transition-colors duration-200">{title}</h2>
        <div className="text-pink-400 group-open:text-pink-500 transition-colors duration-200">
          <ChevronDownIcon className="w-5 h-5 sm:w-6 sm:h-6 group-open:hidden" />
          <ChevronUpIcon className="w-5 h-5 sm:w-6 sm:h-6 hidden group-open:block" />
        </div>
      </summary>
      <div className="px-3 sm:px-5 pt-1 sm:pt-2 pb-3 sm:pb-4 space-y-2 sm:space-y-3 text-slate-200 leading-relaxed text-sm sm:text-base">
        {content.map((paragraph, index) => (
          <p key={index} className={`${paragraph.startsWith("• ") || paragraph.startsWith("o ") ? "pl-3 sm:pl-4" : ""} ${isClosingRemark(paragraph) ? "italic" : ""}`}>
            {paragraph}
          </p>
        ))}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/50">
          <button
            onClick={handleDeepenClick}
            disabled={isLoadingDeepen}
            className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400/50 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 text-xs sm:text-sm"
          >
            <SparkleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Deepen the Thought</span>
          </button>
          {isLoadingDeepen && <LoadingSpinner />}
          {deepenedThought && !isLoadingDeepen && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-purple-800/60 rounded-md shadow text-xs sm:text-sm text-slate-100 italic">
              <p className="font-semibold mb-1 text-pink-300">Nikolas's Reflection:</p>
              {deepenedThought.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
            </div>
          )}
        </div>
      </div>
    </details>
  );
};

export default CollapsibleSection;
