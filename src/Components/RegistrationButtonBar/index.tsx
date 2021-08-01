import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Button, ButtonGroup, Intent, Icon } from '@blueprintjs/core'
import { RegistrationButtonBarProps } from '../../Contracts/Components/RegistrationButtonBarProps'
import { ScreenStatus } from '../../Constants/Enums'
import { useWindow } from '../../Hooks/useWindow'

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
  const { screenStatus, setScreenStatus, payload, setPayload } = useWindow()

  const { exitButton = true, screen } = props
  const handleNewButtonOnClick = () => {
    if (props?.handleNewButtonOnClick?.()) {
      props?.handleNewButtonOnClick()
      return
    }
    setPayload?.({})
    setScreenStatus(ScreenStatus.NEW)
  }

  const handleSaveButtonOnClick = () => {
    if (props?.handleSaveButtonOnClick) {
      props?.handleSaveButtonOnClick()
      return
    }
  }

  const handleEditButtonOnClick = () => {
    if (props?.handleEditButtonOnClick) {
      props?.handleEditButtonOnClick()
      return
    }
    setScreenStatus(ScreenStatus.EDIT)
  }

  const handleCancelButtonOnClick = () => {
    if (props?.handleCancelButtonOnClick) {
      props?.handleCancelButtonOnClick()
      return
    }
    setPayload?.({})
    setScreenStatus(ScreenStatus.VISUALIZE)
  }

  const handleDeleteButtonOnClick = () => {
    if (props?.handleDeleteButtonOnClick) {
      props?.handleDeleteButtonOnClick()
      return
    }
  }

  const handleExitButtonOnClick = () => {
    if (props?.handleExitButtonOnClick) {
      props?.handleExitButtonOnClick()
      return
    }

    screen?.close()
  }

  const hasPayload = useMemo(() => {
    return Boolean(Object.keys(payload || {}).length)
  }, [payload])

  return (
    <BarContainer>
      <ButtonGroup>
        <Button
          icon='add'
          intent={Intent.PRIMARY}
          disabled={
            screenStatus === ScreenStatus.EDIT ||
            screenStatus === ScreenStatus.NEW
          }
          onClick={handleNewButtonOnClick}
        >
          Novo
        </Button>

        <Button
          icon='floppy-disk'
          intent={Intent.SUCCESS}
          disabled={screenStatus === ScreenStatus.VISUALIZE}
          onClick={handleSaveButtonOnClick}
        >
          Salvar
        </Button>

        <Button
          icon={
            <Icon
              icon='disable'
              color='#ff0000'
              aria-disabled={screenStatus === ScreenStatus.VISUALIZE}
            />
          }
          outlined
          disabled={screenStatus === ScreenStatus.VISUALIZE}
          onClick={handleCancelButtonOnClick}
        >
          Cancelar
        </Button>

        <Button
          icon='edit'
          outlined
          disabled={
            screenStatus === ScreenStatus.NEW ||
            screenStatus === ScreenStatus.EDIT ||
            !hasPayload
          }
          onClick={handleEditButtonOnClick}
        >
          Editar
        </Button>

        {Boolean(props.handleButtonInfoOnClick) && (
          <Button
            icon='info-sign'
            intent={Intent.WARNING}
            disabled={!hasPayload || screenStatus !== ScreenStatus.EDIT}
            onClick={props.handleButtonInfoOnClick}
          >
            Detalhes
          </Button>
        )}

        <Button
          icon='trash'
          intent={Intent.DANGER}
          onClick={handleDeleteButtonOnClick}
          disabled={!hasPayload && screenStatus !== ScreenStatus.EDIT}
          {...(props?.buttonDeleteProps || {})}
        >
          Excluir
        </Button>
      </ButtonGroup>

      {exitButton && (
        <ButtonGroup>
          {props.handleReloadScreenOnClick && (
            <Button
              icon='log-in'
              outlined
              onClick={props.handleReloadScreenOnClick}
            >
              Recarregar dados da tela
            </Button>
          )}
          <Button icon='log-in' outlined onClick={handleExitButtonOnClick}>
            Sair
          </Button>
        </ButtonGroup>
      )}
    </BarContainer>
  )
}

export default RegistrationButtonBar
