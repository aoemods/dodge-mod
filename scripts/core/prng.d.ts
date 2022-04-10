export class PRng {
    private constructor()
    static new(seed?: number): PRng
    set_seed(seed_53: number): void
    get_seed(): number
    get_random_32(): number
}