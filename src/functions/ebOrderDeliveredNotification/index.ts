import { EventBridgeEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { OrderRecord, ProductsRecord } from 'src/types/dynamo';
import SES from '@libs/SES';

export const handler = async (event: EventBridgeEvent<string, OrderRecord>) => {
  try {
    const productTable = process.env.productTable;

    const details = event.detail;

    const itemPromises = details.items.map(async (item) => {
      const itemData = await Dynamo.get<ProductsRecord>({
        tableName: productTable,
        pkValue: item.id,
      });
      return {
        count: item.count,
        title: itemData.title,
        size: itemData.sizesAvailable.find(( size) => size.sizeCode == item.size),
      };
    });
    const itemDetails = await Promise.all(itemPromises);

    await SES.sendEmail({
      email: "ebrahim.abdelaziz@adzily.com",
      subject: 'Your order has been delivered',
      text: `Your order has been delivered ,We hope you enjoy it.
      your order was : 
      ${itemDetails.map(itemToRow)}
      `,
    });
  } catch (error) {
    console.error(error);
  }
};

const itemToRow = ({
  count,
  title,
  size,
}: {
  count: number;
  title: string;
  size?: { sizeCode: number; displayValue: string };
}) => {
  return `${count} ${title} ${size ? `in size ${size.displayValue}` : null}`;
};