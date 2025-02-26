import Link from "next/link"

export const DashboardCard = ({ title, count, link }: { title: string; count: number; link: string }) => {
  return (
    <Link
      href={link}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h2>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
    </Link>
  )
}

export default DashboardCard

