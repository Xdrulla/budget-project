import React, { useState, useEffect } from 'react'
import ReactSwal from '../components/common/ReactSwal'
import { Form, Input, InputNumber, Switch, Button, Row, Col, DatePicker, Card, Typography, message, Checkbox } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { db } from '../services/firebase'
import { collection, addDoc, getDocs, query, where, limit, doc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import ExpenseChart from '../components/ExpensesChart'

const { Title } = Typography

const Budget = ({ isDarkMode }) => {
  const [salary, setSalary] = useState(0)
  const [otherIncome, setOtherIncome] = useState(0)
  const [applyDiscount, setApplyDiscount] = useState(false)
  const [expenses, setExpenses] = useState([{ id: uuidv4(), name: '', value: 0, fixed: false }])
  const [month, setMonth] = useState(null)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [remainingBalance, setRemainingBalance] = useState(0)

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    const calculateTotalIncome = () => {
      const salaryAfterDiscount = applyDiscount ? salary * 0.91 : salary
      setTotalIncome(salaryAfterDiscount + otherIncome)
    }
    calculateTotalIncome()
  }, [salary, otherIncome, applyDiscount])

  useEffect(() => {
    const calculateTotalExpenses = () => {
      const total = expenses.reduce((acc, curr) => acc + curr.value, 0)
      setTotalExpenses(total)
    }
    calculateTotalExpenses()
  }, [expenses])

  useEffect(() => {
    const calculateRemainingBalance = () => {
      setRemainingBalance(totalIncome - totalExpenses)
    }
    calculateRemainingBalance()
  }, [totalIncome, totalExpenses])

  const handleSalaryChange = (value) => {
    setSalary(value)
  }

  const handleOtherIncomeChange = (value) => {
    setOtherIncome(value)
  }

  const handleDiscountChange = (checked) => {
    setApplyDiscount(checked)
  }

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses]
    newExpenses[index][field] = value
    setExpenses(newExpenses)
  }

  const handleDelete = async () => {
    if (!month) {
      ReactSwal.fire({
        title: 'Erro ao deletar!',
        html: 'Você não pode deletar algo sem selecionar um mês!',
        icon: 'error',
        customClass: {
          icon: 'border-0',
        }
      })
      return
    }

    const formattedDate = dayjs(month).format('YYYY/MM')

    const budgetRef = collection(db, 'budgets')
    const q = query(budgetRef, where('month', '==', formattedDate), where('userId', '==', user.uid), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id
      try {
        await deleteDoc(doc(db, 'budgets', docId))
        ReactSwal.fire({
          title: 'Sucesso',
          html: 'Orçamento deletado com sucesso!',
          icon: 'success',
          customClass: {
            icon: 'border-0',
          }
        })
        setSalary(0)
        setApplyDiscount(false)
        setOtherIncome(0)
        setExpenses([{ id: uuidv4(), name: '', value: 0, fixed: false }])
        setMonth(null)
      } catch (error) {
        console.error('Erro ao deletar o documento:', error)
        message.error('Erro ao deletar')
      }
    } else {
      message.error('Erro ao deletar')
    }
  }

  const addExpense = () => {
    setExpenses([...expenses, { id: uuidv4(), name: '', value: 0, fixed: false }])
  }

  const removeExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index)
    setExpenses(newExpenses)
  }

  const handleMonthChange = async (date) => {
    if (!user) {
      console.error('Usuário não está autenticado.')
      return
    }

    if (!date) {
      console.error('Data inválida selecionada.')
      return
    }

    const formattedDate = dayjs(date).format('YYYY/MM')
    setMonth(formattedDate)

    try {
      const budgetRef = collection(db, 'budgets')
      const q = query(budgetRef, where('month', '==', formattedDate), where('userId', '==', user.uid), limit(1))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const budgetData = querySnapshot.docs[0].data()
        setSalary(budgetData.salary)
        setApplyDiscount(budgetData.applyDiscount)
        setOtherIncome(budgetData.otherIncome)
        setExpenses(budgetData.expenses)
      } else {
        const previousMonth = dayjs(date).subtract(1, 'month').format('YYYY/MM')
        const qPrevious = query(budgetRef, where('month', '==', previousMonth), where('userId', '==', user.uid), limit(1))
        const queryPreviousSnapshot = await getDocs(qPrevious)

        if (!queryPreviousSnapshot.empty) {
          const previousBudgetData = queryPreviousSnapshot.docs[0].data()
          const fixedExpenses = previousBudgetData.expenses.filter((expense) => expense.fixed)
          setExpenses(fixedExpenses)
        } else {
          setExpenses([{ id: uuidv4(), name: '', value: 0, fixed: false }])
        }

        setSalary(0)
        setApplyDiscount(false)
        setOtherIncome(0)
      }
    } catch (error) {
      console.error('Erro ao recuperar orçamento:', error)
      message.error('Erro ao recuperar orçamento!')
    }
  }

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
    }

    try {
      await addDoc(collection(db, 'budgets'), budgetData)
      message.success('Orçamento salvo com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err)
      message.error('Erro ao salvar orçamento!')
    }
  }

  return (
    <Card
      className={isDarkMode ? 'dark-mode' : ''}
      style={{ maxWidth: 800, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>Orçamento Mensal</Title>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Salário">
              <InputNumber
                style={{ width: '100%' }}
                value={salary}
                onChange={handleSalaryChange}
                formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Descontar 9% do Salário?">
              <Switch checked={applyDiscount} onChange={handleDiscountChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Outras Rendas">
              <InputNumber
                style={{ width: '100%' }}
                value={otherIncome}
                onChange={handleOtherIncomeChange}
                formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Total de Renda">
              <InputNumber
                style={{ width: '100%' }}
                value={totalIncome}
                readOnly
                formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Mês do Orçamento">
          <DatePicker picker="month" onChange={handleMonthChange} style={{ width: '100%' }} format="YYYY-MM" />
        </Form.Item>
        <Form.Item label="Contas">
          {expenses.map((expense, index) => (
            <Row key={expense.id} gutter={16} style={{ marginBottom: 8 }}>
              <Col xs={24} sm={8}>
                <Input
                  placeholder="Nome da Conta"
                  value={expense.name}
                  onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                />
              </Col>
              <Col xs={24} sm={8}>
                <InputNumber
                  placeholder="Valor"
                  style={{ width: '100%' }}
                  value={expense.value}
                  onChange={(value) => handleExpenseChange(index, 'value', value)}
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
                />
              </Col>
              <Col xs={12} sm={4}>
                <Checkbox
                  checked={expense.fixed}
                  onChange={(e) => handleExpenseChange(index, 'fixed', e.target.checked)}
                  className={isDarkMode ? 'dark-mode' : ''}
                >
                  Fixo
                </Checkbox>
              </Col>
              <Col xs={12} sm={4}>
                <Button
                  type="danger"
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeExpense(index)}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            onClick={addExpense}
            style={{ width: '100%', marginTop: '10px' }}
            icon={<PlusOutlined />}
          >
            Adicionar Conta
          </Button>
        </Form.Item>
        <Form.Item label="Total de Contas">
          <InputNumber
            style={{ width: '100%' }}
            value={totalExpenses}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Form.Item label="Saldo Restante">
          <InputNumber
            style={{ width: '100%' }}
            value={remainingBalance}
            readOnly
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
        <Row gutter={16} className="button-container">
          <Button type="primary" onClick={handleSubmit}>
            Salvar Orçamento
          </Button>
          <Button type="primary" danger onClick={handleDelete}>
            Deletar Orçamento
          </Button>
        </Row>
      </Form>
      {month && <ExpenseChart data={expenses.map((exp) => ({ name: exp.name, value: exp.value }))} />}
    </Card>
  )
}

export default Budget
