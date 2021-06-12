import { Button, Card, Classes, FormGroup, Intent } from '@blueprintjs/core'
import React from 'react'
import { Container } from './style'
import { useForm } from 'react-hook-form'
import AuthService from '../../Services/AuthService'
import { useAuth } from '../../Hooks/useAuth'
import { useHistory } from 'react-router-dom'
const LoginPage = () => {
  const history = useHistory()
  const { handleSubmit, register } = useForm()
  const { setAuth } = useAuth()
  const onSubmit = async ({ email, password }: any) => {
    try {
      const auth = await AuthService.login(email, password)
      localStorage.setItem('@auth', JSON.stringify(auth))
      if (auth.user) {
        setAuth(auth)
        history.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup label='Email' labelFor='login-input' labelInfo='*'>
            <input
              className={Classes.INPUT}
              type='email'
              placeholder='Digite seu email'
              dir='auto'
              {...register('email', { required: true })}
            />
          </FormGroup>
          <FormGroup label='Senha' labelFor='login-input' labelInfo='*'>
            <input
              className={Classes.INPUT}
              type='password'
              placeholder='Digite a sua senha'
              dir='auto'
              {...register('password', { required: true })}
            />
          </FormGroup>

          <Button intent={Intent.SUCCESS} text='Entrar' type='submit' />
        </form>
      </Card>
    </Container>
  )
}

export default LoginPage
