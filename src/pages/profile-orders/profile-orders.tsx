import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import { getOrdersSelector, getOrdersThunk } from '@slices';
import { Center } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersSelector);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  return (
    <Center title='История заказов' isProtected>
      <ProfileOrdersUI orders={orders} />
    </Center>
  );
};
