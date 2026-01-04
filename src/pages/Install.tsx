import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { Download, Share, Smartphone, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container max-w-lg px-4 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 glow">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Install the App</h1>
          <p className="text-muted-foreground">
            Add to your home screen for quick access
          </p>
        </div>

        {isInstalled ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="font-semibold text-lg mb-2">Already Installed!</h2>
            <p className="text-muted-foreground text-sm">
              The app is installed on your device. You can find it on your home screen.
            </p>
          </div>
        ) : isIOS ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="font-semibold text-lg mb-4 text-center">
              Install on iOS
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground">
                    Look for the <Share className="inline h-4 w-4" /> icon at the bottom of Safari
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground">
                    You may need to scroll down in the share menu
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">
                    The app will appear on your home screen
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
            <Button
              onClick={handleInstall}
              className="w-full h-14 text-lg font-semibold rounded-xl glow"
            >
              <Download className="mr-2 h-5 w-5" />
              Install Now
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Quick access from your home screen, works offline
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="font-semibold text-lg mb-4 text-center">
              Install on Android / Desktop
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Open browser menu</p>
                  <p className="text-sm text-muted-foreground">
                    Tap the three dots (⋮) in Chrome or your browser
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Select "Install app" or "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground">
                    The option may vary by browser
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm installation</p>
                  <p className="text-sm text-muted-foreground">
                    The app will be added to your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-center mb-4">Why Install?</h3>
          {[
            "Works offline - download videos anytime",
            "Fast access from your home screen",
            "No app store needed",
            "Always up to date",
          ].map((benefit, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
            >
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Install;
