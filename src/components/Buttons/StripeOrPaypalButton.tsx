import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

export default function Component() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select your preferred payment method.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="stripe" className="grid grid-cols-2 gap-4">
          <div>
            <RadioGroupItem
              value="stripe"
              id="stripe"
              className="peer sr-only"
            />
            <Label
              htmlFor="stripe"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <img
                src="/images/credit-card-svgrepo-com.svg"
                width="80"
                height="80"
                alt="Stripe"
                className="mb-3"
                style={{ aspectRatio: "80/60", objectFit: "cover" }}
              />
              Stripe
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="peer sr-only"
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <img
                src="/images/PayPal.svg"
                width="220"
                height="300"
                alt="PayPal"
                className="mb-3 w-20"
                style={{ aspectRatio: "240/60", objectFit: "cover" }}
              />
              PayPal
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  );
}
