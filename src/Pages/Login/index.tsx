import {Button, Card, Classes, FormGroup, Intent} from '@blueprintjs/core'
import React, {useState} from 'react'
import {Container} from './style'
import {useForm} from 'react-hook-form'
import Render from '../../Components/Render'
import AuthService from '../../Services/AuthService'
import {useAuth} from '../../Hooks/useAuth'
import {useHistory} from 'react-router-dom'
import {useToast} from '../../Hooks/useToast'

enum PageMode {
  LOGIN = 'login',
  RESET_PASSWORD = 'reset_password'
}

const LoginPage = () => {

  const [pageMode, setPageMode] = useState(PageMode.LOGIN)
  const [sentEmail, setSentEmail] = useState(false)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const {handleSubmit, register} = useForm()
  const {setAuth} = useAuth()
  const {showToast, showErrorToast} = useToast()

  const onSubmit = async ({email, password}: any) => {
    if (pageMode === PageMode.RESET_PASSWORD) {
      AuthService.sendPasswordEmail({email})
      setSentEmail(true)
      return
    }
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
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Render renderIf={pageMode === PageMode.RESET_PASSWORD}>
          <Button
            icon='arrow-left'
            style={{
              alignSelf: 'flex-start',
            }}
            onClick={() => {
              setPageMode(PageMode.LOGIN)
              setSentEmail(false)
            }}
            aria-label='voltar'
          />
        </Render>

        <Render renderIf={!sentEmail}>
          <Render renderIf={pageMode === PageMode.RESET_PASSWORD}>
            <p className='mt-3'>
              Um email de recuperação de senha será enviado para o email
              digitado abaixo caso esteja cadastrado no sistema
            </p>
          </Render>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-1 w-100'>
            <FormGroup label='Email' labelFor='login-input' labelInfo='*'>
              <input
                style={{ width: '100%' }}
                className={Classes.INPUT}
                type='email'
                placeholder='Digite seu email'
                dir='auto'
                {...register('email', { required: true })}
              />
            </FormGroup>
            <Render renderIf={pageMode === PageMode.LOGIN}>
              <FormGroup label='Senha' labelFor='login-input' labelInfo='*'>
                <input
                  style={{ width: '100%' }}
                  className={Classes.INPUT}
                  type='password'
                  placeholder='Digite a sua senha'
                  dir='auto'
                  {...register('password', { required: true })}
                />
              </FormGroup>
            </Render>

            <Button
              style={{
                width: '100%',
              }}
              icon={PageMode.LOGIN ? 'log-in' : undefined}
              loading={loading}
              intent={Intent.SUCCESS}
              text={
                pageMode === PageMode.LOGIN
                  ? 'Entrar'
                  : 'Enviar email de recuperação de senha'
              }
              type='submit'
            />
          </form>
        </Render>
        <Render renderIf={sentEmail}>O email foi enviado com sucesso!</Render>
        <Render renderIf={pageMode === PageMode.LOGIN}>
          <Button
            className='mt-3'
            small
            onClick={() => setPageMode(PageMode.RESET_PASSWORD)}
          >
            {' '}
            Recuperar senha
          </Button>
        </Render>
      </Card>
    </Container>
  )
}

export default LoginPage
