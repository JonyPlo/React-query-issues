import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi'
import { Issue, State } from '../interfaces'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  issue: Issue
}

export const IssueItem: FC<Props> = ({ issue }) => {
  const navigate = useNavigate()

  return (
    <div
      className='card mb-2 issue'
      onClick={() => navigate(`/issues/issue/${issue.number}`)}
    >
      <div className='card-body row'>
        <div className='col-1'>
          {issue.state === State.Open ? (
            <FiInfo size={30} color='red' />
          ) : (
            <FiCheckCircle size={30} color='green' />
          )}
        </div>
        <div className='col-8'>
          <div className='d-flex flex-column flex-fill px-2'>
            <span>{issue.title}</span>
            <span className='issue-subinfo'>
              #{issue.number} opened 2 days ago by{' '}
              <span className='fw-bold'>{issue.user.login}</span>
            </span>
          </div>
        </div>
        <div className='col-3'>
          <div className='d-flex justify-content-end'>
            <img
              src={issue.user.avatar_url}
              alt='User Avatar'
              className='avatar me-4'
            />
            <div>
              <span className='px-1'>{issue.comments}</span>
              <FiMessageSquare />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
