import { ImageResponse } from 'next/og'

import { getBlogPosts } from 'app/blog/utils'

export async function generateStaticParams() {
    return getBlogPosts().map((post) => ({
        slug: post.slug,
    }));
}

export function GET(req: Request, { params }: { params: { slug: string } }) {

    let post = getBlogPosts().find((post) => post.slug === params.slug)
    if (!post) {
        return
    }

    let {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata


    return new ImageResponse(
        (
            <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
                <div tw="flex flex-col w-full py-12 px-4 p-8">
                    <h1 tw="text-4xl font-bold tracking-tight text-left mb-0">
                        {title}
                    </h1>
                    <h2 tw="text-2xl tracking-tight text-left mt-0">
                        {description}
                    </h2>
                    <h2 tw="text-2xl tracking-tight text-left mt-0">
                        Matt Thorne
                    </h2>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
