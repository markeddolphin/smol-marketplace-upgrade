import React, { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactElement;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ fallback, children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback ?? null;
  }

  return <>{children}</>;
};

export default ClientOnly;
