import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/utils/prisma'
import { UserType } from '@/types/User'
import { createUser, deleteUser } from '@/app/server/user.action'

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent;

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent

    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
            status: 400,
        })
    }

    if (evt.type === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        const newUser: UserType = {
            name: first_name!,
            lastName: last_name!,
            email: email_addresses[0].email_address,
            clerkUserID: id,
        }

        const createdUser = await createUser(newUser);

        const client = await clerkClient();

        await client.users.createUser({
            emailAddress: [email_addresses[0].email_address],
            privateMetadata: {
                mongoDBID: createdUser?.id,
            }
        })
    }

    if (evt.type === 'user.deleted') {
        const clerkUserID = evt.data.id;
        if (!clerkUserID)
            return new Response('Error: User not Found', {
                status: 400,
            })

        await deleteUser(clerkUserID);
    }



    return new Response('Webhook received', { status: 200 })
}