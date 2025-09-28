// backend/src/universal-certificate/UniversalCertificate.ts

export interface UniversalCertificate {
  id: string;
  version: string;
  type: CertificateType;
  issuer: {
    id: string;
    name: string;
    did: string;
    domain?: string;
    authorityType: 'educational' | 'professional' | 'governmental' | 'corporate' | 'non-profit' | 'international' | 'other';
    verificationEndpoint: string;
    publicKey: string;
    reputation?: ReputationScore;
    accreditation?: any[]; // Simplified for now
  };
  subject: {
    id: string;
    did: string;
    identifiers: any[];
    privacyLevel: 'public' | 'restricted' | 'private';
  };
  claims: { [key: string]: ClaimValue };
  validation: {
    criteria: ValidationCriteria[];
    requirements: any[];
    evidence?: any[];
    assessmentMethod?: string;
    verification?: any[];
  };
  lifecycle: {
    issuedDate: Date;
    validFrom: Date;
    validUntil?: Date;
    status: 'active' | 'suspended' | 'revoked' | 'expired' | 'pending';
    renewalInfo?: any;
    updateHistory?: any[];
  };
  blockchain: {
    network: string;
    contractAddress: string;
    transactionHash: string;
    blockNumber: number;
    gasUsed?: number;
    merkleProof?: string;
    crossChainInfo?: any[];
  };
  security: {
    cryptographicProof: any;
    quantumResistant: boolean;
    integrityHash: string;
    digitalSignature: string;
    encryptionInfo?: any;
    accessControl?: any;
  };
  interoperability: {
    standards: string[];
    formats: any[];
    apiEndpoints?: string[];
    webhooks?: any[];
  };
  metadata: { [key: string]: any };
}

// --- Supporting Types ---
export interface CertificateType {
  category: string;
  subcategory?: string;
  specificType?: string;
  customType?: string;
  confidence?: number;
}

export interface ClaimValue {
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  unit?: string;
  confidence?: number;
  evidence?: string[];
}

export interface ValidationCriteria {
  rule: string;
  type: 'required' | 'optional' | 'conditional';
  condition?: string;
  errorMessage?: string;
}

export interface ReputationScore {
  overallScore: number;
  certificatesIssued: number;
  verificationRate: number;
  complaints: number;
  accreditationLevel: string;
}