import React from 'react';
import { Form, InputNumber, Switch, DatePicker, Row, Col } from 'antd';

const BudgetForm = ({ salary, setSalary, applyDiscount, setApplyDiscount, otherIncome, setOtherIncome, handleMonthChange }) => {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Salário">
            <InputNumber
              style={{ width: '100%', borderRadius: '8px' }}
              value={salary}
              onChange={setSalary}
              formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Descontar 9% do Salário?">
            <Switch checked={applyDiscount} onChange={setApplyDiscount} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Outras Rendas">
            <InputNumber
              style={{ width: '100%', borderRadius: '8px' }}
              value={otherIncome}
              onChange={setOtherIncome}
              formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Mês do Orçamento">
            <DatePicker picker="month" onChange={handleMonthChange} style={{ width: '100%', borderRadius: '8px' }} format="YYYY-MM" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default BudgetForm;
