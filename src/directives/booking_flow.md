# 🌊 Booking Flow Directive

> **Location:** `src/directives/booking_flow.md`
> **Responsibility:** Strictly defines the reservation procedure for a guest from selection to confirmation, interacting with `/bookings/` endpoints.

## 1. Core Rule: Strict Sequence
The Booking Engine enforces a strictly sequential process. **Do NOT allow users to skip steps.** They must complete:
1. `initBooking`
2. `addGuests`
3. `startPayment`
4. `getBookingStatus` (Polling)

---

## 2. Step-by-Step Breakdown

### Step 1: Initial Booking Frame
**User Action:** User selects a `checkInDate`, `checkOutDate`, and `roomsCount` for a specific `roomId` inside `HotelDetailsPage`.
**UI Component:** `BookingDateSelector` (Dialog-driven overlay)
**API Trigger:** `bookingApi.initBooking(data)`
- **Payload:** 
  ```json
  { "hotelId": 1, "roomId": 1, "checkInDate": "2026-05-10", "checkOutDate": "2026-05-12", "roomsCount": 1 }
  ```
- **Response:** Returns `bookingId`. 
**Store State:** Save `bookingId` globally or in URL params and shift view to Step 2.

### Step 2: Guest Assignment
**User Action:** User selects existing family members or adds new guests to link to the reservation.
**UI Component:** `GuestSelectionList` (Shows guests fetched via `guestApi.getGuests()`)
**API Trigger:** `bookingApi.addGuests(bookingId, guestIds)`
- **Payload:** `[ 4, 7 ]`
**Store State:** Update booking entity state locally ensuring guest array is attached. Move to Step 3.

### Step 3: Payment Lock
**User Action:** User clicks "Proceed to Payment".
**API Trigger:** `bookingApi.startPayment(bookingId)`
**UI State:** Renders Stripe elements or mock gateway intent UI immediately upon 200 OK.
- Use `Glassmorphism` on the checkout container.

### Step 4: Status Polling & Confirmation
**User Action:** Form submitted, Webhook processing externally.
**API Trigger:** `bookingApi.getBookingStatus(bookingId)`
**Logic:**
- Poll every 3 seconds for max 5 attempts.
- IF `status === 'CONFIRMED'`, redirect to success.
- IF `status === 'CANCELLED'`, show failure notice.
**UI Component:** `TransactionStatusSpinner` with `bg-signature-gradient` pulses.

---

## 3. Edge Cases & Handling
- **401 Unauthorized:** Ensure Axios Interceptor captures and runs `/refresh` silently. If logout triggers, buffer the booking details in localStorage caching.
- **Inventory Mismatch (400 Bad Request):** If the room sells out during Step 1, gracefully notify user utilizing standard `ApiResponse` error format.
