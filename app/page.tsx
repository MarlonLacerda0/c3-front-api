"use client"

import { useState, useEffect } from "react"
import UserForm from "@/components/user-form"
import PostForm from "@/components/post-form"
import UsersTable from "@/components/users-table"
import type { User, Post } from "@/lib/types"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleUserCreated = () => {
    fetchUsers()
  }

  const handleUserUpdated = () => {
    fetchUsers()
  }

  const handlePostCreated = () => {
    fetchUsers()
  }

  const handlePostUpdated = () => {
    fetchUsers()
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Seção Superior - Formulários */}
      <div className="bg-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
            Sistema de Gerenciamento de Usuários e Posts
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserForm
              onUserCreated={handleUserCreated}
              onUserUpdated={handleUserUpdated}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
            />
            <PostForm
              users={users}
              onPostCreated={handlePostCreated}
              onPostUpdated={handlePostUpdated}
              editingPost={editingPost}
              setEditingPost={setEditingPost}
            />
          </div>
        </div>
      </div>

      {/* Seção Inferior - Tabela */}
      <div className="bg-green-50 p-6">
        <div className="max-w-7xl mx-auto">
          <UsersTable users={users} onRefresh={handleRefresh} onEditUser={handleEditUser} onEditPost={handleEditPost} />
        </div>
      </div>
    </div>
  )
}
