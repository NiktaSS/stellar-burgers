import { FC, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../services/store';
import { isAuthorizedSelector } from '../../../services/slices/userSlice';
import { TCenter } from './type';

export const Center: FC<TCenter> = memo(
  ({ title, children, isProtected = false }) => {
    const navigate = useNavigate();
    const isAuthorized = useSelector(isAuthorizedSelector);

    useEffect(() => {
      if (isProtected && !isAuthorized) {
        navigate('/login', { state: { from: location.pathname } });
      }
    }, [isProtected, isAuthorized]);

    return (
      <div className='center-container'>
        <h1 className='center-title'>{title}</h1>
        <div className='center-content'>{children}</div>
      </div>
    );
  }
);
