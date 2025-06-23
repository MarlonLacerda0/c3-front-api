"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import type { User, Post } from "@/lib/types"

interface UsersTableProps {
  users: User[]
  onRefresh: () => void
  onEditUser: (user: User) => void
  onEditPost: (post: Post) => void
}

export default function UsersTable({ users, onRefresh, onEditUser, onEditPost }: UsersTableProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const toggleUserExpansion = (userId: number) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Todos os posts dele também serão excluídos.")) {
      return
    }

    setLoading({ ...loading, [`user-${userId}`]: true })

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete user")
      }

      onRefresh()
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading({ ...loading, [`user-${userId}`]: false })
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) {
      return
    }

    setLoading({ ...loading, [`post-${postId}`]: true })

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete post")
      }

      onRefresh()
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading({ ...loading, [`post-${postId}`]: false })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários e Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado</p>
          ) : (
            users.map((user) => (
              <Collapsible
                key={user.id}
                open={expandedUsers.has(user.id)}
                onOpenChange={() => toggleUserExpansion(user.id)}
              >
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
                      {expandedUsers.has(user.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold">{user.name || "Sem nome"}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          {user.posts?.length || 0} posts
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading[`user-${user.id}`]}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent className="mt-4">
                    {user.posts && user.posts.length > 0 ? (
                      <div className="space-y-2 pl-6">
                        <h4 className="font-medium text-sm text-gray-700">Posts:</h4>
                        {user.posts.map((post) => (
                          <div key={post.id} className="border-l-2 border-gray-200 pl-4 py-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{post.title}</h5>
                                {post.content && <p className="text-sm text-gray-600 mt-1">{post.content}</p>}
                                <div className="flex gap-2 mt-2">
                                  <Badge variant={post.published ? "default" : "secondary"}>
                                    {post.published ? "Publicado" : "Rascunho"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button size="sm" variant="outline" onClick={() => onEditPost(post)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeletePost(post.id)}
                                  disabled={loading[`post-${post.id}`]}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 pl-6">Nenhum post encontrado</p>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
