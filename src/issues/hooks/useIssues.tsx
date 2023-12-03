import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../../api/githubApi'
import { Issue, State } from '../interfaces'
import { sleep } from '../helpers'

interface Props {
  state?: State
  labels: string[]
}

// Recordar que cuando se recibe un parametro que es opcional como el caso del "state?", este debe ponerse al final porque typescript valida los opcionales al final, es decir si los parametros se reciben de esta forma ", state?: State, label: string[]" esto daría error
const getIssues = async (labels: string[], state?: State): Promise<Issue[]> => {
  await sleep(2)

  const params = new URLSearchParams()

  // params es un objeto y cada propiedad es un parametro, cuando hacemos un params.append(clave, valor) esto nos agregara una nueva propiedad que queremos que sea un parametro
  if (state) params.append('state', state)

  if (labels.length > 0) {
    const labelString = labels.join(',')
    params.append('labels', labelString)
  }

  params.append('page', '1')
  params.append('per_page', '5')

  const { data } = await githubApi.get<Issue[]>('/issues', { params })
  return data
}

export const useIssues = ({ state, labels }: Props) => {
  const issuesQuery = useQuery({
    // Si dentro de la key, agregamos un objeto con elementos, no importa si antes tenia un orden y despues ese orden dentro del objeto cambio, react quey sabe detectar que quiero realizar cambios en esa key que ya esta almacenada en cache y no crear una key nueva
    queryKey: ['issues', { state, labels }],
    queryFn: () => getIssues(labels, state),
  })

  return issuesQuery
}
