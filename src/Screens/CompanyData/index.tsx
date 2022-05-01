import { Button, ButtonGroup, Intent } from '@blueprintjs/core'
import { FC, useState } from 'react'
import Collapse from '../../Components/Collapse'
import InputText from '../../Components/InputText'
import Bar from '../../Components/Layout/Bar'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import { ScreenStatus } from '../../Constants/Enums'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import Company from '../../Contracts/Models/Company'
import useAsync from '../../Hooks/useAsync'
import { useToast } from '../../Hooks/useToast'
import { useWindow } from '../../Hooks/useWindow'
import AddressService from '../../Services/AddressService'
import CompanyService from '../../Services/CompanyService'
import cleanNumericInput from '../../Util/cleanNumericInput'

const CompanyData: FC<ScreenProps> = ({ screen }) => {
  const { setScreenStatus, isScreenStatusEdit, isScreenStatusVizualize } =
    useWindow()
  const [addressCollapsed, setAddressCollapsed] = useState(true)
  const [company, setCompany] = useState<Partial<Company>>({})
  const [address, setAddress] = useState<Record<string, string>>({})
  const { showErrorToast } = useToast()

  const [loadingCompany, loadCompany] = useAsync(async () => {
    try {
      const response = await CompanyService.get()
      setCompany(response.data.data)
    } catch (error) {
      showErrorToast(
        'Não foi possível obter os dados da empresa. Por favor, tente novamente'
      )
    }
  }, [])

  const onSave = async () => {
    try {
      if (!company) return
      CompanyService.update({
        ...company,
        identification: company?.identification
          ? cleanNumericInput(company.identification!)
          : undefined,
        phone: company?.phone ? cleanNumericInput(company.phone) : undefined,
        cep: company.cep ? cleanNumericInput(company.cep) : undefined,
      })
      setScreenStatus(ScreenStatus.VISUALIZE)
    } catch (error) {
      showErrorToast({
        message:
          'Não foi possível  salvar a empresa. Por favor, tente novamente!',
      })
    }
  }

  const updateCompanyAttribute = (key: keyof typeof company, value: any) => {
    setCompany((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const [loadingAddress, loadAddress] = useAsync(async () => {
    try {
      const cep = cleanNumericInput(company?.cep ?? '')
      if (cep.length !== 8) {
        setAddress({})
        return
      }
      const response = await AddressService.getAddressFromCep(cep)
      if (response.data.erro) {
        showErrorToast('CEP inválido, por favor digite um CEP correto')
        return
      }
      if(!company.complement){
        updateCompanyAttribute('complement', response.data.complemento)
      }
      setAddress(response.data)
    } catch (error) {
      showErrorToast('Não foi possível obter os dados do endereço da empresa')
    }
  }, [company?.cep])
  return (
    <Container>
      <Bar>
        <ButtonGroup>
          <Button
            intent={Intent.SUCCESS}
            icon='floppy-disk'
            disabled={isScreenStatusVizualize}
            onClick={onSave}
          >
            Salvar
          </Button>
          <Button
            icon='edit'
            disabled={isScreenStatusEdit}
            onClick={() => setScreenStatus(ScreenStatus.EDIT)}
          >
            Editar
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            onClick={() => {
              loadCompany()
              loadAddress()
            }}
          >
            Recarregar tudo
          </Button>
          <Button
            icon='log-out'
            onClick={() => {
              screen?.close()
            }}
          >
            Fechar
          </Button>
        </ButtonGroup>
      </Bar>
      <Box>
        <Row>
          <h6>Dados da empresa</h6>
        </Row>
        <Row>
          <InputText
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
            id={screen.id + 'company_name'}
            disabled={isScreenStatusVizualize}
            onChange={(e) => updateCompanyAttribute('name', e.target.value)}
            label='Nome'
            value={company?.name ?? ''}
            className={loadingCompany ? 'bp4-skeleton' : ''}
          />
          <InputText
            id={screen.id + 'company_identification'}
            disabled={isScreenStatusVizualize}
            maxLength={14}
            onChange={(e) =>
              updateCompanyAttribute('identification', e.target.value)
            }
            label='CPF ou CNPJ'
            value={company?.identification ?? ''}
            className={loadingCompany ? 'bp4-skeleton' : ''}
          />
          <InputText
            id={screen.id + 'company_mail'}
            disabled={isScreenStatusVizualize}
            onChange={(e) => updateCompanyAttribute('mail', e.target.value)}
            label='email'
            type='mail'
            value={company?.mail ?? ''}
            className={loadingCompany ? 'bp4-skeleton' : ''}
          />
          <InputText
            id={screen.id + 'company_phone'}
            disabled={isScreenStatusVizualize}
            onChange={(e) => updateCompanyAttribute('phone', e.target.value)}
            label='Telefone'
            type='phone'
            mask='(99) 99999-9999'
            value={company?.phone ?? ''}
            className={loadingCompany ? 'bp4-skeleton' : ''}
          />
        </Row>
      </Box>

      <Box className='mt-2'>
        <Row className='w-100'>
          <Collapse
            title='Endereço'
            isCollapsed={addressCollapsed}
            onChange={() => setAddressCollapsed((prev) => !prev)}
          >
            <Row>
              <InputText
                id={screen.id + 'company_cep'}
                onChange={(e) => updateCompanyAttribute('cep', e.target.value)}
                label='CEP'
                disabled={isScreenStatusVizualize}
                mask='99999-999'
                value={company.cep ?? ''}
              />
              <InputText
                className={loadingAddress ? 'bp4-skeleton' : ''}
                id={screen.id + 'company_cep'}
                disabled
                label='Logradouro'
                value={address.logradouro ?? ''}
              />
              <InputText
                className={loadingAddress ? 'bp4-skeleton' : ''}
                id={screen.id + 'company_cep'}
                disabled
                label='Cidade'
                value={address.localidade ?? ''}
              />
              <InputText
                className={loadingAddress ? 'bp4-skeleton' : ''}
                id={screen.id + 'company_cep'}
                disabled
                label='UF'
                value={address.uf ?? ''}
              />
              <InputText
                className={loadingAddress ? 'bp4-skeleton' : ''}
                id={screen.id + 'company_cep'}
                disabled
                label='Bairro'
                value={address.bairro ?? ''}
              />
            </Row>
            <Row className='w-100'>
              <InputText
                id={screen.id + 'company_complement'}
                disabled={isScreenStatusVizualize}
                label='Complemento'
                style={{ flex: 1 }}
                inputStyle={{ width: '100%' }}
                value={company.complement ?? ''}
                onChange={(e) =>
                  updateCompanyAttribute('complement', e.target.value)
                }
              />
            </Row>
          </Collapse>
        </Row>
      </Box>
    </Container>
  )
}

export default CompanyData
