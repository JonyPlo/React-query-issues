import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { githubApi } from '../../api/githubApi'
import { Issue, State } from '../interfaces'
import { sleep } from '../helpers'

interface Props {
  state?: State
  labels: string[]
  page?: number
}

// Recordar que cuando se recibe un parametro que es opcional como el caso del "state?", este debe ponerse al final porque typescript valida los opcionales al final, es decir si los parametros se reciben de esta forma ", state?: State, label: string[]" esto daría error
const getIssues = async ({
  labels,
  state,
  page = 1,
}: Props): Promise<Issue[]> => {
  await sleep(2)

  const params = new URLSearchParams()

  // params es un objeto y cada propiedad es un parametro, cuando hacemos un params.append(clave, valor) esto nos agregara una nueva propiedad que queremos que sea un parametro
  if (state) params.append('state', state)

  if (labels.length > 0) {
    const labelString = labels.join(',')
    params.append('labels', labelString)
  }

  params.append('page', page.toString())
  params.append('per_page', '5')

  const { data } = await githubApi.get<Issue[]>('/issues', { params })
  return data
}

export const useIssues = ({ state, labels }: Props) => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [state, labels])

  const issuesQuery = useQuery({
    // Si dentro de la key, agregamos un objeto con elementos, no importa si antes tenia un orden y despues ese orden dentro del objeto cambio, react quey sabe detectar que quiero realizar cambios en esa key que ya esta almacenada en cache y no crear una key nueva
    //Si una de las propiedades dentro del objeto en el queryKey cambia, hace que se vuelva a disparar la peticion
    queryKey: ['issues', { state, labels, page }],
    queryFn: () => getIssues({ labels, state, page }),
  })

  const nextPage = () => {
    if (issuesQuery.data?.length === 0) return

    setPage(page + 1)

    // issuesQuery.refetch() <-- Este metodo se usa cuando queremos re disparar la peticion por si hace falta
  }

  const prevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  return {
    // Properties
    issuesQuery,

    // Getter
    page: issuesQuery.isFetching ? 'Loading' : page,

    // Methods
    nextPage,
    prevPage,
  }
}
