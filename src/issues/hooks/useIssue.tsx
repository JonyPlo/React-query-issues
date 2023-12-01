import { useQuery } from '@tanstack/react-query'
import { Issue } from '../interfaces'
import { githubApi } from '../../api/githubApi'
import { sleep } from '../helpers/sleep'

const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
  await sleep(2)
  const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`)
  return data
}

const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
  await sleep(2)
  const { data } = await githubApi.get<Issue[]>(
    `/issues/${issueNumber}/comments`
  )
  return data
}

export const useIssue = (issueNumber: number) => {
  const issueQuery = useQuery({
    queryKey: ['issue', issueNumber],
    queryFn: () => getIssueInfo(issueNumber),
  })

  const commentsQuery = useQuery({
    queryKey: ['issue', issueNumber, 'comments'],
    queryFn: () => getIssueComments(issueQuery.data!.number),
    // Con la opcion enabled puedo decidir si se ejecutara la peticion o no, si el enabled es false, entonces nunca se ejecutara la peticion de commentsQuery, por lo tanto, se agregó una validacion para que solo cuando issueQuery tenga datos, recien en ese momento quiero que commentsQuery ejecute su peticion
    enabled: issueQuery.data !== undefined,
  })

  return {
    issueQuery,
    commentsQuery,
  }
}
