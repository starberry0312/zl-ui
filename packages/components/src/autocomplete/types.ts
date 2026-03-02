export interface AutocompleteSuggestion {
  value: string
  [key: string]: unknown
}

export type FetchSuggestionsTrigger = (
  queryString: string,
  cb: (suggestions: AutocompleteSuggestion[]) => void
) => void

export const EVENT_CODE = {
  tab: 'Tab',
  enter: 'Enter',
  up: 'ArrowUp',
  down: 'ArrowDown',
  esc: 'Escape',
  home: 'Home',
  end: 'End',
  pageUp: 'PageUp',
  pageDown: 'PageDown',
} as const
