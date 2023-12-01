import { Link, Navigate, useParams } from 'react-router-dom'
import { IssueComment } from '../components/IssueComment'
import { useIssue } from '../hooks'
import { LoadingIcon } from '../../shared/components/LoadingIcon'

export const IssueView = () => {
  const { id = '0' } = useParams()
  const { issueQuery, commentsQuery } = useIssue(+id)

  if (issueQuery.isLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <LoadingIcon />
      </div>
    )
  } else if (!issueQuery.data) {
    return <Navigate to={'issues/list'} />
  }

  return (
    <div className='row mb-5'>
      <div className='col-12 mb-3'>
        <Link to='issues/list'>Go Back</Link>
      </div>
      {/* Primer comentario */}
      <IssueComment issue={issueQuery.data} />
      {/* Comentario de otros */}
      {commentsQuery.isLoading && <LoadingIcon />}
      {commentsQuery.data?.map((issue) => (
        <IssueComment key={issue.id} issue={issue} />
      ))}
      {/* <IssueComment body={comment3} /> */}
    </div>
  )
}
