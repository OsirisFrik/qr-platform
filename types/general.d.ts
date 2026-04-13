import 'vue-router'

export type BoolMapped<T> = { [K in keyof T]: boolean }
export type FieldError = [boolean, string | null]
export type FieldErrorMapped<T> = {
  [K in keyof T]: FieldError
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean
    title?: string
    icon?: string
    aside?: boolean
    order?: number
    breadcrumb?: boolean
  }
}

export interface NavBarItem {
  name: string
  title: string
  path: string
  icon?: string
  isActive?: boolean
  items?: {
    name: string
    title: string
    path: string
  }[]
}

export type BucketName = 'public-bucket' | 'private-bucket'

interface SelectOptionLabel {
  label: string
  labelKey?: string
  value: string
  disabled?: boolean
  icon?: string
}

interface SelectOptionLabelKey {
  label?: string
  labelKey: string
  value: string
  disabled?: boolean
  icon?: string
}

export type SelectOption = SelectOptionLabel | SelectOptionLabelKey
