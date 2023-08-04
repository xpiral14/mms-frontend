import Unit from './Unit'

export default  interface Product {
  id: number;
  companyId: number;
  unit_id: number;
  unit_name?: string;
  reference: string;
  name: string;
  price: number;
  description?: string;
  created_at: string;
  updated_at: string;
  unit?: Unit
}


