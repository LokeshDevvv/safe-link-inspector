
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Shield, Clock, AlertCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: <Link2 className="h-6 w-6 text-neutral" />,
      title: "URL Analysis",
      description: "Checks URL structure, domain, and content patterns for suspicious elements."
    },
    {
      icon: <Shield className="h-6 w-6 text-safe" />,
      title: "Security Verification",
      description: "Identifies potential phishing attempts and malicious websites."
    },
    {
      icon: <Clock className="h-6 w-6 text-warning" />,
      title: "Domain Age Check",
      description: "Verifies how long a domain has existed. Newer domains may be riskier."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-unsafe" />,
      title: "Suspicious Pattern Detection",
      description: "Recognizes common tactics used by deceptive websites."
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 bg-gray-100 p-3 rounded-full">
                {feature.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
