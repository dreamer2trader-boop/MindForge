import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Smartphone, Check } from "lucide-react";

export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (installed)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInstalled = isStandalone || isInWebAppiOS;
      
      setIsInstalled(isInstalled);
      
      if (isInstalled) {
        console.log("✅ NeonFlow is running as an installed PWA");
      }
    };

    checkInstalled();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => checkInstalled();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, []);

  // Only show for 3 seconds when installed
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (isInstalled) {
      setShowBadge(true);
      const timer = setTimeout(() => setShowBadge(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  if (!isInstalled || !showBadge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="glassmorphism rounded-2xl px-4 py-2 flex items-center gap-2 border border-green-400/30 neon-glow-cyan">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">App Installed</span>
        </div>
      </div>
    </motion.div>
  );
}
