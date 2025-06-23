"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { User, Post } from "@/lib/types"

interface PostFormProps {
  users: User[]
  onPostCreated: () => void
  onPostUpdated: () => void
  editingPost: Post | null
  setEditingPost: (post: Post | null) => void
}

export default function PostForm({ users, onPostCreated, onPostUpdated, editingPost, setEditingPost }: PostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [authorId, setAuthorId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Update form when editing post changes
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title)
      setContent(editingPost.content || "")
      setPublished(editingPost.published)
      setAuthorId(editingPost.authorId.toString())
    } else {
      setTitle("")
      setContent("")
      setPublished(false)
      setAuthorId("")
    }
  }, [editingPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingPost) {
        // Update post
        const response = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content: content || null,
            published,
            authorId: Number.parseInt(authorId),
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update post")
        }

        onPostUpdated()
        setEditingPost(null)
      } else {
        // Create post
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content: content || null,
            published,
            authorId: Number.parseInt(authorId),
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create post")
        }

        onPostCreated()
      }

      setTitle("")
      setContent("")
      setPublished(false)
      setAuthorId("")
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingPost(null)
    setTitle("")
    setContent("")
    setPublished(false)
    setAuthorId("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingPost ? "Editar Post" : "Criar Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Título do post"
            />
          </div>
          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conteúdo do post"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="author">Autor *</Label>
            <Select value={authorId} onValueChange={setAuthorId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um autor" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked as boolean)}
            />
            <Label htmlFor="published">Publicado</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !authorId}>
              {loading ? "Salvando..." : editingPost ? "Atualizar" : "Criar"}
            </Button>
            {editingPost && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
