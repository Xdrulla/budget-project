import React from 'react';
import { Form, InputNumber, Switch, DatePicker, Row, Col, Select } from 'antd'
import { Banknote, Calendar, Coins } from 'lucide-react'

const { Option } = Select

const BudgetForm = ({
  salary,
  setSalary,
  applyDiscount,
  setApplyDiscount,
  discountPercentage,
  setDiscountPercentage,
  otherIncome,
  setOtherIncome,
  handleMonthChange
}) => {
  return (
    <>
      <div className="budget-form">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={<span><Banknote size={16} style={{marginRight:4}}/>Salário</span>}>
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
            <Row gutter={16}>
              <Col xs={12}>
                <Form.Item label="Aplicar Desconto?">
                  <Switch checked={applyDiscount} onChange={setApplyDiscount} />
                </Form.Item>
              </Col>
              {applyDiscount && (
                <Col xs={12}>
                  <Form.Item label="Porcentagem de Desconto">
                    <Select
                      value={discountPercentage}
                      onChange={setDiscountPercentage}
                      style={{ width: '100%' }}
                    >
                      <Option value={8}>8%</Option>
                      <Option value={9}>9%</Option>
                      <Option value={12}>12%</Option>
                      <Option value={14}>14%</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={<span><Coins size={16} style={{marginRight:4}}/>Outras Rendas</span>}>
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
            <Form.Item label={<span><Calendar size={16} style={{marginRight:4}}/>Mês do Orçamento</span>}>
              <DatePicker picker="month" onChange={handleMonthChange} style={{ width: '100%', borderRadius: '8px' }} format="YYYY-MM" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BudgetForm;
