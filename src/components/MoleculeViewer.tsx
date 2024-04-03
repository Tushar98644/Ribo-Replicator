import React, { useEffect } from 'react';

const ThreeDmolViewer = () => {
  useEffect(() => {
    const loadScript = (url: string) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      document.body.appendChild(script);
    };

    loadScript('https://3Dmol.org/build/3Dmol-min.js');
    loadScript('https://3Dmol.org/build/3Dmol.ui-min.js');
  }, []);

  return (
    <div
      style={{ height: '400px', width: '400px', position: 'relative' }}
      className="viewer_3Dmoljs"
      data-pdb="2POR"
      data-backgroundcolor="white"
      data-style="stick"
      data-ui="true"
    />
  );
};

export default ThreeDmolViewer;