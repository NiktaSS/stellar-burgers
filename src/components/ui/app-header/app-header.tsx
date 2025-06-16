import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { Link } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex'
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            icon={<BurgerIcon type='primary' />}
            text='Конструктор'
            additionalClass='mr-10'
            style={linkStyle}
          />
          <NavLink
            to='/feed'
            icon={<ListIcon type='primary' />}
            text='Лента заказов'
            style={linkStyle}
          />
        </div>

        <div className={styles.logo}>
          <Link to='/' style={linkStyle}>
            <Logo className={styles.logo_image || ''} />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            icon={<ProfileIcon type='primary' />}
            text={userName || 'Личный кабинет'}
            style={linkStyle}
            hideIconMargin
          />
        </div>
      </nav>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  style: React.CSSProperties;
  additionalClass?: string;
  hideIconMargin?: boolean;
}

const NavLink: FC<NavLinkProps> = ({
  to,
  icon,
  text,
  style,
  additionalClass = '',
  hideIconMargin = false
}) => (
  <Link to={to} style={style}>
    {icon}
    <p
      className={`text text_type_main-default ${hideIconMargin ? '' : 'ml-2'} ${additionalClass}`}
    >
      {text}
    </p>
  </Link>
);
