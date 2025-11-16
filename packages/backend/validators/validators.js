import { z } from "zod";
import { Moneda } from "../domain/pedidos/enum_monedas.js";
import { EstadoPedido } from "../domain/pedidos/enum_estados.js";
// Validación para dirección de entrega
export const direccionEntregaSchema = z.object({
  calle: z.string().min(1, "Calle requerida"),
  altura: z.string().min(1, "Altura requerida"),
  departamento: z.string().optional(),
  codigoPostal: z.string().min(1, "Código postal requerido"),
  ciudad: z.string().min(1, "Ciudad requerida"),
  provincia: z.string().min(1, "Provincia requerida"),
  pais: z.string().min(1, "País requerido"),
  lat: z.number().optional(),
  lon: z.number().optional()
});

// export const idTransform = z.string().transform(((val, ctx) => {
//     const num = Number(val);
//     if (isNaN(num)) {
//         ctx.addIssue({
//             code: "custom",
//             message: "Me pusiste un ID que no es un numero - ''Yo, la verdad, milagros no puedo hacer'' - Charlotte "
//         });
//         return z.NEVER;
//     }
//     return num;
// }))

// Expresión regular para validar un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

export const idTransform = z.string().refine(val => objectIdRegex.test(val), {
  message: "ID inválido: debe ser un ObjectId de 24 caracteres hexadecimales"
});

// Validación para usuario
export const usuarioSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(5, "La contraseña debe tener como mínimo 5 caracteres").max(10, "La contraseña debe tener como maximo 10 caracteres"),
  telefono: z.string().min(1, "Teléfono requerido"),
  tipo: z.enum(['COMPRADOR', 'VENDEDOR'], { required_error: 'tipo requerido' }),
  fechaAlta: z.string().optional(),
});

// Validación para producto
export const productoSchema = z.object({
  id: z.string().optional(),
  vendedor: idTransform,
  titulo: z.string().min(1, "Titulo requerido"),
  descripcion: z.string().min(1, "Descripción requerida"),
  categorias: z.array(z.string().min(1, "Nombre de categoría requerido"))
    .min(1, "Debe especificar al menos una categoría"),
  precio: z.number().positive("Precio debe ser mayor a 0"),
  // moneda: z.union([
  //     z.enum([Moneda.PESO_ARG, Moneda.DOLAR, Moneda.REAL]),
  //     z.enum(["PESO_ARG", "DOLAR", "REAL"]).transform((k) => Moneda[k])
  // ]),
  moneda: z.enum(["PESO_ARG", "DOLAR", "REAL"], {
    required_error: "La moneda es obligatoria",
    invalid_type_error: "Moneda inválida: debe ser 'PESO_ARG', 'DOLAR' o 'REAL'"
  }),
  stock: z.number().int().nonnegative("Stock no puede ser negativo"),
  fotos: z.array(z.string()).optional(),
  activo: z.boolean().optional()
});


// Validación para item de pedido
export const itemPedidoSchema = z.object({
  producto: idTransform,
  cantidad: z.number().int().positive("Cantidad debe ser mayor a 0"),
  precioUnitario: z.number().positive("El precio debe ser mayor a 0").optional(),
});

// Validación para estado
export const estadoPedidoSchema = z.enum([
  "Pendiente",
  "Confirmado",
  "En Preparación",
  "Enviado",
  "Entregado",
  "Cancelado"
]);

// Esquema de validación para un pedido
// export const pedidoSchema = z.object({
//     usuario: usuarioSchema,
//     direccionEntrega: direccionEntregaSchema,
//     items: z.array(itemPedidoSchema).min(1, "Debe haber al menos un item"),
//     moneda: z.union([
//         z.enum([Moneda.PESO_ARG, Moneda.DOLAR, Moneda.REAL]),
//         z.enum(["PESO_ARG", "DOLAR", "REAL"]).transform((k) => Moneda[k])
//     ]),
//     // total: z.number().positive("El total debe ser mayor a 0")
// });

export const pedidoSchema = z.object({
  id: z.string().optional(),
  comprador: idTransform,
  items: z.array(itemPedidoSchema).min(1, "Debe haber al menos un item"),
  total: z.number().nonnegative("Total no puede ser negativo").optional(),
  moneda: z.enum(["PESO_ARG", "DOLAR", "REAL"], {
    required_error: "La moneda es obligatoria",
    invalid_type_error: "Moneda inválida: debe ser 'PESO_ARG', 'DOLAR' o 'REAL'"
  }),
  direccionEntrega: z.object({
    calle: z.string().min(1, "Calle requerida"),
    altura: z.string().min(1, "Altura requerida"),
    departamento: z.string().optional(),
    codigoPostal: z.string().min(1, "Código postal requerido"),
    ciudad: z.string().min(1, "Ciudad requerida"),
    provincia: z.string().min(1, "Provincia requerida"),
    pais: z.string().min(1, "País requerido"),
    lat: z.string().min(1, "Latitud requerida"),
    lon: z.string().min(1, "Longitud requerida"),
  }),

  estado: z.enum(
    ["Pendiente", "Confirmado", "En Preparación", "Enviado", "Cancelado", "Entregado"]
  ).optional(),

  fecha: z.string().optional(),
});

// Esquema Zod para validar nuevoEstado
export const estadoSchema = z.string().min(1).refine(val => {
  const s = String(val)
  const byKey = Object.keys(EstadoPedido).some(k => k.toLowerCase() === s.toLowerCase())
  const byValue = Object.values(EstadoPedido).some(v => String(v).toLowerCase() === s.toLowerCase())
  return byKey || byValue
}, { message: 'estado inválido' })

export const bodySchema = z.object({
  estado: estadoSchema,
  motivo: z.string().min(1, 'motivo requerido')
}).strict()