import { BlogPosts } from 'app/components/posts'
import SocialLinks from 'app/components/social-links'


export default function Page() {
  return (
    <section>
      <h1 className="text-5xl font-semibold tracking-tighter">
        Matt Thorne
      </h1>
      <p className="text-lg  tracking-tighter">
        Software Engineer
      </p>
      <SocialLinks />
      {/* <p className="mt-8 mb-4">
        {`I'm a Software Engineer and Certified AWS expert`}
      </p> */}
      <div className="my-8">
        <h2 className="mb-2 text-xl font-semibold tracking-tighter">
          Blog
        </h2>
        <BlogPosts />
      </div>
    </section>
  )
}
