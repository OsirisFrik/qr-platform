<script lang="ts" setup>
import { useTranslation } from 'i18next-vue'
import { DeleteIcon } from 'lucide-vue-next'
import ButtonTooltip from './ButtonTooltip.vue'

interface Props {
  loading?: boolean
  actionTooltip?: string
}

const { t } = useTranslation()
const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'delete'): void
}>()
</script>
<template>
  <ButtonTooltip
    :icon="DeleteIcon"
    variant="danger-outline"
    :loading="loading"
    :tooltip="
      actionTooltip
        ? t('actions.deleteAction', { action: actionTooltip })
        : t('actions.delete')
    "
    @click="() => emits('delete')"
  />
</template>
