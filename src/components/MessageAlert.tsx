import { CheckCircle, XCircle } from 'lucide-react';

interface MessageAlertProps {
  message: string;
  type: 'success' | 'error';
}

const MessageAlert = ({ message, type }: MessageAlertProps) => {
  if (!message) return null;

  return (
    <div
      className={`p-5 rounded-2xl mt-6 text-lg font-medium flex items-center gap-3 animate-slide-up ${
        type === 'success'
          ? 'bg-accent/10 text-accent border-l-4 border-accent'
          : 'bg-destructive/10 text-destructive border-l-4 border-destructive'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 flex-shrink-0" />
      )}
      {message}
    </div>
  );
};

export default MessageAlert;
