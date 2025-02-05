export function Button({ className, children, ...props }) {
  return (
    <button
      className={`px-6 py-3 rounded-lg bg-[#006d77] text-white font-semibold tracking-wide transition-all duration-300 ease-in-out 
      shadow-md hover:bg-[#005a66] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#34d399] active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
