import { Intent } from '@blueprintjs/core'
import { FC, useEffect } from 'react'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NumericInput from '../../Components/NumericInput'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'
import { ScreenStatus } from '../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  RegistrationButtons,
  StopLoadFunc,
} from '../../Contracts/Components/RegistrationButtonBarProps'
import ProductStockWarning from '../../Contracts/Models/ProductStockWarning'
import ProductStockWarningScreenProps from '../../Contracts/Screen/ProductStockWarning'
import { useAlert } from '../../Hooks/useAlert'
import useMessageError from '../../Hooks/useMessageError'
import { useToast } from '../../Hooks/useToast'
// import { useToast } from '../../Hooks/useToast'
import { useWindow } from '../../Hooks/useWindow'
import ProductStockWarningService from '../../Services/ProductStockWarningService'

const ProductStockWaning: FC<ProductStockWarningScreenProps> = ({
  screen,
  productStock,
}) => {
  const {
    payload,
    changePayloadAttribute,
    setPayload,
    setScreenStatus,
    screenStatus,
  } = useWindow<ProductStockWarning>()
  const { showErrorMessage: showErrormessage } = useMessageError()
  const { openAlert } = useAlert()
  const {showSuccessToast} = useToast()
  const handleCreateWarning = async (stopLoad: StopLoadFunc) => {
    try {
      if(!productStock.id ){
        return
      }
      const productStockWarning = {
        id: undefined,
        product_stock_id: productStock.id,
        minimum: payload.minimum,
        warning_type: 'value',
      }!
      await ProductStockWarningService.create(
        productStock.stock_id!,
        productStockWarning
      )

      showSuccessToast('O alerta foi criado com sucesso. Você receberá notificações quando este produto estiver abaixo do valor mínimo estipulado no alerta')
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível criar o alerta de estoque. Por favor, tente novamente.'
      )
    } finally {
      stopLoad()
    }
  }

  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)
    screen.decreaseScreenSize?.()
  }

  useEffect(() => {
    setScreenStatus(ScreenStatus.NEW)
  }, [])
  const handleDelete = () => {
    try {
      ProductStockWarningService.create(
        productStock.stock_id!,
        payload as ProductStockWarning
      )
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível criar o alerta de estoque. Por favor, tente novamente.'
      )
    }
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    screen.increaseScreenSize?.()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    buttonsToShow: [
      RegistrationButtons.NEW,
      RegistrationButtons.SAVE,
      RegistrationButtons.CLOSE,
    ],
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick: handleCreateWarning,

    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleDelete,
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleCancelButtonOnClick: () => {
      if (screenStatus === ScreenStatus.EDIT) {
        screen?.increaseScreenSize?.()
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        return
      }

      setScreenStatus(ScreenStatus.VISUALIZE)
    },
  }
  return (
    <Container>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>
      <Row>
        <NumericInput
          id={screen.id + 'minimum'}
          label='Valor mínimo para ser alertado'
          style={{ width: '100%' }}
          value={payload.minimum}
          fill
          onValueChange={(_, v) => changePayloadAttribute('minimum', v)}
        />
      </Row>
    </Container>
  )
}

export default ProductStockWaning
