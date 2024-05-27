import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Intent,
  Icon,
  Menu,
  MenuItem,
} from '@blueprintjs/core'
import {
  RegistrationButtonBarProps,
  RegistrationButtons,
  ReportProps,
} from '../../Contracts/Components/RegistrationButtonBarProps'
import { ScreenStatus } from '../../Constants/Enums'
import { useWindow } from '../../Hooks/useWindow'
import Bar from '../Layout/Bar'
import Render from '../Render'
import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2'
import { useScreen } from '../../Hooks/useScreen'
import { DynamicReportScreenProps } from '../../Contracts/Screen/DynamicReportScreen'

const RegistrationButtonBar: React.FC<RegistrationButtonBarProps> = (
  props
): JSX.Element => {
  const [loadings, setLoadings] = useState<{
    isSaveLoading?: boolean
    isDeleteLoading?: boolean
  }>({})
  const importInputRef = useRef<HTMLInputElement>(null)
  const { screenStatus, setScreenStatus, payload, setPayload } = useWindow()

  const stopLoad = (key: keyof typeof loadings) => () => {
    setLoadings((prev) => ({ ...prev, [key]: false }))
  }
  const startLoad = (key: keyof typeof loadings) => () => {
    setLoadings((prev) => ({ ...prev, [key]: true }))
  }

  const { screen } = props
  const { openSubScreen } = useScreen()
  const handleNewButtonOnClick = () => {
    if (props?.handleNewButtonOnClick) {
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

  const handleCancelButtonOnClick =
    props?.handleCancelButtonOnClick ||
    (() => {
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      screen?.increaseScreenSize?.()
    })

  const handleDeleteButtonOnClick = () => {
    startLoad('isDeleteLoading')()
    if (props?.handleDeleteButtonOnClick) {
      props?.handleDeleteButtonOnClick(stopLoad('isDeleteLoading'))
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

  const hasToShowButton = useCallback(
    (button: RegistrationButtons) => props.buttonsToShow?.includes(button),
    [props.buttonsToShow]
  )
  const openReportScreen = (report: ReportProps) => () => {
    openSubScreen<DynamicReportScreenProps>(
      {
        id: 'dynamic-report',
        headerTitle: report.text,
      },
      screen?.id,
      report
    )
  }
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
            {...props.buttonNewProps}
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
            {...props.buttonSaveProps}
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
            {...props.buttonCancelProps}
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
            {...props.buttonEditProps}
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
            loading={loadings.isDeleteLoading}
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
          <Render renderIf={Boolean(props.reports?.length)}>
            <Popover2
              interactionKind={Popover2InteractionKind.HOVER}
              placement='bottom'
              content={
                <Menu>
                  {props.reports?.map((report) => (
                    <MenuItem
                      key={report.text}
                      text={report.text}
                      onClick={openReportScreen(report)}
                    />
                  ))}
                </Menu>
              }
            >
              <Button icon='document' outlined>
                Relatórios
              </Button>
            </Popover2>
          </Render>
        </Render>
        <Render renderIf={hasToShowButton(RegistrationButtons.IMPORT)}>
          <Button
            icon='import'
            intent={Intent.NONE}
            onClick={
              props.handleButtonImportOnClick
                ? () => {
                  importInputRef.current?.click()
                }
                : undefined
            }
            disabled={
              ![ScreenStatus.SEE_REGISTERS, ScreenStatus.NEW].includes(
                screenStatus
              )
            }
            {...(props?.buttonVisualizeProps || {})}
          >
            Importar
          </Button>
          <input
            type='file'
            hidden
            ref={importInputRef}
            accept={props.importFileTypes?.join(',')}
            onChange={props.handleButtonImportOnClick}
          />
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
  buttonsToShow: [
    RegistrationButtons.NEW,
    RegistrationButtons.SAVE,
    RegistrationButtons.CANCEL,
    RegistrationButtons.DETAIL,
    RegistrationButtons.EDIT,
    RegistrationButtons.DELETE,
    RegistrationButtons.VIZUALIZE,
    RegistrationButtons.CLOSE,
  ],
}
export default RegistrationButtonBar
