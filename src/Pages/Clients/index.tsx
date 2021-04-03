//eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import Link, { LinkProps } from '@material-ui/core/Link'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Grid } from '@material-ui/core'
import {
  default as Breadcrumbs,
  default as IconButton,
} from '@material-ui/core/Breadcrumbs'
import { Add as AddIcon } from '@material-ui/icons'
import { Update as UpdateIcon } from '@material-ui/icons'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { makeStyles } from '@material-ui/styles'
import { DataGrid, GridColDef, GridRowData } from '@material-ui/data-grid'
// import Costumer from '../../Contracts/Models/Costumer'
import CostumerService from '../../services/CustomerService'
import { GRID_LOCALE_PT_BR } from '../../Locales/dataGrid'
import { useSnackbar } from 'notistack'
import ModalClientAdd from './ModalClientAdd'
import Modal from '../../Components/Modal'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minWidth: 275,
    maxWidth: 345,
  },
  breadcrumbCurrent: {
    color: '#000000',
  },
  grid: {
    height: '100%',
    width: '100%',
  },
  breadcrumb: {
    marginTop: '10px',
  },
  loading: {
    width: '100%',
    height: '100%',
  },
})

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
)

const Clients: React.FC = () => {
  const history = useHistory()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  //eslint-disable-next-line
  const [costumers, setCostumers] = useState<any | GridRowData[]>() // fix type / fix new metadata
  //eslint-disable-next-line
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      getAllCostumers(1, 50)
    }, 1500)
  }, [])

  const getAllCostumers = async (page: number, limit: number) => {
    try {
      const costumersData = await CostumerService.getAll(page, limit)
      setCostumers(costumersData)
    } catch (err) {
      enqueueSnackbar('Erro ao se comunicar com o servidor', {
        variant: 'error',
      })
    }
  }

  const handleArrowBackButton = () => {
    history.goBack()
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 250 },
    { field: 'email', headerName: 'E-Mail', width: 190, sortable: false },
    {
      field: 'phone',
      headerName: 'Telefone',
      width: 190,
      sortable: false,
      type: 'string',
    },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      width: 120,
      sortable: false,
      type: 'string',
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 120,
      sortable: false,
      type: 'string',
    },
  ]

  return (
    <>
      <Grid container xs={6} alignItems='center'>
        <div>
          <IconButton aria-label='backOnePage' onClick={handleArrowBackButton}>
            <ArrowBackIcon />
          </IconButton>
        </div>

        <div>
          <Breadcrumbs aria-label='breadcrumb'>
            <LinkRouter color='inherit' to='/empresa'>
              Minha Empresa
            </LinkRouter>
            <span className={classes.breadcrumbCurrent}>Clientes{}</span>
          </Breadcrumbs>
        </div>
      </Grid>

      <Grid container xs={6} justify='flex-end' alignContent='center'>
        <ButtonGroup
          color='primary'
          variant='contained'
          size='small'
          aria-label='small button group'
        >
          <Button onClick={handleOpen}>
            <AddIcon />
            Adicionar Cliente
          </Button>
          <Button
            onClick={() => {
              getAllCostumers(1, 50)
            }}
            color='secondary'
          >
            <UpdateIcon />
            Atualizar
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid
        container
        xs={12}
        justify='flex-end'
        alignContent='center'
        className={classes.breadcrumb}
      >
        <div style={{ height: 400, width: '100%' }}>
          {costumers && (
            <DataGrid
              rowCount={costumers?.meta?.total || 0}
              rows={costumers?.data || []}
              columns={columns}
              page={costumers?.meta?.current_page || 1}
              onPageChange={(param) =>
                getAllCostumers(param.page + 1, param.pageSize)
              }
              pageSize={50}
              localeText={GRID_LOCALE_PT_BR}
              checkboxSelection
              disableSelectionOnClick
              onPageSizeChange={(param) => {
                getAllCostumers(param.page + 1, param.pageSize)
              }}
              pagination
              paginationMode='server'
              onCellClick={() => alert('clicou')}
            />
          )}
        </div>
      </Grid>

      <Modal modalProps={{ open, onClose: handleClose } as any}>
        <ModalClientAdd
          title='Cadastrar Novo Cliente'
          handleClose={handleClose}
        />
      </Modal>
    </>
  )
}

export default Clients
