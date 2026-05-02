import Link from "next/link";

export default function BlogsPage() {
  const posts = [
    {
      id: 1,
      title: "How to Shorten URLs Effectively",
      excerpt: "Learn the best practices for URL shortening and tracking click analytics.",
      date: "2026-05-01",
      slug: "how-to-shorten-urls",
    },
    {
      id: 2,
      title: "Bulk SMS Campaigns with Bird.com",
      excerpt: "Discover how to send thousands of SMS messages efficiently using Bird.com API.",
      date: "2026-04-28",
      slug: "bulk-sms-bird-api",
    },
    {
      id: 3,
      title: "Hosting Static Websites Made Easy",
      excerpt: "Step-by-step guide to hosting your static website with custom domains.",
      date: "2026-04-25",
      slug: "static-website-hosting",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Blogs</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">
                <Link href={`/blogs/${post.slug}`} className="hover:text-blue-400">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-400 text-sm mb-3">{post.date}</p>
              <p className="text-gray-300">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
