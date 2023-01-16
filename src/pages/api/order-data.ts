import executeQuery from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

type handledOrder = {
  id: string;
  orderId: string;
  estimatedPrepTime: number;
  actualPrepTime: number;
};

type Data = {
  prod: handledOrder[];
  next: handledOrder[];
};

// @ts-ignore
const mapData = (items) => {
  let handledOrders: handledOrder[] = [];

  // @ts-ignore
  items.forEach((item) => {
    const order: handledOrder = {
      id: item.Id,
      orderId: item.OrderId,
      actualPrepTime: item.ActualPrepTime,
      estimatedPrepTime: item.EstimatedPrepTime,
    };

    handledOrders.push(order);
  });

  return handledOrders;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const resultP = await executeQuery({
      query: 'SELECT * FROM HandledOrders',
      values: '',
    });
    const resultN = await executeQuery({
      query: 'SELECT * FROM HandledOrdersShadow',
      values: '',
    });

    // @ts-ignore
    const prod = mapData(resultP);
    const next = mapData(resultN);
    res.status(200).json({ prod: prod, next: next });
  } catch (error) {
    console.log(error);
  }
}
