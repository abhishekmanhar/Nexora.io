if (typeof window !== 'undefined') {
  // Polyfill matchMedia if it doesn't exist or is missing properties
  const patchMql = (mql: any) => {
    if (!mql) return mql;
    if (typeof mql.addListener !== 'function') {
      mql.addListener = function(cb: any) {
        try { mql.addEventListener('change', cb); } catch (e) {}
      };
    }
    if (typeof mql.removeListener !== 'function') {
      mql.removeListener = function(cb: any) {
        try { mql.removeEventListener('change', cb); } catch (e) {}
      };
    }
    return mql;
  };

  const originalMatchMedia = window.matchMedia;
  window.matchMedia = function(query: string): MediaQueryList {
    let result: any = null;
    try {
      if (typeof originalMatchMedia === 'function') {
        result = originalMatchMedia.call(window, query);
      }
    } catch (err) {}
    
    if (!result || typeof result !== 'object') {
      result = {
        matches: false,
        media: query,
        onchange: null,
        addListener: function() {},
        removeListener: function() {},
        addEventListener: function() {},
        removeEventListener: function() {},
        dispatchEvent: function() { return false; },
      };
    }
    return patchMql(result);
  };

  // Polyfill screen.orientation
  const patchOrientation = (orientation: any) => {
    if (!orientation) return orientation;
    if (typeof orientation.addListener !== 'function') {
      orientation.addListener = function(cb: any) {
        try { orientation.addEventListener('change', cb); } catch (e) {}
      };
    }
    if (typeof orientation.removeListener !== 'function') {
      orientation.removeListener = function(cb: any) {
        try { orientation.removeEventListener('change', cb); } catch (e) {}
      };
    }
    return orientation;
  };

  if (typeof window.screen !== 'undefined') {
    if (!window.screen.orientation) {
      try {
        const mockOrientation = {
          type: 'landscape-primary',
          angle: 0,
          onchange: null,
          addListener: function() {},
          removeListener: function() {},
          addEventListener: function() {},
          removeEventListener: function() {},
          dispatchEvent: function() { return false; },
          lock: function() { return Promise.resolve(); },
          unlock: function() {},
        };
        Object.defineProperty(window.screen, 'orientation', {
          value: mockOrientation,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch (e) {
        try {
          (window.screen as any).orientation = {
             addListener: () => {},
             removeListener: () => {},
             addEventListener: () => {},
             removeEventListener: () => {},
          };
        } catch (e2) {}
      }
    }
    const orientation = window.screen.orientation;
    if (orientation) {
      patchOrientation(orientation);
    }
  }

  // Polyfill visualViewport
  if (typeof window.visualViewport !== 'undefined') {
    patchOrientation(window.visualViewport);
  } else {
    try {
      (window as any).visualViewport = {
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        onresize: null,
        onscroll: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    } catch (e) {}
  }
}

