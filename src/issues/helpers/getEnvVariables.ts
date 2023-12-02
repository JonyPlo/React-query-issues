export const getEnvVariables = () => {
  const environments = import.meta.env

  return {
    ...environments,
  }
}
