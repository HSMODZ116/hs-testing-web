import { useState } from 'react';
import { Copy, Share2, Download, FileText, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Result {
  mobile?: string;
  name?: string;
  cnic?: string;
  address?: string;
}

interface ResultsDisplayProps {
  results: Result[];
  searchType: 'sim' | 'cnic';
}

const ResultsDisplay = ({ results, searchType }: ResultsDisplayProps) => {
  const [selectedResult, setSelectedResult] = useState<{ result: Result; index: number } | null>(null);

  const formatResultsText = () => {
    return results
      .map((r, i) => 
        `Record #${i + 1}\nMobile: ${r.mobile || 'N/A'}\nName: ${r.name || 'N/A'}\nCNIC: ${r.cnic || 'N/A'}\nAddress: ${r.address || 'N/A'}`
      )
      .join('\n\n');
  };

  const copyResults = () => {
    navigator.clipboard.writeText(formatResultsText()).then(() => {
      toast.success('Results copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy results');
    });
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pakistan Number Info Results',
          text: formatResultsText(),
        });
        toast.success('Results shared successfully!');
      } catch {
        copyResults();
      }
    } else {
      copyResults();
    }
  };

  const exportCSV = () => {
    const headers = ['Mobile', 'Name', 'CNIC', 'Address'];
    const rows = results.map(r => [
      r.mobile || 'N/A',
      r.name || 'N/A',
      r.cnic || 'N/A',
      `"${(r.address || 'N/A').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search_results_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const exportPDF = () => {
    const content = results.map((r, i) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
        <h3 style="color: #10b981; margin-bottom: 10px;">📋 Record #${i + 1}</h3>
        <p><strong>📱 Mobile:</strong> ${r.mobile || 'N/A'}</p>
        <p><strong>👤 Name:</strong> ${r.name || 'N/A'}</p>
        <p><strong>🆔 CNIC:</strong> ${r.cnic || 'N/A'}</p>
        <p><strong>🏠 Address:</strong> ${r.address || 'N/A'}</p>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pakistan Number Info - Search Results</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #065f46; text-align: center; }
            h3 { margin: 0; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <h1>🔍 Pakistan Number Info Pro</h1>
          <p style="text-align: center; color: #666;">Search Results - ${new Date().toLocaleString()}</p>
          ${content}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
      toast.success('PDF export opened!');
    } else {
      toast.error('Please allow popups for PDF export');
    }
  };

  return (
    <>
      <div className="mt-10 animate-slide-up">
        <div className="bg-gradient-to-r from-secondary to-primary rounded-t-2xl p-4 sm:p-6 flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Results ({results.length})
          </h2>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={exportCSV}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground/30 hover:scale-110 transition-all"
              title="Export CSV"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={exportPDF}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground/30 hover:scale-110 transition-all"
              title="Export PDF"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={copyResults}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground/30 hover:scale-110 transition-all"
              title="Copy Results"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={shareResults}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground/30 hover:scale-110 transition-all"
              title="Share Results"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-b-2xl p-4 sm:p-6 space-y-3">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="bg-muted/50 rounded-xl p-4 flex items-center justify-between gap-3 hover:bg-muted/70 transition-colors cursor-pointer border border-border/30"
              onClick={() => setSelectedResult({ result, index })}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary font-bold text-sm">#{index + 1}</span>
                  <span className="text-foreground font-semibold truncate">
                    {result.name || 'Unknown Name'}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm truncate">
                  📱 {result.mobile || 'N/A'} • 🆔 {result.cnic || 'N/A'}
                </div>
              </div>
              <button
                className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Details Modal */}
      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl flex items-center gap-2">
              📋 Record #{selectedResult ? selectedResult.index + 1 : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResult && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-col pb-4 border-b border-border/40">
                <div className="font-semibold text-muted-foreground text-sm mb-1">
                  📱 {searchType === 'sim' ? 'Mobile Number' : 'CNIC'}
                </div>
                <div className="text-foreground break-all font-medium">
                  {searchType === 'sim' 
                    ? (selectedResult.result.mobile || 'N/A') 
                    : (selectedResult.result.cnic || 'N/A')}
                </div>
              </div>

              <div className="flex flex-col pb-4 border-b border-border/40">
                <div className="font-semibold text-muted-foreground text-sm mb-1">
                  👤 SIM Owner Name
                </div>
                <div className="text-foreground break-words font-medium">
                  {selectedResult.result.name || 'N/A'}
                </div>
              </div>
              
              <div className="flex flex-col pb-4 border-b border-border/40">
                <div className="font-semibold text-muted-foreground text-sm mb-1">
                  🆔 {searchType === 'sim' ? 'CNIC Number' : 'Mobile Number'}
                </div>
                <div className="text-foreground break-all font-medium">
                  {searchType === 'sim' 
                    ? (selectedResult.result.cnic || 'N/A') 
                    : (selectedResult.result.mobile || 'N/A')}
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="font-semibold text-muted-foreground text-sm mb-1">
                  🏠 Address
                </div>
                <div className="text-foreground break-words font-medium">
                  {selectedResult.result.address || 'N/A'}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultsDisplay;
