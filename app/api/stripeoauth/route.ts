import useCheckStripe from "@/src/hooks/useCheckStripe";
import useServerData from "@/src/hooks/useServerData";
import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import stripe from "stripe";

export async function POST(req: Request, res: NextApiResponse) {
  const body: {
    code: string;
    state: string;
  } = await req.json();

  const { code, state } = body;

  const userId = state;

  const stripe = useCheckStripe();

  try {
    console.log("seeeeeeeesssssiooooooooooooooooooon !!!!!!!! state", userId);
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });
    const connected_account_id = response.stripe_user_id;

    await prisma?.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeAccount: connected_account_id,
      },
    });
    return NextResponse.json({ connected_account_id });
  } catch (err) {
    return NextResponse.error();
  }
}
