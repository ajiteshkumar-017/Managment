import { isSessionExpired } from "@/lib/attendance/isSessionExpired";

export function parseAttendanceQrPayload(decodedText: string) {
  let qrData: Record<string, unknown>;
  try {
    qrData = JSON.parse(decodedText);
  } catch {
    throw new Error("Invalid QR payload");
  }

  if (!qrData || typeof qrData !== "object") {
    throw new Error("Invalid QR payload");
  }

  const sessionId =
    typeof qrData.sessionId === "string" ? qrData.sessionId.trim() : "";
  const tokenRaw = qrData.token ?? qrData.sessionToken;
  const token = typeof tokenRaw === "string" ? tokenRaw.trim() : "";

  if (!sessionId || !token) {
    throw new Error("QR missing sessionId or token");
  }

  return { sessionId, token };
}

export function parseAttendanceCode(raw: unknown) {
  const sessionCode = Number(String(raw ?? "").trim());
  if (!Number.isInteger(sessionCode) || sessionCode < 100000 || sessionCode > 999999) {
    return null;
  }
  return sessionCode;
}

export function studentBelongsToClass(
  student: { semester?: unknown; department?: unknown; section?: unknown },
  classData: { semester?: unknown; department?: unknown; section?: unknown },
) {
  return (
    String(classData.semester) === String(student.semester) &&
    String(classData.department) === String(student.department) &&
    String(classData.section) === String(student.section)
  );
}

export function sessionMarkError(
  session: {
    isActive?: boolean;
    status?: string;
    expiryTime: Date;
    sessionToken?: string;
  },
  opts?: { now?: Date; token?: string },
) {
  if (session.status !== "active" || !session.isActive) {
    return "Session is not active";
  }
  if (isSessionExpired(session.expiryTime, opts?.now)) {
    return "Session has expired";
  }
  if (opts?.token !== undefined && session.sessionToken !== opts.token) {
    return "Invalid token";
  }
  return null;
}
