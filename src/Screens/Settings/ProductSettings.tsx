import { Colors, Tab, Tabs } from '@blueprintjs/core'
import React from 'react'
import Collapse from '../../Components/Collapse'
import Box from '../../Components/Layout/Box'
import Row from '../../Components/Layout/Row'
import InputText from '../../Components/ScreenComponents/InputText'
import Switch from '../../Components/ScreenComponents/Switch'
import CompanySetting from '../../Contracts/Models/CompanySettings'
import { useWindow } from '../../Hooks/useWindow'

const ProductSettings = () => {
  const { payload } = useWindow()
  return (
    <Box>
      <Row>
        <Row>
          <h4 className='bp5-heading'>Padrão de referência</h4>
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
          <Switch
            className='self-center'
            name='disable_product_reference_edit'
            label='Bloquear edição de referência do produto'
          />
        </Row>
      </Row>
    </Box>
  )
}

export default ProductSettings
