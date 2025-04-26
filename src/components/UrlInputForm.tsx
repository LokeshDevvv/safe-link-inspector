
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UrlSafetyService } from '@/services/urlSafetyApi';

interface UrlInputFormProps {
  onCheckUrl: (url: string) => void;
  isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onCheckUrl, isLoading }) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Warning for test URLs
      if (url.includes('google3.com') || url.includes('phishing') || url.includes('malware')) {
        toast({
          title: "Test URL Detected",
          description: "You're checking a test/example malicious URL. In a real scenario, never navigate to known malicious URLs.",
          variant: "default",
        });
      }
      onCheckUrl(url);
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  // Some examples of URLs to test (for development purposes)
  const exampleUrls = [
    'google.com',
    'login-secure-paypal.tk',
    'facebook-security-login.gq',
    'microsoft365-verify.ml',
    'amazon-account-verify.cf',
    'apple-id-confirm.xyz'
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Enter URL or domain to check (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pr-24 flex-1 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
        {url && (
          <Button 
            type="button" 
            variant="ghost" 
            className="absolute right-[108px]"
            onClick={handleClear}
            size="sm"
          >
            <X size={18} />
          </Button>
        )}
        <Button 
          type="submit" 
          className="absolute right-2 bg-neutral-dark hover:bg-neutral flex gap-2 items-center"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Checking
            </>
          ) : (
            <>
              <Search size={18} />
              Check
            </>
          )}
        </Button>
      </div>
      
      {/* Test URL examples - commented out for production */}
      {/* <div className="mt-2 text-xs text-gray-500">
        <span className="font-medium">Test examples:</span> 
        {exampleUrls.map((example, index) => (
          <button
            type="button"
            key={index}
            className="ml-2 text-blue-500 hover:underline"
            onClick={() => setUrl(example)}
          >
            {example}
          </button>
        ))}
      </div> */}
    </form>
  );
};

export default UrlInputForm;
