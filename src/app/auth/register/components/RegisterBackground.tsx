export default function RegisterBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full animate-float blur-3xl"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-indigo-500/20 rounded-full animate-float-delayed blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-blue-500/20 rounded-full animate-float-slow blur-3xl"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-bounce delay-700"></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-pink-300/50 rounded-full animate-ping delay-1000"></div>
    </div>
  );
}