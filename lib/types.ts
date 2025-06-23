export interface User {
  id: number
  email: string
  name: string | null
  posts?: Post[]
}

export interface Post {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number
  author?: User
}

export interface CreateUserData {
  email: string
  name?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
}

export interface CreatePostData {
  title: string
  content?: string
  published?: boolean
  authorId: number
}

export interface UpdatePostData {
  title?: string
  content?: string
  published?: boolean
  authorId?: number
}
