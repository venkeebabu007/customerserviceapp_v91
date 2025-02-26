// "use client"

// import { useState, useEffect ,Suspense } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { createClient } from "@/utils/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { toast } from "react-hot-toast"
// import { Loader2 } from "lucide-react"
// import Image from "next/image"
// import { useAuthStore } from "@/lib/store"


// export default function LoginPage() {
//   // Initialize all state variables at the top
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   // Initialize hooks
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const setUserRole = useAuthStore((state) => state.setUserRole)

//   // useEffect for session check
//   useEffect(() => {
//     const checkSession = async () => {
//       const supabase = createClient()
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()
//       if (session) {
//         const redirectTo = searchParams.get("redirectedFrom") || "/dashboard"
//         router.push(redirectTo)
//       }
//     }
//     checkSession()
//   }, [router, searchParams])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     const supabase = createClient()

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })

//       if (error) throw error

//       if (data.user) {
//         const { data: user, error: userError } = await supabase
//           .from("users_csapp")
//           .select("*")
//           .eq("email", data.user.email)
//           .single()

//         if (userError) throw userError
//         if (!user) throw new Error("User not found in the system")

//         // Set the user role in the global state
//         setUserRole(user.role)

//         // Create audit log for successful login
//         const { error: auditError } = await supabase.from("audit_logs_csapp").insert({
//           user_id: user.id,
//           action: "login",
//           details: "User logged in successfully",
//           created_at: new Date().toISOString(),
//         })

//         if (auditError) {
//           console.error("Error creating audit log:", auditError)
//         }

//         toast.success("Logged in successfully")
//         // Implement 2ms loading animation before redirect
//         setTimeout(() => {
//           const redirectTo = searchParams.get("redirectedFrom") || "/dashboard"
//           router.push(redirectTo)
//         }, 3)
//         // const redirectTo = searchParams.get("redirectedFrom") || "/dashboard"
//         // router.push(redirectTo)
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       setError(error instanceof Error ? error.message : "An unknown error occurred")
//       toast.error("Login failed. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <Image src="/placeholder.svg" alt="Logo" width={100} height={100} className="mx-auto" />
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <Label htmlFor="email">Email address</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <Button type="submit" disabled={isLoading} className="w-full">
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Signing In...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or contact your administrator</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </Suspense>
//   )
// }


// 


"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "react-hot-toast"
import { useAuthStore } from "@/lib/store"
import Image from "next/image"

// Loader component for fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2">Loading...</span>
  </div>
)

// Login form component
const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const setUserRole = useAuthStore((state) => state.setUserRole)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulated login for preview
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)

    //Commented out Supabase authentication code
  try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        const { data: user, error: userError } = await supabase
          .from("users_csapp")
          .select("*")
          .eq("email", data.user.email)
          .single()
        if (userError || !user) throw new Error("User not found in the system")

        setUserRole(user.role)

        const { error: auditError } = await supabase.from("audit_logs_csapp").insert({
          user_id: user.id,
          action: "login",
          details: "User logged in successfully",
          created_at: new Date().toISOString(),
        })
        if (auditError) console.error("Error creating audit log:", auditError)

        toast.success("Logged in successfully")
        setTimeout(() => router.push("/dashboard"), 300)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#DAA520] to-[#F9D687] hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}

// Main page component wrapped in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gold%20Hetafu%20Logo%20(1)-CmQcpciXQtmWidDAyg9uEjPHaHJ9u4.png"
            alt="Hetafu Logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

