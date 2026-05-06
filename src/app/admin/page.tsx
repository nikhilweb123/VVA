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
        
        <Link href="/admin/categories" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Categories</h2>
            <p className="text-ivory/60 font-sans">Manage project categories</p>
          </div>
        </Link>

        <Link href="/admin/homepage" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Homepage</h2>
            <p className="text-ivory/60 font-sans">Edit hero, about, services, stats, testimonials & footer</p>
          </div>
        </Link>

        <Link href="/admin/about" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">About Page</h2>
            <p className="text-ivory/60 font-sans">Edit title, banner image, description, mission, vision & timeline</p>
          </div>
        </Link>

        <Link href="/admin/contact" className="block group">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Contact Settings</h2>
            <p className="text-ivory/60 font-sans">Edit address, phone, email, map & form recipient</p>
          </div>
        </Link>

        <Link href="/admin/site-settings" className="block group md:col-span-2">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Site Settings</h2>
            <p className="text-ivory/60 font-sans">Navbar logo & links · Footer columns & socials · SEO meta & OG image</p>
          </div>
        </Link>

        <Link href="/admin/enquiries" className="block group md:col-span-2">
          <div className="p-8 border border-ivory/20 bg-ivory/5 hover:bg-ivory/10 transition-colors h-full flex flex-col justify-center">
            <h2 className="text-2xl font-serif text-ivory mb-2">Enquiries / Leads</h2>
            <p className="text-ivory/60 font-sans">View and manage contact form submissions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
