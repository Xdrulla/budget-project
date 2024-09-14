import React, { useState, useEffect } from 'react';
import { Card, Form, Typography, Row, Col, Button, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, limit, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import dayjs from 'dayjs';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import BudgetForm from './Budget/BudgetForm';
import TotalInfo from './Budget/TotalInfo';
import CategoryExpenseList from './Budget/CategoryExepenseList';


ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;

const Budget = ({ isDarkMode }) => {
  const [salary, setSalary] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [expenses, setExpenses] = useState([{ id: uuidv4(), name: '', value: 0, fixed: false }]);
  const [month, setMonth] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const calculateTotalIncome = () => {
      const salaryAfterDiscount = applyDiscount ? salary * 0.91 : salary;
      setTotalIncome(salaryAfterDiscount + otherIncome);
    };
    calculateTotalIncome();
  }, [salary, otherIncome, applyDiscount]);

  useEffect(() => {
    const calculateTotalExpenses = () => {
      const total = expenses.reduce((acc, curr) => acc + curr.value, 0);
      setTotalExpenses(total);
    };
    calculateTotalExpenses();
  }, [expenses]);

  useEffect(() => {
    const calculateRemainingBalance = () => {
      setRemainingBalance(totalIncome - totalExpenses);
    };
    calculateRemainingBalance();
  }, [totalIncome, totalExpenses]);

  const handleMonthChange = async (date) => {
    if (!user) {
      console.error('Usuário não está autenticado.');
      return;
    }

    if (!date) {
      console.error('Data inválida selecionada.');
      return;
    }

    const formattedDate = dayjs(date).format('YYYY/MM');
    setMonth(formattedDate);

    try {
      const budgetRef = collection(db, 'budgets');
      const q = query(budgetRef, where('month', '==', formattedDate), where('userId', '==', user.uid), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const budgetData = querySnapshot.docs[0].data();
        
        const updatedExpenses = budgetData.expenses.map(expense => {
          if (!expense.category) {
            return { ...expense, category: 'Moradia' }
          }
          return expense;
        });

        setSalary(budgetData.salary);
        setApplyDiscount(budgetData.applyDiscount);
        setOtherIncome(budgetData.otherIncome);
        setExpenses(updatedExpenses);
      } else {
        const previousMonth = dayjs(date).subtract(1, 'month').format('YYYY/MM');
        const qPrevious = query(budgetRef, where('month', '==', previousMonth), where('userId', '==', user.uid), limit(1));
        const queryPreviousSnapshot = await getDocs(qPrevious);

        if (!queryPreviousSnapshot.empty) {
          const previousBudgetData = queryPreviousSnapshot.docs[0].data();
          const fixedExpenses = previousBudgetData.expenses.filter((expense) => expense.fixed);
          setExpenses(fixedExpenses);
        } else {
          setExpenses([{ id: uuidv4(), name: '', value: 0, fixed: false }]);
        }

        setSalary(0);
        setApplyDiscount(false);
        setOtherIncome(0);
      }
    } catch (error) {
      console.error('Erro ao recuperar orçamento:', error);
      message.error('Erro ao recuperar orçamento!');
    }
  };

  const handleDelete = async () => {
    if (!month) {
      message.error('Você não pode deletar algo sem selecionar um mês!');
      return;
    }

    const formattedDate = dayjs(month).format('YYYY/MM');
    const budgetRef = collection(db, 'budgets');
    const q = query(budgetRef, where('month', '==', formattedDate), where('userId', '==', user.uid), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      try {
        await deleteDoc(doc(db, 'budgets', docId));
        message.success('Orçamento deletado com sucesso!');
        setSalary(0);
        setApplyDiscount(false);
        setOtherIncome(0);
        setExpenses([{ id: uuidv4(), name: '', value: 0, fixed: false }]);
        setMonth(null);
      } catch (error) {
        console.error('Erro ao deletar o documento:', error);
        message.error('Erro ao deletar');
      }
    } else {
      message.error('Erro ao deletar');
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { id: uuidv4(), name: '', value: 0, fixed: false, category: 'Moradia' }]);
  };

  const removeExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const handleSubmit = async () => {
    const budgetData = {
      userId: user.uid,
      month,
      salary,
      applyDiscount,
      otherIncome,
      totalIncome,
      totalExpenses,
      remainingBalance,
      expenses,
    };

    try {
      await addDoc(collection(db, 'budgets'), budgetData);
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
    }
  };

  const data = {
    labels: expenses.map((exp) => exp.name),
    datasets: [
      {
        data: expenses.map((exp) => exp.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <Card className={`budget-card ${isDarkMode ? 'dark-mode' : ''}`}>
      <Title level={2} className="budget-title">Orçamento Mensal</Title>
      <Form layout="vertical">
        <BudgetForm
          salary={salary}
          setSalary={setSalary}
          applyDiscount={applyDiscount}
          setApplyDiscount={setApplyDiscount}
          otherIncome={otherIncome}
          setOtherIncome={setOtherIncome}
          handleMonthChange={handleMonthChange}
        />
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <div className="expense-list">
              <CategoryExpenseList
                expenses={expenses}
                handleExpenseChange={handleExpenseChange}
                addExpense={addExpense}
                removeExpense={removeExpense}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Pie data={data} />
            </div>
          </Col>
        </Row>

        <TotalInfo totalIncome={totalIncome} totalExpenses={totalExpenses} remainingBalance={remainingBalance} />

        <Row gutter={16} className="budget-button-container">
          <Button type="primary" className="budget-button" onClick={handleSubmit}>
            Salvar Orçamento
          </Button>
          <Button type="primary" danger className="budget-button" onClick={handleDelete}>
            Deletar Orçamento
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default Budget;
