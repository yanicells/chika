"use server"

import { requireAdmin } from "../auth-helper"

export async function adminActionExample() {
    await requireAdmin()
    // Perform admin-specific action here
    return { success: true, message: "Admin action performed successfully." }
}
