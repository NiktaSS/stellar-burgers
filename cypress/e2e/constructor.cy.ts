import { URL } from '@api';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Устанавливаем тестовые данные аутентификации
    setCookie(
      'accessToken',
      'Zeemu eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxNDYwODAwMCwiZXhwIjoxNzE0NjA5MjAwfQ.2k9V7xqY4nQwZ1Lm8pR6sT3yU1vW5bN7cX0jH4kG9dF2eA'
    );
    localStorage.setItem(
      'refreshToken',
      'f7a2e1b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcd'
    );

    // Мокаем API-запросы
    cy.intercept('GET', `${URL}//auth/user`, { fixture: 'user.json' }).as(
      'fetchUserData'
    );
    cy.intercept('GET', `${URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('fetchIngredients');

    cy.visit('');
    cy.wait('@fetchUserData');
  });

  afterEach(() => {
    // Очищаем тестовые данные
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Основные сценарии', () => {
    describe('Отображение добавленных ингредиентов в конструкторе', () => {
      beforeEach(() => {
        cy.get('[data-cy="constructor"]').as('burgerConstructor');
        cy.addIngredient('Булки');
        cy.addIngredient('Начинки');
        cy.addIngredient('Соусы');
      });

      it('Должен отображать булку в конструкторе', () => {
        cy.get('@burgerConstructor').should(
          'contain',
          'Краторная булка N-200i'
        );
      });

      it('Должен отображать начинку в конструкторе', () => {
        cy.get('@burgerConstructor').should(
          'contain',
          'Биокотлета из марсианской Магнолии'
        );
      });

      it('Должен отображать соус в конструкторе', () => {
        cy.get('@burgerConstructor').should('contain', 'Соус Spicy-X');
      });
    });

    describe('Работа с модальным окном деталей ингредиента', () => {
      it('Должен открывать модальное окно при клике на ингредиент', () => {
        cy.get('[data-cy="ingredient-item"]').first().click();
        cy.get('[data-cy="modal"]').as('ingredientModal');
        cy.get('@ingredientModal').should('exist');
        cy.get('@ingredientModal').should('contain', 'Краторная булка N-200i');
      });

      it('Должен закрывать модальное окно по кнопке', () => {
        cy.get('[data-cy="ingredient-item"]').first().click();
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });

      it('Должен закрывать модальное окно по клику на оверлей', () => {
        cy.get('[data-cy="ingredient-item"]').first().click();
        cy.get('[data-cy="modal-overlay"]').click('left', { force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    });

    describe('Создание заказа', () => {
      beforeEach(() => {
        cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' }).as(
          'createOrder'
        );
        cy.get('[data-cy="constructor"]').as('burgerConstructor');
        cy.addIngredient('Булки');
        cy.addIngredient('Начинки');
        cy.get('@burgerConstructor').children('div').children('button').click();
      });

      it('Должен открывать модальное окно с номером заказа', () => {
        cy.get('[data-cy="modal"]').as('orderModal');
        cy.get('@orderModal').should('exist');
        cy.get('@orderModal').should('contain', '37865');
      });

      it('Должен закрывать модальное окно после оформления', () => {
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });

      it('Должен очищать конструктор после оформления заказа', () => {
        cy.get('[data-cy="modal-close"]').click();
        cy.get('@burgerConstructor').within(() => {
          cy.contains('Говяжий метеорит (отбивная)').should('not.exist');
          cy.contains('Флюоресцентная булка R2-D3').should('not.exist');
          cy.contains('Мясо бессмертных моллюсков Protostomia').should(
            'not.exist'
          );
        });
      });

      it('Должен вызывать API создания заказа', () => {
        cy.wait('@createOrder');
      });
    });
  });
});
