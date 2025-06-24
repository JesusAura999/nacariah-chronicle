import React, { useState, useCallback, useEffect } from 'react';
import { CHRONICLE_DATA, APP_NAME, CHRONICLE_INTRO_SALUTATION, CHRONICLE_INTRO_PARAGRAPHS, CHERISHED_PHOTOS_BASE64 } from './constants';
import { ChronicleSectionData } from './types';
import CollapsibleSection from './components/CollapsibleSection';
import LoadingSpinner from './components/LoadingSpinner';
import HeartIcon from './components/icons/HeartIcon';
import PhotoGallery from './components/PhotoGallery';
import { generateSweetMessage, deepenThought } from './services/geminiService';

const App = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [sweetMessage, setSweetMessage] = useState<string | null>(null);
  const [isSweetMessageLoading, setIsSweetMessageLoading] = useState(false);
  const [deepenedThoughts, setDeepenedThoughts] = useState<Record<string, string | null>>({});
  const [isLoadingDeepen, setIsLoadingDeepen] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleGenerateSweetMessage = useCallback(async () => {
    setIsSweetMessageLoading(true);
    setApiError(null);
    try {
      const message = await generateSweetMessage("Nacariah");
      setSweetMessage(message);
    } catch (error) {
      console.error(error);
      setApiError("Failed to generate sweet message. Please check console for details.");
    } finally {
      setIsSweetMessageLoading(false);
    }
  }, []);

  const handleDeepenThought = useCallback(async (sectionId: string, title: string, content: string) => {
    setIsLoadingDeepen(prev => ({ ...prev, [sectionId]: true }));
    setApiError(null);
    try {
      const thought = await deepenThought(title, content);
      setDeepenedThoughts(prev => ({ ...prev, [sectionId]: thought }));
    } catch (error) {
      console.error(error);
      setApiError(`Failed to deepen thought for "${title}". Please check console for details.`);
      setDeepenedThoughts(prev => ({ ...prev, [sectionId]: "Error generating reflection." }));
    } finally {
      setIsLoadingDeepen(prev => ({ ...prev, [sectionId]: false }));
    }
  }, []);
  
  useEffect(() => {
    if (!isRevealed && !sweetMessage && !isSweetMessageLoading) {
        handleGenerateSweetMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, sweetMessage, isSweetMessageLoading, handleGenerateSweetMessage]); 

  return (
    <div className="min-h-screen container mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      <header className="text-center mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-pulse">
          {APP_NAME}
        </h1>
        <p className="text-slate-300 mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl italic">{CHRONICLE_INTRO_SALUTATION}</p>
      </header>

      {apiError && (
        <div className="bg-red-500/80 text-white p-3 rounded-md mb-6 max-w-2xl w-full text-center shadow-lg text-sm sm:text-base">
          {apiError}
        </div>
      )}

      {!isRevealed ? (
        <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-xl max-w-2xl w-full">
            <div className="text-slate-200 mb-5 sm:mb-6 space-y-3 leading-relaxed text-sm sm:text-base">
                {CHRONICLE_INTRO_PARAGRAPHS.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            {isSweetMessageLoading && !sweetMessage && <LoadingSpinner/>}
            {sweetMessage && !isSweetMessageLoading && (
                 <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-purple-700/50 rounded-lg shadow-xl ">
                    <p className="text-md sm:text-lg italic text-pink-200 leading-relaxed">{sweetMessage.split('\\n').map((line,idx) => <span key={idx} className="block">{line}</span>)}</p>
                </div>
            )}
          <button
            onClick={handleReveal}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-3 px-6 text-lg sm:py-4 sm:px-8 sm:text-xl rounded-lg shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-50"
          >
            Reveal Your Chronicle, My Love
          </button>
        </div>
      ) : (
        <main className="w-full max-w-3xl space-y-6 sm:space-y-8">
          <div className="p-4 sm:p-6 bg-slate-800/50 backdrop-blur-md shadow-xl rounded-lg text-center">
            {isSweetMessageLoading && <LoadingSpinner />}
            {sweetMessage && !isSweetMessageLoading && (
              <div className="mb-4">
                 <p className="text-md sm:text-lg italic text-pink-200">{sweetMessage.split('\\n').map((line,idx) => <span key={idx} className="block">{line}</span>)}</p>
              </div>
            )}
            <button
              onClick={handleGenerateSweetMessage}
              disabled={isSweetMessageLoading}
              className="flex items-center justify-center mx-auto space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500/50 text-white font-semibold py-2 px-4 sm:px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 text-sm sm:text-base"
            >
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Another Sweet Message from Nikolas</span>
            </button>
          </div>

          <PhotoGallery photos={CHERISHED_PHOTOS_BASE64} />
          
           <div className="text-slate-200 my-6 sm:my-8 p-4 sm:p-6 bg-slate-800/30 backdrop-blur-sm shadow-lg rounded-lg space-y-3 leading-relaxed text-sm sm:text-base">
              {CHRONICLE_INTRO_PARAGRAPHS.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
          </div>

          {CHRONICLE_DATA.map((section: ChronicleSectionData) => (
            <CollapsibleSection
              key={section.id}
              sectionId={section.id}
              title={section.title}
              content={section.content}
              onDeepenThought={handleDeepenThought}
              deepenedThought={deepenedThoughts[section.id] || null}
              isLoadingDeepen={isLoadingDeepen[section.id] || false}
            />
          ))}
        </main>
      )}
      <footer className="mt-10 sm:mt-12 text-center text-slate-400 text-xs sm:text-sm space-y-1">
        <p className="italic">With an infinite, burning love that knows no bounds,</p>
        <p className="italic">Yours Truly, Now and Forever,</p>
        <p className="italic">Mr. Sir &lt;3</p>
        <p className="italic">(Your Nikolas)</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} This chronicle is a living testament to a love that reshapes universes.</p>
      </footer>
    </div>
  );
};

export default App;
