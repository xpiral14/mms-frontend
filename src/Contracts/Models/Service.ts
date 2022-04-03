import Part from './Part'

export default  interface Service {
  id: number;
  company_id: number;
  reference: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  parts?: Part[]
}


