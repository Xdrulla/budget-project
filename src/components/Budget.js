import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Form, Typography, Row, Col, Button, Select, message } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import { db } from '../services/firebase'
import { collection, addDoc, getDocs, query, where, limit, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

import dayjs from 'dayjs'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import ReactSwal from './common/ReactSwal'
import { saveSucessful, deleteBudget } from './content/alert'

import BudgetForm from './Budget/BudgetForm'
import TotalInfo from './Budget/TotalInfo'
import CategoryExpenseList from './Budget/CategoryExepenseList'

ChartJS.register(ArcElement, Tooltip, Legend)

const { Title } = Typography
const { Option } = Select

const Budget = ({ isDarkMode }) => {
  const { t } = useTranslation()
  const [salary, setSalary] = useState(0)
  const [otherIncome, setOtherIncome] = useState(0)
  const [applyDiscount, setApplyDiscount] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(9)
  const [colors, setColors] = useState({})
  const [expenses, setExpenses] = useState({
    Moradia: [],
    Transporte: [],
    Educação: [],
    Lazer: []
  })
  const [month, setMonth] = useState(null)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [viewMode, setViewMode] = useState('categories')
  const [remainingBalance, setRemainingBalance] = useState(0)
  const allExpenses = Object.values(expenses).flat()

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    const calculateTotalIncome = () => {
      const discountRate = applyDiscount ? (1 - discountPercentage / 100) : 1
      const salaryAfterDiscount = salary * discountRate
      setTotalIncome(salaryAfterDiscount + otherIncome)
    }
    calculateTotalIncome()
  }, [salary, otherIncome, applyDiscount, discountPercentage])

  useEffect(() => {
    const calculateTotalExpenses = () => {
      const allExpenses = Object.values(expenses).flat()

      const total = allExpenses.reduce((acc, curr) => acc + curr.value, 0)
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

        if (budgetData.expenses) {
          setExpenses(budgetData.expenses)
        } else {
          setExpenses({
            Moradia: [],
            Transporte: [],
            Educação: [],
            Lazer: []
          })
        }
      } else {
        const previousMonth = dayjs(date).subtract(1, 'month').format('YYYY/MM')
        const qPrevious = query(budgetRef, where('month', '==', previousMonth), where('userId', '==', user.uid), limit(1))
        const queryPreviousSnapshot = await getDocs(qPrevious)

        if (!queryPreviousSnapshot.empty) {
          const previousBudgetData = queryPreviousSnapshot.docs[0].data()
          const fixedExpenses = {}
          if (previousBudgetData.expenses) {
            Object.keys(previousBudgetData.expenses).forEach((category) => {
              const categoryExpenses = previousBudgetData.expenses[category]
              fixedExpenses[category] = categoryExpenses.filter((expense) => expense.fixed)
            })
          }
          if (Object.keys(fixedExpenses).length > 0) {
            setExpenses(fixedExpenses)
          } else {
            setExpenses({
              Moradia: [],
              Transporte: [],
              Educação: [],
              Lazer: []
            })
          }
        } else {
          setExpenses({
            Moradia: [],
            Transporte: [],
            Educação: [],
            Lazer: []
          })
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

  const handleDelete = async () => {
    if (!month) {
      message.error('Você não pode deletar algo sem selecionar um mês!')
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
        ReactSwal.fire(deleteBudget(t))
        message.success('Orçamento deletado com sucesso!')
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

  const handleExpenseChange = (category, index, field, value) => {
    if (!category || !expenses[category]) {
      console.error("Categoria inválida ou não encontrada.")
      return
    }

    const updatedCategoryExpenses = [...expenses[category]]

    updatedCategoryExpenses[index] = {
      ...updatedCategoryExpenses[index],
      [field]: value
    }

    setExpenses({
      ...expenses,
      [category]: updatedCategoryExpenses
    })
  }

  const addExpense = (category) => {
    if (!category) {
      console.error("Categoria inválida. A despesa deve pertencer a uma categoria.")
      return
    }

    setExpenses({
      ...expenses,
      [category]: [
        ...(expenses[category] || []),
        { id: uuidv4(), name: '', value: 0, fixed: false, category }
      ]
    })
  }

  const removeExpense = (category, index) => {
    const updatedCategoryExpenses = expenses[category].filter((_, i) => i !== index)
    setExpenses({
      ...expenses,
      [category]: updatedCategoryExpenses
    })
  }

  const handleSubmit = async () => {
    if (!month) {
      message.error('Por favor, selecione o mês.')
      return
    }

    if (!salary || salary <= 0) {
      message.error('Por favor, insira um valor válido para o salário.')
      return
    }

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
      const budgetRef = collection(db, 'budgets')
      const q = query(budgetRef, where('month', '==', month), where('userId', '==', user.uid), limit(1))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id
        await setDoc(doc(db, 'budgets', docId), budgetData)
      } else {
        await addDoc(budgetRef, budgetData)
      }

      ReactSwal.fire(saveSucessful(t))
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err)
      message.error('Erro ao salvar o orçamento!')
    }
  }

  const generateColor = useCallback(() => {
    const randomColor = () =>
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`

    const updatedColors = { ...colors }
    let colorUpdated = false

    allExpenses.forEach((expense) => {
      if (!updatedColors[expense.id]) {
        updatedColors[expense.id] = randomColor()
        colorUpdated = true
      }
    })

    if (colorUpdated) {
      setColors(updatedColors)
    }
  }, [allExpenses, colors])


  useEffect(() => {
    generateColor()
  }, [allExpenses, generateColor])

  const groupByCategory = () => {
    const categories = Object.keys(expenses)
    const dataByCategory = categories.map((category) => {
      const categoryExpenses = Array.isArray(expenses[category]) ? expenses[category] : []
      const categoryTotal = categoryExpenses.reduce((acc, expense) => acc + expense.value, 0)
      return { name: category, value: categoryTotal }
    })
    return dataByCategory
  }

  const pieData = viewMode === 'all'
    ? {
      labels: allExpenses.map((exp) => exp.name),
      datasets: [
        {
          data: allExpenses.map((exp) => exp.value),
          backgroundColor: allExpenses.map((exp) => colors[exp.id]),
        },
      ],
    }
    : {
      labels: groupByCategory().map((cat) => cat.name),
      datasets: [
        {
          data: groupByCategory().map((cat) => cat.value),
          backgroundColor: groupByCategory().map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`),
        },
      ],
    }

  return (
    <Card className={`budget-card ${isDarkMode ? 'dark-mode' : ''}`}>
      <Title level={2} className="budget-title">Orçamento Mensal</Title>
      <Form layout="vertical">
        <BudgetForm
          salary={salary}
          setSalary={setSalary}
          applyDiscount={applyDiscount}
          discountPercentage={discountPercentage}
          setApplyDiscount={setApplyDiscount}
          otherIncome={otherIncome}
          setOtherIncome={setOtherIncome}
          handleMonthChange={handleMonthChange}
          setDiscountPercentage={setDiscountPercentage}
        />

        <Form.Item label="Visualização do Gráfico">
          <Select defaultValue="categories" onChange={(value) => setViewMode(value)}>
            <Option value="all">Todas as Contas</Option>
            <Option value="categories">Por Categoria</Option>
          </Select>
        </Form.Item>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <div className="expense-list">
              <CategoryExpenseList
                expenses={expenses}
                handleExpenseChange={handleExpenseChange}
                addExpense={addExpense}
                removeExpense={removeExpense}
                setExpenses={setExpenses}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Pie data={pieData} />
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
  )
}

export default Budget
