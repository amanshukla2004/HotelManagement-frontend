# 🔍 Hotel Search Directive

> **Location:** `src/directives/hotel_search.md`
> **Responsibility:** Dictates the layout and query parameters driving the public discovery of properties.

## 1. Parameters & API
**API Trigger:** `hotelApi.searchHotels(params)`
**Path:** `GET /api/v1/hotels/search`

Accepted Query Parameters (all map directly to `useState` hooks):
*   `city` (String, required based on generic search box)
*   `startDate` & `endDate` (ISO Strings)
*   `roomsCount` (Integer)
*   `page` & `size` (Pagination triggers)

---

## 2. Layout Elements

### The Search Header (Hero)
- **Visuals:** Should feature a full-width background image masked with a `surface` overlay.
- **Inputs:**
  - **City Field:** Auto-complete text line. Keep it minimal without heavy borders.
  - **Date Picker:** Opens a dual-pane calendar modal. Note: "Use dialog boxes for Date Picker" (from `AGENT.md`).
  - **Rooms Metric:** A simple `[-] 1 [+]` counter.
- **Submit Button:** Primary `bg-primary` utilizing the "Gradient Signature" active state.

### Results Grid
- Display paginated objects wrapping `HotelDto`.
- Each card should employ the "Tonal Depth" rule—white `surface-container-lowest` card against a `.bg-surface` body default.
- Include a Carousel component for `photos[]`.
- Tags mapping `amenities[]` should use minimalist rounded grey badges `surface-container-high`.
- **Empty State:** If query yields zero results, show a "ghost graphic" with `body-md` text suggesting broader search perimeters.

---

## 3. UI Optimization
- **Debouncing:** Delay `onChange` text typing for the City field by `300ms` if hooking up live search autocomplete.
- **Skeleton Shimmers:** 
  > *Rule: "Never show blank UI"* (`AGENT.md`).
  Load an array of 6 `SkeletonCards` mirroring the dimensions of real Hotel cards while `isLoading === true`.

## 4. Navigation Loop
Clicking any `HotelCard` dispatches `navigate('/hotels/:hotelId')` passing the Context ID to allow the Details page to fire `hotelApi.getHotelInfo(hotelId)`.
