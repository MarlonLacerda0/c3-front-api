import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { UpdatePostData } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body: UpdatePostData = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.authorId && { authorId: body.authorId }),
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error updating post:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    if (error.code === "P2003") {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting post:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
