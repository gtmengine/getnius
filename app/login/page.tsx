"use client"

import { signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Image src="/placeholder-logo.svg" alt="Getnius" width={32} height={32} />
            <CardTitle>Sign in to Getnius</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="default"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

