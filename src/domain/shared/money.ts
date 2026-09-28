export class Money {
    readonly cents: number;

    private constructor(cents: number) {
        if(!Number.isInteger(cents) ) {
            throw new Error("O valor deve ser um número inteiro.")
        }
        this.cents = cents;
    }


    add(other: Money): Money {
        return new Money(this.cents + other.cents);
    }

    subtract(other: Money): Money {
        return new Money(this.cents - other.cents);
    }

    equals(other: Money): boolean {
        return this.cents === other.cents;
    }

    isZero(): boolean {
        return this.cents === 0;
    }

    isPositive(): boolean {
        return this.cents > 0;
    }

    isNegative(): boolean {
        return this.cents < 0;
    }

    split(parts: number): Money[] {
        if(parts <= 0 || !Number.isInteger(parts) ) {
            throw new Error("O número de partes deve ser um inteiro maior que zero.")
        }

        const base = Math.floor(this.cents / parts);
        const remainder = this.cents % parts;
        const list: Money[] = [];

        for(let i = 0; i < parts; i++) {
            if(i < remainder) {
                list.push(new Money(base+1))
            } else {
                list.push(new Money(base))
            }
        }

        return list;
    }

    static fromCents(cents: number): Money {
        return new Money(cents)
    }

    static zero(): Money {
        return new Money(0);
    }

}