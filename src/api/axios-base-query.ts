import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import mainInstance from './main-instance'

interface AxiosBaseQueryArgs {
  url: string
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl?: string } = { baseUrl: '' }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await mainInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
