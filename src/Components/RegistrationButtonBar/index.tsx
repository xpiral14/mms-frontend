import React from 'react'
import styled from 'styled-components'
import { Button, ButtonGroup, Intent, Icon } from '@blueprintjs/core'
import { RegistrationButtonBarProps } from '@Contracts/Components/RegistrationButtonBarProps'
import { ScreenStatus } from '../../Constants/Enums'

const BarContainer = styled.div`
  background-color: #ebf1f5;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 5px #d3d3d3;
  background: linear-gradient(
    180deg,
    rgba(235, 241, 245, 1) 0%,
    rgba(233, 237, 238, 1) 50%,
    rgba(218, 222, 224, 1) 100%
  );
`

const RegistrationButtonBar: React.FC<RegistrationButtonBarProps> = (
  props
): JSX.Element => {
  const { exitButton = true, status, setStatus } = props

  const handleNewButtonOnClick = () => {
    if (props?.handleNewButtonOnClick?.()) {
      props?.handleNewButtonOnClick()
      return
    }

    setStatus(ScreenStatus.NEW)
  }

  const handleSaveButtonOnClick = () => {
    if (props?.handleSaveButtonOnClick?.()) {
      props?.handleSaveButtonOnClick()
      return
    }
  }

  const handleEditButtonOnClick = () => {
    if (props?.handleEditButtonOnClick?.()) {
      props?.handleEditButtonOnClick()
      return
    }

    setStatus(ScreenStatus.EDIT)
  }

  const handleCancelButtonOnClick = () => {
    if (props?.handleCancelButtonOnClick?.()) {
      props?.handleCancelButtonOnClick()
      return
    }

    setStatus(ScreenStatus.VISUALIZE)
  }

  const handleDeleteButtonOnClick = () => {
    if (props?.handleDeleteButtonOnClick?.()) {
      props?.handleDeleteButtonOnClick()
      return
    }
  }

  const handleExitButtonOnClick = () => {
    if (props?.handleExitButtonOnClick?.()) {
      props?.handleExitButtonOnClick()
      return
    }
  }

  return (
    <BarContainer>
      <ButtonGroup>
        <Button
          icon='add'
          intent={Intent.PRIMARY}
          disabled={status === ScreenStatus.EDIT || status === ScreenStatus.NEW}
          onClick={handleNewButtonOnClick}
        >
          Novo
        </Button>

        <Button
          icon='floppy-disk'
          intent={Intent.SUCCESS}
          disabled={status === ScreenStatus.VISUALIZE}
          onClick={handleSaveButtonOnClick}
        >
          Salvar
        </Button>

        <Button
          icon={
            <Icon
              icon='disable'
              color='#ff0000'
              aria-disabled={status === ScreenStatus.VISUALIZE}
            />
          }
          outlined
          disabled={status === ScreenStatus.VISUALIZE}
          onClick={handleCancelButtonOnClick}
        >
          Cancelar
        </Button>

        <Button
          icon='edit'
          outlined
          disabled={status === ScreenStatus.NEW || status === ScreenStatus.EDIT}
          onClick={handleEditButtonOnClick}
        >
          Editar
        </Button>

        <Button
          icon='trash'
          intent={Intent.DANGER}
          onClick={handleDeleteButtonOnClick}
          {...(props?.buttonDeleteProps || {})}
        >
          Excluir
        </Button>
      </ButtonGroup>

      {exitButton && (
        <Button
          color='#ff0000'
          icon='log-in'
          outlined
          onClick={handleExitButtonOnClick}
        >
          Sair
        </Button>
      )}
    </BarContainer>
  )
}

export default RegistrationButtonBar
