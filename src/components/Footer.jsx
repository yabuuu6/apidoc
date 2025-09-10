export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-left">
        <h2 className="text-4xl md:text-xl font-bold mb-4 tracking-wide">
          DocAPIku
        </h2>
        <p className="text-base md:text- opacity-75 mb-6 max-w-lg">
          © {new Date().getFullYear()} DocAPIku. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
