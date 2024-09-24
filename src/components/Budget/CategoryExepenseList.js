import React, { useEffect, useState } from 'react'
import { Collapse, Row, Col, Input, InputNumber, Checkbox, Button, Form, message } from 'antd'
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons'

const { Panel } = Collapse

const initialCategories = {
  Moradia: ['Apartamento', 'Luz', 'Internet'],
  Transporte: ['Combustível', 'Manutenção'],
  Educação: ['Cursos', 'Livros'],
  Lazer: ['Cinema', 'Viagens'],
}

const CategoryExpenseList = ({ expenses, handleExpenseChange, addExpense, removeExpense, setExpenses }) => {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    const dynamicCategories = Object.keys(expenses).filter(
      (category) => !Object.keys(initialCategories).includes(category)
    )
    if (dynamicCategories.length > 0) {
      const updatedCategories = { ...categories }
      let changed = false
      dynamicCategories.forEach((category) => {
        if (!updatedCategories[category]) {
          updatedCategories[category] = []
          changed = true
        }
      })
      if (changed) {
        setCategories(updatedCategories)
      }
    }
  }, [expenses, categories])

  const getCategoryExpenses = (category) => {
    return expenses[category] || []
  }

  const calculateCategoryTotal = (category) => {
    const categoryExpenses = getCategoryExpenses(category)
    return categoryExpenses.reduce((total, expense) => total + expense.value, 0)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      message.error('O nome da categoria não pode estar vazio')
      return
    }
    if (categories[newCategoryName]) {
      message.error('Essa categoria já existe')
      return
    }

    setCategories({ ...categories, [newCategoryName]: [] })
    setNewCategoryName('')
  }

  const handleRemoveCategory = (category) => {
    const newCategories = { ...categories }
    delete newCategories[category]
    setCategories(newCategories)

    const newExpenses = { ...expenses }
    delete newExpenses[category]
    setExpenses(newExpenses)
  }

  return (
    <>
      <Collapse accordion>
        {Object.keys(categories).map((category) => (
          <Panel
            header={(
              <div className="category-header">
                {`${category} (R$ ${calculateCategoryTotal(category).toFixed(2)})`}
                {!(initialCategories[category]) && (
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveCategory(category)}
                    className="category-delete-button"
                  />
                )}
              </div>
            )}
            key={category}
            className="category-panel"
          >
            {getCategoryExpenses(category).map((expense, index) => (
              <Row key={expense.id} gutter={16} className="expense-row">
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Nome da Conta"
                    value={expense.name}
                    onChange={(e) => handleExpenseChange(category, index, 'name', e.target.value)}
                    className="expense-input"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <InputNumber
                    placeholder="Valor"
                    className="expense-input-number"
                    value={expense.value || 0}
                    onChange={(value) => handleExpenseChange(category, index, 'value', value)}
                    formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <Checkbox
                    checked={expense.fixed}
                    onChange={(e) => handleExpenseChange(category, index, 'fixed', e.target.checked)}
                  >
                    Fixo
                  </Checkbox>
                </Col>
                <Col xs={12} md={4}>
                  <Button
                    type="danger"
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeExpense(category, index)}
                    className="expense-button"
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              onClick={() => addExpense(category)}
              className="expense-add-button"
              icon={<PlusOutlined />}
            >
              Adicionar Conta
            </Button>
          </Panel>
        ))}
      </Collapse>

      <Form layout="inline" className="category-form">
        <Form.Item>
          <Input
            placeholder="Nome da Nova Categoria"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="new-category-input"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddCategory} icon={<PlusOutlined />}>
            Adicionar Nova Categoria
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default CategoryExpenseList
