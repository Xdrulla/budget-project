import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import ptBrDateFns from 'date-fns/locale/pt-BR'
import ptBr from './pt-br.json'


// Translation react-datepicker

const ptBrTranslation = { 'pt-BR': { translation: ptBr } }
const languages = { ...ptBrTranslation }

/**
 * I18n configurations.
 */
i18n
  .use(initReactI18next)
  .init({
    resources: languages,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  })

registerLocale('pt-BR', ptBrDateFns)
setDefaultLocale('pt-BR')

export default i18n

export const t = i18n.t.bind(i18n)
