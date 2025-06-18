import { useQuery as useQueryVue, useMutation as useMutationVue } from '@tanstack/vue-query'

// get请求方法封装fetch
const getRequest = async (url: string, data: any) => {
  const params = new URLSearchParams(data)
  return fetch(`${url}?${params.toString()}`).then((res) => res.json())
}

// post请求方法封装fetch
const postRequest = async (url: string, data: any) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json",
      },
  }).then((res) => res.json())
}

export const useQuery = (url: string, data: any) => {
  return useQueryVue({
    queryKey: ['request', url],
    queryFn: () => getRequest(url, data),
  })
}

export const useMutation = (url: string, data: any) => {
  return useMutationVue({
    mutationFn: () => postRequest(url, data),
  })
}
