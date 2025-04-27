
export interface UrlSafetyResult {
  url: string;
  status: "SAFE" | "WARNING" | "UNSAFE" | "ERROR";
  score: number;
  message: string;
  domainAge: number;
  creationDate?: string;
  statusCode?: number;
  similarTo?: string;
  suspiciousReasons: string[];
}

export const checkUrlSafety = async (url: string): Promise<UrlSafetyResult> => {
  // This is a placeholder. In a real implementation, this would call your API
  console.log('Checking URL safety for:', url);
  
  // For testing purposes, we'll return mock results based on the URL
  if (url.includes('phishing') || url.includes('malware')) {
    return {
      url,
      status: "UNSAFE",
      score: 20,
      message: "This URL has been flagged as potentially malicious.",
      domainAge: 3,
      creationDate: "2025-04-24",
      statusCode: 200,
      suspiciousReasons: [
        "Domain registered recently",
        "Similar to known phishing domains",
        "Suspicious URL patterns detected"
      ],
      similarTo: "legitimate-site.com"
    };
  } else if (url.includes('suspicious') || url.includes('unknown')) {
    return {
      url,
      status: "WARNING",
      score: 65,
      message: "This URL has some suspicious characteristics.",
      domainAge: 45,
      creationDate: "2025-03-12",
      statusCode: 200,
      suspiciousReasons: ["Unusual URL structure"],
      similarTo: undefined
    };
  } else {
    return {
      url,
      status: "SAFE",
      score: 95,
      message: "This URL appears to be safe.",
      domainAge: 3650,
      creationDate: "2015-04-27",
      statusCode: 200,
      suspiciousReasons: []
    };
  }
};

// Export assessUrlSafety as an alias for checkUrlSafety for backward compatibility
export const assessUrlSafety = checkUrlSafety;
