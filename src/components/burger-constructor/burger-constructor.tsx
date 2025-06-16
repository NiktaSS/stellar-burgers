import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import {
  setOrderRequest,
  sendOrderThunk,
  setNullOrderModalData,
  isAuthorizedSelector
} from '@slices';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorState = useSelector((state) => state.constructorbg);
  const { constructorItems, orderRequest, orderModalData } = constructorState;

  const isAuthorized = useSelector(isAuthorizedSelector);

  const handleOrderClick = useCallback(() => {
    if (!constructorItems.bun) return;

    if (!isAuthorized) {
      navigate('/login');
      return;
    }

    dispatch(setOrderRequest(true));

    const bunId = constructorItems.bun._id;
    const ingredientsIds = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    const order = [bunId, ...ingredientsIds, bunId];

    dispatch(sendOrderThunk(order))
      .unwrap()
      .catch((error) => {
        console.error('Order error:', error);
        dispatch(setOrderRequest(false));
      });
  }, [constructorItems, isAuthorized, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(setOrderRequest(false));
    dispatch(setNullOrderModalData());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
