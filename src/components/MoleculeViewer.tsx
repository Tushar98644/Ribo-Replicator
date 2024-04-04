'use client'
import axios from 'axios';
import { useEffect } from 'react';


async function getRandomAvailablePDBCode() {
  const availablePDBCodes = ['1AIY', '1BEN', '1EV3', '1EV6', '1EVR', '1FU2','1FUB','1G7A','1G7B','1GUJ','1J73','1JCA','1MSO','1OS3','1SF1','1TRZ','1TYL'];

  const randomIndex = Math.floor(Math.random() * availablePDBCodes.length);
  console.log(`Random PDB code: ${availablePDBCodes[randomIndex]}`);
  return availablePDBCodes[randomIndex];
}

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

    loadScripts().then(async () => {
      // @ts-ignore
      if (window?.$3Dmol) {
        // @ts-ignore
        window?.$3Dmol.autoload();
        // @ts-ignore
        const viewer = $3Dmol.createViewer('viewer-container', {
          backgroundColor: 'white',
        });

        const pdbCode = await getRandomAvailablePDBCode();
        if (!pdbCode) {
          console.error('No available PDB codes found.');
          return;
        }

        const pdbUri = `https://files.rcsb.org/download/${pdbCode}.pdb`;

        await axios.get(pdbUri)
          .then(response => {
            if (response.status !== 200) {
              throw new Error(`Failed to load PDB: ${response.statusText}`);
            }
            return response.data;
          })
          .then(data => {
            viewer.addModel(data, 'pdb');
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.zoomTo();
            viewer.render();
            viewer.zoom(1.2, 1000);
          })
          .catch(error => console.log(`Failed to load PDB ${pdbUri}: ${error}`));
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