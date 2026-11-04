// Inicial para un avatar: la primera letra o número del apodo (los símbolos decorativos se saltan).
export const initialOf = (nickname) => [...nickname].find((ch) => /[\p{L}\p{N}]/u.test(ch)) ?? [...nickname][0] ?? '?'
