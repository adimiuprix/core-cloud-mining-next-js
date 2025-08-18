'use client'
import { useEffect, useState } from 'react'

export default function MiningBalance() {
const [balance, setBalance] = useState<number>(0)
  const [earningRate, setEarningRate] = useState<number>(0)

  // Fetch data awal dari API
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/mining')
      const data = await res.json()
      setBalance(parseFloat(data.balance))
      setEarningRate(parseFloat(data.user_earning_rate))
    }
    fetchData()
  }, [])

  // Update balance tiap detik
  useEffect(() => {
    if (!earningRate) return

    const speed = earningRate / 60
    const interval = setInterval(() => {
      setBalance(prev => parseFloat((prev + speed).toFixed(8)))
    }, 1000)

    return () => clearInterval(interval)
  }, [earningRate])
  
  return (<div id="balance">{balance.toFixed(8)}</div>)
}
