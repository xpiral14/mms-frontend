import {
  Button,
  Card,
  Grid,
  IconButton,
  Select,
  MenuItem,
} from '@material-ui/core/'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link, { LinkProps } from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@material-ui/icons/'
import { useSnackbar } from 'notistack'
import { useContext, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
import { userDataContext } from '../../context/UserData'
import { fuelType } from '../../Contracts/Enums'
import CompanyModel from '../../Contracts/Models/Company'
import Vehicle from '../../Contracts/Models/Vehicle'
import CompanyService from '../../services/CompanyService'
import VehicleService from '../../services/VehicleService'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 275,
    maxWidth: 345,
  },
  grid: {
    height: '100%',
    width: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  card: {
    width: '100%',
    height: '100%',
    padding: '2rem',
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    width: '100%',
  },
  description: {
    marginTop: '0.5rem',
  },
  breadcrumbCurrent: {
    color: '#000000',
  },
  input: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  divFormTextField: {
    display: 'flex',
  },
}))

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
)

const VehicleDetails: React.FC = () => {
  const history = useHistory()
  const match = useRouteMatch<{ vehicleId: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined)
  const [company, setCompany] = useState<CompanyModel | null>(null)
  const { register, handleSubmit, setValue, control } = useForm()
  const watchImageInput = useWatch({
    control,
    name: 'imageUrl',
  })
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useContext(userDataContext)
  const classes = useStyles()

  useEffect(() => {
    (async function () {
      const vehicle = await VehicleService.getOne(+match.params.vehicleId)
      setVehicle(vehicle)
    })()
  }, [])

  useEffect(() => {
    (async function () {
      try {
        const companyData = await CompanyService.getOne(user!.companyId)
        setCompany(companyData)
      } catch (error) {
        enqueueSnackbar('Não foi possível obter os dados da empresa')
      }
    })()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      await VehicleService.create(data)
      enqueueSnackbar('Veículo criado com sucesso!', { variant: 'success' })
    } catch (error) {
      if (error.response) {
        error.response.data.errors.forEach((err: any) => {
          enqueueSnackbar(err.message, { variant: 'error' })
        })
      }
    }
  }

  const handleButtonCancelEditVehicleDetailsOnClick = () => {
    history.goBack()
  }

  return (
    <Grid container spacing={3} className={classes.grid}>
      <Grid container xs={12} alignItems='center'>
        <div>
          <IconButton aria-label='backOnePage' onClick={() => history.goBack()}>
            <ArrowBackIcon />
          </IconButton>
        </div>

        <div>
          <Breadcrumbs aria-label='breadcrumb'>
            <LinkRouter color='inherit' to='/empresa'>
              Minha Empresa
            </LinkRouter>
            <LinkRouter color='inherit' to='/veiculos'>
              Veículos
            </LinkRouter>
            <span className={classes.breadcrumbCurrent}>Adicionar</span>
          </Breadcrumbs>
        </div>
      </Grid>

      <>
        <Grid item xs={12} sm={6} style={{ height: '372px' }}>
          <Card
            className={classes.card}
            style={{
              backgroundImage: `url(${watchImageInput || 'https://source.unsplash.com/random'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></Card>
        </Grid>

        <Grid item xs={12} sm={6} direction='column'>
          <Card className={classes.card}>
            <div>
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  {company && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      style={{ width: '100%' }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.make}
                            id='make'
                            name='make'
                            label='Marca'
                            fullWidth
                            className={classes.input}
                            inputRef={register}
                            autoComplete='given-name'
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                make: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.model}
                            id='model'
                            name='model'
                            label='Modelo'
                            fullWidth
                            inputRef={register({ required: true })}
                            autoComplete='shipping address-line1'
                            className={classes.input}
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                model: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.year}
                            id='year'
                            name='year'
                            label='Ano Fabricação'
                            inputRef={register({ required: true })}
                            autoComplete='shipping address-line1'
                            className={classes.input}
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                year: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.yearModel}
                            id='yearModel'
                            name='yearModel'
                            label='Ano Modelo'
                            inputRef={register({ required: true })}
                            autoComplete='shipping address-line1'
                            className={classes.input}
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                yearModel: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.color}
                            id='color'
                            name='color'
                            label='Cor'
                            fullWidth
                            className={classes.input}
                            inputRef={register}
                            autoComplete='given-name'
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                color: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            defaultValue={'aaa'}
                            id='licensePlate'
                            name='licensePlate'
                            label='Placa'
                            fullWidth
                            inputRef={register({ required: true })}
                            autoComplete='shipping address-line1'
                            className={classes.input}
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                licensePlate: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <TextField
                            defaultValue={vehicle?.kmDriven}
                            id='kmDriven'
                            name='kmDriven'
                            label='Quilometragem'
                            fullWidth
                            className={classes.input}
                            inputRef={register}
                            autoComplete='given-name'
                            required
                            onChange={(
                              evt: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setVehicle((prev: any) => ({
                                ...prev,
                                kmDriven: evt.target.value,
                              }))
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <Select
                            id='fuelType'
                            name='fuelType'
                            inputRef={register}
                            label='Combustível'
                            fullWidth
                            className={classes.input}
                            style={{ marginTop: '33px' }}
                            required
                            onChange={(evt: any) => {
                              console.log(evt.target.value, evt.target.name)
                              setValue(
                                evt.target.name as string,
                                evt.target.value
                              )
                            }}
                          >
                            {Object.keys(fuelType).map((fuelKey) => (
                              <MenuItem key={fuelKey} value={fuelKey}>
                                {fuelType[fuelKey as keyof typeof fuelType]}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            id='imageUrl'
                            name='imageUrl'
                            placeholder='https://link-para-imagem/imagem.png'
                            inputRef={register}
                            label='Link para imagem'
                            fullWidth
                            className={classes.input}
                          ></TextField>
                        </Grid>
                      </Grid>

                      <div
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                          marginTop: '2rem',
                        }}
                      >
                        <Button
                          variant='contained'
                          color='secondary'
                          startIcon={<CancelIcon />}
                          onClick={handleButtonCancelEditVehicleDetailsOnClick}
                        >
                          Cancelar
                        </Button>

                        <Button
                          variant='contained'
                          color='primary'
                          startIcon={<SaveIcon />}
                          type='submit'
                        >
                          Salvar
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            </div>
          </Card>
        </Grid>
      </>
    </Grid>
  )
}

export default VehicleDetails

