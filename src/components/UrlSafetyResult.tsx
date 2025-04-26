
import React from 'react';
import { UrlSafetyResult as UrlSafetyResultType } from '@/utils/urlChecker';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Ban, Link2, Shield, ShieldAlert } from 'lucide-react';

interface UrlSafetyResultProps {
  result: UrlSafetyResultType | null;
  showDetails: boolean;
}

const UrlSafetyResult: React.FC<UrlSafetyResultProps> = ({ result, showDetails }) => {
  if (!result) {
    return null;
  }

  const getStatusIcon = () => {
    switch (result.status) {
      case "SAFE":
        return <Shield className="w-8 h-8 text-safe" />;
      case "WARNING":
        return <ShieldAlert className="w-8 h-8 text-warning" />;
      case "UNSAFE":
        return <Ban className="w-8 h-8 text-unsafe" />;
      case "ERROR":
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
      default:
        return <Link2 className="w-8 h-8 text-neutral" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "SAFE":
        return "bg-safe";
      case "WARNING":
        return "bg-warning";
      case "UNSAFE":
        return "bg-unsafe";
      case "ERROR":
        return "bg-gray-500";
      default:
        return "bg-neutral";
    }
  };

  const getScoreBackground = () => {
    if (result.score >= 80) return "from-safe-light to-safe";
    if (result.score >= 50) return "from-warning-light to-warning";
    return "from-unsafe-light to-unsafe";
  };

  return (
    <Card className="w-full result-card border-t-4 shadow-lg animate-in fade-in-50 slide-in-from-bottom-5 duration-300" 
      style={{ borderTopColor: result.status === "SAFE" ? "#2ecc71" : result.status === "WARNING" ? "#f39c12" : "#e74c3c" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>{result.status === "SAFE" ? "Safe URL" : result.status === "WARNING" ? "Potentially Unsafe URL" : "Unsafe URL"}</span>
          </div>
          <Badge 
            className={`${result.status === "SAFE" ? "bg-safe" : result.status === "WARNING" ? "bg-warning" : "bg-unsafe"} text-white`}
          >
            {result.score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
          
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Safety Score</span>
              <span className="font-medium">{result.score}/100</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getScoreBackground()}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {showDetails && (
            <>
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Domain Age</h3>
                  <div className="mt-1 text-sm">
                    {result.domainAge < 30 ? (
                      <span className="text-unsafe">
                        This domain is only {result.domainAge} days old (created on {result.creationDate || "unknown date"}). 
                        New domains are often used for phishing.
                      </span>
                    ) : result.domainAge < 365 ? (
                      <span className="text-warning">
                        This domain is {result.domainAge} days old (created on {result.creationDate || "unknown date"}).
                      </span>
                    ) : (
                      <span className="text-safe">
                        This is an established domain ({result.domainAge} days old, created on {result.creationDate || "unknown date"}).
                      </span>
                    )}
                  </div>
                </div>

                {result.statusCode > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">Response Status</h3>
                    <div className="mt-1 text-sm">
                      {result.statusCode === 200 ? (
                        <span className="text-safe">URL is accessible (HTTP {result.statusCode})</span>
                      ) : (
                        <span className="text-warning">URL returned HTTP status code {result.statusCode}</span>
                      )}
                    </div>
                  </div>
                )}

                {result.similarTo && (
                  <div>
                    <h3 className="text-sm font-medium text-unsafe">Lookalike Domain Warning</h3>
                    <div className="mt-1 text-sm text-unsafe">
                      This URL looks similar to <span className="font-semibold">{result.similarTo}</span>. 
                      It may be attempting to impersonate a trusted site.
                    </div>
                  </div>
                )}

                {result.suspiciousReasons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-unsafe">Suspicious Patterns Detected</h3>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-unsafe-dark">
                      {result.suspiciousReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlSafetyResult;
