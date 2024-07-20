/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lMt8s6oYsls
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@//src//components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src//components/ui/label";
import { Input } from "@/src//components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src//components/ui/select";
import { Separator } from "@/src//components/ui/separator";

export default function Component() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
        <CardDescription>
          Choose your preferred payment method to finalize your order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Pay with Stripe
          </Button>
          <Button variant="outline">
            <WalletIcon className="h-5 w-5 mr-2" />
            Pay with PayPal
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            Pay Deposit with Stripe
          </Button>
          <Button variant="outline">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            Pay Deposit with PayPal
          </Button>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name on Card</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="card-number">Card Number</Label>
          <Input id="card-number" placeholder="4111 1111 1111 1111" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expiry-month">Expiry Month</Label>
            <Select>
              <SelectTrigger id="expiry-month">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">01</SelectItem>
                <SelectItem value="02">02</SelectItem>
                <SelectItem value="03">03</SelectItem>
                <SelectItem value="04">04</SelectItem>
                <SelectItem value="05">05</SelectItem>
                <SelectItem value="06">06</SelectItem>
                <SelectItem value="07">07</SelectItem>
                <SelectItem value="08">08</SelectItem>
                <SelectItem value="09">09</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry-year">Expiry Year</Label>
            <Select>
              <SelectTrigger id="expiry-year">
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Subtotal</div>
            <div>$99.99</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Shipping</div>
            <div>$4.99</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Tax</div>
            <div>$9.00</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">$113.98</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Place Order</Button>
      </CardFooter>
    </Card>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
