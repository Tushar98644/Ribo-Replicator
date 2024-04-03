'use client'
import { useEffect } from 'react';

export default function Viewer() {
 useEffect(() => {
    const loadScripts = async () => {
      await new Promise((resolve, reject) => {
        const script1 = document.createElement('script');
        script1.src = 'https://3Dmol.org/build/3Dmol-min.js';
        script1.onload = resolve;
        script1.onerror = reject;
        document.body.appendChild(script1);
      });

      await new Promise((resolve, reject) => {
        const script2 = document.createElement('script');
        script2.src = 'https://3Dmol.org/build/3Dmol.ui-min.js';
        script2.onload = resolve;
        script2.onerror = reject;
        document.body.appendChild(script2);
      });
    };

    loadScripts().then(() => {
        // @ts-ignore
      if (window?.$3Dmol) {
        // @ts-ignore
        window?.$3Dmol.autoload();
      }
    });

    return () => {
      const script1 = document.querySelector('script[src="https://3Dmol.org/build/3Dmol-min.js"]');
      const script2 = document.querySelector('script[src="https://3Dmol.org/build/3Dmol.ui-min.js"]');
      script1 && script1.remove();
      script2 && script2.remove();
    };
 }, []);

 return (
    <div className='viewer_3Dmoljs relative h-screen w-screen' data-pdb='2POR' data-backgroundcolor='0xffffff' data-style='stick' data-ui='true'></div>
 );
}