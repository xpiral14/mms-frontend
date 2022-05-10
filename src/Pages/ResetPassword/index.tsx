import {Button, Card, Classes, FormGroup, Intent} from '@blueprintjs/core'
import React, {useState} from 'react'
import {Container} from './style'
import {useForm} from 'react-hook-form'
import AuthService from '../../Services/AuthService'
import {useHistory} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import useMessageError from '../../Hooks/useMessageError'

const ResetPasswordPage = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const {handleSubmit, register} = useForm()
  const {search} = useLocation()
  const { showErrormessage } = useMessageError()
  if (!search?.includes('token=') || !search?.includes('email=')) {
    history.push('/login')
  }

  const onSubmit = async ({password, password_confirmation}: any) => {
    try {
      setLoading(true)
      const urlSearchParams = new URLSearchParams(search)

      await AuthService.changePassword({
        token: urlSearchParams.get('token')!,
        email: urlSearchParams.get('email')!,
        password,
        password_confirmation
      })
      history.push('/login')

    } catch (error: any) {
      showErrormessage(
        error,
        'Houve um problema ao tentar trocar sua senha, por favor tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card style={{
        width: '100%',
        maxWidth: '400px'
      }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup label='Nova senha' labelFor='login-input' labelInfo='*'>
            <input
              style={{width: '100%'}}
              className={Classes.INPUT}
              type='password'
              placeholder='Digite sua nova senha'
              dir='auto'
              {...register('password', {required: true})}
            />
          </FormGroup>
          <FormGroup label='Confirmação da senha' labelFor='login-input' labelInfo='*'>
            <input
              style={{width: '100%'}}
              className={Classes.INPUT}
              type='password'
              placeholder='Digite a confirmação da sua senha'
              dir='auto'
              {...register('password_confirmation', {required: true})}
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

export default ResetPasswordPage
