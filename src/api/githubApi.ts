import axios from 'axios'

export const githubApi = axios.create({
  baseURL: 'https://api.github.com/repos/facebook/react',
  headers: {
    Authorization:
      'Bearer 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',
  },
})
