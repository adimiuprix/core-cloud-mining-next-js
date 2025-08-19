import { cookies } from 'next/headers'
import MiningBalance from '@/components/MiningBalance'

export default function Page() {
  const cookieStore = cookies()
  const userName = cookieStore.get('session')?.value || 'Belum ada data'
  const userData = userName ? JSON.parse(userName) : null

  return (
    <div className="p-4 bg-black rounded-md">
      <h1 className="text-lg font-bold">Data Cookie Kamu:</h1>
      <p className="mt-2">data user id: {userData.id}</p>
      <MiningBalance />
    </div>
  )
}
