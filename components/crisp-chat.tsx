'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat() {
  useEffect(() => {
    // Initialize Crisp exactly as provided
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "608ebcb6-a75d-4144-bbf7-ff1ebe354ee9";
    
    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null; // This component doesn't render anything visible
} 