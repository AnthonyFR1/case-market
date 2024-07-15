'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('Necesitas estar logeado para ver esta pagina.')
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  console.log('Order:', order)  // Log para verificar la orden obtenida

  if (!order) throw new Error('Esta orden no existe.')

  if (order.isPaid) {
    return order
  } else {
    return false
  }
}
