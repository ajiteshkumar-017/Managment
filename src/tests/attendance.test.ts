import { afterEach, describe, expect, it, vi } from "vitest";
import { isSessionExpired } from "@/lib/attendance/isSessionExpired";
import {
  parseAttendanceCode,
  parseAttendanceQrPayload,
  sessionMarkError,
  studentBelongsToClass,
} from "@/lib/attendance/markRules";
import {
  attendanceBand,
  attendancePct,
  recordOwnerIds,
} from "@/lib/student/attendance";

const EXPIRY = new Date("2026-08-25T10:00:00Z");

afterEach(() => {
  vi.useRealTimers();
});

describe("isSessionExpired", () => {
  it("is false while the session is still open", () => {
    expect(isSessionExpired(EXPIRY, new Date("2026-08-25T09:59:59.999Z"))).toBe(
      false,
    );
  });

  it("is true at the exact expiry instant", () => {
    expect(isSessionExpired(EXPIRY, EXPIRY)).toBe(true);
  });

  it("is true after expiry", () => {
    expect(isSessionExpired(EXPIRY, new Date("2026-08-25T10:00:00.001Z"))).toBe(
      true,
    );
  });

  it("uses the current clock when now is omitted", () => {
    vi.useFakeTimers();
    vi.setSystemTime(EXPIRY);
    expect(isSessionExpired(EXPIRY)).toBe(true);
    expect(isSessionExpired(new Date("2026-08-25T10:00:01Z"))).toBe(false);
  });
});

describe("parseAttendanceQrPayload", () => {
  it("reads sessionId and token from a faculty QR payload", () => {
    expect(
      parseAttendanceQrPayload(
        JSON.stringify({
          sessionId: "enc-session-1",
          token: "secret-token",
          sessionCode: 482913,
          classId: "enc-class-1",
        }),
      ),
    ).toEqual({ sessionId: "enc-session-1", token: "secret-token" });
  });

  it("falls back to sessionToken when token is absent", () => {
    expect(
      parseAttendanceQrPayload(
        JSON.stringify({
          sessionId: "enc-session-1",
          sessionToken: "legacy-token",
        }),
      ),
    ).toEqual({ sessionId: "enc-session-1", token: "legacy-token" });
  });

  it("rejects invalid JSON", () => {
    expect(() => parseAttendanceQrPayload("not-json")).toThrow("Invalid QR payload");
  });

  it("rejects a payload missing sessionId or token", () => {
    expect(() =>
      parseAttendanceQrPayload(JSON.stringify({ sessionId: "enc-session-1" })),
    ).toThrow("QR missing sessionId or token");
    expect(() =>
      parseAttendanceQrPayload(JSON.stringify({ token: "secret-token" })),
    ).toThrow("QR missing sessionId or token");
  });
});

describe("parseAttendanceCode", () => {
  it("accepts a 6-digit code", () => {
    expect(parseAttendanceCode("482913")).toBe(482913);
    expect(parseAttendanceCode(100000)).toBe(100000);
    expect(parseAttendanceCode(" 999999 ")).toBe(999999);
  });

  it("rejects codes outside the 6-digit range", () => {
    expect(parseAttendanceCode("99999")).toBeNull();
    expect(parseAttendanceCode("1000000")).toBeNull();
    expect(parseAttendanceCode("abc123")).toBeNull();
    expect(parseAttendanceCode("")).toBeNull();
    expect(parseAttendanceCode(undefined)).toBeNull();
  });
});

describe("studentBelongsToClass", () => {
  const student = { department: "CSE", semester: 3, section: "A" };

  it("matches when department, semester, and section align", () => {
    expect(
      studentBelongsToClass(student, {
        department: "CSE",
        semester: "3",
        section: "A",
      }),
    ).toBe(true);
  });

  it("rejects a different section, semester, or department", () => {
    expect(
      studentBelongsToClass(student, { ...student, section: "B" }),
    ).toBe(false);
    expect(
      studentBelongsToClass(student, { ...student, semester: 4 }),
    ).toBe(false);
    expect(
      studentBelongsToClass(student, { ...student, department: "ECE" }),
    ).toBe(false);
  });
});

describe("sessionMarkError", () => {
  const activeSession = {
    isActive: true,
    status: "active",
    expiryTime: EXPIRY,
    sessionToken: "secret-token",
  };

  it("allows an active session before expiry with a matching token", () => {
    expect(
      sessionMarkError(activeSession, {
        now: new Date("2026-08-25T09:59:00Z"),
        token: "secret-token",
      }),
    ).toBeNull();
  });

  it("blocks inactive or closed sessions before checking the token", () => {
    expect(
      sessionMarkError(
        { ...activeSession, isActive: false },
        { now: new Date("2026-08-25T09:59:00Z"), token: "secret-token" },
      ),
    ).toBe("Session is not active");
    expect(
      sessionMarkError(
        { ...activeSession, status: "closed" },
        { now: new Date("2026-08-25T09:59:00Z"), token: "secret-token" },
      ),
    ).toBe("Session is not active");
  });

  it("blocks at expiry so the attendance test page cannot mark late", () => {
    expect(
      sessionMarkError(activeSession, {
        now: EXPIRY,
        token: "secret-token",
      }),
    ).toBe("Session has expired");
  });

  it("rejects a mismatched QR token", () => {
    expect(
      sessionMarkError(activeSession, {
        now: new Date("2026-08-25T09:59:00Z"),
        token: "wrong-token",
      }),
    ).toBe("Invalid token");
  });

  it("skips the token check when marking by 6-digit code", () => {
    expect(
      sessionMarkError(activeSession, {
        now: new Date("2026-08-25T09:59:00Z"),
      }),
    ).toBeNull();
  });
});

describe("attendancePct", () => {
  it("returns 0 when no sessions were held", () => {
    expect(attendancePct(0, 0)).toBe(0);
  });

  it("rounds present / total to a whole percent", () => {
    expect(attendancePct(1, 1)).toBe(100);
    expect(attendancePct(1, 3)).toBe(33);
    expect(attendancePct(2, 3)).toBe(67);
  });
});

describe("attendanceBand", () => {
  it("maps percentage to the student attendance labels", () => {
    expect(attendanceBand(85)).toBe("Excellent");
    expect(attendanceBand(84)).toBe("Good");
    expect(attendanceBand(75)).toBe("Good");
    expect(attendanceBand(74)).toBe("Average");
    expect(attendanceBand(65)).toBe("Average");
    expect(attendanceBand(64)).toBe("Low");
  });
});

describe("recordOwnerIds", () => {
  it("looks up records by both student profile id and user id", () => {
    expect(recordOwnerIds("student-1", "user-1")).toEqual([
      "student-1",
      "user-1",
    ]);
  });
});
