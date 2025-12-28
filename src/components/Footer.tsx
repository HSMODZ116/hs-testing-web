import { Shield, FileText, Mail, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-center py-10 bg-background/30 backdrop-blur-sm mt-16">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-5">
          <a href="#" className="text-foreground/80 hover:text-foreground hover:-translate-y-0.5 transition-all font-medium flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Privacy Policy
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground hover:-translate-y-0.5 transition-all font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Terms of Service
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground hover:-translate-y-0.5 transition-all font-medium flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> Contact Us
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground hover:-translate-y-0.5 transition-all font-medium flex items-center justify-center gap-2">
            <Info className="w-4 h-4" /> About
          </a>
        </div>
        
        <p className="text-foreground/60 text-sm">
          © 2024 Pakistan Number Info Pro. All rights reserved.
        </p>
        <p className="text-foreground/80 text-sm font-medium mt-2">
          Powered by ROMEK XD & Zaynix
        </p>
      </div>
    </footer>
  );
};

export default Footer;
