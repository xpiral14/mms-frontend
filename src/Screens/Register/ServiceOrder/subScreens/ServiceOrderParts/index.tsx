/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useMemo } from 'react'
import MultiSelect, {
  MultiSelectOption,
} from '../../../../../Components/MultiSelect'
import Select from '../../../../../Components/Select'
import ScreenProps from '../../../../../Contracts/Components/ScreenProps'
import { Option } from '../../../../../Contracts/Components/Suggest'
import Piece from '../../../../../Contracts/Models/Piece'
import Service from '../../../../../Contracts/Models/Service'
import useAsync from '../../../../../Hooks/useAsync'
import { useScreen } from '../../../../../Hooks/useScreen'
import { useWindow } from '../../../../../Hooks/useWindow'
import { Row as Body, Container, Footer, Header } from './style'
import PartsService from '../../../../../Services/PartsService'
import Button from '../../../../../Components/Button'
import { Intent } from '@blueprintjs/core'
import NumericInput from '../../../../../Components/NumericInput'
import TextArea from '../../../../../Components/TextArea'
import OrderService from '../../../../../Services/OrderService'
import useValidation from '../../../../../Hooks/useValidation'
import { Validation } from '../../../../../Contracts/Hooks/useValidation'
interface ServiceOrderPartsScreenProps extends ScreenProps {
  services: Service[]
  parts: Piece[],
  orderId: number
}

const FIRST_ARRAY_INDEX = 0

interface PayloadData {
  partIds?: number[]
  description?: string
  estimatedTime?: number,
  hasSaved?: boolean
}
const ServiceOrderParts = ({
  services,
  screen,
  orderId
}: ServiceOrderPartsScreenProps) => {
  const [activeServiceIndex, setActiveService] = useState<number>(0)
  const [payload, setPayload] = useState<{
    data?: {
      [x: string]: PayloadData
    }
  }>()
  const [parts, setParts] = useState<Piece[]>([])

  const [loadingParts, loadParts] = useAsync(async () => {
    const parts = await PartsService.getAll(1, 100)
    setParts(parts.data.data)
  }, [])

  const activeService = useMemo(
    () => services[activeServiceIndex],
    [services, activeServiceIndex]
  )
  const partsOption = useMemo<Option[]>(
    () => parts.map((p) => ({ label: `${p.name} - ${p.price}`, value: p.id })),
    [parts]
  )

  const handleNextServiceClick = () => {
    const nextServiceIndex = activeServiceIndex + 1

    if (!services?.[nextServiceIndex]) {
      return
    }

    setActiveService(nextServiceIndex)
  }

  const handlePreviousServiceClick = () => {
    const previousServiceIndex = activeServiceIndex - 1

    if (
      previousServiceIndex < FIRST_ARRAY_INDEX ||
      !services?.[previousServiceIndex]
    ) {
      return
    }

    setActiveService(previousServiceIndex)
  }

  const handleSetPayload = (
    serviceId: number,
    propertyName: string,
    value: any
  ) => {
    setPayload((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        [serviceId]: {
          ...prev?.data?.[serviceId],
          [propertyName]: value,
          hasSaved: propertyName === 'hasSaved' ? value : false,
        },
      },
    }))
  }

  const handleOnRemoveSelectedPieces = (_: any, partIndex: number) => {
    setPayload((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        [activeService!.id]: {
          ...prev?.data?.[activeService!.id],
          partIds:
            prev?.data?.[activeService!.id]?.partIds?.filter(
              (_, i) => i !== partIndex
            ) || [],
          hasSaved: false
        },
      },
    }))
  }

  const handleOnSelectPieces = (o: MultiSelectOption) => {
    setPayload((prev) => {
      const copyPrev = { ...prev }
      if (
        copyPrev.data?.[activeService!.id]?.partIds?.includes(o.value as number)
      ) {
        return {
          ...copyPrev,
          data: {
            ...copyPrev.data,
            [activeService!.id]: {
              partIds:
                copyPrev.data?.[
                  services?.[activeServiceIndex]!.id
                ]?.partIds?.filter((partId) => partId !== o.value) || [],
              hasSaved: false,
            },
          },
        }
      }

      return {
        data: {
          ...prev?.data,
          [activeService!.id]: {
            ...services?.[activeServiceIndex],
            partIds: [
              ...(prev?.data?.[activeService!.id]?.partIds || []),
              o.value as number,
            ],
            hasSaved: false,
          },
        },
      }
    })
  }
  const validations : Validation[] = [
    {
      check:  () => Boolean(payload?.data?.[activeServiceIndex]?.estimatedTime),
      errorMessage: 'O tempo estimado',
      inputId: `${screen.id}-estimated-time`,
    },
    {
      check: () => Boolean(payload?.data?.[activeServiceIndex]?.partIds?.length),
      errorMessage: 'As peças do serviços são obrigatórias'
    }
  ]
  const {validate} = useValidation(validations)
  const handleNoteChange = (ev: any) => {
    handleSetPayload(activeService!.id, 'description', ev.target.value)
  }

  const handleEstimatedTimeChange = (v: number) => {
    handleSetPayload(activeService!.id, 'estimatedTime', v)
  }

  const handleButtonSave = () => {

    if(!validate()){
      return
    }
    OrderService.configServiceOrder(
      orderId,
      activeService!.id,
      {
        description: payload?.data?.[activeServiceIndex]?.description || '',
        estimatedTime: payload?.data?.[activeServiceIndex]?.estimatedTime || 0,
        partIds: payload?.data?.[activeServiceIndex]?.partIds || [],
      }
    )
    handleSetPayload(
      activeService!.id,
      'hasSaved',
      true
    )
  }
  return (
    <Container>
      <Header>
        <div style={{ fontSize: 15 }}>
          <b>{services?.[activeServiceIndex]?.name}</b>
        </div>
      </Header>
      <Body>
        <Body>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div>
              <NumericInput
                id={`${screen.id}_total_worked_hours`}
                label='Tempo estimado (Horas)'
                selectAllOnIncrement
                selectAllOnFocus
                value={
                  payload?.data?.[activeService!.id]?.estimatedTime || ''
                }
                onValueChange={handleEstimatedTimeChange}
              />
            </div>
            <div>
              <MultiSelect
                id={`${screen.id}_select_pieces`}
                label='Peças'
                handleButtonReloadClick={loadParts}
                loading={loadingParts}
                onRemove={handleOnRemoveSelectedPieces}
                items={partsOption}
                selectedItems={payload?.data?.[activeService!.id]?.partIds}
                onChange={handleOnSelectPieces}
                formGroupProps={{
                  style: {
                    width: '100%',
                  },
                }}
              />
            </div>

            <div>
              <TextArea
                id={`${screen.id}_note`}
                value={payload?.data?.[activeService!.id]?.description || ''}
                label='Observação'
                onChange={handleNoteChange}
              />
            </div>
          </div>
        </Body>
      </Body>

      <Footer>
        <div>
          <Button
            onClick={handlePreviousServiceClick}
            disabled={activeServiceIndex === FIRST_ARRAY_INDEX}
          >
            Anterior
          </Button>
        </div>
        <div>
          Serviço {activeServiceIndex + 1} de {services.length}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 5,
          }}
        >
          <Button
            text='Salvar'
            disabled={payload?.data?.[activeService!.id]?.hasSaved}
            onClick={handleButtonSave}
            intent={Intent.SUCCESS}
          />

          <Button
            disabled={activeServiceIndex === services.length - 1}
            onClick={handleNextServiceClick}
          >
            Próximo
          </Button>
        </div>
      </Footer>
    </Container>
  )
}

export default ServiceOrderParts
