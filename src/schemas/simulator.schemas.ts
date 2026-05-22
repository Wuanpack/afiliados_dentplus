import { z } from 'zod'

export const simulatorSchema = z.object({
    numeroIngresado: z.coerce.number('Ingresa un número válido').positive('Debes ingresar un valor positivo')
})

export type SimulatorInput = z.infer<typeof simulatorSchema>