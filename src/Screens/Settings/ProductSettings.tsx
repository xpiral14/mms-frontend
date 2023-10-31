import { Colors, Tab, Tabs } from '@blueprintjs/core'
import React from 'react'
import Collapse from '../../Components/Collapse'
import Box from '../../Components/Layout/Box'
import Row from '../../Components/Layout/Row'
import InputText from '../../Components/ScreenComponents/InputText'
import { useWindow } from '../../Hooks/useWindow'

const ProductSettings = () => {
  const { payload } = useWindow()
  return (
    <Box>
      <Row>
        <Row>
          <h3 className='text-lg'>Padrão de referência</h3>
        </Row>
        <Row className='text-gray-500'>
          <p>Esse é o código que será usado para identificar os produtos</p>
        </Row>
        <Row>
          <InputText
            name='product_reference_prefix'
            label='Prefixo da referência'
          />
          <InputText
            name='product_reference_suffix'
            label='Sufixo da referência'
          />
          <InputText
            tabIndex={-1}
            readOnly
            name=''
            label='Exemplo:'
            value={`${payload.product_reference_prefix ?? ''}1234${
              payload.product_reference_suffix ?? ''
            }`}
          />
        </Row>
      </Row>
    </Box>
  )
}

export default ProductSettings
