export function stockValido(value: string) {
  return value === '' || (/^\d+$/.test(value) && Number(value) <= 2147483647);
}

export function textoStock(quantity: number | null | undefined) {
  if (quantity === null || quantity === undefined) return 'Stock por confirmar';
  return quantity === 0 ? 'Sin stock · 0 unidades' : `Stock: ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`;
}
