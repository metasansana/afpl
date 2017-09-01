import { Monad } from './Monad';

/**
 * just wraps a value in a Just
 */
export const just = <A>(a: A): Maybe<A> => new Just(a);;

/**
 * nothing constructs nothing
 */
export const nothing = <A>() => new Nothing<A>();

/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export const fromAny = <A>(a: A): Maybe<A> => a == null ? nothing<A>() : just(a);

/**
 * fromArray checks an array to see if it's empty (or full of nulls)
 * and returns a Maybe.
 */
export const fromArray = <A>(a: A[]): Maybe<A[]> =>
    ((a.length === 0) || (a.reduce((c, v) => (v == null) ? c + 1 : c, 0) === 0)) ?
        nothing<A[]>() : just(a)

/**
 * Maybe
 */
export abstract class Maybe<A> implements Monad<A> {

    static just = just;
    static nothing = nothing;
    static fromAny = fromAny;
    static fromArray = fromArray;

    of(a: A): Maybe<A> {

        return new Just(a);
    }

    abstract map<B>(_: (a: A) => B): Maybe<B>;

    abstract chain<B>(_: (a: A) => Maybe<B>): Maybe<B>;

    abstract get(): A

    abstract orElse<B>(f: () => Maybe<B>): Maybe<B>;

    abstract orJust<B>(f: () => B): Maybe<B>;

    abstract cata<C>(f: () => C, _g: (a: A) => C): C;

}

/**
 * Nothing
 */
export class Nothing<A> extends Maybe<A> {

    map<B>(_: (a: A) => B): Maybe<B> {

        return new Nothing<B>();

    }

    chain<B>(_: (a: A) => Maybe<B>): Maybe<B> {

        return new Nothing<B>();

    }

    get(): A {

        throw new TypeError('Cannot get anything from Nothing!');

    }

    orElse<B>(f: () => Maybe<B>): Maybe<B> {

        return f();

    }

    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    orJust<B>(f: () => B): Maybe<B> {

        return just(f());

    }

    /**
     * cata applies the corresponding function to the Maybe
     */
    cata<C>(f: () => C, _g: (a: A) => C): C {

        return f();

    }

}

/**
 * Just
 */
export class Just<A> extends Maybe<A> {

    constructor(public a: A) {

        super();

    }

    map<B>(f: (a: A) => B): Maybe<B> {

        return new Just(f(this.a));

    }

    join(): A {

        return this.a

    }

    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {

        return f(this.a);

    }

    get(): A {

        return this.a;

    }

    orElse<B>(_f: () => Maybe<B>): Maybe<B> {

        return <any>this;

    }

    orJust<B>(_f: () => B): Maybe<B> {

        return <any>this;

    }

    cata<C>(_f: () => C, g: (a: A) => C): C {

        return g(this.a);

    }


}


