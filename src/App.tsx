import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Shuffle, Moon, Sun, Github } from 'lucide-react';

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState('dark'); // Default to dark mode

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
    // North America
    { name: 'North America', minLat: 25, maxLat: 72, minLng: -168, maxLng: -52 },
    // South America
    { name: 'South America', minLat: -56, maxLat: 13, minLng: -82, maxLng: -35 },
    // Europe
    { name: 'Europe', minLat: 36, maxLat: 71, minLng: -10, maxLng: 40 },
    // Asia
    { name: 'Asia', minLat: 10, maxLat: 77, minLng: 26, maxLng: 180 },
    // Africa
    { name: 'Africa', minLat: -35, maxLat: 37, minLng: -18, maxLng: 52 },
    // Australia
    { name: 'Australia', minLat: -44, maxLat: -10, minLng: 113, maxLng: 154 },
    // Antarctica
    { name: 'Antarctica', minLat: -90, maxLat: -60, minLng: -180, maxLng: 180 }
  ];

  // Animation effect for numbers
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setAnimatedLat((Math.random() - 0.5) * 180);
        setAnimatedLng((Math.random() - 0.5) * 360);
      }, 50);

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
        lat = (Math.random() - 0.5) * 180; // -90 to 90
        lng = (Math.random() - 0.5) * 360; // -180 to 180
      } else {
        const coords = generateRandomCoordinatesInContinent();
        lat = coords.lat;
        lng = coords.lng;
      }

      setCoordinates({ lat, lng });
      setAnimatedLat(lat);
      setAnimatedLng(lng);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    const coordsText = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    const url = `http://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const openGitHub = () => {
    window.open('https://github.com/HeySreelal/waypoint', '_blank');
  };

  const displayLat = isGenerating ? animatedLat : coordinates.lat;
  const displayLng = isGenerating ? animatedLng : coordinates.lng;

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center transition-all duration-300 relative ${isDark
      ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
      : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100'
      }`}>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2">
        <button
          onClick={openGitHub}
          className={`p-2 rounded-lg transition-all duration-200 ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            : 'bg-white/80 hover:bg-white text-gray-600'
            } cursor-pointer hover:shadow-xl`}
          title="View on GitHub"
        >
          <Github className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 ${isDark
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
            : 'bg-white/80 hover:bg-white text-gray-600'
            } cursor-pointer hover:shadow-xl`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-6">
            <img
              src="/logo.png"
              alt="Waypoint Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl object-cover"
            />
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'
            }`}>
            Waypoint
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Discover random places on Earth
          </p>
        </div>

        {/* Coordinates Display */}
        <div className="mb-8 sm:mb-10">
          <div className="text-center space-y-6">
            <div>
              <div className={`text-sm mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                Latitude
              </div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold transition-all duration-100 ${isDark ? 'text-emerald-400' : 'text-teal-700'
                } ${isGenerating ? 'blur-sm scale-110' : ''}`}>
                {displayLat.toFixed(6)}°
              </div>
            </div>

            <div className={`w-12 h-px mx-auto ${isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>

            <div>
              <div className={`text-sm mb-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                Longitude
              </div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold transition-all duration-100 ${isDark ? 'text-emerald-400' : 'text-teal-700'
                } ${isGenerating ? 'blur-sm scale-110' : ''}`}>
                {displayLng.toFixed(6)}°
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox for ocean inclusion */}
        <div className="mb-6 sm:mb-8">
          <label className="flex items-center justify-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeOceans}
              onChange={(e) => setIncludeOceans(e.target.checked)}
              className={`w-4 h-4 border rounded focus:ring-2 ${isDark
                ? 'text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500'
                : 'text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500'
                }`}
            />
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Include oceans
            </span>
          </label>
          <p className={`text-center text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
            {includeOceans ? 'Anywhere on Earth' : 'Approximately continental regions only'}
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRandomCoordinates}
          disabled={isGenerating}
          className={`w-full font-semibold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl mb-4 ${isDark
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
            : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700'
            } ${isGenerating
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-lg">
              {isGenerating ? 'Generating...' : 'Generate Random Location'}
            </span>
          </div>
        </button>

        {/* Action Buttons */}
        {(coordinates.lat !== 0 || coordinates.lng !== 0) && !isGenerating && (
          <div className="flex space-x-3">
            <button
              onClick={copyToClipboard}
              className={`flex-1 font-medium py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border ${isDark
                ? 'bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-gray-300 border-gray-600'
                : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 border-gray-200'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </div>
            </button>

            <button
              onClick={openInGoogleMaps}
              className={`flex-1 font-medium py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border ${isDark
                ? 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border-emerald-700'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Open Map</span>
              </div>
            </button>
          </div>
        )}

        {/* Fun fact */}
        <div className="text-center mt-8 sm:mt-10">
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            🌍 Every click takes you to a unique place on Earth!
          </p>
        </div>
      </div>
    </div>
  );
}