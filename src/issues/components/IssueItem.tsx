import { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi'

import { Issue, State } from '../interfaces'
import { getIssueComments, getIssueInfo } from '../hooks'
import { timeSince } from '../helpers'

interface Props {
  issue: Issue
}

export const IssueItem: FC<Props> = ({ issue }) => {
  const navigate = useNavigate()

  const queryClient = useQueryClient() // Con este custom hook de react query podemos acceder al query client que engloba la aplicacion, esto nos sirve para limpiar queries, obtener los queries, etc

  const prefetchData = () => {
    // En este caso usamos prefetchQuery para que al pasar el mouse por encima de una issue, se realice la peticion y se guarde la data en la cache, esto hara que al momento de entrar a esa card o issue, los datos aparezcan rápidamente porque la peticion ya se hizo antes cuando se paso el mouse por encima de la issue y solo tuvo que buscar los datos en la cache para mostrarlos en pantalla.
    // Recordar que en este caso al entrar a cada issue, se intentara realizar una peticion, pero si la peticion que se intenta realizar detecta que ya existe una key igual en la cache, entonces buscara los datos de esa key y los usara, evitando realizar la peticion, en este caso, al pasar el mouse por encima de una issue, ejecutamos un prefetchQuery, que realiza la peticion y almacena los datos de la issue en la cache con la key ['issue', 27763], pero cuando entremos a esa issue, la funcion que se encarga de realizar la peticion para traer los datos de esa issue, crear una key llamada ['issue', 27763] y almacenar los datos ahi, pero antes de hacer eso, detectara que ya existe una key con ese mismo nombre que quiere crear, entonces rehusara esa key con esos datos que ya tiene almacenados, pero si el nombre de las key no coincide, entonces al entrar a la issue se realizara nuevamente la peticion, creando una nueva key con otro nombre y almacenando los nuevos datos
    queryClient.prefetchQuery({
      queryKey: ['issue', issue.number],
      queryFn: () => getIssueInfo(issue.number),
    })

    queryClient.prefetchQuery({
      queryKey: ['issue', issue.number, 'comments'],
      queryFn: () => getIssueComments(issue.number),
    })
  }

  const preSetData = () => {
    // Con el metodo setQueryData puedo tomar los datos almacenados en cache que ya fueron solicitados anteriormente por otra solicitud y almacenarlos en una key que sera usada en otro momento, por ej, en este caso especifico para cargar la lista de todas las issues se tiene que realizar una peticion, la cual me retorna un arreglo de issues y las guardo en la cache con la key ['issues'], ahora cada issue de ese arreglo tiene la misma informacion que me retorna la peticion que se realiza cuando entro a cada issue individualmente, entonces en vez de realizar una peticion cada vez que paso el mouse por encima de una issue, voy a crear una key llamada ['issue', issue.number] (el issue.number es el numero de la issue) y a esa key le voy a asignar la informacion de la "issue" que quedo guardada por la peticion anterior cuando se listaron todas las issues, en otras palabras, estamos reutilizando datos que quedaron guardados de otras peticiones
    queryClient.setQueryData(['issue', issue.number], issue, {
      updatedAt: new Date().getTime() + 100000, // <-- Esta propiedad es solo de el metodo setQueryData y es para establecer hasta que hora la data se considerara como nueva o "fresh", en este caso la info sera fresh durante 1 min y medio, cuando se pase de ese tiempo, pasara al estado "stale", recordar que si una key esta en estado stale, cuando nos vallamos a otra pestaña del navegador y volvamos a la pagina, se volverán a disparar las peticiones para actualizar esos datos
    })

    // Con este if pregunto si la key '['issue', issue.number, 'comments'])' existe en la cache de react query, si existe entonces ejecuta la peticion de adentro, crea la key y guarda los datos en la cache para ser usados si se accede a la issue
    if (!queryClient.getQueryState(['issue', issue.number, 'comments'])) {
      return queryClient.prefetchQuery({
        queryKey: ['issue', issue.number, 'comments'],
        queryFn: () => getIssueComments(issue.number),
        gcTime: 10000 * 6, //<-- Con esta propiedad hago que la key en la cache de react query se borre despues del tiempo especificado, en este caso se borraran despues de 60 segundos
      })
    }
  }

  return (
    <div
      className='card mb-2 issue'
      onClick={() => navigate(`/issues/issue/${issue.number}`)}
      // onMouseEnter={prefetchData}
      onMouseEnter={preSetData}
    >
      <div className='card-body row'>
        <div className='col-1 d-flex g-0 justify-content-center align-items-center'>
          {issue.state === State.Open ? (
            <FiInfo size={30} color='red' />
          ) : (
            <FiCheckCircle size={30} color='green' />
          )}
        </div>
        <div className='col-8'>
          <div className='d-flex flex-column flex-fill'>
            <span>{issue.title}</span>
            <span className='issue-subinfo'>
              #{issue.number} opened {timeSince(issue.created_at)} ago by{' '}
              <span className='fw-bold'>{issue.user.login}</span>
            </span>
            <div>
              {issue.labels.map((label) => (
                <span
                  key={label.id}
                  className='badge rounded-pill m-1'
                  style={{ backgroundColor: `#${label.color}`, color: 'black' }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='col-3 d-flex g-0 justify-content-center align-items-center'>
          <div className='d-flex justify-content-end'>
            <img
              src={issue.user.avatar_url}
              alt='User Avatar'
              className='avatar me-4'
            />
            <div className='d-flex align-items-center'>
              <span className='px-1'>{issue.comments}</span>
              <FiMessageSquare />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
