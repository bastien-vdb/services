//types créé par bastien vdb et non par paypal directement
export type paypalCustomIdType = {
  startTime: Date;
  endTime: Date;
  userId: string;
};

export type paypalDescriptionTransactionType = {
  serviceId: string;
  addedOption:
    | {
        name: string;
        price: number;
      }
    | undefined;
  formData: {
    q8: boolean;
    q1?: string | undefined;
    q2?: string | undefined;
    q3?: string | undefined;
    q4?: string | undefined;
    q5?: string | undefined;
    q6?: string | undefined;
    q7?: string | undefined;
  };
};

//exemple de type de retour de l'api de paypal
export type paypalCheckoutOrderApprovedType = typeof checkoutOrderApprouved;

const checkoutOrderApprouved = {
  id: "WH-50414537RE1577411-9DR8686765084740G",
  create_time: "2024-06-22T21:49:11.212Z",
  resource_type: "checkout-order",
  event_type: "CHECKOUT.ORDER.APPROVED",
  summary: "An order has been approved by buyer",
  resource: {
    update_time: "2024-06-22T21:49:10Z",
    create_time: "2024-06-22T21:49:01Z",
    purchase_units: [
      {
        reference_id: "default",
        amount: {
          currency_code: "USD",
          value: "60.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "60.00",
            },
          },
        },
        payee: {
          email_address: "sb-vkgos30062005@business.example.com",
          merchant_id: "5SGUYBLWY5KYJ",
        },
        description:
          '{"serviceId":"66601a7ebdad1b184f160cb8","formData":{"q1":"","q2":"","q3":"","q4":"","q5":"","q6":"","q7":"","q8":true}}',
        custom_id:
          '{"startTime":"2024-06-23T05:30:00.000Z","endTime":"2024-06-23T06:30:00.000Z","userId":"666019ccbdad1b184f160cb3"}',
        items: [
          {
            name: "Eyes to Eyes contact",
            unit_amount: {
              currency_code: "USD",
              value: "60.00",
            },
            quantity: "1",
            description:
              "Sun Jun 23 2024 07:30:00 GMT+0200 (heure d’été d’Europe centrale)",
          },
        ],
        shipping: {
          name: {
            full_name: "John Doe",
          },
          address: {
            address_line_1: "Av. de la Pelouse, 87648672 Mayet",
            admin_area_2: "Paris",
            admin_area_1: "Alsace",
            postal_code: "75002",
            country_code: "FR",
          },
        },
        payments: {
          captures: [
            {
              id: "4EV232657M6584605",
              status: "COMPLETED",
              amount: {
                currency_code: "USD",
                value: "60.00",
              },
              final_capture: true,
              seller_protection: {
                status: "ELIGIBLE",
                dispute_categories: [
                  "ITEM_NOT_RECEIVED",
                  "UNAUTHORIZED_TRANSACTION",
                ],
              },
              seller_receivable_breakdown: {
                gross_amount: {
                  currency_code: "USD",
                  value: "60.00",
                },
                paypal_fee: {
                  currency_code: "USD",
                  value: "2.34",
                },
                net_amount: {
                  currency_code: "USD",
                  value: "57.66",
                },
                receivable_amount: {
                  currency_code: "EUR",
                  value: "52.44",
                },
                exchange_rate: {
                  source_currency: "USD",
                  target_currency: "EUR",
                  value: "0.90948",
                },
              },
              custom_id:
                '{"startTime":"2024-06-23T05:30:00.000Z","endTime":"2024-06-23T06:30:00.000Z","userId":"666019ccbdad1b184f160cb3"}',
              links: [
                {
                  href: "https://api.sandbox.paypal.com/v2/payments/captures/4EV232657M6584605",
                  rel: "self",
                  method: "GET",
                },
                {
                  href: "https://api.sandbox.paypal.com/v2/payments/captures/4EV232657M6584605/refund",
                  rel: "refund",
                  method: "POST",
                },
                {
                  href: "https://api.sandbox.paypal.com/v2/checkout/orders/1EW67485PT496654V",
                  rel: "up",
                  method: "GET",
                },
              ],
              create_time: "2024-06-22T21:49:10Z",
              update_time: "2024-06-22T21:49:10Z",
            },
          ],
        },
      },
    ],
    links: [
      {
        href: "https://api.sandbox.paypal.com/v2/checkout/orders/1EW67485PT496654V",
        rel: "self",
        method: "GET",
      },
    ],
    id: "1EW67485PT496654V",
    payment_source: {
      paypal: {
        email_address: "sb-0jcb530065991@personal.example.com",
        account_id: "2C9J925A583MJ",
        account_status: "VERIFIED",
        name: {
          given_name: "John",
          surname: "Doe",
        },
        address: {
          country_code: "FR",
        },
      },
    },
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: "John",
        surname: "Doe",
      },
      email_address: "sb-0jcb530065991@personal.example.com",
      payer_id: "2C9J925A583MJ",
      address: {
        country_code: "FR",
      },
    },
    status: "COMPLETED",
  },
  status: "SUCCESS",
  transmissions: [
    {
      webhook_url:
        "https://www.quickreserve.app/api/checkout/paymentdone_paypal",
      http_status: 200,
      reason_phrase: "HTTP/1.1 200 Connection established",
      response_headers: {
        "Strict-Transport-Security": "max-age=63072000",
        Server: "Vercel",
        Etag: '"tqv1urdxohq"',
        "Cache-Control": "public, max-age=0, must-revalidate",
        Connection: "keep-alive",
        "X-Vercel-Cache": "MISS",
        "Content-Length": "28",
        "X-Matched-Path": "/api/checkout/paymentdone_paypal",
        "X-Vercel-Id": "sfo1::iad1::pk7w4-1719092967710-8e084d5a1aed",
        Date: "Sat, 22 Jun 2024 21:49:27 GMT",
        "Content-Type": "text/plain; charset=utf-8",
      },
      transmission_id: "49f93b60-30e1-11ef-ac3c-db71f122b195",
      status: "SUCCESS",
      timestamp: "2024-06-22T21:49:23Z",
    },
  ],
  links: [
    {
      href: "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-50414537RE1577411-9DR8686765084740G",
      rel: "self",
      method: "GET",
      encType: "application/json",
    },
    {
      href: "https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-50414537RE1577411-9DR8686765084740G/resend",
      rel: "resend",
      method: "POST",
      encType: "application/json",
    },
  ],
  event_version: "1.0",
  resource_version: "2.0",
};
