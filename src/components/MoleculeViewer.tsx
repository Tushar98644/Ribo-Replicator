'use client'
import { useEffect } from 'react';

export const MoleculeViewer = () => {
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
        // @ts-ignore
        const viewer = $3Dmol.createViewer('viewer-container', {
          backgroundColor: 'white',
        });
        let pdbUri = '';
        pdbUri = 'https://files.rcsb.org/download/1CRN.pdb';
        fetch(pdbUri)
        .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load PDB: ${response.statusText}`);
            }
            return response.text();
          })
          .then(data => {
            viewer.addModel(data, "pdb"); 
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.zoomTo();
            viewer.render();
            viewer.zoom(1.2, 1000); 
          })
          .catch(error => console.error(`Failed to load PDB ${pdbUri}: ${error}`));
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
    <div id="viewer-container" className='viewer-container relative h-screen w-screen' data-backgroundcolor='0xffffff' data-style='stick' data-ui='true'></div>
  );
}