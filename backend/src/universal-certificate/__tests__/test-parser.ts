// backend/src/universal-certificate/__tests__/test-parser.ts
import { UniversalParser } from '../UniversalParser';

const sampleCert = {
  id: "cert-001",
  version: "1.0",
  type: { category: "education", subcategory: "degree" },
  issuer: {
    id: "issuer-001",
    name: "Global University",
    did: "did:example:gu123",
    authorityType: "educational",
    verificationEndpoint: "https://gu.edu/verify",
    publicKey: "0x123..."
  },
  subject: {
    id: "user-001",
    did: "did:example:alice",
    identifiers: [],
    privacyLevel: "public"
  },
  claims: {
    degree: "BSc Computer Science",
    gpa: 3.8
  },
  lifecycle: {
    issuedDate: "2023-06-15T00:00:00Z",
    validFrom: "2023-06-15T00:00:00Z"
  },
  blockchain: {
    network: "ethereum",
    contractAddress: "0x...",
    transactionHash: "0xabc123def456...",
    blockNumber: 18456789
  },
  security: {
    cryptographicProof: {},
    quantumResistant: false,
    integrityHash: "sha256:...",
    digitalSignature: "0xdef456..."
  }
};

try {
  const parsed = UniversalParser.parseFromJSON(sampleCert);
  const result = UniversalParser.validate(parsed);
  console.log("✅ Parsed successfully!");
  console.log("Validation:", result);
} catch (e) {
  console.error("❌ Error:", e.message);
}