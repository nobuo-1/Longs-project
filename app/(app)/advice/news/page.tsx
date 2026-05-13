import { getWeekStart } from "@/src/lib/news-week"
import { getNewsViewAction, listActiveQueriesAction, getDefaultExcludedSourcesAction } from "@/src/actions/news-actions"
import { AdviceNewsShell } from "@/components/feature/advice/advice-news-shell"

export default async function AIAdviceNewsPage() {
  const weekStart = getWeekStart(new Date())
  const weekStartIso = weekStart.toISOString()

  const [newsRes, queriesRes, defaultExcludedRes] = await Promise.all([
    getNewsViewAction(weekStartIso),
    listActiveQueriesAction(),
    getDefaultExcludedSourcesAction(),
  ])

  const initialData = newsRes.success ? newsRes.data : []
  const initialQueries = queriesRes.success ? queriesRes.data : []
  const initialDefaultExcludedSources = defaultExcludedRes.success ? defaultExcludedRes.data : null

  return (
    <AdviceNewsShell
      initialData={initialData}
      initialWeekStart={weekStart}
      initialQueries={initialQueries}
      initialDefaultExcludedSources={initialDefaultExcludedSources}
    />
  )
}
