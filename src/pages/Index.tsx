
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import UrlInputForm from '@/components/UrlInputForm';
import UrlSafetyResult from '@/components/UrlSafetyResult';
import SafetyHeader from '@/components/SafetyHeader';
import HowItWorks from '@/components/HowItWorks';
import { assessUrlSafety, UrlSafetyResult as UrlSafetyResultType } from '@/utils/urlChecker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UrlSafetyResultType | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const { toast } = useToast();

  const handleCheckUrl = async (url: string) => {
    setIsLoading(true);
    try {
      const safetyResult = await assessUrlSafety(url);
      setResult(safetyResult);
      
      // Show toast notification based on result
      if (safetyResult.status === "SAFE") {
        toast({
          title: "URL Analyzed",
          description: "This URL appears to be safe.",
          variant: "default",
        });
      } else if (safetyResult.status === "WARNING") {
        toast({
          title: "Caution Advised",
          description: "This URL has some suspicious characteristics.",
          variant: "destructive",
        });
      } else if (safetyResult.status === "UNSAFE") {
        toast({
          title: "Warning: Unsafe URL",
          description: "This URL appears to be unsafe or malicious.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking URL:", error);
      toast({
        title: "Error",
        description: "Failed to analyze URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header and Description */}
          <SafetyHeader />
          
          {/* URL Input Form */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Check URL Safety</h2>
            <UrlInputForm onCheckUrl={handleCheckUrl} isLoading={isLoading} />
            
            {/* Show details toggle */}
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="details-mode"
                checked={showDetails}
                onCheckedChange={setShowDetails}
              />
              <Label htmlFor="details-mode">Show detailed analysis</Label>
            </div>
          </div>
          
          {/* URL Safety Results */}
          {result && <UrlSafetyResult result={result} showDetails={showDetails} />}
          
          {/* How It Works Section */}
          <Separator className="my-10" />
          <HowItWorks />
          
          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>
              Disclaimer: This tool provides an assessment based on available information but does not guarantee absolute accuracy. 
              Always exercise caution when visiting unfamiliar websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
