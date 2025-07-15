import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Shuffle } from 'lucide-react';

export default function App() {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [animatedLat, setAnimatedLat] = useState(0);
  const [animatedLng, setAnimatedLng] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const generateRandomCoordinates = () => {
    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      const lat = (Math.random() - 0.5) * 180; // -90 to 90
      const lng = (Math.random() - 0.5) * 360; // -180 to 180

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

  const displayLat = isGenerating ? animatedLat : coordinates.lat;
  const displayLng = isGenerating ? animatedLng : coordinates.lng;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 px-4 py-8 sm:py-12 flex items-center justify-center">
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Waypoint
          </h1>
          <p className="text-gray-600 text-lg">Discover random places on Earth</p>
        </div>

        {/* Coordinates Display */}
        <div className="mb-8 sm:mb-10">
          <div className="text-center space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2 font-medium">Latitude</div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold text-teal-700 transition-all duration-100 ${isGenerating ? 'blur-sm scale-110' : ''
                }`}>
                {displayLat.toFixed(6)}°
              </div>
            </div>

            <div className="w-12 h-px bg-gray-300 mx-auto"></div>

            <div>
              <div className="text-sm text-gray-500 mb-2 font-medium">Longitude</div>
              <div className={`text-2xl sm:text-3xl font-mono font-bold text-teal-700 transition-all duration-100 ${isGenerating ? 'blur-sm scale-110' : ''
                }`}>
                {displayLng.toFixed(6)}°
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRandomCoordinates}
          disabled={isGenerating}
          className={`w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl mb-4 ${isGenerating
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:scale-[1.02] active:scale-[0.98] hover:from-teal-600 hover:to-emerald-700'
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
              className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-medium py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </div>
            </button>

            <button
              onClick={openInGoogleMaps}
              className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg border border-emerald-200"
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
          <p className="text-gray-600 text-sm sm:text-base">
            🌍 Every click takes you to a unique place on Earth!
          </p>
        </div>
      </div>
    </div>
  );
}