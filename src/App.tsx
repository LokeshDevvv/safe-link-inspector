
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import UrlInputForm from './components/UrlInputForm';
import UrlSafetyResult from './components/UrlSafetyResult';
import { Button } from './components/ui/button';
import { UrlSafetyResult as UrlSafetyResultType } from './utils/urlChecker';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UrlSafetyResultType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime?.onMessage?.addListener((message) => {
      if (message.type === 'URL_CHECK_RESULT') {
        setResult(message.data);
        setIsLoading(false);
      } else if (message.type === 'URL_CHECK_ERROR') {
        console.error(message.error);
        setIsLoading(false);
      }
    });

    // Get current tab URL when popup opens
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0]?.url;
      if (currentUrl) {
        handleCheckUrl(currentUrl);
      }
    });
  }, []);

  const handleCheckUrl = async (url: string) => {
    setIsLoading(true);
    // The actual check will be handled by the background script
    chrome.runtime.sendMessage({
      type: 'CHECK_URL',
      url: url
    });
  };

  return (
    <div className="w-[400px] min-h-[300px] p-4 bg-background">
      <Card className="p-4">
        <h1 className="text-xl font-bold mb-4">URL Safety Checker</h1>
        <UrlInputForm onCheckUrl={handleCheckUrl} isLoading={isLoading} />
        {result && (
          <>
            <UrlSafetyResult result={result} showDetails={showDetails} />
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default App;
