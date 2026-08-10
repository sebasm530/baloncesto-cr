import { useLanguage } from '../context/LanguageContext'

export default function ListControls({ query, onQueryChange, totalItems, page, onPageChange, itemName = 'resultados', perPage = 6 }) {
  const { t } = useLanguage()
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const from = totalItems ? (page - 1) * perPage + 1 : 0
  const to = Math.min(page * perPage, totalItems)

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">{t('controls.search')}</span>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={`${t('controls.search')} ${itemName}...`} className="w-full glass border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" />
          <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
        </label>
        <p className="text-sm text-gray-500 shrink-0">{totalItems ? `${from}-${to} de ${totalItems}` : `0 ${itemName}`}</p>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end gap-2 mt-4">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="glass border border-white/10 px-3 py-2 rounded-lg text-sm disabled:opacity-40">{t('controls.previous')}</button>
          <span className="text-sm text-gray-400 px-2">Página {page} de {totalPages}</span>
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="glass border border-white/10 px-3 py-2 rounded-lg text-sm disabled:opacity-40">{t('controls.next')}</button>
        </div>
      )}
    </div>
  )
}
