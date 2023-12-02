import axios from 'axios'
import { getEnvVariables } from '../issues/helpers/getEnvVariables'

const { VITE_AUTHENTICATION_TOKEN } = getEnvVariables()

export const githubApi = axios.create({
  baseURL: 'https://api.github.com/repos/facebook/react',
  headers: {
    Authorization:
      `Bearer ${VITE_AUTHENTICATION_TOKEN}`,
  },
})
