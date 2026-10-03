import { useEffect } from 'react'

const DEFAULT_TITLE =
  'Computer Science and Technology | Uva Wellassa University of Sri Lanka'
const SITE_NAME = 'CST · UWU'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  }, [title])
}
