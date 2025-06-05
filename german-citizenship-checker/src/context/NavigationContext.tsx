import React, { createContext, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext<any>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stackRef = useRef<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Push current path to stack on navigation (except for back)
  React.useEffect(() => {
    const stack = stackRef.current;
    if (stack[stack.length - 1] !== location.pathname) {
      stack.push(location.pathname);
    }
  }, [location.pathname]);

  const goBack = () => {
    const stack = stackRef.current;
    if (stack.length > 1) {
      stack.pop(); // Remove current
      const prev = stack.pop(); // Get previous
      if (prev) {
        navigate(prev, { replace: true });
      }
    } else {
      navigate('/', { replace: true }); // fallback
    }
  };

  return (
    <NavigationContext.Provider value={{ goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext); 