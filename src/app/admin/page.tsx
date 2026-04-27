import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-serif text-ivory mb-12">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/admin/projects" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Projects</h2>
            <p className="text-ivory/60 font-sans">Manage your portfolio projects</p>
          </div>
        </Link>
        
        <Link href="/admin/enquiries" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Enquiries</h2>
            <p className="text-ivory/60 font-sans">View contact form submissions</p>
          </div>
        </Link>

        <Link href="/admin/categories" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Categories</h2>
            <p className="text-ivory/60 font-sans">Manage project categories</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
