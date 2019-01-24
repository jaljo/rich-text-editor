export const locales = ['en', 'fr', 'ar']

export const contentStatuses = [
  { key: 'draft', label: 'Draft' },
  { key: 'in_review', label: 'In review' },
  { key: 'published', label: 'Published' },
  { key: 'unpublished', label: 'Unpublished' },
]

export const brightcovePlayerIds = {
  fr: process.env.REACT_APP_BRIGHTCOVE_FRENCH_PLAYER_ID,
  en: process.env.REACT_APP_BRIGHTCOVE_ENGLISH_PLAYER_ID,
  ar: process.env.REACT_APP_BRIGHTCOVE_ARABIC_PLAYER_ID,
}
