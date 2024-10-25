import { getCurrentUser } from "@/actions/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unathenticated", { status: 403 });

    const account = await stripe.accounts.create({
      type: "custom",
      country: "CA",
      business_type: "company",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      external_account: "btok_us",
      tos_acceptance: {
        date: 1547923073,
        ip: "172.18.80.19",
      },
    });

    if (!account) throw new Error("account");

    const approve = await stripe.accounts.update(account.id, {
      business_profile: {
        mcc: "5045",
        url: "https://bestcookieco.com",
      },
      company: {
        address: {
          city: "victoria",
          line1: "123 State ST",
          postal_code: "V8P 1A1",
          state: "BC",
        },
        tax_id: "000000000",
        name: "The Best Cookie Co",
        phone: "9230029300",
      },
    });

    if (!approve) throw new Error("approve");

    const person = await stripe.accounts.createPerson(account.id, {
      first_name: "Jenny",
      last_name: "Rosen",
      relationship: {
        representative: true,
        title: "CEO",
      },
    });

    if (!person) throw new Error("person");

    const approvePerson = await stripe.accounts.updatePerson(
      account.id,
      person.id,
      {
        address: {
          city: "victoria",
          line1: "123 State ST",
          postal_code: "V8P 1A1",
          state: "BC",
        },
        dob: {
          day: 10,
          month: 11,
          year: 1980,
        },
        ssn_last_4: "0000",
        phone: "9230029300",
        email: "jenny@bestcookieco.come",
        relationship: {
          executive: true,
        },
      }
    );

    if (!approvePerson) throw new Error("approvePerson");

    const owner = await stripe.accounts.createPerson(account.id, {
      first_name: "Kathleen",
      last_name: "Banks",
      email: "kathleen@bestcookieco.com",
      address: {
        city: "victoria ",
        line1: "123 State St",
        postal_code: "V8P 1A1",
        state: "BC",
      },
      dob: {
        day: 10,
        month: 11,
        year: 1980,
      },
      phone: "8888675309",
      relationship: {
        owner: true,
        percent_ownership: 80,
      },
    });

    if (!owner) throw new Error("owner");

    const complete = await stripe.accounts.update(account.id, {
      company: {
        owners_provided: true,
      },
    });

    if (!complete) throw new Error("complete");

    const saveAccountId = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeId: account.id,
      },
    });

    if (!saveAccountId) throw new Error("saveAccountId");

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}callback/stripe/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_URL}callback/stripe/success`,
      type: "account_onboarding",
      collection_options: {
        fields: "currently_due",
      },
    });

    return NextResponse.json({
      url: accountLink.url,
    });
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }
    return new Response("Error", { status: 500 });
  }
};
