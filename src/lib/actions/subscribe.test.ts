import { beforeEach, describe, expect, it, vi } from "vitest"
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }))
vi.mock("@/lib/supabase/server", () => ({ createServiceClient: () => ({ rpc }) }))
import { subscribeEmail } from "./subscribe"
function form(email: string) { const data = new FormData(); data.set("email", email); return data }
beforeEach(() => { vi.clearAllMocks(); rpc.mockResolvedValue({ error: null }) })
describe("single opt-in", () => {
  it("validates before accessing the database", async () => {
    expect((await subscribeEmail(form("invalid"))).success).toBe(false)
    expect(rpc).not.toHaveBeenCalled()
  })
  it("normalizes and immediately subscribes without email delivery", async () => {
    const result = await subscribeEmail(form(" Reader@Example.COM "))
    expect(rpc).toHaveBeenCalledWith("subscribe_email", { p_email: "reader@example.com" })
    expect(result).toEqual({ success: true, message: "You’re subscribed. Thanks for following Ethical AI Departures." })
  })
  it("returns the same message for repeated signups", async () => {
    expect(await subscribeEmail(form("reader@example.com"))).toEqual(await subscribeEmail(form("reader@example.com")))
  })
  it("does not claim success on a database error", async () => {
    rpc.mockResolvedValue({ error: { message: "private database details" } })
    expect(await subscribeEmail(form("reader@example.com"))).toEqual({ success: false, message: "Something went wrong. Please try again." })
  })
})
