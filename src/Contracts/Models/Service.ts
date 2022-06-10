import Unit from './Unit'

export default  interface Service {
  id: number;
  company_id: number;
  reference: string;
  name: string;
  unit_id: number;
  unit_name?: string;
  price?: number;
  description: string;
  created_at: string;
  updated_at: string;
  unit?: Unit
}


