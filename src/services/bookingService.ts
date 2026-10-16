import type { BookingDetails, BookingResponse } from '../types'

/** Demo adapter for the future booking backend (Supabase or n8n). */
export async function submitBooking(details: BookingDetails): Promise<BookingResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, 800))
  if (!details.patientName || !details.email || !details.phone) {
    return { success: false, message: 'Please complete the required patient details.' }
  }
  return {
    success: true,
    confirmationId: `HV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    message: 'Your appointment request has been received.',
  }
}
