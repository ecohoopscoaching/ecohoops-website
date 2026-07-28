import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { BlogPost } from '../types'

const BLOG_COLLECTION = 'blog_posts'
const LOCAL_STORAGE_KEY = 'ecohoops_local_blog_posts'
const DELETED_POSTS_KEY = 'ecohoops_deleted_blog_posts'

const getLocalPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error reading from localStorage:', e)
    return []
  }
}

const saveLocalPost = (post: BlogPost) => {
  if (typeof window === 'undefined') return
  try {
    const posts = getLocalPosts()
    posts.push(post)
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

const getDeletedPostIds = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = window.localStorage.getItem(DELETED_POSTS_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error reading deleted posts from localStorage:', e)
    return []
  }
}

const addDeletedPostId = (id: string) => {
  if (typeof window === 'undefined') return
  try {
    const ids = getDeletedPostIds()
    if (!ids.includes(id)) {
      ids.push(id)
      window.localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(ids))
    }
  } catch (e) {
    console.error('Error saving deleted post ID to localStorage:', e)
  }
}

const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  return !!(
    apiKey && 
    apiKey !== "" && 
    apiKey !== "dummy_api_key" && 
    projectId && 
    projectId !== "" && 
    projectId !== "dummy_project_id"
  )
}

export const blogService = {
  isPostDeleted(id: string): boolean {
    return getDeletedPostIds().includes(id)
  },

  async deleteBlogPost(id: string): Promise<{ success: boolean; error?: any }> {
    // 1. Mark as deleted in localStorage for both default and custom posts
    addDeletedPostId(id)

    // 2. If it is a local post, also remove it from local posts storage
    if (id.startsWith('local_')) {
      if (typeof window !== 'undefined') {
        try {
          const posts = getLocalPosts()
          const filtered = posts.filter(p => p.id !== id)
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
        } catch (e) {
          console.error('Error removing local post:', e)
        }
      }
    }

    // 3. If Firebase is configured, delete from Firestore
    if (isFirebaseConfigured() && !id.startsWith('local_')) {
      try {
        await deleteDoc(doc(db, BLOG_COLLECTION, id))
        return { success: true }
      } catch (error) {
        console.error('Error deleting blog post from Firestore:', error)
        // We still return success: true because it's marked as deleted locally
        return { success: true, error }
      }
    }

    return { success: true }
  },

  async addBlogPost(post: Omit<BlogPost, 'id' | 'date'>) {
    const newPost: BlogPost = {
      ...post,
      id: `local_${Date.now()}`,
      date: new Date().toISOString()
    }

    if (isFirebaseConfigured()) {
      try {
        const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
          ...post,
          date: newPost.date,
        })
        return { success: true, id: docRef.id }
      } catch (error) {
        console.error('Error adding blog post to Firestore, falling back to localStorage:', error)
        saveLocalPost(newPost)
        return { success: true, id: newPost.id, fallback: true }
      }
    } else {
      console.warn('Firebase is not configured. Saving blog post to localStorage.')
      saveLocalPost(newPost)
      return { success: true, id: newPost.id, fallback: true }
    }
  },

  async getFirestorePosts(): Promise<BlogPost[]> {
    const localPosts = getLocalPosts().filter(p => !this.isPostDeleted(p.id))

    if (!isFirebaseConfigured()) {
      return localPosts
    }

    try {
      const q = query(collection(db, BLOG_COLLECTION), orderBy('date', 'desc'))
      
      // Race the Firestore query against a 2.5 second timeout to prevent spinner hangs
      const getDocsPromise = getDocs(q)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore fetch timeout')), 2500)
      )
      
      const querySnapshot = await Promise.race([getDocsPromise, timeoutPromise])
      const dbPosts = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost))
        .filter(p => !this.isPostDeleted(p.id))
      // Combine local posts and Firestore posts, sorting them by date descending
      return [...localPosts, ...dbPosts].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } catch (error) {
      console.error('Error fetching dynamic posts from Firestore:', error)
      return localPosts
    }
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    // Check localStorage first
    const localPosts = getLocalPosts()
    const localMatch = localPosts.find(p => p.slug === slug)
    if (localMatch) {
      return this.isPostDeleted(localMatch.id) ? null : localMatch
    }

    if (!isFirebaseConfigured()) {
      return null
    }

    try {
      const q = query(collection(db, BLOG_COLLECTION), where('slug', '==', slug))
      
      // Race the Firestore query against a 2.5 second timeout to prevent page hangs
      const getDocsPromise = getDocs(q)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore fetch timeout')), 2500)
      )
      
      const querySnapshot = await Promise.race([getDocsPromise, timeoutPromise])
      if (querySnapshot.empty) return null
      const doc = querySnapshot.docs[0]
      const post = {
        id: doc.id,
        ...doc.data()
      } as BlogPost
      return this.isPostDeleted(post.id) ? null : post
    } catch (error) {
      console.error('Error fetching post by slug from Firestore:', error)
      return null
    }
  }
}
