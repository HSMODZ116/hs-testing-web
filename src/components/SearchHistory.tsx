import { Smartphone, CreditCard, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryItem {
  value: string;
  type: 'sim' | 'cnic';
  timestamp: number;
}

interface SearchHistoryProps {
  history: HistoryItem[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

const SearchHistory = ({ history, onSelect, onClear }: SearchHistoryProps) => {
  if (history.length === 0) return null;

  const handleClear = () => {
    onClear();
    toast.success('Search history cleared!');
  };

  return (
    <div className="mt-10 glass-card p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground">Recent Searches</h3>
        <button
          onClick={handleClear}
          className="bg-destructive/20 text-destructive rounded-lg px-5 py-2 font-semibold hover:bg-destructive/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {history.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item.value)}
            className="history-chip"
          >
            {item.type === 'sim' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
