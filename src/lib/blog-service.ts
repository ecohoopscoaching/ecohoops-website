import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'
import { BlogPost } from '../types'

const BLOG_COLLECTION = 'blog_posts'

export const blogService = {
  async addBlogPost(post: Omit<BlogPost, 'id' | 'date'>) {
    try {
      const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
        ...post,
        date: Timestamp.now().toDate().toISOString(),
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error adding blog post:', error)
      return { success: false, error }
    }
  },

  async getFirestorePosts(): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, BLOG_COLLECTION), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost))
    } catch (error) {
      console.error('Error fetching dynamic posts:', error)
      return []
    }
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(collection(db, BLOG_COLLECTION), where('slug', '==', slug))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as BlogPost
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  }
}
