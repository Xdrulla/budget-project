import React from 'react';
import { Form, InputNumber } from 'antd';

const TotalInfo = ({ totalIncome, totalExpenses, totalPaidExpenses, remainingBalance }) => {
  return (
    <>
      <div className="total-info">
        <Form.Item label="Total de Renda">
          <InputNumber
            style={{ width: '100%', borderRadius: '8px' }}
            value={totalIncome}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Form.Item label="Total de Contas">
          <InputNumber
            style={{ width: '100%', borderRadius: '8px' }}
            value={totalExpenses}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Form.Item label="Contas Pagas">
          <InputNumber
            style={{ width: '100%', borderRadius: '8px' }}
            value={totalPaidExpenses}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Form.Item label="Saldo Restante">
          <InputNumber
            style={{ width: '100%', borderRadius: '8px' }}
            value={remainingBalance}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
      </div>
    </>
  );
};

export default TotalInfo;
