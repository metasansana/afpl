import { Either } from './Either';
import { Monad } from './Monad';
import { Functor } from '../data/Functor';
/**
 * free wraps a value in a free
 */
export declare const free: <A>(a: A) => Return<A>;
/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
export declare const suspend: <A>(f: () => A) => Suspend<(x: {}) => Return<{}>, {}>;
/**
 * liftF lifts a Functor into a Free.
 */
export declare const liftF: <F extends Functor<A>, A>(f: F) => Suspend<Functor<Return<A>>, {}>;
/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export declare abstract class Free<F, A> implements Monad<A> {
    static free: <A>(a: A) => Return<A>;
    static suspend: <A>(f: () => A) => Suspend<(x: {}) => Return<{}>, {}>;
    static liftF: <F extends Functor<A>, A>(f: F) => Suspend<Functor<Return<A>>, {}>;
    /**
     * of
     */
    of(a: A): Free<F, A>;
    /**
     * map
     */
    map<B>(f: (a: A) => B): Free<F, B>;
    /**
     * chain
     */
    chain<B>(g: (a: A) => Free<F, B>): Free<F, B>;
    /**
     * resume the next stage of the computation
     */
    resume(): Either<F, A>;
    /**
     * hoist
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<F, A> {

        if (this instanceof Suspend) {

            return new Suspend((func(this.f))
                .map((fr: Free<F, B>) => fr.hoist<any>(func)))
        } else {

            return this;

        }

    }
    */
    /**
     * cata
     */
    cata<B>(f: (f: F) => B, g: (a: A) => B): B;
    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    go(f: (next: F) => Free<F, A>): A;
    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    run(): A;
}
export declare class Suspend<F, A> extends Free<F, A> {
    f: F;
    constructor(f: F);
}
export declare class Return<A> extends Free<any, A> {
    a: A;
    constructor(a: A);
}
