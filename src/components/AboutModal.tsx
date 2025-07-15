
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Modal Component
const AboutModal = ({ isOpen, onClose, isDark }: { isOpen: boolean; onClose: () => void; isDark: boolean }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className={`max-w-md w-full rounded-xl p-6 relative shadow-2xl border ${isDark
                ? 'bg-gray-800 text-gray-200 border-gray-700'
                : 'bg-white text-gray-800 border-gray-200'
                }`}>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${isDark
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="pr-8">
                    <h2 className="text-xl font-bold mb-4">About Waypoint</h2>
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            I love browsing Google Maps street view, but I kept finding myself only looking at places I already knew about. There's literally millions of interesting spots on Earth, but I was stuck in my bubble of familiar locations.
                        </p>
                        <p>
                            Then recently a friend randomly asked me to send them some coordinates, and I just typed something off the top of my head. That's when it hit me - why not make a simple tool that just spits out random coordinates? It's dead simple, maybe a bit stupid, but hey, it works.
                        </p>
                        <div className="pt-2 border-t border-gray-600/20">
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Made by{' '}
                                <a
                                    href="https://github.com/HeySreelal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                                >
                                    @HeySreelal
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default AboutModal;