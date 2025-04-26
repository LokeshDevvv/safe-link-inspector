
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface UrlInputFormProps {
  onCheckUrl: (url: string) => void;
  isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onCheckUrl, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onCheckUrl(url);
    }
  };

  const handleClear = () => {
    setUrl('');
  };

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
    </form>
  );
};

export default UrlInputForm;
