import { Intent, Tab, Tabs } from '@blueprintjs/core'
import React, { useEffect, useState } from 'react'
import Button from '../../Components/Button'
import { useAuth } from '../../Hooks/useAuth'
import useMessageError from '../../Hooks/useMessageError'
import { useWindow } from '../../Hooks/useWindow'
import CompanySettingsService from '../../Services/CompanySettingsService'
import ProductSettings from './ProductSettings'

const Settings = () => {
  const { companySetting } = useAuth()
  const { payload, setPayload } = useWindow()
  const [loading, setLoading] = useState(false)
  const { showErrorMessage } = useMessageError()

  useEffect(() => {
    setPayload(companySetting)
  }, [companySetting])
  const onSave = async () => {
    try {
      setLoading(true)
      await CompanySettingsService.saveCompanySetting(payload)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível salvar as configurações. Por favor tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Button
        text='Salvar'
        className='absolute right-[5px] z-10'
        intent={Intent.SUCCESS}
        icon='floppy-disk'
        onClick={onSave}
        loading={loading}
      />
      <Tabs id='settings-tab' defaultSelectedTabId='product-settings'>
        <Tab
          id='product-settings'
          title='Produtos'
          panel={<ProductSettings />}
        />
      </Tabs>
    </>
  )
}

export default Settings
