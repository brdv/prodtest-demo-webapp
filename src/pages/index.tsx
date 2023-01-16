import {
  Button,
  Container,
  Grid,
  Loading,
  Table,
  Text,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

type handledOrder = {
  id: string;
  orderId: string;
  estimatedPrepTime: number;
  actualPrepTime: number;
};

const sortOrders = (a: handledOrder, b: handledOrder) => {
  if (a.orderId > b.orderId) return 1;
  if (a.orderId < b.orderId) return -1;
  return 0;
};

export default function Home() {
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataProd, setDataProd] = useState<handledOrder[]>([]);
  const [dataNext, setDataNext] = useState<handledOrder[]>([]);
  const [latestOrderId, setLatestOrderId] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/order-data')
      .then((res) => res.json())
      .then((data) => {
        setDataProd(data.prod);
        setDataNext(data.next);
      })
      .then(() => setLoading(false));
  }, []);

  const handleClick = async () => {
    const items = ['burger', 'fries', 'soda'];
    let menuItems: string[] = [];

    const times = Math.random() * 5;
    for (let i = 0; i <= times; i++) {
      const pick = items[Math.floor(Math.random() * items.length)];
      menuItems.push(pick);
    }

    console.log(menuItems);

    await fetch('http://localhost/orders', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menuItems: menuItems }),
    })
      .then((data) => data.json())
      .then((data) => setLatestOrderId(data.id));
  };

  const refreshOrders = () => {
    setLoading(true);
    fetch('/api/order-data')
      .then((res) => res.json())
      .then((data) => {
        setDataProd(data.prod);
        setDataNext(data.next);
      })
      .then(() => setLoading(false));
  };

  return (
    <Container>
      <h1>Prodtest-demo</h1>
      <Grid.Container gap={2}>
        <Grid>
          <Button onPress={handleClick}>Post New Order!</Button>
        </Grid>
        <Grid>
          <Button onPress={refreshOrders}>Refresh data!</Button>
        </Grid>
      </Grid.Container>

      <Text>Laatste order: {latestOrderId}</Text>

      {loading ? (
        <Loading />
      ) : (
        <HandledOrderPanel dn={dataNext} dp={dataProd} />
      )}
    </Container>
  );
}

interface handledPanelProps {
  dn: handledOrder[];
  dp: handledOrder[];
}

const calcTime = (time: number) => {
  return (time * 2) / 5 + 3;
};

export function HandledOrderPanel({ dn, dp }: handledPanelProps) {
  dn = dn.sort(sortOrders);
  dp = dp.sort(sortOrders);

  return (
    <div className="handledOrdersPanel">
      <div className="handledOrdersListPanel">
        <Text h3 style={{ textAlign: 'center' }}>
          Huidige keukenopstelling (Productie)
        </Text>

        <Table aria-label="Example table with static content">
          <Table.Header>
            <Table.Column>Id</Table.Column>
            <Table.Column>OrderId</Table.Column>
            <Table.Column>Geschatte tijd</Table.Column>
            <Table.Column>Werkelijke tijd</Table.Column>
          </Table.Header>
          <Table.Body>
            {dp.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.orderId}</Table.Cell>
                  <Table.Cell>
                    <strong>{calcTime(item.estimatedPrepTime)} minuten</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>{calcTime(item.actualPrepTime)} minuten</strong>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <div className="handledOrdersListPanel">
        <Text h3 style={{ textAlign: 'center' }}>
          Nieuwe keukenopstelling (Dark Launch)
        </Text>

        <Table aria-label="Example table with static content">
          <Table.Header>
            <Table.Column>Id</Table.Column>
            <Table.Column>OrderId</Table.Column>
            <Table.Column>Geschatte tijd</Table.Column>
            <Table.Column>Werklijke tijd</Table.Column>
          </Table.Header>
          <Table.Body>
            {dn.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.orderId}</Table.Cell>
                  <Table.Cell>
                    <strong>{calcTime(item.estimatedPrepTime)} minuten</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>{calcTime(item.actualPrepTime)} minuten</strong>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
