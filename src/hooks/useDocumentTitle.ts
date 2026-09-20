import { useEffect } from 'react'

export interface DocumentTitleOptions {
  raw?: boolean;
  metaDescription?: string;
}

export function useDocumentTitle(title: string, options?: DocumentTitleOptions) {
  useEffect(() => {
    document.title = options?.raw
      ? title
      : (title.includes('EcoHoops') ? title : `${title} | EcoHoops`)

    if (options?.metaDescription) {
      let metaTag = document.querySelector('meta[name="description"]')
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', 'description')
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', options.metaDescription)
    }
  }, [title, options?.raw, options?.metaDescription])
}
