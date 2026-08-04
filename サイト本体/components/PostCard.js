import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-card">
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          loading="lazy"
          className="post-card-thumb"
        />
      )}
      <div className="post-card-body">
        <span className="category-badge">{post.category}</span>
        <h2>{post.title}</h2>
      </div>
    </Link>
  );
}
