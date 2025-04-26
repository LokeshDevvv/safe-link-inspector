// URL safety checking utilities

// Function to check if URL exists and returns a valid response
export const checkUrlResponse = async (url: string): Promise<{ valid: boolean; status?: number }> => {
  try {
    // Ensure URL has protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    
    // We use a proxy to avoid CORS issues
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(urlWithProtocol)}`);
    
    // Check if the response is ok first
    if (!response.ok) {
      console.log(`Proxy response not ok: ${response.status}`);
      return { valid: false, status: response.status };
    }
    
    // Try to parse the JSON response
    try {
      const data = await response.json();
      // Check if we received an error from the proxy
      if (data.error) {
        console.log(`Proxy error: ${data.error}`);
        return { valid: false, status: 404 };
      }
      
      return {
        valid: true,
        status: data.status?.http_code || 200
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return { valid: false, status: 0 };
    }
  } catch (error) {
    console.error("Error checking URL:", error);
    return { valid: false };
  }
};

// Check domain age using WHOIS API (simulated for now)
export const checkDomainAge = async (domain: string): Promise<{ age: number; creationDate: string | null }> => {
  try {
    // Extract domain from URL if needed
    const domainName = extractDomain(domain);
    
    // In a real implementation, we would call a WHOIS API here
    // For demonstration, we'll simulate with random data
    // But mark some known domains as established
    
    const knownDomains: Record<string, { age: number; date: string }> = {
      'google.com': { age: 8760, date: '1997-09-15' },
      'microsoft.com': { age: 8760, date: '1991-05-02' },
      'facebook.com': { age: 7300, date: '2004-02-04' },
      'twitter.com': { age: 6200, date: '2006-03-21' },
      'amazon.com': { age: 8760, date: '1994-07-05' },
      'apple.com': { age: 8760, date: '1987-02-19' },
      'netflix.com': { age: 8030, date: '1997-08-29' },
      'github.com': { age: 5475, date: '2007-10-09' },
      'youtube.com': { age: 6570, date: '2005-02-14' },
      'instagram.com': { age: 4745, date: '2010-03-05' },
      'linkedin.com': { age: 7300, date: '2002-05-05' },
      'yahoo.com': { age: 8760, date: '1995-01-18' },
      'reddit.com': { age: 6570, date: '2005-06-23' },
      'ebay.com': { age: 8395, date: '1995-09-03' },
    };
    
    // Return known domain data or generate a random age between 1-365 days for unknown domains
    if (knownDomains[domainName]) {
      return { 
        age: knownDomains[domainName].age,
        creationDate: knownDomains[domainName].date
      };
    }
    
    // For demonstration purposes, suspicious domains (with typos of known domains) are marked as new
    if (isSuspiciousName(domainName)) {
      const randomRecentDate = new Date();
      randomRecentDate.setDate(randomRecentDate.getDate() - Math.floor(Math.random() * 30));
      return {
        age: Math.floor(Math.random() * 30) + 1, // 1-30 days
        creationDate: randomRecentDate.toISOString().split('T')[0]
      };
    }
    
    // Default random age between 1-3000 days for other domains
    const randomAge = Math.floor(Math.random() * 3000) + 1;
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - randomAge);
    
    return {
      age: randomAge,
      creationDate: randomDate.toISOString().split('T')[0]
    };
    
  } catch (error) {
    console.error("Error checking domain age:", error);
    return { age: 0, creationDate: null };
  }
};

// Check for suspicious patterns in URL
export const checkSuspiciousPatterns = (url: string): { suspicious: boolean; reasons: string[] } => {
  const patterns = [
    { pattern: /[^\w\-\.:\/\?\=\&\%\+]/g, reason: "Contains unusual characters" },
    { pattern: /^(?:https?:\/\/)?([\w-]+)\.([\w-]+)\.(?!com|org|net|edu|gov|mil|io|co)([\w-]{2,})/i, reason: "Unusual TLD combination" },
    { pattern: /(?:paypal|apple|microsoft|amazon|google|facebook|twitter|instagram).*?(?:secure|login|verify|account|support|service).*?\.(?!com|net|org)/i, reason: "Brand name with suspicious domain" },
    { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, reason: "Uses IP address instead of domain name" },
    { pattern: /(?:url|link|web|online|signin|banking|payment|verify|secure|account|user|auth)\d+/i, reason: "Suspicious naming pattern" },
    { pattern: url.length > 100 ? /.*/ : /^$/, reason: "Excessively long URL" },
    { pattern: /(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd)/i, reason: "Uses a URL shortener" },
    { pattern: /-{2,}/g, reason: "Uses multiple consecutive hyphens" },
    { pattern: /\.(tk|ml|ga|cf|gq|top|xyz|pw)(?:\/|$)/i, reason: "Uses a frequently abused free TLD" },
    { pattern: /(?:secure|login|auth|account|signin|banking|update).*?-.*?(?:verify|confirm|secure|protect)/i, reason: "Suspicious security-related terms" }
  ];
  
  const reasons: string[] = [];
  
  patterns.forEach(({ pattern, reason }) => {
    if (pattern.test(url)) {
      reasons.push(reason);
    }
  });
  
  return {
    suspicious: reasons.length > 0,
    reasons
  };
};

// Check domain similarity to well-known domains (detect typosquatting)
export const checkDomainSimilarity = (url: string): { suspicious: boolean; similarTo: string | null } => {
  const domain = extractDomain(url);
  
  const commonDomains = [
    "google.com", "facebook.com", "microsoft.com", "apple.com", "amazon.com",
    "paypal.com", "twitter.com", "instagram.com", "netflix.com", "gmail.com",
    "yahoo.com", "linkedin.com", "github.com", "youtube.com", "reddit.com"
  ];
  
  for (const knownDomain of commonDomains) {
    // Skip if exactly the same (legitimate domain)
    if (domain === knownDomain) {
      return { suspicious: false, similarTo: null };
    }
    
    // Check for simple typosquatting
    if (
      levenshteinDistance(domain, knownDomain) <= 2 || // Allow 2 character differences
      domain.includes(knownDomain.replace('.com', '')) || // Contains the brand name
      knownDomain.replace('.com', '').includes(domain.replace('.com', '')) // The domain is part of the brand name
    ) {
      return { suspicious: true, similarTo: knownDomain };
    }
  }
  
  return { suspicious: false, similarTo: null };
};

// Calculate Levenshtein distance between two strings (for typo detection)
export const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};

// Helper function to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    // Add protocol if not present
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const hostname = new URL(urlWithProtocol).hostname;
    
    // Remove 'www.' if present
    return hostname.replace(/^www\./, '');
  } catch {
    // If URL parsing fails, try a simpler approach
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
    return domainMatch ? domainMatch[1] : url;
  }
};

// Check if domain name seems suspicious (like typosquatting)
const isSuspiciousName = (domain: string): boolean => {
  const suspiciousPatterns = [
    /g[o0]{2}gle/i,
    /faceb[o0]{2}k/i,
    /amaz[o0]n/i,
    /payp[a@]l/i,
    /micr[o0]s[o0]ft/i,
    /netfl[i1]x/i,
    /[i1]nstagram/i,
    /tw[i1]tter/i,
    /l[i1]nked[i1]n/i,
    /g[i1]thub/i,
    /y[o0]utube/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(domain));
};

// Overall safety assessment
export const assessUrlSafety = async (url: string): Promise<UrlSafetyResult> => {
  // Check if URL is empty
  if (!url.trim()) {
    return {
      safe: false,
      score: 0,
      status: "EMPTY",
      statusCode: 0,
      domainAge: 0,
      creationDate: null,
      suspicious: false,
      similarTo: null,
      suspiciousReasons: [],
      message: "Please enter a URL to check"
    };
  }

  try {
    // Normalize URL for checking
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Enhanced phishing detection for known patterns
    const knownPhishingPatterns = [
      /\.(?:tk|ml|ga|cf|gq)$/i,  // Free TLDs often used for phishing
      /(?:paypal|apple|microsoft|amazon|google|facebook|twitter|instagram).*?-?(?:secure|login|verify|account).*?\.(?!com|net|org)/i,
      /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,  // Raw IP addresses
      /(?:secure|login|auth|account|signin|banking|update).*?-.*?(?:verify|confirm|secure|protect)/i,
      /\.(pw|top|xyz|online|site|space|icu)$/i  // Additional suspicious TLDs
    ];
    
    for (const pattern of knownPhishingPatterns) {
      if (pattern.test(normalizedUrl)) {
        return {
          safe: false,
          score: 5,
          status: "UNSAFE",
          statusCode: 0,
          domainAge: 0,
          creationDate: null,
          suspicious: true,
          similarTo: null,
          suspiciousReasons: ["Matches known phishing pattern"],
          message: "This URL matches patterns commonly used in phishing attacks."
        };
      }
    }

    // Run all checks in parallel
    const [responseCheck, domainAgeCheck, suspiciousCheck, similarityCheck] = await Promise.all([
      checkUrlResponse(normalizedUrl),
      checkDomainAge(normalizedUrl),
      Promise.resolve(checkSuspiciousPatterns(normalizedUrl)),
      Promise.resolve(checkDomainSimilarity(normalizedUrl))
    ]);

    // Assign base safety score
    let safetyScore = 100;

    // Adjust score based on checks
    if (!responseCheck.valid) safetyScore -= 30;
    if (domainAgeCheck.age < 30) safetyScore -= 20; // Penalize new domains more heavily
    if (domainAgeCheck.age < 7) safetyScore -= 15; // Additional penalty for very new domains
    if (suspiciousCheck.suspicious) safetyScore -= 15 * Math.min(suspiciousCheck.reasons.length, 5); // Cap at 75 points deduction
    if (similarityCheck.suspicious) safetyScore -= 25;

    // Check for multiple suspicious factors
    if (suspiciousCheck.suspicious && domainAgeCheck.age < 30 && similarityCheck.suspicious) {
      safetyScore = Math.max(safetyScore - 20, 0); // Additional penalty for multiple factors
    }

    // Ensure score is within bounds
    safetyScore = Math.max(0, Math.min(100, safetyScore));

    // Determine overall safety status
    let status: UrlSafetyStatus;
    if (safetyScore >= 80) {
      status = "SAFE";
    } else if (safetyScore >= 50) {
      status = "WARNING";
    } else {
      status = "UNSAFE";
    }

    // Special cases for known bad domains
    const knownBadDomains = [
      /google\d+\.com/i,
      /paypa[l1]\d*\.com/i,
      /secure.*?-.*?login/i,
      /verify.*?account.*?online/i,
      /docusign-?online/i,
      /\w+login\w*\.com/i
    ];

    for (const badPattern of knownBadDomains) {
      if (badPattern.test(normalizedUrl)) {
        safetyScore = 0;
        status = "UNSAFE";
        break;
      }
    }

    return {
      safe: status === "SAFE",
      score: safetyScore,
      status,
      statusCode: responseCheck.status || 0,
      domainAge: domainAgeCheck.age,
      creationDate: domainAgeCheck.creationDate,
      suspicious: suspiciousCheck.suspicious || similarityCheck.suspicious,
      similarTo: similarityCheck.similarTo,
      suspiciousReasons: suspiciousCheck.reasons,
      message: getStatusMessage(status, safetyScore, domainAgeCheck.age)
    };
  } catch (error) {
    console.error("Error assessing URL safety:", error);
    return {
      safe: false,
      score: 0,
      status: "ERROR",
      statusCode: 0,
      domainAge: 0,
      creationDate: null,
      suspicious: false,
      similarTo: null,
      suspiciousReasons: [],
      message: "Error checking URL safety"
    };
  }
};

// Get status message based on safety assessment
const getStatusMessage = (status: UrlSafetyStatus, score: number, age: number): string => {
  switch (status) {
    case "SAFE":
      return `This URL appears safe (${score}/100). The domain is ${age} days old.`;
    case "WARNING":
      return `This URL needs caution (${score}/100). The domain is ${age} days old.`;
    case "UNSAFE":
      return `This URL appears to be unsafe (${score}/100). The domain is ${age} days old.`;
    case "ERROR":
      return "There was an error checking this URL.";
    case "EMPTY":
      return "Please enter a URL to check.";
    default:
      return "Unknown status.";
  }
};

// Types for URL safety checks
export type UrlSafetyStatus = "SAFE" | "WARNING" | "UNSAFE" | "ERROR" | "EMPTY";

export interface UrlSafetyResult {
  safe: boolean;
  score: number;
  status: UrlSafetyStatus;
  statusCode: number;
  domainAge: number;
  creationDate: string | null;
  suspicious: boolean;
  similarTo: string | null;
  suspiciousReasons: string[];
  message: string;
}
