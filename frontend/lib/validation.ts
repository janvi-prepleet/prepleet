export function safeReturnPath(value: unknown) {
  if (
    typeof value !== "string" ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  )
    return "/guesstimates";
  return /^\/(?:$|guesstimates(?:[/?]|$)|learn(?:[/?]|$)|blogs(?:[/?]|$)|practice(?:[/?]|$))/.test(
    value,
  )
    ? value
    : "/guesstimates";
}
export function validateComment(guideId: unknown, body: unknown) {
  if (
    typeof guideId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      guideId,
    )
  )
    return { error: "Choose a valid guide." } as const;
  if (typeof body !== "string" || !body.trim() || body.trim().length > 2000)
    return {
      error: "Write a comment between 1 and 2,000 characters.",
    } as const;
  return { guideId, body: body.trim() } as const;
}
