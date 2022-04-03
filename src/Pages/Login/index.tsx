import { Button, Card, Classes, FormGroup, Intent } from '@blueprintjs/core'
import React, { useState } from 'react'
import { Container } from './style'
import { useForm } from 'react-hook-form'
import AuthService from '../../Services/AuthService'
import { useAuth } from '../../Hooks/useAuth'
import { useHistory } from 'react-router-dom'
import { useToast } from '../../Hooks/useToast'
const LoginPage = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const { handleSubmit, register } = useForm()
  const { setAuth } = useAuth()
  const { showToast, showErrorToast } = useToast()

  const onSubmit = async ({ email, password }: any) => {
    try {
      setLoading(true)
      const auth = await AuthService.login(email, password)
      if (auth) {
        setAuth(auth.data)
        history.push('/')
      }
    } catch (error: any) {
      if (error.response) {
        showToast({
          message: error?.response?.data?.data?.messages,
          intent: Intent.DANGER,
        })
      } else {
        showErrorToast({
          message:
            'Houve um problema ao tentar se autenticar, recarregue e tente novamente. Caso o problema persista entra em contato com o suporte',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card style = {{
        width: '100%',
        maxWidth: '400px'
      }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup label='Email' labelFor='login-input' labelInfo='*'>
            <input
              style={{width: '100%'}}
              className={Classes.INPUT}
              type='email'
              placeholder='Digite seu email'
              dir='auto'
              {...register('email', { required: true })}
            />
          </FormGroup>
          <FormGroup label='Senha' labelFor='login-input' labelInfo='*'>
            <input
              style={{width: '100%'}}
              className={Classes.INPUT}
              type='password'
              placeholder='Digite a sua senha'
              dir='auto'
              {...register('password', { required: true })}
            />
          </FormGroup>

          <Button
            style={
              {
                width: '100%'
              }
            }
            loading={loading}
            intent={Intent.SUCCESS}
            text='Entrar'
            type='submit'
          />
        </form>
      </Card>
    </Container>
  )
}

export default LoginPage
