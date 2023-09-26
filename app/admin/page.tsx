'use client'
import { WithConnection } from "@/src/HOCs/WithConnection";
import Services from "@/src/components/Admin/Services/Services";
import { Separator } from "@/src/components/ui/separator"

function Admin() {

  return (
    <main className="flex flex-col p-6">
      <Services />
      <Separator />
    </main >
  )
};

export default WithConnection(Admin);