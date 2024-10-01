
export const saveSucessful = (t) => ({
  icon: 'success',
  text: `${t('common_saved')}`,
  showConfirmButton: false,
  timer: 1500,
})

export const deleteBudget = (t) => ({
  title: `${t('common_delete')}`,
  html: `${t('budget_DeleteNotification')}`,
  icon: 'warning',
  showConfirmButton: false,
  customClass: {
    icon: 'border-0',
  },
  timer: 1500,
})
