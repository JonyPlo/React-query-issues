import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../../api/githubApi'
import { Label } from '../interfaces/label'
import { sleep } from '../helpers/sleep'

const getLabels = async (): Promise<Label[]> => {
  await sleep(2)
  const { data } = await githubApi.get<Label[]>('/labels?per_page=100')
  return data
}

export const useLabels = () => {
  const labelsQuery = useQuery({
    queryKey: ['labels'],
    queryFn: getLabels,
    // La opcion placeholderData es lo que aparecerá y se mostrara en pantalla mientras se realiza la peticion, una vez termine la peticion se mostraran los datos reales
    placeholderData: [
      {
        id: 725156255,
        node_id: 'MDU6TGFiZWw3MjUxNTYyNTU=',
        url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue%20(taken)',
        name: 'good first issue (taken)',
        color: 'b60205',
        default: false,
      },
      {
        id: 717031390,
        node_id: 'MDU6TGFiZWw3MTcwMzEzOTA=',
        url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue',
        name: 'good first issue',
        color: '6ce26a',
        default: true,
      },
    ],
    // La opcion staleTime es para decirle a react query que despues del tiempo establecido recien quiero que refresque la respuesta que esta almacenada en cache, asi que mientras no pase ese tiempo la respuesta estara en el estado "fresh", pero luego del tiempo establecido pasara al estado "stale", por lo tanto, en este caso los labels se actualizaran despues de 1 hora o cuando el usuario actualice la pagina
    // staleTime: 1000 * 60 * 60,
  })

  return labelsQuery
}
