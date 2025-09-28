// backend/src/universal-certificate/UniversalParser.ts
import { UniversalCertificate, CertificateType, ClaimValue } from './UniversalCertificate';

export class UniversalParser {
  static parseFromJSON(raw: any): UniversalCertificate {
    // Validate required fields
    if (!raw.id || !raw.issuer || !raw.subject || !raw.claims) {
      throw new Error('Missing required fields: id, issuer, subject, or claims');
    }

    // Parse dates
    const issuedDate = new Date(raw.lifecycle?.issuedDate);
    const validFrom = new Date(raw.lifecycle?.validFrom);
    const validUntil = raw.lifecycle?.validUntil ? new Date(raw.lifecycle.validUntil) : undefined;

    if (isNaN(issuedDate.getTime()) || isNaN(validFrom.getTime())) {
      throw new Error('Invalid date format in lifecycle. Use ISO 8601 (e.g., "2023-01-01T00:00:00Z")');
    }

    const cert: UniversalCertificate = {
      id: raw.id,
      version: raw.version || '1.0.0',
      type: this.parseType(raw.type),
      issuer: raw.issuer,
      subject: raw.subject,
      claims: this.parseClaims(raw.claims),
      validation: raw.validation || { criteria: [], requirements: [] },
      lifecycle: {
        issuedDate,
        validFrom,
        validUntil,
        status: raw.lifecycle?.status || 'active',
        renewalInfo: raw.lifecycle?.renewalInfo,
        updateHistory: raw.lifecycle?.updateHistory,
      },
      blockchain: raw.blockchain,
      security: raw.security,
      interoperability: raw.interoperability || { standards: [], formats: [] },
      metadata: raw.metadata || {},
    };

    return cert;
  }

  private static parseType(type: any): CertificateType {
    if (!type || !type.category) {
      throw new Error('Certificate type must include "category"');
    }
    return {
      category: type.category,
      subcategory: type.subcategory,
      specificType: type.specificType,
      customType: type.customType,
      confidence: type.confidence,
    };
  }

  private static parseClaims(claims: any): { [key: string]: ClaimValue } {
    const result: { [key: string]: ClaimValue } = {};
    for (const [key, value] of Object.entries(claims)) {
      // Auto-detect type (simplified)
      let type: ClaimValue['type'] = 'string';
      if (typeof value === 'number') type = 'number';
      else if (typeof value === 'boolean') type = 'boolean';
      else if (Array.isArray(value)) type = 'array';
      else if (value && typeof value === 'object') type = 'object';
      else if (typeof value === 'string' && !isNaN(Date.parse(value))) type = 'date';

      result[key] = { value, type };
    }
    return result;
  }

  static validate(cert: UniversalCertificate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Rule 1: Issuer must have DID and name
    if (!cert.issuer.did || !cert.issuer.name) {
      errors.push('Issuer must have "did" and "name"');
    }

    // Rule 2: Issue date must be in the past
    if (cert.lifecycle.issuedDate > new Date()) {
      errors.push('Issue date cannot be in the future');
    }

    // Rule 3: Must have blockchain transaction hash
    if (!cert.blockchain?.transactionHash) {
      errors.push('Blockchain transactionHash is required');
    }

    // Rule 4: Must have at least one claim
    if (Object.keys(cert.claims).length === 0) {
      errors.push('Certificate must have at least one claim');
    }

    return { valid: errors.length === 0, errors };
  }
}