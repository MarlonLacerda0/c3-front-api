import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CreatePostData } from "@/lib/types"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostData = await request.json()

    if (!body.title || !body.authorId) {
      return NextResponse.json({ error: "Title and authorId are required" }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content || null,
        published: body.published || false,
        authorId: body.authorId,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error("Error creating post:", error)
    if (error.code === "P2003") {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
