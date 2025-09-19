export default function Footer() {
  return (
<footer className="w-screen bg-blue-900 text-white py-12 mt-16">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    {/* Brand */}
    <div className="flex flex-col">
      <h2 className="text-4xl md:text-2xl font-bold mb-2 tracking-wide">DocAPIku</h2>
      <p className="text-sm opacity-75">© {new Date().getFullYear()} DocAPIku. All rights reserved.</p>
    </div>

    {/* Links */}
    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
      <div className="flex flex-col gap-2">
        <span className="font-semibold mb-2">Resources</span>
        <a href="#" className="hover:text-blue-300 transition-colors">Docs</a>
        <a href="#" className="hover:text-blue-300 transition-colors">API Reference</a>
        <a href="#" className="hover:text-blue-300 transition-colors">Tutorials</a>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold mb-2">Community</span>
        <a href="#" className="hover:text-blue-300 transition-colors">GitHub</a>
        <a href="#" className="hover:text-blue-300 transition-colors">Discord</a>
        <a href="#" className="hover:text-blue-300 transition-colors">Twitter</a>
      </div>
    </div>
  </div>
</footer>

  );
}
