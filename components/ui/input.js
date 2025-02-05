export function Input({ className, ...props }) {
    return (
      <input
        className={`p-3 rounded-lg border border-[#006d77] bg-gray-700 text-white placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] transition-all ${className}`}
        {...props}
      />
    );
  }
  