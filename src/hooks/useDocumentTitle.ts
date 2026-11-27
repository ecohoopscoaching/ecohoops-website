import { useEffect } from 'react'

export interface DocumentTitleOptions {
  raw?: boolean;
  metaDescription?: string;
  noindex?: boolean;
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

    const robotsTag = document.querySelector('meta[name="robots"]')
    if (options?.noindex) {
      if (!robotsTag) {
        const tag = document.createElement('meta')
        tag.setAttribute('name', 'robots')
        tag.setAttribute('content', 'noindex, nofollow')
        document.head.appendChild(tag)
      } else {
        robotsTag.setAttribute('content', 'noindex, nofollow')
      }
    } else if (robotsTag && robotsTag.getAttribute('content') === 'noindex, nofollow') {
      robotsTag.remove()
    }
  }, [title, options?.raw, options?.metaDescription, options?.noindex])
}
