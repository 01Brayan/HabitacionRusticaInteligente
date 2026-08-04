// Única responsabilidad: calcular la intensidad "parpadeante" de una vela,
// a partir de su intensidad base ya suavizada.

export function flickerIntensity(baseIntensity, elapsed, seed = 0) {

    const wave =
        Math.sin(elapsed * 9 + seed) * 0.12 +
        Math.sin(elapsed * 17 + seed * 1.7) * 0.06;

    const noise = (Math.random() - 0.5) * 0.08;

    return Math.max(0, baseIntensity * (1 + wave + noise));
}