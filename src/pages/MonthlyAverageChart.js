import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { db } from '../services/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import dayjs from 'dayjs'
import { Card } from 'antd'

const MonthlyAverageChart = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        console.error("Usuário não está autenticado.")
        return
      }

      const budgetsRef = collection(db, 'budgets')
      const q = query(budgetsRef, where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log("No matching documents.")
        return
      }

      const monthlyData = {}

      querySnapshot.forEach((doc) => {
        const budget = doc.data()
        const month = dayjs(budget.month, 'YYYY/MM').format('YYYY-MM')
        if (!monthlyData[month]) {
          monthlyData[month] = { month, totalIncome: 0, totalExpenses: 0, count: 0 }
        }
        monthlyData[month].totalIncome += budget.totalIncome
        monthlyData[month].totalExpenses += budget.totalExpenses
        monthlyData[month].count += 1
      })

      const averageData = Object.values(monthlyData)
        .map((monthData) => ({
          month: monthData.month,
          avgIncome: (monthData.totalIncome / monthData.count).toFixed(2),
          avgExpenses: (monthData.totalExpenses / monthData.count).toFixed(2),
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month))

      setData(averageData)
    }

    fetchMonthlyData()
  }, [])

  return (
    <Card style={{ height: '600px', width: '100%' }}>
      <ResponsiveContainer width="100%" height={500}>
        {data.length > 0 ? (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 20000]} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="avgIncome" stroke="#82ca9d" name="Média de Renda" />
            <Line type="monotone" dataKey="avgExpenses" stroke="#8884d8" name="Média de Despesas" />
          </LineChart>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>No data available</div>
        )}
      </ResponsiveContainer>
    </Card>
  )
}

export default MonthlyAverageChart
