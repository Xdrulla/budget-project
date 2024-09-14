import React from 'react';
import { Row, Col, Input, InputNumber, Checkbox, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const ExpenseList = ({ expenses, handleExpenseChange, addExpense, removeExpense }) => {
  return (
    <>
      {expenses.map((expense, index) => (
        <Row
          key={expense.id}
          gutter={16}
          className="expense-row"
        >
          <Col xs={24} md={8}>
            <Input
              placeholder="Nome da Conta"
              value={expense.name}
              onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
              className="expense-input"
            />
          </Col>
          <Col xs={24} md={8}>
            <InputNumber
              placeholder="Valor"
              className="expense-input-number"
              value={expense.value}
              onChange={(value) => handleExpenseChange(index, 'value', value)}
              formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
            />
          </Col>
          <Col xs={12} md={4}>
            <Checkbox
              checked={expense.fixed}
              onChange={(e) => handleExpenseChange(index, 'fixed', e.target.checked)}
            >
              Fixo
            </Checkbox>
          </Col>
          <Col xs={12} md={4}>
            <Button
              type="danger"
              icon={<MinusCircleOutlined />}
              onClick={() => removeExpense(index)}
              className="expense-button"
            />
          </Col>
        </Row>
      ))}
      <Button
        type="dashed"
        onClick={addExpense}
        className="expense-add-button"
        icon={<PlusOutlined />}
      >
        Adicionar Conta
      </Button>
    </>
  );
};

export default ExpenseList;
