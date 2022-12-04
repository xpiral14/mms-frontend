import React, { useCallback, useMemo, useState } from 'react'
import { Button, ButtonGroup, Intent, Icon } from '@blueprintjs/core'
import { RegistrationButtonBarProps, RegistrationButtons } from '../../Contracts/Components/RegistrationButtonBarProps'
import { ScreenStatus } from '../../Constants/Enums'
import { useWindow } from '../../Hooks/useWindow'
import Bar from '../Layout/Bar'
import Render from '../Render'

const RegistrationButtonBar: React.FC<RegistrationButtonBarProps> = (
  props
): JSX.Element => {
  const [loadings, setLoadings] = useState<{ isSaveLoading?: boolean }>({})

  const { screenStatus, setScreenStatus, payload, setPayload } = useWindow()

  const stopLoad = (key: keyof typeof loadings) => () => {
    setLoadings((prev) => ({ ...prev, [key]: false }))
  }
  const startLoad = (key: keyof typeof loadings) => () => {
    setLoadings((prev) => ({ ...prev, [key]: true }))
  }

  const {screen } = props

  const handleNewButtonOnClick = () => {
    if (props?.handleNewButtonOnClick?.()) {
      props?.handleNewButtonOnClick()
      return
    }

    setPayload?.({})
    setScreenStatus(ScreenStatus.NEW)
  }

  const handleSaveButtonOnClick = () => {
    startLoad('isSaveLoading')()
    if (props?.handleSaveButtonOnClick) {
      props?.handleSaveButtonOnClick(stopLoad('isSaveLoading'))
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

  const handleVisualizeRegistersButtonOnClick = () => {
    if (props?.handleButtonVisualizeOnClick) {
      props?.handleButtonVisualizeOnClick()
      return
    }

    setScreenStatus(ScreenStatus.SEE_REGISTERS)
  }

  const handleExitButtonOnClick = () => {
    if (props?.handleExitButtonOnClick) {
      props?.handleExitButtonOnClick()
      return
    }

    screen?.close()
  }

  const hasPayload = useMemo(() => {
    return Boolean(payload.id)
  }, [payload])

  const hasToShowButton = useCallback((button: RegistrationButtons) => props.buttonsToShow?.includes(button), [props.buttonsToShow])
  return (
    <Bar>
      <ButtonGroup>
        <Render renderIf={hasToShowButton(RegistrationButtons.NEW)}>
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
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.SAVE)}>
        
          <Button
            icon='floppy-disk'
            intent={Intent.SUCCESS}
            loading={loadings.isSaveLoading}
            disabled={
              screenStatus === ScreenStatus.SEE_REGISTERS ||
            screenStatus === ScreenStatus.VISUALIZE
            }
            onClick={handleSaveButtonOnClick}
          >
          Salvar
          </Button>
        </Render>

        <Render renderIf={hasToShowButton(RegistrationButtons.CANCEL)}>
    
          <Button
            icon={
              <Icon
                icon='disable'
                color='#ff0000'
                aria-disabled={screenStatus === ScreenStatus.VISUALIZE}
              />
            }
            outlined
            disabled={
              screenStatus === ScreenStatus.SEE_REGISTERS ||
            screenStatus === ScreenStatus.VISUALIZE
            }
            onClick={handleCancelButtonOnClick}
          >
          Cancelar
          </Button>
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.EDIT)}>
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
        </Render>

        <Render renderIf={hasToShowButton(RegistrationButtons.DETAIL)}>

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
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.DELETE)}>
          <Button
            icon='trash'
            intent={Intent.DANGER}
            onClick={handleDeleteButtonOnClick}
            disabled={!hasPayload && screenStatus !== ScreenStatus.EDIT}
            {...(props?.buttonDeleteProps || {})}
          >
          Excluir
          </Button>
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.VIZUALIZE)}>
      
          <Button
            icon='filter-list'
            intent={Intent.NONE}
            onClick={handleVisualizeRegistersButtonOnClick}
            disabled={screenStatus !== ScreenStatus.VISUALIZE}
            {...(props?.buttonVisualizeProps || {})}
          >
          Registros
          </Button>
        </Render>
      </ButtonGroup>
      <ButtonGroup>

        <Render renderIf={hasToShowButton(RegistrationButtons.RELOAD_ALL)}>
          <Button
            icon='refresh'
            outlined
            onClick={props.handleReloadScreenOnClick}
          >
              Recarregar dados da tela
          </Button>
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.CLOSE)}>
          <Button icon='log-out' outlined onClick={handleExitButtonOnClick}>
            Sair
          </Button>
        </Render>
      </ButtonGroup>
    </Bar>
  )
}

RegistrationButtonBar.defaultProps = {
  buttonsToShow: [ RegistrationButtons.NEW,
    RegistrationButtons.SAVE,
    RegistrationButtons.CANCEL,
    RegistrationButtons.DETAIL,
    RegistrationButtons.EDIT,
    RegistrationButtons.DELETE,
    RegistrationButtons.VIZUALIZE,
    RegistrationButtons.CLOSE,
  ]
}
export default RegistrationButtonBar
