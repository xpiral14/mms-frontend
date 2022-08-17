export default interface PartStock {
  id?: number;
  company_id: number;
  stock_id: number;
  part_id: number;
  quantity: number;
  minimum: number;
  part_name?: string
  part_price?: number;
  unit_id?: number;
  unit_name?: string;
}
