class QRCodeGenerator {
  private static baseUrl = 'https://getflock.io';

  /**
   * Generate a Universal Link QR code for venue check-in
   * @param venueId - The venue ID
   * @returns Universal Link URL
   */
  static generateVenueCheckinLink(venueId: number | string): string {
    return `${this.baseUrl}/venue/${venueId}`;
  }

  /**
   * Generate a Universal Link QR code with query parameters
   * @param venueId - The venue ID
   * @returns Universal Link URL with query params
   */
  static generateVenueCheckinLinkWithQuery(venueId: number | string): string {
    return `${this.baseUrl}/?venue_id=${venueId}`;
  }

  /**
   * Generate a Branch.io link for venue check-in (alternative)
   * @param venueId - The venue ID
   * @returns Branch link URL
   */
  static generateBranchLink(venueId: number | string): string {
    return `https://flockloyalty.app.link/?venue_id=${venueId}`;
  }

  /**
   * Generate QR code data for different formats
   * @param venueId - The venue ID
   * @param format - The format type
   * @returns QR code data
   */
  static generateQRData(venueId: number | string, format: 'universal' | 'branch' | 'simple' = 'universal'): string {
    switch (format) {
      case 'universal':
        return this.generateVenueCheckinLink(venueId);
      case 'branch':
        return this.generateBranchLink(venueId);
      case 'simple':
        return venueId.toString();
      default:
        return this.generateVenueCheckinLink(venueId);
    }
  }
}

export default QRCodeGenerator; 