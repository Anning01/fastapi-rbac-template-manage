import request from '@/utils/request'

export function login(data) {
  // The backend expects form data, so we use URLSearchParams to format it.
  const params = new URLSearchParams()
  params.append('username', data.username)
  params.append('password', data.password)

  return request.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
