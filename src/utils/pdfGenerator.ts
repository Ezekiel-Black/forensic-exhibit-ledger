import { Exhibit } from '../types/exhibit';

export class PDFGenerator {
  private static createPDFContent(content: string, title: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
          }
          .header h2 {
            margin: 5px 0 0 0;
            font-size: 14px;
            color: #666;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .field-row {
            display: flex;
            margin-bottom: 8px;
          }
          .field-label {
            font-weight: bold;
            width: 150px;
            flex-shrink: 0;
          }
          .field-value {
            flex: 1;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 2px;
          }
          .description-field {
            margin-bottom: 15px;
          }
          .description-field .field-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .description-field .field-value {
            border: 1px solid #ccc;
            padding: 8px;
            min-height: 60px;
            white-space: pre-wrap;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 200px;
            text-align: center;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            height: 40px;
            margin-bottom: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          .legal-notice {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 20px 0;
            font-size: 11px;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
          }
          .badge-collected {
            background-color: #d4edda;
            color: #155724;
          }
          .badge-not-collected {
            background-color: #fff3cd;
            color: #856404;
          }
          .badge-exploited {
            background-color: #d1ecf1;
            color: #0c5460;
          }
          .badge-unexploited {
            background-color: #f8f9fa;
            color: #495057;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private static getCurrentTimestamp(): string {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  static generateSubmissionReceipt(exhibit: Exhibit): void {
    const content = `
      <div class="header">
        <h1>ANTI-TERROR POLICE UNIT (ATPU)</h1>
        <h2>FORENSIC EXHIBIT SUBMISSION RECEIPT</h2>
      </div>

      <div class="section">
        <div class="section-title">EXHIBIT IDENTIFICATION</div>
        <div class="field-row">
          <div class="field-label">Serial Number:</div>
          <div class="field-value">${exhibit.serialNumber}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Date Received:</div>
          <div class="field-value">${this.formatDate(exhibit.dateReceived)}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Current Status:</div>
          <div class="field-value">
            <span class="badge ${exhibit.collectionStatus === 'Collected' ? 'badge-collected' : 'badge-not-collected'}">
              ${exhibit.collectionStatus}
            </span>
            <span class="badge ${exhibit.remarks === 'Exploited' ? 'badge-exploited' : 'badge-unexploited'}">
              ${exhibit.remarks}
            </span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">PERSONNEL INFORMATION</div>
        <div class="field-row">
          <div class="field-label">Receiving Officer:</div>
          <div class="field-value">${exhibit.receivingOfficer}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Examiner:</div>
          <div class="field-value">${exhibit.examiner}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Investigating Officer:</div>
          <div class="field-value">${exhibit.investigatingOfficer}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Station:</div>
          <div class="field-value">${exhibit.station}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CASE INFORMATION</div>
        <div class="field-row">
          <div class="field-label">Accused Person:</div>
          <div class="field-value">${exhibit.accusedPerson}</div>
        </div>
        <div class="description-field">
          <div class="field-label">Description of Exhibit(s):</div>
          <div class="field-value">${exhibit.description}</div>
        </div>
      </div>

      <div class="legal-notice">
        <strong>LEGAL DECLARATION:</strong> By signing below, the Investigating Officer confirms the submission 
        of the exhibit(s) described above to the Anti-Terror Police Unit for forensic examination. 
        All information provided is accurate and complete to the best of their knowledge.
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Investigating Officer</strong></div>
          <div>${exhibit.investigatingOfficer}</div>
          <div>Date: _________________</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Receiving Officer</strong></div>
          <div>${exhibit.receivingOfficer}</div>
          <div>Date: _________________</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Examiner</strong></div>
          <div>${exhibit.examiner}</div>
          <div>Date: _________________</div>
        </div>
      </div>

      <div class="footer">
        <p>This document was generated electronically by the ATPU Exhibit Management System</p>
        <p>Serial Number: ${exhibit.serialNumber} | Generated: ${this.getCurrentTimestamp()}</p>
      </div>
    `;

    this.createPDFContent(content, `ATPU_Submission_Receipt_${exhibit.serialNumber}`);
  }

  static generateCollectionReport(exhibit: Exhibit): void {
    if (exhibit.collectionStatus !== 'Collected') {
      throw new Error('Cannot generate collection report for uncollected exhibit');
    }

    const content = `
      <div class="header">
        <h1>ANTI-TERROR POLICE UNIT (ATPU)</h1>
        <h2>FORENSIC EXHIBIT COLLECTION REPORT</h2>
      </div>

      <div class="section">
        <div class="section-title">EXHIBIT IDENTIFICATION</div>
        <div class="field-row">
          <div class="field-label">Serial Number:</div>
          <div class="field-value">${exhibit.serialNumber}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Date Received:</div>
          <div class="field-value">${this.formatDate(exhibit.dateReceived)}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Collection Date:</div>
          <div class="field-value">${exhibit.collectionDate ? this.formatDate(exhibit.collectionDate) : 'N/A'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Final Status:</div>
          <div class="field-value">
            <span class="badge badge-collected">Collected</span>
            <span class="badge ${exhibit.remarks === 'Exploited' ? 'badge-exploited' : 'badge-unexploited'}">
              ${exhibit.remarks}
            </span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">PERSONNEL INFORMATION</div>
        <div class="field-row">
          <div class="field-label">Examiner:</div>
          <div class="field-value">${exhibit.examiner}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Collected By:</div>
          <div class="field-value">${exhibit.collectedBy || 'Not specified'}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Investigating Officer:</div>
          <div class="field-value">${exhibit.investigatingOfficer}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Station:</div>
          <div class="field-value">${exhibit.station}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CASE INFORMATION</div>
        <div class="field-row">
          <div class="field-label">Accused Person:</div>
          <div class="field-value">${exhibit.accusedPerson}</div>
        </div>
        <div class="description-field">
          <div class="field-label">Description of Exhibit(s):</div>
          <div class="field-value">${exhibit.description}</div>
        </div>
      </div>

      <div class="legal-notice">
        <strong>LEGAL DECLARATION:</strong> By signing below, the parties confirm the collection 
        of the exhibit(s) described above from the Anti-Terror Police Unit. The exhibit has been 
        properly examined and is being returned to the authorized personnel.
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Collecting Officer</strong></div>
          <div>${exhibit.collectedBy || 'Not specified'}</div>
          <div>Date: _________________</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Examiner</strong></div>
          <div>${exhibit.examiner}</div>
          <div>Date: _________________</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div><strong>Investigating Officer</strong></div>
          <div>${exhibit.investigatingOfficer}</div>
          <div>Date: _________________</div>
        </div>
      </div>

      <div class="footer">
        <p>This document was generated electronically by the ATPU Exhibit Management System</p>
        <p>Serial Number: ${exhibit.serialNumber} | Generated: ${this.getCurrentTimestamp()}</p>
      </div>
    `;

    this.createPDFContent(content, `ATPU_Collection_Report_${exhibit.serialNumber}`);
  }
}
