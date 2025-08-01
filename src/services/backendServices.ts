import { backendApiClient } from '@/lib/api/client';
import { Document, Order, AnalysisResult } from '@/types/backend';

export class DocumentService {
  static async uploadMultipleFiles(
    files: File[], 
    orderId?: string,
    onProgress?: (progress: number) => void
  ): Promise<Document[]> {
    const results: Document[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      try {
        const document = await backendApiClient.uploadDocument(files[i], orderId);
        results.push(document);
        
        if (onProgress) {
          onProgress(((i + 1) / total) * 100);
        }
      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error);
        throw error;
      }
    }

    return results;
  }

  static async downloadDocument(documentId: string): Promise<Blob> {
    // Implementation depends on your backend's download endpoint
    const response = await fetch(`/api/documents/${documentId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return response.blob();
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel')) return '📊';
    return '📎';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export class OrderService {
  static calculateOrderTotal(analysisType: string, documentCount: number): number {
    const basePrices = {
      'standard': 29.99,
      'premium': 59.99,
      'express': 99.99
    };

    const basePrice = basePrices[analysisType as keyof typeof basePrices] || 29.99;
    const documentMultiplier = Math.max(1, documentCount);
    
    return basePrice * documentMultiplier;
  }

  static getStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'processing': 'W trakcie',
      'completed': 'Zakończone',
      'cancelled': 'Anulowane'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static async createOrderWithDocuments(
    analysisType: string,
    files: File[]
  ): Promise<{ order: Order; documents: Document[] }> {
    try {
      // First upload documents
      const documents = await DocumentService.uploadMultipleFiles(files);
      
      // Then create order with document IDs
      const order = await backendApiClient.createOrder({
        analysis_type: analysisType as any,
        document_ids: documents.map(doc => doc.id)
      });

      return { order, documents };
    } catch (error) {
      console.error('Failed to create order with documents:', error);
      throw error;
    }
  }
}

export class AnalysisService {
  static getAnalysisStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getAnalysisStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'processing': 'Przetwarzanie',
      'completed': 'Zakończona',
      'failed': 'Błąd'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static formatConfidenceScore(score?: number): string {
    if (!score) return 'N/A';
    return `${(score * 100).toFixed(1)}%`;
  }

  static exportAnalysisResults(analysis: AnalysisResult): void {
    const dataStr = JSON.stringify(analysis.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${analysis.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export class PaymentService {
  static getPaymentStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-purple-100 text-purple-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getPaymentStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'completed': 'Opłacone',
      'failed': 'Błąd',
      'refunded': 'Zwrócone'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static getPaymentMethodText(method: string): string {
    const methods = {
      'card': 'Karta płatnicza',
      'blik': 'BLIK',
      'transfer': 'Przelew'
    };

    return methods[method as keyof typeof methods] || 'Nieznany';
  }

  static formatAmount(amount: number, currency: string = 'PLN'): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
