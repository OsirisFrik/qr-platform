import { h } from 'vue'
import IconSvg, { type IconSvgProps } from './IconSvg.vue'

export { IconSvg }
export function mountIconSvg(options: IconSvgProps) {
  return h(IconSvg, options)
}
