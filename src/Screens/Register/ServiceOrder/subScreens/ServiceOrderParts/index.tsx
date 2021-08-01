/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useMemo } from 'react'
import MultiSelect from '../../../../../Components/MultiSelect'
import Select from '../../../../../Components/Select'
import ScreenProps from '../../../../../Contracts/Components/ScreenProps'
import { Option } from '../../../../../Contracts/Components/Suggest'
import Piece from '../../../../../Contracts/Models/Piece'
import Service from '../../../../../Contracts/Models/Service'
import useAsync from '../../../../../Hooks/useAsync'
import { useScreen } from '../../../../../Hooks/useScreen'
import { useWindow } from '../../../../../Hooks/useWindow'
import { Row, Container, Footer, Header } from './style'
import PartsService from '../../../../../Services/PartsService'
import Button from '../../../../../Components/Button'
import { Intent } from '@blueprintjs/core'
import { Body } from '../../../../../Pages/Login/style'
interface ServiceOrderPartsScreenProps extends ScreenProps {
  services: Service[]
  parts: Piece[]
}

const ServiceOrderParts = (props: ServiceOrderPartsScreenProps) => {
  const [payload, setPayload] = useState<{
    data?: {
      [x: string]: number[]
    }
  }>()
  const [parts, setParts] = useState<Piece[]>([])

  const [loadingParts, loadParts] = useAsync(async () => {
    const parts = await PartsService.getAll(1, 100)
    setParts(parts.data.data)
  }, [])

  const partsOption = useMemo<Option[]>(
    () => parts.map((p) => ({ label: `${p.name} - ${p.price}`, value: p.id })),
    [parts]
  )
  return (
    <Container>
      <Header>
        <p>Selecione as peças de cada serviço da ordem</p>
        <Button text='Salvar' intent={Intent.SUCCESS} />
      </Header>
      <Row>
        {props.services.map((s) => (
          <Row key={s.id}>
            <div>
              <b>{s.name}</b>
            </div>
            <div style={{ flex: 1 }}>
              <MultiSelect
                handleButtonReloadClick={loadParts}
                loading={loadingParts}
                onRemove={(_, partIndex) => {
                  setPayload((prev) => ({
                    ...prev,
                    data: {
                      ...prev?.data,
                      [s.id]:
                        prev?.data?.[s.id].filter((_, i) => i !== partIndex) ||
                        [],
                    },
                  }))
                }}
                items={partsOption}
                selectedItems={payload?.data?.[s.id]}
                onChange={(o) =>
                  setPayload((prev) => {
                    const copyPrev = { ...prev }
                    if (copyPrev.data?.[s.id]?.includes(o.value as number)) {
                      return {
                        ...copyPrev,
                        data: {
                          ...copyPrev.data,
                          [s.id]: copyPrev.data[s.id].filter(
                            (partId) => partId !== o.value
                          ),
                        },
                      }
                    }

                    return {
                      data: {
                        ...prev?.data,
                        [s.id]: [
                          ...(prev?.data?.[s.id] || []),
                          o.value as number,
                        ],
                      },
                    }
                  })
                }
                formGroupProps={{
                  style: {
                    width: '100%',
                  },
                }}
              />
            </div>
          </Row>
        ))}
      </Row>
    </Container>
  )
}

export default ServiceOrderParts
