import logo from '@/assets/logo.png';

const Header = () => {
  return (
    <header className="py-8 text-center relative z-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="inline-block mb-8">
          <div className="w-28 h-28 glass-card flex items-center justify-center animate-float border-2 border-foreground/20 p-2">
            <img src={logo} alt="ROMEK XD Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient tracking-tight w-fit mx-auto">
          Pakistan Number Info Pro
        </h1>
        
        <p className="text-xl text-foreground/90 font-normal mb-2">
          Advanced SIM & CNIC Information Tracker
        </p>
        
        <p className="text-base text-foreground/70 italic">
          Your trusted source for Pakistani mobile number intelligence
        </p>
      </div>
    </header>
  );
};

export default Header;
