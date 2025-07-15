import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Shuffle, Moon, Sun, Github, Check } from 'lucide-react';

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [animatedLat, setAnimatedLat] = useState(0);
  const [animatedLng, setAnimatedLng] = useState(0);
  const [copied, setCopied] = useState(false);
  const [includeOceans, setIncludeOceans] = useState(true);

  // Continent bounding boxes (approximate)
  const continentBounds = [
    { name: 'North America', minLat: 25, maxLat: 72, minLng: -168, maxLng: -52 },
    { name: 'South America', minLat: -56, maxLat: 13, minLng: -82, maxLng: -35 },
    { name: 'Europe', minLat: 36, maxLat: 71, minLng: -10, maxLng: 40 },
    { name: 'Asia', minLat: 10, maxLat: 77, minLng: 26, maxLng: 180 },
    { name: 'Africa', minLat: -35, maxLat: 37, minLng: -18, maxLng: 52 },
    { name: 'Australia', minLat: -44, maxLat: -10, minLng: 113, maxLng: 154 },
    { name: 'Antarctica', minLat: -90, maxLat: -60, minLng: -180, maxLng: 180 }
  ];

  // Animation effect for numbers
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setAnimatedLat((Math.random() - 0.5) * 180);
        setAnimatedLng((Math.random() - 0.5) * 360);
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateRandomCoordinatesInContinent = () => {
    const continent = continentBounds[Math.floor(Math.random() * continentBounds.length)];
    const lat = continent.minLat + Math.random() * (continent.maxLat - continent.minLat);
    const lng = continent.minLng + Math.random() * (continent.maxLng - continent.minLng);
    return { lat, lng };
  };

  const generateRandomCoordinates = () => {
    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      let lat, lng;

      if (includeOceans) {
        lat = (Math.random() - 0.5) * 180;
        lng = (Math.random() - 0.5) * 360;
      } else {
        const coords = generateRandomCoordinatesInContinent();
        lat = coords.lat;
        lng = coords.lng;
      }

      setCoordinates({ lat, lng });
      setAnimatedLat(lat);
      setAnimatedLng(lng);
      setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    const coordsText = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    const url = `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const openGitHub = () => {
    window.open('https://github.com/HeySreelal/waypoint', '_blank');
  };

  const displayLat = isGenerating ? animatedLat : coordinates.lat;
  const displayLng = isGenerating ? animatedLng : coordinates.lng;

  const isDark = theme === 'dark';
  const hasCoordinates = coordinates.lat !== 0 || coordinates.lng !== 0;

  return (
    <div className={`min-h-screen px-4 py-6 sm:py-8 flex items-center justify-center transition-all duration-300 ${isDark
      ? 'bg-gray-900'
      : 'bg-gray-50'
      }`}>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center space-x-3 z-10">
        {/* Logo */}
        <div className={`p-2 rounded-lg border ${isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
          <img
            src="/logo.png"
            alt="Waypoint Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>

        <button
          onClick={openGitHub}
          className={`p-3 cursor-pointer rounded-lg transition-all duration-200 border ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600'
            : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          title="View on GitHub"
        >
          <Github className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-3 cursor-pointer rounded-lg transition-all duration-200 border ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600'
            : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-md mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 mt-16 sm:mt-20">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Waypoint
          </h1>
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDark
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-600'
              }`}>
              <p className="text-sm font-medium">
                🌍 Every click takes you to a unique place on Earth!
              </p>
            </div>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="mb-8 sm:mb-10">
          <div className={`p-6 sm:p-8 rounded-lg border ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            } ${hasCoordinates ? 'shadow-lg' : 'shadow-sm'}`}>

            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-sm mb-3 font-semibold tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Latitude
                </div>
                <div className={`text-3xl sm:text-4xl font-mono font-bold transition-all duration-200 ${isDark ? 'text-blue-400' : 'text-blue-600'} 
                  ${isGenerating ? 'blur-sm scale-105' : 'scale-100'}`}>
                  {displayLat.toFixed(6)}°
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`mx-3 w-2 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`w-16 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              </div>

              <div className="text-center">
                <div className={`text-sm mb-3 font-semibold tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Longitude
                </div>
                <div className={`text-3xl sm:text-4xl font-mono font-bold transition-all duration-200 ${isDark ? 'text-green-400' : 'text-green-600'} 
                  ${isGenerating ? 'blur-sm scale-105' : 'scale-100'}`}>
                  {displayLng.toFixed(6)}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ocean Inclusion Toggle */}
        <div className="mb-8 sm:mb-10">
          <div className={`p-4 sm:p-5 rounded-lg border ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            }`}>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className={`font-semibold text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Include oceans
                </span>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {includeOceans ? 'Anywhere on Earth' : 'Approximately, continental regions only'}
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={includeOceans}
                  onChange={(e) => setIncludeOceans(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center ${includeOceans
                  ? (isDark ? 'bg-blue-600' : 'bg-blue-500')
                  : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                  }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 transform ${includeOceans ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRandomCoordinates}
          disabled={isGenerating}
          className={`w-full font-bold py-5 sm:py-6 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-6 text-lg sm:text-xl ${isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${isGenerating
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:scale-105 active:scale-95'
            }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Shuffle className={`w-6 h-6 transition-transform duration-300 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating ? 'Generating...' : 'Generate Random Location'}
            </span>
          </div>
        </button>

        {/* Action Buttons */}
        {hasCoordinates && !isGenerating && (
          <div className="flex space-x-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <button
              onClick={copyToClipboard}
              className={`flex-1 font-semibold py-4 sm:py-5 px-5 rounded-lg transition-all duration-200 border ${isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center justify-center space-x-2">
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={openInGoogleMaps}
              className={`flex-1 font-semibold py-4 sm:py-5 px-5 rounded-lg transition-all duration-200 border ${isDark
                ? 'bg-green-800 hover:bg-green-700 text-green-300 border-green-700 hover:border-green-600'
                : 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700'
                } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ExternalLink className="w-5 h-5" />
                <span>Open Map</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}