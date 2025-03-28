'use client'
import axios from 'axios';
import { useEffect } from 'react';

export const MoleculeViewer = () => {
  useEffect(() => {
    console.log('useEffect triggered');

    let isMounted = true;
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

    loadScripts().then(async () => {

      if (isMounted) {
        // @ts-ignore
        if (window?.$3Dmol) {
          // @ts-ignore
          window?.$3Dmol.autoload();
          // @ts-ignore
          const viewer = $3Dmol.createViewer('viewer-container', {
            backgroundColor: 'white',
          });

          try {
             const config = {
                headers: {
                  'Content-Type': 'application/json',
                }
              }
              await axios.get('/api/generate_view',config)
              .then((response) => {
                console.log(response.data);
                const dataFile = '/src/components/output.pdb';
                viewer.addModel(dataFile, 'pdb');
                viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
                viewer.zoomTo();
                viewer.render();
                viewer.zoom(1.2, 1000);
                // const command = `pymol ${dataFile}`;
              })
              .catch((error) => {
                console.log(`Failed to load PDB: ${error}`);
              });
              // const dataFile = '/src/components/output.pdb';
              // viewer.addModel(dataFile, 'pdb');
              // viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
              // viewer.zoomTo();
              // viewer.render();
              // viewer.zoom(1.2, 1000);
          }
          catch (error) {
            console.log(`Failed to load PDB: ${error}`);
          }
        }
      }
    });

    return () => {
      isMounted = false;
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