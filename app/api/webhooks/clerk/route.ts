import { createUser, deleteUser } from '@/app/server/user.action'
import { UserType } from '@/types/User'
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

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
        try {
            const { id, email_addresses, first_name, last_name } = evt.data;

            const newUser: UserType = {
                name: first_name ?? "",
                lastName: last_name ?? "",
                email: email_addresses[0].email_address,
                clerkUserID: id,
            }

            await createUser(newUser);

        } catch (error) {
            console.log(error + ':' + "Error creating user");
        }
    }

    if (evt.type === 'user.deleted') {
        try {
            const clerkUserID = evt.data.id;
            if (!clerkUserID)
                return new Response('Error: User not Found', {
                    status: 400,
                })

            await deleteUser(clerkUserID);

        } catch (error) {
            console.log(error + ': ' + "Error deleting user");
        }

    }

    return new Response('Webhook received', { status: 200 })
}