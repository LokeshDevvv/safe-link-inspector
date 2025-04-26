
import React from 'react';
import { Shield } from 'lucide-react';

const SafetyHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-neutral" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral to-neutral-dark bg-clip-text text-transparent">Safe Link Inspector</h1>
      </div>
      <p className="text-center text-gray-600 max-w-xl">
        Check URLs for safety before clicking. Identify potential phishing sites, malicious links, and suspicious domains in real-time.
      </p>
    </div>
  );
};

export default SafetyHeader;
