// src/pages/register/types.ts
export type Certificate = {
  name: string
  issuer?: string
  issueYear?: number | null
  certificateLink?: string
  issuedDate?: Date | null
  certificateImage?: File | string | null // after R2 its not base 64 now
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'student' | 'trainer' | undefined

  // trainer fields
  education: string
  experience: string // keep string in UI; convert to number before sending
  certificates: Certificate[]
  dob: string
  bio: string
  resume: File | string | null // File during upload and R2, string for base64 before R2

  // shared
  phone: string
  nationalityCode?: string
  location?: string

  // student fields & trainer teaching fields
  learningType: '' | 'subjects' | 'languages' | 'hobbies' // students
  learningValues: string[] // generic

  // trainer will also use these but label as teachingType/teachingValues in mapping
  subjects: string[]
  languages: string[]
  hobbies: string[]
  standards: string[] // array of selected standards or custom ranges
  customStandardRange?: string
}