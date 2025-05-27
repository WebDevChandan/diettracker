'use client'
import { UserProfile } from '@clerk/nextjs'
import { OctagonAlert } from 'lucide-react'

const UserProfilePage = () => (
    <div className="w-full flex justify-center items-center h-screen mt-14 sm:mt-12 md:mt-16 lg:mt-10">
        <UserProfile path="/account" routing="path">
            <UserProfile.Page label="account" />
            <UserProfile.Page label="Account Delete" url="custom" labelIcon={<OctagonAlert className="w-4 h-4 text-gray-500" />}>
                <div>
                    <h1 className="text-2xl font-bold mb-4">Account Deletion Note</h1>
                    <p className="text-gray-700 mb-4">
                        If you delete your account, all your data will be permanently removed (including <b>Food Items</b>, <b>Listed Food Items</b> and <b>Goal Settings</b>) and cannot be recovered.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Please ensure you have backed up any important information before proceeding.
                    </p>
                </div>
            </UserProfile.Page>
            <UserProfile.Page label="security" />
        </UserProfile>
    </div>
)

export default UserProfilePage