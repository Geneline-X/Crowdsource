
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Problem
 * 
 */
export type Problem = $Result.DefaultSelection<Prisma.$ProblemPayload>
/**
 * Model ProblemUpvote
 * 
 */
export type ProblemUpvote = $Result.DefaultSelection<Prisma.$ProblemUpvotePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Problems
 * const problems = await prisma.problem.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Problems
   * const problems = await prisma.problem.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.problem`: Exposes CRUD operations for the **Problem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Problems
    * const problems = await prisma.problem.findMany()
    * ```
    */
  get problem(): Prisma.ProblemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.problemUpvote`: Exposes CRUD operations for the **ProblemUpvote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProblemUpvotes
    * const problemUpvotes = await prisma.problemUpvote.findMany()
    * ```
    */
  get problemUpvote(): Prisma.ProblemUpvoteDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.1.0
   * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Problem: 'Problem',
    ProblemUpvote: 'ProblemUpvote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "problem" | "problemUpvote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Problem: {
        payload: Prisma.$ProblemPayload<ExtArgs>
        fields: Prisma.ProblemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProblemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProblemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          findFirst: {
            args: Prisma.ProblemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProblemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          findMany: {
            args: Prisma.ProblemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>[]
          }
          create: {
            args: Prisma.ProblemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          createMany: {
            args: Prisma.ProblemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProblemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>[]
          }
          delete: {
            args: Prisma.ProblemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          update: {
            args: Prisma.ProblemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          deleteMany: {
            args: Prisma.ProblemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProblemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProblemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>[]
          }
          upsert: {
            args: Prisma.ProblemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemPayload>
          }
          aggregate: {
            args: Prisma.ProblemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProblem>
          }
          groupBy: {
            args: Prisma.ProblemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProblemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProblemCountArgs<ExtArgs>
            result: $Utils.Optional<ProblemCountAggregateOutputType> | number
          }
        }
      }
      ProblemUpvote: {
        payload: Prisma.$ProblemUpvotePayload<ExtArgs>
        fields: Prisma.ProblemUpvoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProblemUpvoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProblemUpvoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          findFirst: {
            args: Prisma.ProblemUpvoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProblemUpvoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          findMany: {
            args: Prisma.ProblemUpvoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>[]
          }
          create: {
            args: Prisma.ProblemUpvoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          createMany: {
            args: Prisma.ProblemUpvoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProblemUpvoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>[]
          }
          delete: {
            args: Prisma.ProblemUpvoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          update: {
            args: Prisma.ProblemUpvoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          deleteMany: {
            args: Prisma.ProblemUpvoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProblemUpvoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProblemUpvoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>[]
          }
          upsert: {
            args: Prisma.ProblemUpvoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProblemUpvotePayload>
          }
          aggregate: {
            args: Prisma.ProblemUpvoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProblemUpvote>
          }
          groupBy: {
            args: Prisma.ProblemUpvoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProblemUpvoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProblemUpvoteCountArgs<ExtArgs>
            result: $Utils.Optional<ProblemUpvoteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    problem?: ProblemOmit
    problemUpvote?: ProblemUpvoteOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProblemCountOutputType
   */

  export type ProblemCountOutputType = {
    upvotes: number
  }

  export type ProblemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    upvotes?: boolean | ProblemCountOutputTypeCountUpvotesArgs
  }

  // Custom InputTypes
  /**
   * ProblemCountOutputType without action
   */
  export type ProblemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemCountOutputType
     */
    select?: ProblemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProblemCountOutputType without action
   */
  export type ProblemCountOutputTypeCountUpvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProblemUpvoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Problem
   */

  export type AggregateProblem = {
    _count: ProblemCountAggregateOutputType | null
    _avg: ProblemAvgAggregateOutputType | null
    _sum: ProblemSumAggregateOutputType | null
    _min: ProblemMinAggregateOutputType | null
    _max: ProblemMaxAggregateOutputType | null
  }

  export type ProblemAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    upvoteCount: number | null
  }

  export type ProblemSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    upvoteCount: number | null
  }

  export type ProblemMinAggregateOutputType = {
    id: number | null
    reporterPhone: string | null
    rawMessage: string | null
    title: string | null
    locationText: string | null
    latitude: number | null
    longitude: number | null
    locationVerified: boolean | null
    locationSource: string | null
    createdAt: Date | null
    updatedAt: Date | null
    upvoteCount: number | null
  }

  export type ProblemMaxAggregateOutputType = {
    id: number | null
    reporterPhone: string | null
    rawMessage: string | null
    title: string | null
    locationText: string | null
    latitude: number | null
    longitude: number | null
    locationVerified: boolean | null
    locationSource: string | null
    createdAt: Date | null
    updatedAt: Date | null
    upvoteCount: number | null
  }

  export type ProblemCountAggregateOutputType = {
    id: number
    reporterPhone: number
    rawMessage: number
    title: number
    locationText: number
    latitude: number
    longitude: number
    locationVerified: number
    locationSource: number
    createdAt: number
    updatedAt: number
    upvoteCount: number
    _all: number
  }


  export type ProblemAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    upvoteCount?: true
  }

  export type ProblemSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    upvoteCount?: true
  }

  export type ProblemMinAggregateInputType = {
    id?: true
    reporterPhone?: true
    rawMessage?: true
    title?: true
    locationText?: true
    latitude?: true
    longitude?: true
    locationVerified?: true
    locationSource?: true
    createdAt?: true
    updatedAt?: true
    upvoteCount?: true
  }

  export type ProblemMaxAggregateInputType = {
    id?: true
    reporterPhone?: true
    rawMessage?: true
    title?: true
    locationText?: true
    latitude?: true
    longitude?: true
    locationVerified?: true
    locationSource?: true
    createdAt?: true
    updatedAt?: true
    upvoteCount?: true
  }

  export type ProblemCountAggregateInputType = {
    id?: true
    reporterPhone?: true
    rawMessage?: true
    title?: true
    locationText?: true
    latitude?: true
    longitude?: true
    locationVerified?: true
    locationSource?: true
    createdAt?: true
    updatedAt?: true
    upvoteCount?: true
    _all?: true
  }

  export type ProblemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Problem to aggregate.
     */
    where?: ProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Problems to fetch.
     */
    orderBy?: ProblemOrderByWithRelationInput | ProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Problems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Problems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Problems
    **/
    _count?: true | ProblemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProblemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProblemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProblemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProblemMaxAggregateInputType
  }

  export type GetProblemAggregateType<T extends ProblemAggregateArgs> = {
        [P in keyof T & keyof AggregateProblem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProblem[P]>
      : GetScalarType<T[P], AggregateProblem[P]>
  }




  export type ProblemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProblemWhereInput
    orderBy?: ProblemOrderByWithAggregationInput | ProblemOrderByWithAggregationInput[]
    by: ProblemScalarFieldEnum[] | ProblemScalarFieldEnum
    having?: ProblemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProblemCountAggregateInputType | true
    _avg?: ProblemAvgAggregateInputType
    _sum?: ProblemSumAggregateInputType
    _min?: ProblemMinAggregateInputType
    _max?: ProblemMaxAggregateInputType
  }

  export type ProblemGroupByOutputType = {
    id: number
    reporterPhone: string
    rawMessage: string
    title: string
    locationText: string | null
    latitude: number | null
    longitude: number | null
    locationVerified: boolean
    locationSource: string | null
    createdAt: Date
    updatedAt: Date
    upvoteCount: number
    _count: ProblemCountAggregateOutputType | null
    _avg: ProblemAvgAggregateOutputType | null
    _sum: ProblemSumAggregateOutputType | null
    _min: ProblemMinAggregateOutputType | null
    _max: ProblemMaxAggregateOutputType | null
  }

  type GetProblemGroupByPayload<T extends ProblemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProblemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProblemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProblemGroupByOutputType[P]>
            : GetScalarType<T[P], ProblemGroupByOutputType[P]>
        }
      >
    >


  export type ProblemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterPhone?: boolean
    rawMessage?: boolean
    title?: boolean
    locationText?: boolean
    latitude?: boolean
    longitude?: boolean
    locationVerified?: boolean
    locationSource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    upvoteCount?: boolean
    upvotes?: boolean | Problem$upvotesArgs<ExtArgs>
    _count?: boolean | ProblemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["problem"]>

  export type ProblemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterPhone?: boolean
    rawMessage?: boolean
    title?: boolean
    locationText?: boolean
    latitude?: boolean
    longitude?: boolean
    locationVerified?: boolean
    locationSource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    upvoteCount?: boolean
  }, ExtArgs["result"]["problem"]>

  export type ProblemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reporterPhone?: boolean
    rawMessage?: boolean
    title?: boolean
    locationText?: boolean
    latitude?: boolean
    longitude?: boolean
    locationVerified?: boolean
    locationSource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    upvoteCount?: boolean
  }, ExtArgs["result"]["problem"]>

  export type ProblemSelectScalar = {
    id?: boolean
    reporterPhone?: boolean
    rawMessage?: boolean
    title?: boolean
    locationText?: boolean
    latitude?: boolean
    longitude?: boolean
    locationVerified?: boolean
    locationSource?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    upvoteCount?: boolean
  }

  export type ProblemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reporterPhone" | "rawMessage" | "title" | "locationText" | "latitude" | "longitude" | "locationVerified" | "locationSource" | "createdAt" | "updatedAt" | "upvoteCount", ExtArgs["result"]["problem"]>
  export type ProblemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    upvotes?: boolean | Problem$upvotesArgs<ExtArgs>
    _count?: boolean | ProblemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProblemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProblemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProblemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Problem"
    objects: {
      upvotes: Prisma.$ProblemUpvotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reporterPhone: string
      rawMessage: string
      title: string
      locationText: string | null
      latitude: number | null
      longitude: number | null
      locationVerified: boolean
      locationSource: string | null
      createdAt: Date
      updatedAt: Date
      upvoteCount: number
    }, ExtArgs["result"]["problem"]>
    composites: {}
  }

  type ProblemGetPayload<S extends boolean | null | undefined | ProblemDefaultArgs> = $Result.GetResult<Prisma.$ProblemPayload, S>

  type ProblemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProblemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProblemCountAggregateInputType | true
    }

  export interface ProblemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Problem'], meta: { name: 'Problem' } }
    /**
     * Find zero or one Problem that matches the filter.
     * @param {ProblemFindUniqueArgs} args - Arguments to find a Problem
     * @example
     * // Get one Problem
     * const problem = await prisma.problem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProblemFindUniqueArgs>(args: SelectSubset<T, ProblemFindUniqueArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Problem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProblemFindUniqueOrThrowArgs} args - Arguments to find a Problem
     * @example
     * // Get one Problem
     * const problem = await prisma.problem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProblemFindUniqueOrThrowArgs>(args: SelectSubset<T, ProblemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Problem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemFindFirstArgs} args - Arguments to find a Problem
     * @example
     * // Get one Problem
     * const problem = await prisma.problem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProblemFindFirstArgs>(args?: SelectSubset<T, ProblemFindFirstArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Problem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemFindFirstOrThrowArgs} args - Arguments to find a Problem
     * @example
     * // Get one Problem
     * const problem = await prisma.problem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProblemFindFirstOrThrowArgs>(args?: SelectSubset<T, ProblemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Problems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Problems
     * const problems = await prisma.problem.findMany()
     * 
     * // Get first 10 Problems
     * const problems = await prisma.problem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const problemWithIdOnly = await prisma.problem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProblemFindManyArgs>(args?: SelectSubset<T, ProblemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Problem.
     * @param {ProblemCreateArgs} args - Arguments to create a Problem.
     * @example
     * // Create one Problem
     * const Problem = await prisma.problem.create({
     *   data: {
     *     // ... data to create a Problem
     *   }
     * })
     * 
     */
    create<T extends ProblemCreateArgs>(args: SelectSubset<T, ProblemCreateArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Problems.
     * @param {ProblemCreateManyArgs} args - Arguments to create many Problems.
     * @example
     * // Create many Problems
     * const problem = await prisma.problem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProblemCreateManyArgs>(args?: SelectSubset<T, ProblemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Problems and returns the data saved in the database.
     * @param {ProblemCreateManyAndReturnArgs} args - Arguments to create many Problems.
     * @example
     * // Create many Problems
     * const problem = await prisma.problem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Problems and only return the `id`
     * const problemWithIdOnly = await prisma.problem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProblemCreateManyAndReturnArgs>(args?: SelectSubset<T, ProblemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Problem.
     * @param {ProblemDeleteArgs} args - Arguments to delete one Problem.
     * @example
     * // Delete one Problem
     * const Problem = await prisma.problem.delete({
     *   where: {
     *     // ... filter to delete one Problem
     *   }
     * })
     * 
     */
    delete<T extends ProblemDeleteArgs>(args: SelectSubset<T, ProblemDeleteArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Problem.
     * @param {ProblemUpdateArgs} args - Arguments to update one Problem.
     * @example
     * // Update one Problem
     * const problem = await prisma.problem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProblemUpdateArgs>(args: SelectSubset<T, ProblemUpdateArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Problems.
     * @param {ProblemDeleteManyArgs} args - Arguments to filter Problems to delete.
     * @example
     * // Delete a few Problems
     * const { count } = await prisma.problem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProblemDeleteManyArgs>(args?: SelectSubset<T, ProblemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Problems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Problems
     * const problem = await prisma.problem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProblemUpdateManyArgs>(args: SelectSubset<T, ProblemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Problems and returns the data updated in the database.
     * @param {ProblemUpdateManyAndReturnArgs} args - Arguments to update many Problems.
     * @example
     * // Update many Problems
     * const problem = await prisma.problem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Problems and only return the `id`
     * const problemWithIdOnly = await prisma.problem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProblemUpdateManyAndReturnArgs>(args: SelectSubset<T, ProblemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Problem.
     * @param {ProblemUpsertArgs} args - Arguments to update or create a Problem.
     * @example
     * // Update or create a Problem
     * const problem = await prisma.problem.upsert({
     *   create: {
     *     // ... data to create a Problem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Problem we want to update
     *   }
     * })
     */
    upsert<T extends ProblemUpsertArgs>(args: SelectSubset<T, ProblemUpsertArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Problems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemCountArgs} args - Arguments to filter Problems to count.
     * @example
     * // Count the number of Problems
     * const count = await prisma.problem.count({
     *   where: {
     *     // ... the filter for the Problems we want to count
     *   }
     * })
    **/
    count<T extends ProblemCountArgs>(
      args?: Subset<T, ProblemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProblemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Problem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProblemAggregateArgs>(args: Subset<T, ProblemAggregateArgs>): Prisma.PrismaPromise<GetProblemAggregateType<T>>

    /**
     * Group by Problem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProblemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProblemGroupByArgs['orderBy'] }
        : { orderBy?: ProblemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProblemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProblemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Problem model
   */
  readonly fields: ProblemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Problem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProblemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    upvotes<T extends Problem$upvotesArgs<ExtArgs> = {}>(args?: Subset<T, Problem$upvotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Problem model
   */
  interface ProblemFieldRefs {
    readonly id: FieldRef<"Problem", 'Int'>
    readonly reporterPhone: FieldRef<"Problem", 'String'>
    readonly rawMessage: FieldRef<"Problem", 'String'>
    readonly title: FieldRef<"Problem", 'String'>
    readonly locationText: FieldRef<"Problem", 'String'>
    readonly latitude: FieldRef<"Problem", 'Float'>
    readonly longitude: FieldRef<"Problem", 'Float'>
    readonly locationVerified: FieldRef<"Problem", 'Boolean'>
    readonly locationSource: FieldRef<"Problem", 'String'>
    readonly createdAt: FieldRef<"Problem", 'DateTime'>
    readonly updatedAt: FieldRef<"Problem", 'DateTime'>
    readonly upvoteCount: FieldRef<"Problem", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Problem findUnique
   */
  export type ProblemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter, which Problem to fetch.
     */
    where: ProblemWhereUniqueInput
  }

  /**
   * Problem findUniqueOrThrow
   */
  export type ProblemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter, which Problem to fetch.
     */
    where: ProblemWhereUniqueInput
  }

  /**
   * Problem findFirst
   */
  export type ProblemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter, which Problem to fetch.
     */
    where?: ProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Problems to fetch.
     */
    orderBy?: ProblemOrderByWithRelationInput | ProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Problems.
     */
    cursor?: ProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Problems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Problems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Problems.
     */
    distinct?: ProblemScalarFieldEnum | ProblemScalarFieldEnum[]
  }

  /**
   * Problem findFirstOrThrow
   */
  export type ProblemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter, which Problem to fetch.
     */
    where?: ProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Problems to fetch.
     */
    orderBy?: ProblemOrderByWithRelationInput | ProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Problems.
     */
    cursor?: ProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Problems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Problems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Problems.
     */
    distinct?: ProblemScalarFieldEnum | ProblemScalarFieldEnum[]
  }

  /**
   * Problem findMany
   */
  export type ProblemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter, which Problems to fetch.
     */
    where?: ProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Problems to fetch.
     */
    orderBy?: ProblemOrderByWithRelationInput | ProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Problems.
     */
    cursor?: ProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Problems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Problems.
     */
    skip?: number
    distinct?: ProblemScalarFieldEnum | ProblemScalarFieldEnum[]
  }

  /**
   * Problem create
   */
  export type ProblemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * The data needed to create a Problem.
     */
    data: XOR<ProblemCreateInput, ProblemUncheckedCreateInput>
  }

  /**
   * Problem createMany
   */
  export type ProblemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Problems.
     */
    data: ProblemCreateManyInput | ProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Problem createManyAndReturn
   */
  export type ProblemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * The data used to create many Problems.
     */
    data: ProblemCreateManyInput | ProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Problem update
   */
  export type ProblemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * The data needed to update a Problem.
     */
    data: XOR<ProblemUpdateInput, ProblemUncheckedUpdateInput>
    /**
     * Choose, which Problem to update.
     */
    where: ProblemWhereUniqueInput
  }

  /**
   * Problem updateMany
   */
  export type ProblemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Problems.
     */
    data: XOR<ProblemUpdateManyMutationInput, ProblemUncheckedUpdateManyInput>
    /**
     * Filter which Problems to update
     */
    where?: ProblemWhereInput
    /**
     * Limit how many Problems to update.
     */
    limit?: number
  }

  /**
   * Problem updateManyAndReturn
   */
  export type ProblemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * The data used to update Problems.
     */
    data: XOR<ProblemUpdateManyMutationInput, ProblemUncheckedUpdateManyInput>
    /**
     * Filter which Problems to update
     */
    where?: ProblemWhereInput
    /**
     * Limit how many Problems to update.
     */
    limit?: number
  }

  /**
   * Problem upsert
   */
  export type ProblemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * The filter to search for the Problem to update in case it exists.
     */
    where: ProblemWhereUniqueInput
    /**
     * In case the Problem found by the `where` argument doesn't exist, create a new Problem with this data.
     */
    create: XOR<ProblemCreateInput, ProblemUncheckedCreateInput>
    /**
     * In case the Problem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProblemUpdateInput, ProblemUncheckedUpdateInput>
  }

  /**
   * Problem delete
   */
  export type ProblemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
    /**
     * Filter which Problem to delete.
     */
    where: ProblemWhereUniqueInput
  }

  /**
   * Problem deleteMany
   */
  export type ProblemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Problems to delete
     */
    where?: ProblemWhereInput
    /**
     * Limit how many Problems to delete.
     */
    limit?: number
  }

  /**
   * Problem.upvotes
   */
  export type Problem$upvotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    where?: ProblemUpvoteWhereInput
    orderBy?: ProblemUpvoteOrderByWithRelationInput | ProblemUpvoteOrderByWithRelationInput[]
    cursor?: ProblemUpvoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProblemUpvoteScalarFieldEnum | ProblemUpvoteScalarFieldEnum[]
  }

  /**
   * Problem without action
   */
  export type ProblemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Problem
     */
    select?: ProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Problem
     */
    omit?: ProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemInclude<ExtArgs> | null
  }


  /**
   * Model ProblemUpvote
   */

  export type AggregateProblemUpvote = {
    _count: ProblemUpvoteCountAggregateOutputType | null
    _avg: ProblemUpvoteAvgAggregateOutputType | null
    _sum: ProblemUpvoteSumAggregateOutputType | null
    _min: ProblemUpvoteMinAggregateOutputType | null
    _max: ProblemUpvoteMaxAggregateOutputType | null
  }

  export type ProblemUpvoteAvgAggregateOutputType = {
    problemId: number | null
  }

  export type ProblemUpvoteSumAggregateOutputType = {
    problemId: number | null
  }

  export type ProblemUpvoteMinAggregateOutputType = {
    problemId: number | null
    voterPhone: string | null
    createdAt: Date | null
  }

  export type ProblemUpvoteMaxAggregateOutputType = {
    problemId: number | null
    voterPhone: string | null
    createdAt: Date | null
  }

  export type ProblemUpvoteCountAggregateOutputType = {
    problemId: number
    voterPhone: number
    createdAt: number
    _all: number
  }


  export type ProblemUpvoteAvgAggregateInputType = {
    problemId?: true
  }

  export type ProblemUpvoteSumAggregateInputType = {
    problemId?: true
  }

  export type ProblemUpvoteMinAggregateInputType = {
    problemId?: true
    voterPhone?: true
    createdAt?: true
  }

  export type ProblemUpvoteMaxAggregateInputType = {
    problemId?: true
    voterPhone?: true
    createdAt?: true
  }

  export type ProblemUpvoteCountAggregateInputType = {
    problemId?: true
    voterPhone?: true
    createdAt?: true
    _all?: true
  }

  export type ProblemUpvoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProblemUpvote to aggregate.
     */
    where?: ProblemUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProblemUpvotes to fetch.
     */
    orderBy?: ProblemUpvoteOrderByWithRelationInput | ProblemUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProblemUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProblemUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProblemUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProblemUpvotes
    **/
    _count?: true | ProblemUpvoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProblemUpvoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProblemUpvoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProblemUpvoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProblemUpvoteMaxAggregateInputType
  }

  export type GetProblemUpvoteAggregateType<T extends ProblemUpvoteAggregateArgs> = {
        [P in keyof T & keyof AggregateProblemUpvote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProblemUpvote[P]>
      : GetScalarType<T[P], AggregateProblemUpvote[P]>
  }




  export type ProblemUpvoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProblemUpvoteWhereInput
    orderBy?: ProblemUpvoteOrderByWithAggregationInput | ProblemUpvoteOrderByWithAggregationInput[]
    by: ProblemUpvoteScalarFieldEnum[] | ProblemUpvoteScalarFieldEnum
    having?: ProblemUpvoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProblemUpvoteCountAggregateInputType | true
    _avg?: ProblemUpvoteAvgAggregateInputType
    _sum?: ProblemUpvoteSumAggregateInputType
    _min?: ProblemUpvoteMinAggregateInputType
    _max?: ProblemUpvoteMaxAggregateInputType
  }

  export type ProblemUpvoteGroupByOutputType = {
    problemId: number
    voterPhone: string
    createdAt: Date
    _count: ProblemUpvoteCountAggregateOutputType | null
    _avg: ProblemUpvoteAvgAggregateOutputType | null
    _sum: ProblemUpvoteSumAggregateOutputType | null
    _min: ProblemUpvoteMinAggregateOutputType | null
    _max: ProblemUpvoteMaxAggregateOutputType | null
  }

  type GetProblemUpvoteGroupByPayload<T extends ProblemUpvoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProblemUpvoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProblemUpvoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProblemUpvoteGroupByOutputType[P]>
            : GetScalarType<T[P], ProblemUpvoteGroupByOutputType[P]>
        }
      >
    >


  export type ProblemUpvoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    problemId?: boolean
    voterPhone?: boolean
    createdAt?: boolean
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["problemUpvote"]>

  export type ProblemUpvoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    problemId?: boolean
    voterPhone?: boolean
    createdAt?: boolean
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["problemUpvote"]>

  export type ProblemUpvoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    problemId?: boolean
    voterPhone?: boolean
    createdAt?: boolean
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["problemUpvote"]>

  export type ProblemUpvoteSelectScalar = {
    problemId?: boolean
    voterPhone?: boolean
    createdAt?: boolean
  }

  export type ProblemUpvoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"problemId" | "voterPhone" | "createdAt", ExtArgs["result"]["problemUpvote"]>
  export type ProblemUpvoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }
  export type ProblemUpvoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }
  export type ProblemUpvoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | ProblemDefaultArgs<ExtArgs>
  }

  export type $ProblemUpvotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProblemUpvote"
    objects: {
      problem: Prisma.$ProblemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      problemId: number
      voterPhone: string
      createdAt: Date
    }, ExtArgs["result"]["problemUpvote"]>
    composites: {}
  }

  type ProblemUpvoteGetPayload<S extends boolean | null | undefined | ProblemUpvoteDefaultArgs> = $Result.GetResult<Prisma.$ProblemUpvotePayload, S>

  type ProblemUpvoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProblemUpvoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProblemUpvoteCountAggregateInputType | true
    }

  export interface ProblemUpvoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProblemUpvote'], meta: { name: 'ProblemUpvote' } }
    /**
     * Find zero or one ProblemUpvote that matches the filter.
     * @param {ProblemUpvoteFindUniqueArgs} args - Arguments to find a ProblemUpvote
     * @example
     * // Get one ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProblemUpvoteFindUniqueArgs>(args: SelectSubset<T, ProblemUpvoteFindUniqueArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProblemUpvote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProblemUpvoteFindUniqueOrThrowArgs} args - Arguments to find a ProblemUpvote
     * @example
     * // Get one ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProblemUpvoteFindUniqueOrThrowArgs>(args: SelectSubset<T, ProblemUpvoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProblemUpvote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteFindFirstArgs} args - Arguments to find a ProblemUpvote
     * @example
     * // Get one ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProblemUpvoteFindFirstArgs>(args?: SelectSubset<T, ProblemUpvoteFindFirstArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProblemUpvote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteFindFirstOrThrowArgs} args - Arguments to find a ProblemUpvote
     * @example
     * // Get one ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProblemUpvoteFindFirstOrThrowArgs>(args?: SelectSubset<T, ProblemUpvoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProblemUpvotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProblemUpvotes
     * const problemUpvotes = await prisma.problemUpvote.findMany()
     * 
     * // Get first 10 ProblemUpvotes
     * const problemUpvotes = await prisma.problemUpvote.findMany({ take: 10 })
     * 
     * // Only select the `problemId`
     * const problemUpvoteWithProblemIdOnly = await prisma.problemUpvote.findMany({ select: { problemId: true } })
     * 
     */
    findMany<T extends ProblemUpvoteFindManyArgs>(args?: SelectSubset<T, ProblemUpvoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProblemUpvote.
     * @param {ProblemUpvoteCreateArgs} args - Arguments to create a ProblemUpvote.
     * @example
     * // Create one ProblemUpvote
     * const ProblemUpvote = await prisma.problemUpvote.create({
     *   data: {
     *     // ... data to create a ProblemUpvote
     *   }
     * })
     * 
     */
    create<T extends ProblemUpvoteCreateArgs>(args: SelectSubset<T, ProblemUpvoteCreateArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProblemUpvotes.
     * @param {ProblemUpvoteCreateManyArgs} args - Arguments to create many ProblemUpvotes.
     * @example
     * // Create many ProblemUpvotes
     * const problemUpvote = await prisma.problemUpvote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProblemUpvoteCreateManyArgs>(args?: SelectSubset<T, ProblemUpvoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProblemUpvotes and returns the data saved in the database.
     * @param {ProblemUpvoteCreateManyAndReturnArgs} args - Arguments to create many ProblemUpvotes.
     * @example
     * // Create many ProblemUpvotes
     * const problemUpvote = await prisma.problemUpvote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProblemUpvotes and only return the `problemId`
     * const problemUpvoteWithProblemIdOnly = await prisma.problemUpvote.createManyAndReturn({
     *   select: { problemId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProblemUpvoteCreateManyAndReturnArgs>(args?: SelectSubset<T, ProblemUpvoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProblemUpvote.
     * @param {ProblemUpvoteDeleteArgs} args - Arguments to delete one ProblemUpvote.
     * @example
     * // Delete one ProblemUpvote
     * const ProblemUpvote = await prisma.problemUpvote.delete({
     *   where: {
     *     // ... filter to delete one ProblemUpvote
     *   }
     * })
     * 
     */
    delete<T extends ProblemUpvoteDeleteArgs>(args: SelectSubset<T, ProblemUpvoteDeleteArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProblemUpvote.
     * @param {ProblemUpvoteUpdateArgs} args - Arguments to update one ProblemUpvote.
     * @example
     * // Update one ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProblemUpvoteUpdateArgs>(args: SelectSubset<T, ProblemUpvoteUpdateArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProblemUpvotes.
     * @param {ProblemUpvoteDeleteManyArgs} args - Arguments to filter ProblemUpvotes to delete.
     * @example
     * // Delete a few ProblemUpvotes
     * const { count } = await prisma.problemUpvote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProblemUpvoteDeleteManyArgs>(args?: SelectSubset<T, ProblemUpvoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProblemUpvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProblemUpvotes
     * const problemUpvote = await prisma.problemUpvote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProblemUpvoteUpdateManyArgs>(args: SelectSubset<T, ProblemUpvoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProblemUpvotes and returns the data updated in the database.
     * @param {ProblemUpvoteUpdateManyAndReturnArgs} args - Arguments to update many ProblemUpvotes.
     * @example
     * // Update many ProblemUpvotes
     * const problemUpvote = await prisma.problemUpvote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProblemUpvotes and only return the `problemId`
     * const problemUpvoteWithProblemIdOnly = await prisma.problemUpvote.updateManyAndReturn({
     *   select: { problemId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProblemUpvoteUpdateManyAndReturnArgs>(args: SelectSubset<T, ProblemUpvoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProblemUpvote.
     * @param {ProblemUpvoteUpsertArgs} args - Arguments to update or create a ProblemUpvote.
     * @example
     * // Update or create a ProblemUpvote
     * const problemUpvote = await prisma.problemUpvote.upsert({
     *   create: {
     *     // ... data to create a ProblemUpvote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProblemUpvote we want to update
     *   }
     * })
     */
    upsert<T extends ProblemUpvoteUpsertArgs>(args: SelectSubset<T, ProblemUpvoteUpsertArgs<ExtArgs>>): Prisma__ProblemUpvoteClient<$Result.GetResult<Prisma.$ProblemUpvotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProblemUpvotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteCountArgs} args - Arguments to filter ProblemUpvotes to count.
     * @example
     * // Count the number of ProblemUpvotes
     * const count = await prisma.problemUpvote.count({
     *   where: {
     *     // ... the filter for the ProblemUpvotes we want to count
     *   }
     * })
    **/
    count<T extends ProblemUpvoteCountArgs>(
      args?: Subset<T, ProblemUpvoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProblemUpvoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProblemUpvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProblemUpvoteAggregateArgs>(args: Subset<T, ProblemUpvoteAggregateArgs>): Prisma.PrismaPromise<GetProblemUpvoteAggregateType<T>>

    /**
     * Group by ProblemUpvote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProblemUpvoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProblemUpvoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProblemUpvoteGroupByArgs['orderBy'] }
        : { orderBy?: ProblemUpvoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProblemUpvoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProblemUpvoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProblemUpvote model
   */
  readonly fields: ProblemUpvoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProblemUpvote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProblemUpvoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    problem<T extends ProblemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProblemDefaultArgs<ExtArgs>>): Prisma__ProblemClient<$Result.GetResult<Prisma.$ProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProblemUpvote model
   */
  interface ProblemUpvoteFieldRefs {
    readonly problemId: FieldRef<"ProblemUpvote", 'Int'>
    readonly voterPhone: FieldRef<"ProblemUpvote", 'String'>
    readonly createdAt: FieldRef<"ProblemUpvote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProblemUpvote findUnique
   */
  export type ProblemUpvoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which ProblemUpvote to fetch.
     */
    where: ProblemUpvoteWhereUniqueInput
  }

  /**
   * ProblemUpvote findUniqueOrThrow
   */
  export type ProblemUpvoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which ProblemUpvote to fetch.
     */
    where: ProblemUpvoteWhereUniqueInput
  }

  /**
   * ProblemUpvote findFirst
   */
  export type ProblemUpvoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which ProblemUpvote to fetch.
     */
    where?: ProblemUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProblemUpvotes to fetch.
     */
    orderBy?: ProblemUpvoteOrderByWithRelationInput | ProblemUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProblemUpvotes.
     */
    cursor?: ProblemUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProblemUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProblemUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProblemUpvotes.
     */
    distinct?: ProblemUpvoteScalarFieldEnum | ProblemUpvoteScalarFieldEnum[]
  }

  /**
   * ProblemUpvote findFirstOrThrow
   */
  export type ProblemUpvoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which ProblemUpvote to fetch.
     */
    where?: ProblemUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProblemUpvotes to fetch.
     */
    orderBy?: ProblemUpvoteOrderByWithRelationInput | ProblemUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProblemUpvotes.
     */
    cursor?: ProblemUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProblemUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProblemUpvotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProblemUpvotes.
     */
    distinct?: ProblemUpvoteScalarFieldEnum | ProblemUpvoteScalarFieldEnum[]
  }

  /**
   * ProblemUpvote findMany
   */
  export type ProblemUpvoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter, which ProblemUpvotes to fetch.
     */
    where?: ProblemUpvoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProblemUpvotes to fetch.
     */
    orderBy?: ProblemUpvoteOrderByWithRelationInput | ProblemUpvoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProblemUpvotes.
     */
    cursor?: ProblemUpvoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProblemUpvotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProblemUpvotes.
     */
    skip?: number
    distinct?: ProblemUpvoteScalarFieldEnum | ProblemUpvoteScalarFieldEnum[]
  }

  /**
   * ProblemUpvote create
   */
  export type ProblemUpvoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * The data needed to create a ProblemUpvote.
     */
    data: XOR<ProblemUpvoteCreateInput, ProblemUpvoteUncheckedCreateInput>
  }

  /**
   * ProblemUpvote createMany
   */
  export type ProblemUpvoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProblemUpvotes.
     */
    data: ProblemUpvoteCreateManyInput | ProblemUpvoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProblemUpvote createManyAndReturn
   */
  export type ProblemUpvoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * The data used to create many ProblemUpvotes.
     */
    data: ProblemUpvoteCreateManyInput | ProblemUpvoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProblemUpvote update
   */
  export type ProblemUpvoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * The data needed to update a ProblemUpvote.
     */
    data: XOR<ProblemUpvoteUpdateInput, ProblemUpvoteUncheckedUpdateInput>
    /**
     * Choose, which ProblemUpvote to update.
     */
    where: ProblemUpvoteWhereUniqueInput
  }

  /**
   * ProblemUpvote updateMany
   */
  export type ProblemUpvoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProblemUpvotes.
     */
    data: XOR<ProblemUpvoteUpdateManyMutationInput, ProblemUpvoteUncheckedUpdateManyInput>
    /**
     * Filter which ProblemUpvotes to update
     */
    where?: ProblemUpvoteWhereInput
    /**
     * Limit how many ProblemUpvotes to update.
     */
    limit?: number
  }

  /**
   * ProblemUpvote updateManyAndReturn
   */
  export type ProblemUpvoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * The data used to update ProblemUpvotes.
     */
    data: XOR<ProblemUpvoteUpdateManyMutationInput, ProblemUpvoteUncheckedUpdateManyInput>
    /**
     * Filter which ProblemUpvotes to update
     */
    where?: ProblemUpvoteWhereInput
    /**
     * Limit how many ProblemUpvotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProblemUpvote upsert
   */
  export type ProblemUpvoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * The filter to search for the ProblemUpvote to update in case it exists.
     */
    where: ProblemUpvoteWhereUniqueInput
    /**
     * In case the ProblemUpvote found by the `where` argument doesn't exist, create a new ProblemUpvote with this data.
     */
    create: XOR<ProblemUpvoteCreateInput, ProblemUpvoteUncheckedCreateInput>
    /**
     * In case the ProblemUpvote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProblemUpvoteUpdateInput, ProblemUpvoteUncheckedUpdateInput>
  }

  /**
   * ProblemUpvote delete
   */
  export type ProblemUpvoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
    /**
     * Filter which ProblemUpvote to delete.
     */
    where: ProblemUpvoteWhereUniqueInput
  }

  /**
   * ProblemUpvote deleteMany
   */
  export type ProblemUpvoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProblemUpvotes to delete
     */
    where?: ProblemUpvoteWhereInput
    /**
     * Limit how many ProblemUpvotes to delete.
     */
    limit?: number
  }

  /**
   * ProblemUpvote without action
   */
  export type ProblemUpvoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProblemUpvote
     */
    select?: ProblemUpvoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProblemUpvote
     */
    omit?: ProblemUpvoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProblemUpvoteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProblemScalarFieldEnum: {
    id: 'id',
    reporterPhone: 'reporterPhone',
    rawMessage: 'rawMessage',
    title: 'title',
    locationText: 'locationText',
    latitude: 'latitude',
    longitude: 'longitude',
    locationVerified: 'locationVerified',
    locationSource: 'locationSource',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    upvoteCount: 'upvoteCount'
  };

  export type ProblemScalarFieldEnum = (typeof ProblemScalarFieldEnum)[keyof typeof ProblemScalarFieldEnum]


  export const ProblemUpvoteScalarFieldEnum: {
    problemId: 'problemId',
    voterPhone: 'voterPhone',
    createdAt: 'createdAt'
  };

  export type ProblemUpvoteScalarFieldEnum = (typeof ProblemUpvoteScalarFieldEnum)[keyof typeof ProblemUpvoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type ProblemWhereInput = {
    AND?: ProblemWhereInput | ProblemWhereInput[]
    OR?: ProblemWhereInput[]
    NOT?: ProblemWhereInput | ProblemWhereInput[]
    id?: IntFilter<"Problem"> | number
    reporterPhone?: StringFilter<"Problem"> | string
    rawMessage?: StringFilter<"Problem"> | string
    title?: StringFilter<"Problem"> | string
    locationText?: StringNullableFilter<"Problem"> | string | null
    latitude?: FloatNullableFilter<"Problem"> | number | null
    longitude?: FloatNullableFilter<"Problem"> | number | null
    locationVerified?: BoolFilter<"Problem"> | boolean
    locationSource?: StringNullableFilter<"Problem"> | string | null
    createdAt?: DateTimeFilter<"Problem"> | Date | string
    updatedAt?: DateTimeFilter<"Problem"> | Date | string
    upvoteCount?: IntFilter<"Problem"> | number
    upvotes?: ProblemUpvoteListRelationFilter
  }

  export type ProblemOrderByWithRelationInput = {
    id?: SortOrder
    reporterPhone?: SortOrder
    rawMessage?: SortOrder
    title?: SortOrder
    locationText?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    locationVerified?: SortOrder
    locationSource?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    upvoteCount?: SortOrder
    upvotes?: ProblemUpvoteOrderByRelationAggregateInput
  }

  export type ProblemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProblemWhereInput | ProblemWhereInput[]
    OR?: ProblemWhereInput[]
    NOT?: ProblemWhereInput | ProblemWhereInput[]
    reporterPhone?: StringFilter<"Problem"> | string
    rawMessage?: StringFilter<"Problem"> | string
    title?: StringFilter<"Problem"> | string
    locationText?: StringNullableFilter<"Problem"> | string | null
    latitude?: FloatNullableFilter<"Problem"> | number | null
    longitude?: FloatNullableFilter<"Problem"> | number | null
    locationVerified?: BoolFilter<"Problem"> | boolean
    locationSource?: StringNullableFilter<"Problem"> | string | null
    createdAt?: DateTimeFilter<"Problem"> | Date | string
    updatedAt?: DateTimeFilter<"Problem"> | Date | string
    upvoteCount?: IntFilter<"Problem"> | number
    upvotes?: ProblemUpvoteListRelationFilter
  }, "id">

  export type ProblemOrderByWithAggregationInput = {
    id?: SortOrder
    reporterPhone?: SortOrder
    rawMessage?: SortOrder
    title?: SortOrder
    locationText?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    locationVerified?: SortOrder
    locationSource?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    upvoteCount?: SortOrder
    _count?: ProblemCountOrderByAggregateInput
    _avg?: ProblemAvgOrderByAggregateInput
    _max?: ProblemMaxOrderByAggregateInput
    _min?: ProblemMinOrderByAggregateInput
    _sum?: ProblemSumOrderByAggregateInput
  }

  export type ProblemScalarWhereWithAggregatesInput = {
    AND?: ProblemScalarWhereWithAggregatesInput | ProblemScalarWhereWithAggregatesInput[]
    OR?: ProblemScalarWhereWithAggregatesInput[]
    NOT?: ProblemScalarWhereWithAggregatesInput | ProblemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Problem"> | number
    reporterPhone?: StringWithAggregatesFilter<"Problem"> | string
    rawMessage?: StringWithAggregatesFilter<"Problem"> | string
    title?: StringWithAggregatesFilter<"Problem"> | string
    locationText?: StringNullableWithAggregatesFilter<"Problem"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"Problem"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Problem"> | number | null
    locationVerified?: BoolWithAggregatesFilter<"Problem"> | boolean
    locationSource?: StringNullableWithAggregatesFilter<"Problem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Problem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Problem"> | Date | string
    upvoteCount?: IntWithAggregatesFilter<"Problem"> | number
  }

  export type ProblemUpvoteWhereInput = {
    AND?: ProblemUpvoteWhereInput | ProblemUpvoteWhereInput[]
    OR?: ProblemUpvoteWhereInput[]
    NOT?: ProblemUpvoteWhereInput | ProblemUpvoteWhereInput[]
    problemId?: IntFilter<"ProblemUpvote"> | number
    voterPhone?: StringFilter<"ProblemUpvote"> | string
    createdAt?: DateTimeFilter<"ProblemUpvote"> | Date | string
    problem?: XOR<ProblemScalarRelationFilter, ProblemWhereInput>
  }

  export type ProblemUpvoteOrderByWithRelationInput = {
    problemId?: SortOrder
    voterPhone?: SortOrder
    createdAt?: SortOrder
    problem?: ProblemOrderByWithRelationInput
  }

  export type ProblemUpvoteWhereUniqueInput = Prisma.AtLeast<{
    problemId_voterPhone?: ProblemUpvoteProblemIdVoterPhoneCompoundUniqueInput
    AND?: ProblemUpvoteWhereInput | ProblemUpvoteWhereInput[]
    OR?: ProblemUpvoteWhereInput[]
    NOT?: ProblemUpvoteWhereInput | ProblemUpvoteWhereInput[]
    problemId?: IntFilter<"ProblemUpvote"> | number
    voterPhone?: StringFilter<"ProblemUpvote"> | string
    createdAt?: DateTimeFilter<"ProblemUpvote"> | Date | string
    problem?: XOR<ProblemScalarRelationFilter, ProblemWhereInput>
  }, "problemId_voterPhone">

  export type ProblemUpvoteOrderByWithAggregationInput = {
    problemId?: SortOrder
    voterPhone?: SortOrder
    createdAt?: SortOrder
    _count?: ProblemUpvoteCountOrderByAggregateInput
    _avg?: ProblemUpvoteAvgOrderByAggregateInput
    _max?: ProblemUpvoteMaxOrderByAggregateInput
    _min?: ProblemUpvoteMinOrderByAggregateInput
    _sum?: ProblemUpvoteSumOrderByAggregateInput
  }

  export type ProblemUpvoteScalarWhereWithAggregatesInput = {
    AND?: ProblemUpvoteScalarWhereWithAggregatesInput | ProblemUpvoteScalarWhereWithAggregatesInput[]
    OR?: ProblemUpvoteScalarWhereWithAggregatesInput[]
    NOT?: ProblemUpvoteScalarWhereWithAggregatesInput | ProblemUpvoteScalarWhereWithAggregatesInput[]
    problemId?: IntWithAggregatesFilter<"ProblemUpvote"> | number
    voterPhone?: StringWithAggregatesFilter<"ProblemUpvote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProblemUpvote"> | Date | string
  }

  export type ProblemCreateInput = {
    reporterPhone: string
    rawMessage: string
    title: string
    locationText?: string | null
    latitude?: number | null
    longitude?: number | null
    locationVerified?: boolean
    locationSource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    upvoteCount?: number
    upvotes?: ProblemUpvoteCreateNestedManyWithoutProblemInput
  }

  export type ProblemUncheckedCreateInput = {
    id?: number
    reporterPhone: string
    rawMessage: string
    title: string
    locationText?: string | null
    latitude?: number | null
    longitude?: number | null
    locationVerified?: boolean
    locationSource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    upvoteCount?: number
    upvotes?: ProblemUpvoteUncheckedCreateNestedManyWithoutProblemInput
  }

  export type ProblemUpdateInput = {
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
    upvotes?: ProblemUpvoteUpdateManyWithoutProblemNestedInput
  }

  export type ProblemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
    upvotes?: ProblemUpvoteUncheckedUpdateManyWithoutProblemNestedInput
  }

  export type ProblemCreateManyInput = {
    id?: number
    reporterPhone: string
    rawMessage: string
    title: string
    locationText?: string | null
    latitude?: number | null
    longitude?: number | null
    locationVerified?: boolean
    locationSource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    upvoteCount?: number
  }

  export type ProblemUpdateManyMutationInput = {
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
  }

  export type ProblemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
  }

  export type ProblemUpvoteCreateInput = {
    voterPhone: string
    createdAt?: Date | string
    problem: ProblemCreateNestedOneWithoutUpvotesInput
  }

  export type ProblemUpvoteUncheckedCreateInput = {
    problemId: number
    voterPhone: string
    createdAt?: Date | string
  }

  export type ProblemUpvoteUpdateInput = {
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    problem?: ProblemUpdateOneRequiredWithoutUpvotesNestedInput
  }

  export type ProblemUpvoteUncheckedUpdateInput = {
    problemId?: IntFieldUpdateOperationsInput | number
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProblemUpvoteCreateManyInput = {
    problemId: number
    voterPhone: string
    createdAt?: Date | string
  }

  export type ProblemUpvoteUpdateManyMutationInput = {
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProblemUpvoteUncheckedUpdateManyInput = {
    problemId?: IntFieldUpdateOperationsInput | number
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProblemUpvoteListRelationFilter = {
    every?: ProblemUpvoteWhereInput
    some?: ProblemUpvoteWhereInput
    none?: ProblemUpvoteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProblemUpvoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProblemCountOrderByAggregateInput = {
    id?: SortOrder
    reporterPhone?: SortOrder
    rawMessage?: SortOrder
    title?: SortOrder
    locationText?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    locationVerified?: SortOrder
    locationSource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    upvoteCount?: SortOrder
  }

  export type ProblemAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    upvoteCount?: SortOrder
  }

  export type ProblemMaxOrderByAggregateInput = {
    id?: SortOrder
    reporterPhone?: SortOrder
    rawMessage?: SortOrder
    title?: SortOrder
    locationText?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    locationVerified?: SortOrder
    locationSource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    upvoteCount?: SortOrder
  }

  export type ProblemMinOrderByAggregateInput = {
    id?: SortOrder
    reporterPhone?: SortOrder
    rawMessage?: SortOrder
    title?: SortOrder
    locationText?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    locationVerified?: SortOrder
    locationSource?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    upvoteCount?: SortOrder
  }

  export type ProblemSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    upvoteCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ProblemScalarRelationFilter = {
    is?: ProblemWhereInput
    isNot?: ProblemWhereInput
  }

  export type ProblemUpvoteProblemIdVoterPhoneCompoundUniqueInput = {
    problemId: number
    voterPhone: string
  }

  export type ProblemUpvoteCountOrderByAggregateInput = {
    problemId?: SortOrder
    voterPhone?: SortOrder
    createdAt?: SortOrder
  }

  export type ProblemUpvoteAvgOrderByAggregateInput = {
    problemId?: SortOrder
  }

  export type ProblemUpvoteMaxOrderByAggregateInput = {
    problemId?: SortOrder
    voterPhone?: SortOrder
    createdAt?: SortOrder
  }

  export type ProblemUpvoteMinOrderByAggregateInput = {
    problemId?: SortOrder
    voterPhone?: SortOrder
    createdAt?: SortOrder
  }

  export type ProblemUpvoteSumOrderByAggregateInput = {
    problemId?: SortOrder
  }

  export type ProblemUpvoteCreateNestedManyWithoutProblemInput = {
    create?: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput> | ProblemUpvoteCreateWithoutProblemInput[] | ProblemUpvoteUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: ProblemUpvoteCreateOrConnectWithoutProblemInput | ProblemUpvoteCreateOrConnectWithoutProblemInput[]
    createMany?: ProblemUpvoteCreateManyProblemInputEnvelope
    connect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
  }

  export type ProblemUpvoteUncheckedCreateNestedManyWithoutProblemInput = {
    create?: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput> | ProblemUpvoteCreateWithoutProblemInput[] | ProblemUpvoteUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: ProblemUpvoteCreateOrConnectWithoutProblemInput | ProblemUpvoteCreateOrConnectWithoutProblemInput[]
    createMany?: ProblemUpvoteCreateManyProblemInputEnvelope
    connect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProblemUpvoteUpdateManyWithoutProblemNestedInput = {
    create?: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput> | ProblemUpvoteCreateWithoutProblemInput[] | ProblemUpvoteUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: ProblemUpvoteCreateOrConnectWithoutProblemInput | ProblemUpvoteCreateOrConnectWithoutProblemInput[]
    upsert?: ProblemUpvoteUpsertWithWhereUniqueWithoutProblemInput | ProblemUpvoteUpsertWithWhereUniqueWithoutProblemInput[]
    createMany?: ProblemUpvoteCreateManyProblemInputEnvelope
    set?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    disconnect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    delete?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    connect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    update?: ProblemUpvoteUpdateWithWhereUniqueWithoutProblemInput | ProblemUpvoteUpdateWithWhereUniqueWithoutProblemInput[]
    updateMany?: ProblemUpvoteUpdateManyWithWhereWithoutProblemInput | ProblemUpvoteUpdateManyWithWhereWithoutProblemInput[]
    deleteMany?: ProblemUpvoteScalarWhereInput | ProblemUpvoteScalarWhereInput[]
  }

  export type ProblemUpvoteUncheckedUpdateManyWithoutProblemNestedInput = {
    create?: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput> | ProblemUpvoteCreateWithoutProblemInput[] | ProblemUpvoteUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: ProblemUpvoteCreateOrConnectWithoutProblemInput | ProblemUpvoteCreateOrConnectWithoutProblemInput[]
    upsert?: ProblemUpvoteUpsertWithWhereUniqueWithoutProblemInput | ProblemUpvoteUpsertWithWhereUniqueWithoutProblemInput[]
    createMany?: ProblemUpvoteCreateManyProblemInputEnvelope
    set?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    disconnect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    delete?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    connect?: ProblemUpvoteWhereUniqueInput | ProblemUpvoteWhereUniqueInput[]
    update?: ProblemUpvoteUpdateWithWhereUniqueWithoutProblemInput | ProblemUpvoteUpdateWithWhereUniqueWithoutProblemInput[]
    updateMany?: ProblemUpvoteUpdateManyWithWhereWithoutProblemInput | ProblemUpvoteUpdateManyWithWhereWithoutProblemInput[]
    deleteMany?: ProblemUpvoteScalarWhereInput | ProblemUpvoteScalarWhereInput[]
  }

  export type ProblemCreateNestedOneWithoutUpvotesInput = {
    create?: XOR<ProblemCreateWithoutUpvotesInput, ProblemUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: ProblemCreateOrConnectWithoutUpvotesInput
    connect?: ProblemWhereUniqueInput
  }

  export type ProblemUpdateOneRequiredWithoutUpvotesNestedInput = {
    create?: XOR<ProblemCreateWithoutUpvotesInput, ProblemUncheckedCreateWithoutUpvotesInput>
    connectOrCreate?: ProblemCreateOrConnectWithoutUpvotesInput
    upsert?: ProblemUpsertWithoutUpvotesInput
    connect?: ProblemWhereUniqueInput
    update?: XOR<XOR<ProblemUpdateToOneWithWhereWithoutUpvotesInput, ProblemUpdateWithoutUpvotesInput>, ProblemUncheckedUpdateWithoutUpvotesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ProblemUpvoteCreateWithoutProblemInput = {
    voterPhone: string
    createdAt?: Date | string
  }

  export type ProblemUpvoteUncheckedCreateWithoutProblemInput = {
    voterPhone: string
    createdAt?: Date | string
  }

  export type ProblemUpvoteCreateOrConnectWithoutProblemInput = {
    where: ProblemUpvoteWhereUniqueInput
    create: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput>
  }

  export type ProblemUpvoteCreateManyProblemInputEnvelope = {
    data: ProblemUpvoteCreateManyProblemInput | ProblemUpvoteCreateManyProblemInput[]
    skipDuplicates?: boolean
  }

  export type ProblemUpvoteUpsertWithWhereUniqueWithoutProblemInput = {
    where: ProblemUpvoteWhereUniqueInput
    update: XOR<ProblemUpvoteUpdateWithoutProblemInput, ProblemUpvoteUncheckedUpdateWithoutProblemInput>
    create: XOR<ProblemUpvoteCreateWithoutProblemInput, ProblemUpvoteUncheckedCreateWithoutProblemInput>
  }

  export type ProblemUpvoteUpdateWithWhereUniqueWithoutProblemInput = {
    where: ProblemUpvoteWhereUniqueInput
    data: XOR<ProblemUpvoteUpdateWithoutProblemInput, ProblemUpvoteUncheckedUpdateWithoutProblemInput>
  }

  export type ProblemUpvoteUpdateManyWithWhereWithoutProblemInput = {
    where: ProblemUpvoteScalarWhereInput
    data: XOR<ProblemUpvoteUpdateManyMutationInput, ProblemUpvoteUncheckedUpdateManyWithoutProblemInput>
  }

  export type ProblemUpvoteScalarWhereInput = {
    AND?: ProblemUpvoteScalarWhereInput | ProblemUpvoteScalarWhereInput[]
    OR?: ProblemUpvoteScalarWhereInput[]
    NOT?: ProblemUpvoteScalarWhereInput | ProblemUpvoteScalarWhereInput[]
    problemId?: IntFilter<"ProblemUpvote"> | number
    voterPhone?: StringFilter<"ProblemUpvote"> | string
    createdAt?: DateTimeFilter<"ProblemUpvote"> | Date | string
  }

  export type ProblemCreateWithoutUpvotesInput = {
    reporterPhone: string
    rawMessage: string
    title: string
    locationText?: string | null
    latitude?: number | null
    longitude?: number | null
    locationVerified?: boolean
    locationSource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    upvoteCount?: number
  }

  export type ProblemUncheckedCreateWithoutUpvotesInput = {
    id?: number
    reporterPhone: string
    rawMessage: string
    title: string
    locationText?: string | null
    latitude?: number | null
    longitude?: number | null
    locationVerified?: boolean
    locationSource?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    upvoteCount?: number
  }

  export type ProblemCreateOrConnectWithoutUpvotesInput = {
    where: ProblemWhereUniqueInput
    create: XOR<ProblemCreateWithoutUpvotesInput, ProblemUncheckedCreateWithoutUpvotesInput>
  }

  export type ProblemUpsertWithoutUpvotesInput = {
    update: XOR<ProblemUpdateWithoutUpvotesInput, ProblemUncheckedUpdateWithoutUpvotesInput>
    create: XOR<ProblemCreateWithoutUpvotesInput, ProblemUncheckedCreateWithoutUpvotesInput>
    where?: ProblemWhereInput
  }

  export type ProblemUpdateToOneWithWhereWithoutUpvotesInput = {
    where?: ProblemWhereInput
    data: XOR<ProblemUpdateWithoutUpvotesInput, ProblemUncheckedUpdateWithoutUpvotesInput>
  }

  export type ProblemUpdateWithoutUpvotesInput = {
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
  }

  export type ProblemUncheckedUpdateWithoutUpvotesInput = {
    id?: IntFieldUpdateOperationsInput | number
    reporterPhone?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    locationText?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    locationVerified?: BoolFieldUpdateOperationsInput | boolean
    locationSource?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    upvoteCount?: IntFieldUpdateOperationsInput | number
  }

  export type ProblemUpvoteCreateManyProblemInput = {
    voterPhone: string
    createdAt?: Date | string
  }

  export type ProblemUpvoteUpdateWithoutProblemInput = {
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProblemUpvoteUncheckedUpdateWithoutProblemInput = {
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProblemUpvoteUncheckedUpdateManyWithoutProblemInput = {
    voterPhone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}