export function stockValido(value: string) {
  return value === '' || (/^\d+$/.test(value) && Number(value) <= 2147483647);
}

export function textoStock(quantity: number | null | undefined) {
  return quantity === null || quantity === undefined ? 'Stock:' : `Stock: ${quantity}`;
}
