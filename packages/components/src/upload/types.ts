export const uploadListTypes = ['text', 'picture', 'picture-card'] as const
export type UploadListType = (typeof uploadListTypes)[number]

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  uid: string
  name: string
  size: number
  status: UploadFileStatus
  percentage?: number
  url?: string
  raw?: File
}
