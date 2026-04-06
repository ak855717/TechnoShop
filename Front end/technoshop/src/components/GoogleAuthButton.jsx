import { useEffect, useRef, useState } from "react";

const loadGoogleScript = () =>
  new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function GoogleAuthButton({
  onCredential,
  disabled = false,
  buttonText = "continue_with",
}) {
  const buttonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    let isMounted = true;

    const renderGoogleButton = async () => {
      if (!buttonRef.current || !clientId) {
        return;
      }

      const loaded = await loadGoogleScript();
      if (!loaded || !isMounted || !window.google?.accounts?.id) {
        setLoadError(
          `If Google shows “Access blocked”, use a Google OAuth client of type "Web application", add ${currentOrigin || "http://localhost:5173"} to Authorized JavaScript origins, and add your Gmail as a Test user in Google Cloud Console.`
        );
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential && typeof onCredential === "function") {
            onCredential(response.credential);
          }
        },
        ux_mode: "popup",
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: buttonRef.current.clientWidth || 320,
        text: buttonText,
      });
      setLoadError("");
      setIsReady(true);
    };

    renderGoogleButton();

    return () => {
      isMounted = false;
    };
  }, [buttonText, clientId, currentOrigin, onCredential]);

  if (!clientId) {
    return <p className="text-sm text-gray-500">Google sign-in is unavailable right now.</p>;
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      {!isReady && (
        <button
          type="button"
          disabled
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-500"
        >
          Loading Google...
        </button>
      )}
      <div ref={buttonRef} className={isReady ? "flex justify-center" : "hidden"} />
      <p className="mt-2 text-center text-xs text-gray-500">
        Google sign-in for development should allow <span className="font-medium">{currentOrigin || "http://localhost:5173"}</span> in Authorized JavaScript origins.
      </p>
      {loadError && <p className="mt-2 text-center text-xs text-red-500">{loadError}</p>}
    </div>
  );
}
